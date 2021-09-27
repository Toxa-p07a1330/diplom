package ru.shtrih.kds.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import ru.shtrih.kds.exception.DataVerificationException;
import ru.shtrih.kds.exception.ResourceNotFoundException;
import ru.shtrih.kds.model.Group;
import ru.shtrih.kds.model.Terminal;
import ru.shtrih.kds.model.TerminalApplication;
import ru.shtrih.kds.repository.ApplicationRepository;
import ru.shtrih.kds.repository.GroupRepository;
import ru.shtrih.kds.repository.TerminalRepository;

import javax.validation.Valid;
import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1")
public class GroupController {
    @Autowired
    private GroupRepository groupRepository;
    @Autowired
    private TerminalRepository terminalRepository;
    @Autowired
    private ApplicationRepository applicationRepository;

    @GetMapping("/groups")
    public Page<Group> getAllGroups(@RequestParam("page") int page, @RequestParam("limit") int limit) {
        Pageable paged = PageRequest.of(page-1, limit);
        Page<Group> result = groupRepository.findAll(paged);
        return result;
    }

    @GetMapping("/groups/{id}/terminals")
    public Page<Terminal> getGroupTerminals(@PathVariable(value = "id") Long groupId, @RequestParam("page") int page, @RequestParam("limit") int limit) {
        Pageable paged = PageRequest.of(page-1, limit);
        Page<Terminal> result = terminalRepository.findAllByGroup(groupId, paged);
        return result;
    }

    @GetMapping("/groups/{id}")
    public ResponseEntity<Group> getGroupById(@PathVariable(value = "id") Long groupId) throws ResourceNotFoundException {
        Group group = groupRepository.findById(groupId).orElseThrow(() -> new ResourceNotFoundException("Group not found"));
        return ResponseEntity.ok().body(group);
    }

    @PostMapping("/groups")
    public ResponseEntity<Object> createGroup(@Valid @RequestBody Group group) throws DataVerificationException {
        try {
            Group g = groupRepository.save(group);
            return ResponseEntity.ok(g);
        }
        catch (Exception ex)
        {
            String msg = ex.getMessage();
            if (msg.contains("legend_UNIQUE"))
                throw new DataVerificationException("Group with this name already exists");
            else if (msg.contains("tag_UNIQUE"))
                throw new DataVerificationException("Group with this tag already exists");
            else
                throw new DataVerificationException("Unknown server error");
        }
    }

    @PutMapping("/groups/{id}")
    public ResponseEntity<Group> updateGroup(@PathVariable(value = "id") Long groupId, @Valid @RequestBody Group groupDetails)
            throws DataVerificationException, ResourceNotFoundException {
        Group group = groupRepository.findById(groupId).orElseThrow(() -> new ResourceNotFoundException("Group not found"));

        group.legend = groupDetails.legend;
        group.description = groupDetails.description;
        group.tag = groupDetails.tag;
        try {
            final Group updatedGroup = groupRepository.save(group);
            return ResponseEntity.ok(updatedGroup);
        }
        catch (Exception ex)
        {
            String msg = ex.getMessage();
            if (msg.contains("legend_UNIQUE"))
                throw new DataVerificationException("Group with this name already exists");
            else if (msg.contains("tag_UNIQUE"))
                throw new DataVerificationException("Group with this tag already exists");
            else
                throw new DataVerificationException("Unknown server error");
        }
    }

    @DeleteMapping("/groups/{id}")
    public Map<String, Boolean> deleteGroup(@PathVariable(value = "id") Long groupId)
            throws ResourceNotFoundException {
        Group group = groupRepository.findById(groupId).orElseThrow(() -> new ResourceNotFoundException("Group not found"));

        groupRepository.delete(group);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return response;
    }

    @GetMapping("/groups/{id}/appendterminal/{tid}")
    public ResponseEntity<Group> appendTerminal(@PathVariable(value = "id") Long groupId,
                                                  @PathVariable(value = "tid") Long terminalId) throws ResourceNotFoundException {
        Terminal terminal = terminalRepository.findById(terminalId)
                .orElseThrow(() -> new ResourceNotFoundException("Terminal not found"));
        terminal.groups.add(new Group(groupId));
        terminalRepository.save(terminal);
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found"));
        return ResponseEntity.ok(group);

    }

    @PostMapping("/groups/{id}/appendterminals")
    public ResponseEntity<Group> appendTerminals(@PathVariable(value = "id") Long groupId,
                                                 @Valid @RequestBody Terminal[] terminals) throws ResourceNotFoundException {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found"));
        for (Terminal t : terminals)
        {
            Optional<Terminal> tt = terminalRepository.findById(t.id);
            if (tt.isPresent())
                group.addTerminal(tt.get());
        }
        groupRepository.save(group);
        return ResponseEntity.ok(group);
    }

    @PostMapping("/groups/{id}/removeterminals")
    public ResponseEntity<Group> removeTerminals(@PathVariable(value = "id") Long groupId,
                                                 @Valid @RequestBody Terminal[] terminals) throws ResourceNotFoundException {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found"));
        for (Terminal t : terminals)
        {
            Optional<Terminal> tt = terminalRepository.findById(t.id);
            if (tt.isPresent())
                group.removeTerminal(tt.get());
        }
        groupRepository.save(group);
        return ResponseEntity.ok(group);
    }

    @PostMapping("/deletegroups")
    public ResponseEntity deleteGroups(@Valid @RequestBody List<Group> groups) {
        groupRepository.deleteAll(groups);
        return new ResponseEntity(HttpStatus.OK);
    }

    @PostMapping("/groups/{id}/addapplications")
    public ResponseEntity<Object> appendApplications(@PathVariable(value = "id") Long groupId,
                                                      @Valid @RequestBody TerminalApplication[] apps) throws ResourceNotFoundException {
        Group g = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found"));
        Map<String, String> resp = new HashMap<>(); //report
        int tcnt = 0;
        int updatecnt = 0;
        int noupdatecnt = 0;
        int modmissedcnt = 0;
        int errcnt = 0;
        for (Terminal t : g.terminals) {
            tcnt++;
            boolean appinst = false;
            boolean error = false;
            boolean modmissed = false;
            boolean noupdate = false;
            for (TerminalApplication a : apps) {
                Optional<TerminalApplication> aa = applicationRepository.findById(a.id);
                if (aa.isPresent()) {
                    TerminalApplication ap = aa.get();
                    if (!t.applications.stream().anyMatch(o -> o.id == ap.id)) {
                        if (ap.terminalModel.getId() == t.terminalModel.getId()) {
                            t.addApplication(ap);
                            appinst = true;
                        }
                        else
                            modmissed = true;
                    }
                    else
                        noupdate = true;
                }
                else
                    error = true;
            }
            if (appinst)
                updatecnt++;
            if (error)
                errcnt++;
            if (noupdate)
                noupdatecnt++;
            if (modmissed)
                modmissedcnt++;

            terminalRepository.save(t);
        }
        resp.put("total", String.valueOf(tcnt));
        resp.put("installed", String.valueOf(updatecnt));
        resp.put("uptodate", String.valueOf(noupdatecnt));
        resp.put("modelmismatch", String.valueOf(modmissedcnt));
        resp.put("errors", String.valueOf(errcnt));

        return ResponseEntity.ok(resp);
    }

    @PostMapping("/groups/{id}/removeapplications")
    public ResponseEntity<Object> removeApplications(@PathVariable(value = "id") Long groupId,
                                                       @Valid @RequestBody TerminalApplication[] apps) throws ResourceNotFoundException {
        Group g = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found"));
        int tcnt = 0;
        int rcnt = 0;
        int errcnt = 0;
        int nofcnt = 0;
        for (Terminal t : g.terminals) {
            tcnt++;
            boolean err = false;
            boolean removed = false;
            boolean nof = false;
            for (TerminalApplication a : apps) {
                Optional<TerminalApplication> aa = applicationRepository.findById(a.id);
                if (aa.isPresent()) {
                    TerminalApplication app = aa.get();
                    if (t.applications.stream().anyMatch( o -> o.id == app.id)) {
                        t.removeApplication(aa.get());
                        removed = true;
                    }
                    else
                        nof = true;
                }
                else
                    err = true;
            }
            if (err) errcnt++;
            if (removed) rcnt++;
            if (nof) nofcnt++;
            final Terminal updatedTerminal = terminalRepository.save(t);
        }
        Map<String, String > resp = new HashMap<>();
        resp.put("total", String.valueOf(tcnt));
        resp.put("removed", String.valueOf(rcnt));
        resp.put("notfound", String.valueOf(nofcnt));
        resp.put("errors", String.valueOf(errcnt));

        return ResponseEntity.ok(resp);
    }


}
