package ru.shtrih.kds.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.codec.Hex;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.shtrih.kds.exception.DataVerificationException;
import ru.shtrih.kds.exception.ResourceNotFoundException;
import ru.shtrih.kds.model.*;
import ru.shtrih.kds.repository.*;
import ru.shtrih.kds.tools.Utils;

import javax.validation.Valid;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1")
public class TerminalController {
    @Autowired
    private TerminalRepository terminalRepository;

    @Autowired
    private TerminalModelRepository terminalModelRepository;

    @Autowired
    private MerchantRepository merchantRepository;

    @Autowired
    private ConfPackRepository confRepository;

    @Autowired
    private AcquirerRepository acquirerRepository;

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private ApplicationRepository applicationRepository;


    @GetMapping("/terminals")
    public Page<Terminal> getAllTerminals(@RequestParam("page") int page, @RequestParam("limit") int limit) {
        Pageable paged = PageRequest.of(page-1, limit);
        return terminalRepository.findAll(paged);
    }

    @GetMapping("/terminals/{id}")
    public ResponseEntity<Terminal> getTerminalById(@PathVariable(value = "id") Long terminalId)
            throws ResourceNotFoundException {
        Terminal terminal = terminalRepository.findById(terminalId)
                .orElseThrow(() -> new ResourceNotFoundException("Terminal not found"));
        if (terminal.xml == null)
            terminal.xml = "<empty/>";
        return ResponseEntity.ok().body(terminal);
    }

    @PostMapping("/terminals")
    public ResponseEntity<Object> createTerminal(@Valid @RequestBody Terminal terminal)
        throws DataVerificationException {
        try
        {
            Terminal t = terminalRepository.save(terminal);
/*
        Terminal t = null;
        try {
            terminal.groups = new ArrayList<InnerGroup>();
            for (int i = 201; i < 30000; i++) {
                terminal.sn = String.format("%016d", i);
                terminal.tid = String.format("%08d", i);
                t = terminalRepository.save(terminal);
            }

 */
            return new ResponseEntity<Object>(t, HttpStatus.OK);
        }
        catch(Exception ex)
        {
            String msg = ex.getMessage();
            if (msg.contains("model_sn_UNIQUE"))
                throw new DataVerificationException("Terminal of this model and with this sn already exists");
            else
                throw new DataVerificationException("Unknown server error");
        }
    }

    @PutMapping("/terminals/{id}")
    public ResponseEntity<Terminal> updateTerminal(@PathVariable(value = "id") Long terminalId,
                                             @Valid @RequestBody Terminal terminalDetails)
            throws ResourceNotFoundException, DataVerificationException {
        Terminal terminal = terminalRepository.findById(terminalId)
                .orElseThrow(() -> new ResourceNotFoundException("Terminal not found"));

        try {
            terminal.tid = terminalDetails.tid;
            terminal.description = terminalDetails.description;
            terminal.sn = terminalDetails.sn;
            //terminal.terminalModel = terminalDetails.terminalModel; do not allow to change it since created
            terminal.conf = terminalDetails.conf;
            terminal.merchant = terminalDetails.merchant;
            terminal.stage = terminalDetails.stage;
            terminal.keyLoaderCert = terminalDetails.keyLoaderCert;
            terminal.terminalKeys = terminalDetails.terminalKeys;
            terminal.xml = terminalDetails.xml;
            terminal.ip = terminalDetails.ip;
            final Terminal updatedTerminal = terminalRepository.save(terminal);
            return ResponseEntity.ok(updatedTerminal);
        }
        catch(Exception ex)
        {
            String msg = ex.getMessage();
            if (msg.contains("model_sn_UNIQUE"))
                throw new DataVerificationException("Terminal of this model and with this sn already exists");
            else
                throw new DataVerificationException("Unknown server error");
        }
    }

    @PostMapping("/deleteterminals")
    public ResponseEntity deleteTerminals(@Valid @RequestBody List<Terminal> terminals) {
        terminalRepository.deleteAll(terminals);
        return new ResponseEntity(HttpStatus.OK);
    }

    @DeleteMapping("/terminals/{id}")
    public Map<String, Boolean> deleteTerminal(@PathVariable(value = "id") Long terminalId)
            throws ResourceNotFoundException {
        Terminal terminal = terminalRepository.findById(terminalId)
                .orElseThrow(() -> new ResourceNotFoundException("Terminal not found"));

        terminalRepository.delete(terminal);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return response;
    }

    @GetMapping("/terminals/{id}/appendtogroup/{gid}")
    public ResponseEntity<Terminal> appendToGroup(@PathVariable(value = "id") Long terminalId,
                                                  @PathVariable(value = "gid") Long groupId) throws ResourceNotFoundException {
        Terminal terminal = terminalRepository.findById(terminalId)
                .orElseThrow(() -> new ResourceNotFoundException("Terminal not found"));
        terminal.groups.add(new Group(groupId));
        final Terminal updatedTerminal = terminalRepository.save(terminal);
        return ResponseEntity.ok(updatedTerminal);
    }

    @PostMapping("/terminals/{id}/appendtogroups")
    public ResponseEntity<Terminal> appendTerminalToGroups(@PathVariable(value = "id") Long terminalId,
                                                   @Valid @RequestBody Group[] groups) throws ResourceNotFoundException {
        Terminal terminal = terminalRepository.findById(terminalId)
                .orElseThrow(() -> new ResourceNotFoundException("Terminal not found"));
        for (Group g : groups) {
            Optional<Group> gg = groupRepository.findById(g.id);
            if (gg.isPresent()) {
                terminal.addToGroup(gg.get());
            }
        }
        final Terminal updatedTerminal = terminalRepository.save(terminal);
        return ResponseEntity.ok(updatedTerminal);
    }

    @PostMapping("/terminals/{id}/removefromgroups")
    public ResponseEntity<Terminal> removeFromGroup(@PathVariable(value = "id") Long terminalId,
                                                    @Valid @RequestBody Group[] groups) throws ResourceNotFoundException {
        Terminal terminal = terminalRepository.findById(terminalId)
                .orElseThrow(() -> new ResourceNotFoundException("Terminal not found"));
        for (Group g : groups) {
            Optional<Group> gg = groupRepository.findById(g.id);
            if (gg.isPresent()) {
                terminal.removeFromGroup(gg.get());
            }
        }
        final Terminal updatedTerminal = terminalRepository.save(terminal);
        return ResponseEntity.ok(updatedTerminal);
    }

    @PostMapping("/terminals/{id}/addapplications")
    public ResponseEntity<Terminal> appendApplication(@PathVariable(value = "id") Long terminalId,
                                                           @Valid @RequestBody TerminalApplication[] apps) throws ResourceNotFoundException {
        Terminal terminal = terminalRepository.findById(terminalId)
                .orElseThrow(() -> new ResourceNotFoundException("Terminal not found"));
        for (TerminalApplication a : apps) {
            Optional<TerminalApplication> aa = applicationRepository.findById(a.id);
            if (aa.isPresent()) {
                terminal.addApplication(aa.get());
            }
        }
        final Terminal updatedTerminal = terminalRepository.save(terminal);
        return ResponseEntity.ok(updatedTerminal);
    }

    @PostMapping("/terminals/{id}/removeapplications")
    public ResponseEntity<Terminal> removeApplications(@PathVariable(value = "id") Long terminalId,
                                                    @Valid @RequestBody TerminalApplication[] apps) throws ResourceNotFoundException {
        Terminal terminal = terminalRepository.findById(terminalId)
                .orElseThrow(() -> new ResourceNotFoundException("Terminal not found"));
        for (TerminalApplication a : apps) {
            Optional<TerminalApplication> aa = applicationRepository.findById(a.id);
            if (aa.isPresent()) {
                terminal.removeApplication(aa.get());
            }
        }
        final Terminal updatedTerminal = terminalRepository.save(terminal);
        return ResponseEntity.ok(updatedTerminal);
    }


    @GetMapping(value="terminals/{id}/clearcommand")
    public ResponseEntity terminalClearCommand(@PathVariable(value = "id") Long id) {
        Optional<Terminal> t = terminalRepository.findById(id);
        if (t != null) {
            Terminal tt = t.get();
            tt.cmd = null;
            terminalRepository.save(tt);
        }
        return new ResponseEntity(HttpStatus.OK);
    }

    @GetMapping(value="terminals/{id}/commandstatus")
    public ResponseEntity<Map<String, String>> terminalCommandStatus(@PathVariable(value = "id") Long id) {
        Optional<Terminal> t = terminalRepository.findById(id);
        String status = "undefined";
        String payload = null;
        if (t != null) {
            Terminal tt = t.get();
            if (tt.cmd != null && tt.cmd.length() > 0)
            {
                String[] sa = tt.cmd.split(":");
                if (sa.length > 1)
                {
                    String[] sa2 = sa[1].split("\\.");
                    status = sa2[0];
                    if (sa2.length > 1)
                    {
                        String p = sa2[1];
                        if (p.length() > 0)
                        {
                            payload =  new String(Base64.getDecoder().decode(p));
                        }
                    }
                }
            }
            //tt.cmd = null;
            //terminalRepository.save(tt);
        }
        Map<String, String> map = new HashMap();
        map.put("status", status);
        if (payload != null)
            map.put("payload", payload);
        return new ResponseEntity(map, HttpStatus.OK);
    }

    // accept command and list of serial numbers this command to apply
    @GetMapping(value="terminals/{id}/pushcommand/{cmd}")
    public ResponseEntity<Map<String, String>> terminalPushCommand(@PathVariable(value = "id") Long id,
                                                                 @PathVariable(value = "cmd") String cmd) {
        Map<String, String> map = new HashMap<>();

        Optional<Terminal> t = terminalRepository.findById(id);
        if (t != null)
        {
            Terminal tt = t.get();
            if (tt.cmd != null && tt.cmd.length() > 0) {
                map.put("status", "busy");
            }
            else {
                tt.cmd = cmd + "." + java.util.UUID.randomUUID() + ":pending";
                terminalRepository.save(tt);
                map.put("status", "pending");
            }
        }
        else
            map.put("status", "notfound");
        return new ResponseEntity(map, HttpStatus.OK);
    }

    //csv: model,serialnumber,tid,conf,merchant,description,group1:group2
    @PostMapping("/terminals/upload")
    public ResponseEntity<Map<String, Object>> terminalFileUpload(@RequestParam("file") MultipartFile file) {
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
                String model = sa[0].trim();
                String sn = sa[1].trim();
                String tid = sa[2].trim();
                String conf = sa[3].trim();
                String merchant = sa[4].trim();
                String description = sa[5].trim();
                String groups = sa.length > 6 ? sa[6].trim() : "_";


                if (model == null || model.isEmpty())
                {
                    errorList.add("Line " + cnt + ": model is not defined");
                    errorCount++;
                    continue;
                }

                Optional<TerminalModel> mm = terminalModelRepository.findByName(model);
                if (!mm.isPresent())
                {
                    errorList.add("Line " + cnt + ": model is not found");
                    errorCount++;
                    continue;
                }

                TerminalModel m = mm.get();

                if (sn == null || sn.isEmpty())
                {
                    errorList.add("Line " + cnt + ": serial number is not defined");
                    errorCount++;
                    continue;
                }

                Optional<Merchant> mmr = merchantRepository.findByTag(merchant);
                if (!mmr.isPresent())
                {
                    errorList.add("Line " + cnt + ": merchant is not found");
                    errorCount++;
                    continue;
                }
                Merchant mr = mmr.get();

                Optional<ConfPack> ccp = confRepository.findByTag(conf);
                if (!ccp.isPresent())
                {
                    errorCount++;
                    errorList.add("Line " + cnt + ": configuration is not found");
                    continue;
                }
                ConfPack cp = ccp.get();

                Terminal t = null;

                Optional<Terminal> tt = terminalRepository.findByModelAndSerial(model, sn);
                if (tt.isPresent()) {
                    t = tt.get();
                }

                String[] sg;
                if (groups != null && !groups.isEmpty() && !"_".equals(groups))
                    sg = groups.split(":");
                else
                    sg = new String[0];
                List<Group> gps = new ArrayList<>();
                for (String g : sg)
                {
                    Optional<Group> gt = groupRepository.findByTag(g);
                    if (!gt.isPresent())
                    {
                        errorCount++;
                        errorList.add("Line " + cnt + ": group is not found");
                        continue;
                    }
                    gps.add(gt.get());
                }

                String msg;
                if (t != null)
                {
                    //groups differs
                    boolean gd = false;
                    for (Group g : gps) {
                        if (g.legend != null && !g.legend.isEmpty()) {
                            if (t.groups != null) {
                                boolean found = false;
                                for (Group gt : t.groups) {
                                    if (g.legend.equals(gt.legend)) {
                                        found = true;
                                        break;
                                    }
                                }
                                if (!found)
                                {
                                    gd = true;
                                    break;
                                }
                            }
                        }
                    }

                    if (!gd && ("_".equals(tid) || tid.equals(t.tid))
                    && ("_".equals(conf) || (t.conf != null && conf.equals(t.conf.tag)))
                    && ("_".equals(merchant) || (t.merchant != null && merchant.equals(t.merchant.tag)))
                    && ("_".equals(description) || description.equals(description)))
                    {
                        itemsSkipped++;
                        totalItems++;
                        errorList.add("Line " + cnt + ": " + sn + " tid " + tid + " no update required");
                        continue;
                    }
                    itemsUpdated++;
                    totalItems++;
                    msg ="Line " + cnt + ": " + sn + " tid " + tid +  " is updated";
                    if(!"_".equals(merchant)) t.merchant = mr;
                    if(!"_".equals(tid)) t.tid = tid;
                    t.stage = Utils.incrementStage(t.stage);
                    if(!"_".equals(conf)) t.conf = cp;
                    if(!"_".equals(description)) t.description = description;
                }
                else {
                    itemsCreated++;
                    totalItems++;
                    t = new Terminal();
                    if(!"_".equals(merchant)) t.merchant = mr;
                    if(!"_".equals(tid)) t.tid =tid;
                    t.stage = Utils.incrementStage("");
                    t.terminalModel = m;
                    if(!"_".equals(conf)) t.conf = cp;
                    if(!"_".equals(description)) t.description = description;
                    if(!"_".equals(tid)) t.tid = tid;
                    t.sn = sn;
                    msg = "Line " + cnt + ": " + sn + " tid " + tid + " is imported";
                }

                //add groups
                for (Group g : gps)
                {
                    if (g.legend != null && !g.legend.isEmpty())
                    {
                        if (t.groups != null) {
                            boolean found = false;
                            for (Group gt : t.groups) {
                                if (g.legend.equals(gt.legend))
                                {
                                    found = true;
                                    break;
                                }
                            }
                            if (!found)
                            {
                                t.groups.add(new Group(g.id));
                                msg += " added to " + g.legend;
                            }
                        }
                    }
                }
                terminalRepository.save(t);

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
