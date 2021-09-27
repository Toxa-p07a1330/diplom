package ru.shtrih.kds.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.shtrih.kds.exception.ResourceNotFoundException;
import ru.shtrih.kds.model.Acquirer;
import ru.shtrih.kds.model.Command;
import ru.shtrih.kds.model.Group;
import ru.shtrih.kds.model.Terminal;
import ru.shtrih.kds.repository.AcquirerRepository;
import ru.shtrih.kds.repository.CommandRepository;
import ru.shtrih.kds.repository.GroupRepository;
import ru.shtrih.kds.repository.TerminalRepository;
//import sun.java2d.cmm.kcms.CMM;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1")
public class CommandController {
    @Autowired
    private CommandRepository commandRepository;
    @Autowired
    private GroupRepository groupRepository;
    @Autowired
    private TerminalRepository terminalRepository;

    @GetMapping("/commands")
    public List<Command> getAllCommands() {
        List<Command> m =  commandRepository.findAll();
        return m;
    }

    @GetMapping("/terminals/{id}commands/{id}")
    public ResponseEntity<Command> getAcquirerById(@PathVariable(value = "id") Long commandId)
            throws ResourceNotFoundException {
        Command command = commandRepository.findById(commandId)
                .orElseThrow(() -> new ResourceNotFoundException("Command not found for this id :: " + commandId));
        return ResponseEntity.ok().body(command);
    }

    @PostMapping("/groups/{id}/commands")
    public ResponseEntity runGroupCommand(@PathVariable(value = "id") Long groupId, @RequestParam("page") int page,
                                                  @RequestParam("limit") int limit, @Valid @RequestBody Command command) {
        Optional<Group> gg = groupRepository.findById(groupId);
        command.status = "pending";
        command.result = null;
        if (gg.isPresent())
        {
            Group g = gg.get();
            for (Terminal t : g.terminals)
            {
                List<Command> list = commandRepository.findByTerminal(t.id);
                commandRepository.deleteAll(list);
                command.id = -1;
                command.terminal = t;
                commandRepository.save(command);
            }
        }
        Pageable paged = PageRequest.of(page-1, limit);
        Page<Terminal> t = terminalRepository.findAllByGroup(groupId, paged);
        return new ResponseEntity(t, HttpStatus.OK);
    }


    @PostMapping("terminals/{id}/commands")
    public ResponseEntity<Object> runTerminalCommand(@PathVariable(value = "id") Long terminalId,
                                                     @Valid @RequestBody Command command) throws ResourceNotFoundException {

        Command g = null;
        Optional<Terminal> tt = terminalRepository.findById(terminalId);
        if (!tt.isPresent())
            throw new ResourceNotFoundException("terminal is not found");
        Terminal t = tt.get();
        if (t.terminalCommands.size() > 0)
        {
            commandRepository.deleteAll(t.terminalCommands);
        }
        try {
            command.status = "pending";
            command.result = null;
            command.terminal = t;
            Command nc = commandRepository.saveAndFlush(command);
            t.terminalCommands.clear();
            t.terminalCommands.add(command);
            return new ResponseEntity<Object>(t, HttpStatus.OK);
        }
        catch (Exception ex)
        {
            if (ex.getMessage().contains("acquirer.legend_UNIQUE"))
            {
                HashMap<String, String> map = new HashMap<>();
                map.put("error", "Acquirer already exists");
                return new ResponseEntity<Object>(map, HttpStatus.OK);
            }
            HashMap<String, String> map = new HashMap<>();
            map.put("error", "Undefined server error");
            return new ResponseEntity<Object>(map, HttpStatus.OK);
        }
    }

    @DeleteMapping("/terminals/{id}/commands")
    public Map<String, Boolean> deleteTerminalCommands(@PathVariable(value = "id") Long terminalId)
            throws ResourceNotFoundException {

        Optional<Terminal> tt = terminalRepository.findById(terminalId);
        Map<String, Boolean> response = new HashMap<>();
        if (tt.isPresent()) {
            Terminal t = tt.get();
            if (!t.terminalCommands.isEmpty()) {
                commandRepository.deleteAll(t.terminalCommands);
                response.put("deleted", Boolean.TRUE);
                return response;
            }
        }
        response.put("deleted", Boolean.FALSE);
        return response;
    }

    @DeleteMapping("/groups/{id}/commands")
    public Map<String, Boolean> deleteGroupCommands(@PathVariable(value = "id") Long groupId)
            throws ResourceNotFoundException {

        Optional<Group> gg = groupRepository.findById(groupId);
        Map<String, Boolean> response = new HashMap<>();
        if (gg.isPresent()) {
            Group g = gg.get();
            for (Terminal t : g.terminals) {
                if (!t.terminalCommands.isEmpty()) {
                    commandRepository.deleteAll(t.terminalCommands);
                }
            }
        }
        response.put("deleted", Boolean.TRUE);
        return response;
    }

}
