package ru.shtrih.kds.controller;

import org.checkerframework.checker.nullness.Opt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.shtrih.kds.exception.DataVerificationException;
import ru.shtrih.kds.exception.ResourceNotFoundException;
import ru.shtrih.kds.model.*;
import ru.shtrih.kds.repository.AcquirerRepository;
import ru.shtrih.kds.repository.MerchantRepository;
import ru.shtrih.kds.repository.TerminalRepository;
import ru.shtrih.kds.tools.Utils;

import javax.validation.Valid;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1")
public class MerchantController {
    @Autowired
    private MerchantRepository merchantRepository;
    @Autowired
    private TerminalRepository terminalRepository;

    @Autowired
    private AcquirerRepository acquirerRepository;

    @GetMapping("/merchants")
    public Page<Merchant> getAllMerchants(@RequestParam("page") int page, @RequestParam("limit") int limit) {
        Pageable paged = PageRequest.of(page-1, limit);
        Page<Merchant> result = merchantRepository.findAll(paged);
        return result;
    }

    @GetMapping("/merchants/{id}")
    public ResponseEntity<Merchant> getMerchantById(@PathVariable(value = "id") Long merchantId)
            throws ResourceNotFoundException {
        Merchant merchant = merchantRepository.findById(merchantId)
                .orElseThrow(() -> new ResourceNotFoundException("Merchant not found"));
        return ResponseEntity.ok().body(merchant);
    }

    @PostMapping("/merchants")
    public ResponseEntity<Object> createMerchant(@Valid @RequestBody Merchant merchant) throws DataVerificationException {
        try {
            Merchant g = merchantRepository.save(merchant);
            return new ResponseEntity<Object>(g, HttpStatus.OK);
        }
        catch (Exception ex)
        {
            String msg = ex.getMessage();
            if (msg.contains("tag_UNIQUE"))
                throw new DataVerificationException("Tag value must be unique");
            else
                throw new DataVerificationException("Unknown server error");
        }
    }

    @GetMapping("/merchants/{id}/terminals")
    public Page<Terminal> getMerchantTerminals(@PathVariable(value = "id") Long merchantId, @RequestParam("page") int page, @RequestParam("limit") int limit) {
        Pageable paged = PageRequest.of(page-1, limit);
        Page<Terminal> result = terminalRepository.findAllByMerchant(merchantId, paged);
        return result;
    }

    @PutMapping("/merchants/{id}")
    public ResponseEntity<Merchant> updateMerchant(@PathVariable(value = "id") Long merchantId,
                                           @Valid @RequestBody Merchant merchantDetails) throws ResourceNotFoundException, DataVerificationException {
        Merchant merchant = merchantRepository.findById(merchantId)
                .orElseThrow(() -> new ResourceNotFoundException("Merchant not found for this id :: " + merchantId));

        try {
            merchant.name = merchantDetails.name;
            merchant.categoryCode = merchantDetails.categoryCode;
            merchant.mid = merchantDetails.mid;
            merchant.nameAndLocation = merchantDetails.nameAndLocation;
            merchant.description = merchantDetails.description;
            merchant.acquirer = merchantDetails.acquirer;
            merchant.tag = merchantDetails.tag;
            final Merchant updatedMerchant = merchantRepository.save(merchant);
            return ResponseEntity.ok(updatedMerchant);
        }
        catch (Exception ex)
        {
            String msg = ex.getMessage();
            if (msg.contains("tag_UNIQUE"))
                throw new DataVerificationException("Tag value must be unique");
            else
                throw new DataVerificationException("Unknown server error");
        }
    }

    @PostMapping("/deletemerchants")
    public ResponseEntity deleteMerchants(@Valid @RequestBody List<Merchant> merchants) {
        merchantRepository.deleteAll(merchants);
        return new ResponseEntity(HttpStatus.OK);
    }

    @DeleteMapping("/merchants/{id}")
    public Map<String, Boolean> deleteMerchant(@PathVariable(value = "id") Long merchantId)
            throws ResourceNotFoundException {
        Merchant merchant = merchantRepository.findById(merchantId)
                .orElseThrow(() -> new ResourceNotFoundException("Merchant not found"));

        merchantRepository.delete(merchant);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return response;
    }

    //csv: tag, acquirertag, mid, categorycde, nameandlocation, name, description
    @PostMapping("/merchants/upload")
    public ResponseEntity<Map<String, Object>> singleFileUpload(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            //redirectAttributes.addFlashAttribute("message", "Please select a file to upload");
            return ResponseEntity.ok(null);
        }
        try {
            BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
            List<String> errorList = new ArrayList<>();
            int cnt = 0;
            int totalItems = 0;
            int emptyLines = 0;
            int commentLines = 0;
            int itemsCreated = 0;
            int itemsUpdated = 0;
            int itemsSkipped = 0;
            int errorCount = 0;

            while(reader.ready()) {
                cnt++;
                String line = reader.readLine();
                if (line == null || line.isEmpty()) {
                    emptyLines++;
                    continue;
                }
                if (line.startsWith("#")) {
                    commentLines++;
                    continue;
                }
                String[] sa = line.split(",");
                if (sa == null || sa.length < 6 ) {
                    errorCount++;
                    errorList.add("Line " + cnt + ": invalid number of arquments");
                    continue;
                }
                String tag = sa[0].trim();
                String acquirer = sa[1].trim();
                String mid = sa[2].trim();
                String categorycode = sa[3].trim();
                String nameandlocation = sa[4].trim();
                String name = sa[5].trim();
                String description = sa.length < 7 ? "" : sa[6].trim();

                if (tag == null || tag.isEmpty())
                {
                    errorList.add("Line " + cnt + ": tag is not defined");
                    errorCount++;
                    continue;
                }

                if (name == null || name.isEmpty())
                {
                    errorList.add("Line " + cnt + ": name is not defined");
                    errorCount++;
                    continue;
                }

                Acquirer a = null;
                if (!"_".equals(acquirer)) {
                    Optional<Acquirer> aa = acquirerRepository.findByTag(acquirer);
                    if (!aa.isPresent()) {
                        errorCount++;
                        errorList.add("Line " + cnt + ": acquirer is not found");
                        continue;
                    }
                    a = aa.get();
                }

                Merchant m = null;
                Optional<Merchant> mm = merchantRepository.findByTag(tag);
                if (mm.isPresent())
                    m = mm.get();
                boolean updateRequired = true;
                String msg;
                if (m != null)
                {
                    if (("_".equals(mid) || mid.equals(m.mid))
                            && (name.equals("_") || name.equals(m.name))
                            && (description.equals("_") || description.equals(m.description))
                            && (categorycode.equals("_") || categorycode.equals(m.categoryCode))
                            && (nameandlocation.equals("_") || nameandlocation.equals(m.nameAndLocation))
                            && (acquirer.equals("_") || (m.acquirer != null) && acquirer.equals(m.acquirer.tag)))
                    {
                        itemsSkipped++;
                        totalItems++;
                        errorList.add("Line " + cnt + ": " + acquirer + " " + mid + " no update required");
                        continue;
                    }
                    itemsUpdated++;
                    totalItems++;
                    msg = "Line " + cnt + ": " + acquirer + " " + mid + " is updated";
                    if (!"_".equals(mid)) m.mid = mid;
                    if (!"_".equals(name)) m.name = name;
                    if (!"_".equals(description)) m.description = description;
                    if (!"_".equals(categorycode)) m.categoryCode = categorycode;
                    if (!"_".equals(nameandlocation)) m.nameAndLocation = nameandlocation;
                    if (!"_".equals(acquirer)) m.acquirer = a;
                }
                else {
                    itemsCreated++;
                    totalItems++;
                    m = new Merchant();
                    if (!"_".equals(mid)) m.mid = mid;
                    if (!"_".equals(name)) m.name = name;
                    if (!"_".equals(name)) m.tag = tag;
                    if (!"_".equals(description)) m.description = description;
                    if (!"_".equals(categorycode)) m.categoryCode = categorycode;
                    if (!"_".equals(nameandlocation)) m.nameAndLocation = nameandlocation;
                    if (!"_".equals(acquirer)) m.acquirer = a;
                    m.name = name;
                    msg = "Line " + cnt + ": " + acquirer + " " + mid + " is imported";
                }
                merchantRepository.save(m);
                errorList.add(msg);
            }
            Map<String, Object> map = new HashMap<>();
            map.put("totalItems", totalItems);
            map.put("totalLines", cnt);
            map.put("emptyLines", emptyLines);
            map.put("commentLines", commentLines);
            map.put("itemsCreated", itemsCreated);
            map.put("itemsUpdated", itemsUpdated);
            map.put("itemsSkipped", itemsSkipped);
            map.put("errorCount", errorCount);

            map.put("lines", errorList);
            return ResponseEntity.ok(map);
        } catch (Exception ex) {
            return ResponseEntity.ok(null);
        }
    }


}
