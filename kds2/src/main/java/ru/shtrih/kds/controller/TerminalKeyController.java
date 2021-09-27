package ru.shtrih.kds.controller;

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
import ru.shtrih.kds.repository.KeyloaderRepository;
import ru.shtrih.kds.repository.TerminalKeyRepository;
import ru.shtrih.kds.repository.TerminalRepository;
import javax.validation.Valid;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1")
public class TerminalKeyController {

    @Autowired
    private TerminalKeyRepository keyRepository;
    @Autowired
    private TerminalRepository terminalRepository;
    @Autowired
    private KeyloaderRepository keyloaderRepository;

    @GetMapping("/keys")
    public Page<TerminalKey> getAllTerminalKeys(@RequestParam("page") int page, @RequestParam("limit") int limit) {
        Pageable paged = PageRequest.of(page-1, limit);
        Page<TerminalKey> result = keyRepository.findAll(paged);
        return result;
    }


    @GetMapping("/keys/{id}")
    public ResponseEntity<TerminalKey> getTerminalKeyById(@PathVariable(value = "id") Long keyId)
            throws ResourceNotFoundException {
        TerminalKey key = keyRepository.findById(keyId)
                .orElseThrow(() -> new ResourceNotFoundException("TerminalKey not found"));
        return ResponseEntity.ok().body(key);
    }


    @PostMapping("/keys")
    public ResponseEntity<Object> createTerminalKey(@Valid @RequestBody TerminalKey key) throws DataVerificationException {

        try {
            return new ResponseEntity<Object>(keyRepository.save(key), HttpStatus.OK);
        }
        catch (Exception ex)
        {
            throw new DataVerificationException("Unknown server error");
        }
    }

    @PutMapping("/keys/{id}")
    public ResponseEntity<TerminalKey> updateTerminalKey(@PathVariable(value = "id") Long keyId,
                                                   @Valid @RequestBody TerminalKey keyDetails)
            throws ResourceNotFoundException, DataVerificationException {
        TerminalKey key = keyRepository.findById(keyId)
                .orElseThrow(() -> new ResourceNotFoundException("TerminalKey not found"));
        try {
            key.name = keyDetails.name;
            key.keyLoader = keyDetails.keyLoader;
            key.material = keyDetails.material;
            //key.terminal = keyDetails.terminal; never change terminal
            key.tag = keyDetails.tag;

            final TerminalKey updatedKey = keyRepository.save(key);
            return ResponseEntity.ok(updatedKey);
        }
        catch (Exception ex)
        {
            throw new DataVerificationException("Unknown server error");
        }
    }

    @PostMapping("/deletekeys")
    public ResponseEntity deleteKeys(@Valid @RequestBody List<TerminalKey> keys) throws ResourceNotFoundException {
        keyRepository.deleteAll(keys);
        return new ResponseEntity(HttpStatus.OK);
    }


    @DeleteMapping("/keys/{id}")
    public Map<String, Boolean> deleteTerminalKey(@PathVariable(value = "id") Long keyId)
            throws ResourceNotFoundException {
        TerminalKey key = keyRepository.findById(keyId)
                .orElseThrow(() -> new ResourceNotFoundException("TerminalKey not found"));
        keyRepository.delete(key);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return response;
    }

    //csv: acquirer, tid, keyname, keytag, keymaterial, keyloader, kcv
    @PostMapping("/keys/upload")
    public ResponseEntity<Map<String, Object>> singleFileUpload(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.ok(null);
        }
        try {
            BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
            List<String> errorList = new ArrayList<>();
            int cnt = 0;
            int totalKeys = 0;
            int emptyLines = 0;
            int commentLines = 0;
            int keysCreated = 0;
            int keysUpdated = 0;
            int keysSkipped = 0;
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
                String acq = sa[0].trim();
                String tid = sa[1].trim();
                String keyName = sa[2].trim();
                String keyTag = sa[3].trim();
                String keyMaterial = sa[4].trim();
                String keyLoader = sa[5].trim();

                if (keyName == null || keyName.isEmpty())
                {
                    errorList.add("Line " + cnt + ": key name is not defined");
                    errorCount++;
                    continue;
                }

                if (keyTag == null || keyTag.isEmpty())
                {
                    errorList.add("Line " + cnt + ": key tag is not defined");
                    errorCount++;
                    continue;
                }

                if (keyMaterial == null || keyMaterial.isEmpty())
                {
                    errorCount++;
                    errorList.add("Line " + cnt + ": key material is empty");
                    continue;
                }

                Optional<Keyloader> kkld = keyloaderRepository.findByKeyTag(keyLoader);
                if (!kkld.isPresent())
                {
                    errorCount++;
                    errorList.add("Line " + cnt + ": key loader is not found");
                    continue;
                }

                Optional<Terminal> tt = terminalRepository.findByAcquirerAndTid(acq, tid);
                if (!tt.isPresent())
                {
                    errorCount++;
                    errorList.add("Line " + cnt + ": terminal is not found");
                    continue;
                }

                Terminal t = tt.get();
                TerminalKey key = null;
                boolean updateRequired = true;
                for (InnerTerminalKey ikey : t.terminalKeys)
                {
                    if (ikey.tag.equals(keyTag))
                    {
                        key = new TerminalKey(t, ikey);
                        break;
                    }
                }
                String msg;
                if (key != null)
                {
                    if (keyName.equals(key.name) && keyMaterial.equals(key.material)
                            && (key.keyLoader != null) && keyLoader.equals(key.keyLoader.keyTag))
                    {
                        keysSkipped++;
                        totalKeys++;
                        errorList.add("Line " + cnt + ": " + acq + " " + tid + " key " + keyName + " no update required");
                        continue;
                    }
                    keysUpdated++;
                    totalKeys++;
                    msg = "Line " + cnt + ": " + acq + " " + tid + " key " + keyName + " is updated";
                    key.keyLoader = kkld.get();
                    key.material = keyMaterial;
                    key.name = keyName;
                }
                else {
                    keysCreated++;
                    totalKeys++;
                    key = new TerminalKey();
                    key.keyLoader = kkld.get();
                    key.material = keyMaterial;
                    key.name = keyName;
                    key.tag = keyTag;
                    key.terminal = t;
                    msg = "Line " + cnt + ": " + acq + " " + tid + " key " + keyName + " is imported";
                }
                keyRepository.save(key);
                errorList.add(msg);
            }
            Map<String, Object> map = new HashMap<>();
            map.put("totalKeys", totalKeys);
            map.put("totalLines", cnt);
            map.put("emptyLines", emptyLines);
            map.put("commentLines", commentLines);
            map.put("keysCreated", keysCreated);
            map.put("keysUpdated", keysUpdated);
            map.put("keysSkipped", keysSkipped);
            map.put("errorCount", errorCount);

            map.put("lines", errorList);
            return ResponseEntity.ok(map);
        } catch (Exception ex) {
            return ResponseEntity.ok(null);
        }
    }

}
