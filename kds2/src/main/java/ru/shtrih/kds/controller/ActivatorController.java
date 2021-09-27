package ru.shtrih.kds.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import ru.shtrih.kds.KdsApplication;
import ru.shtrih.kds.exception.DataVerificationException;
import ru.shtrih.kds.exception.ResourceNotFoundException;
import ru.shtrih.kds.model.*;
import ru.shtrih.kds.repository.ActivatorRepository;
import ru.shtrih.kds.repository.ConfPackRepository;
import ru.shtrih.kds.repository.ConfTemplateRepository;
import ru.shtrih.kds.repository.TerminalRepository;
import ru.shtrih.kds.tools.Reset;
import ru.shtrih.kds.tools.Utils;

import javax.validation.Valid;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.ByteArrayInputStream;
import java.text.SimpleDateFormat;
import java.util.*;

import static ru.shtrih.kds.tools.Utils.xmlDocumentToString;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1")
public class ActivatorController {

    @Autowired
    private ActivatorRepository activatorRepository;
    @Autowired

    private TerminalRepository terminalRepository;
    @GetMapping("/activators")
    public List<Activator> getAllActivators() {
        List<Activator> list = activatorRepository.findAll();
        return list;
    }


    @GetMapping("/activators/{id}")
    public ResponseEntity<Activator> getActivatorById(@PathVariable(value = "id") Long actId)
            throws ResourceNotFoundException {
        Activator act = activatorRepository.findById(actId)
                .orElseThrow(() -> new ResourceNotFoundException("Activator not found"));
        return ResponseEntity.ok().body(act);
    }


    @PostMapping("/activators")
    public ResponseEntity<Object> createActivator(@Valid @RequestBody Activator act)
            throws DataVerificationException {
        try {
            Activator t = activatorRepository.save(act);
            return new ResponseEntity<Object>(t, HttpStatus.OK);
        }
        catch (Exception ex)
        {
            String msg = ex.getMessage();
            if (msg.contains("name_UNIQUE"))
                throw new DataVerificationException("Activator with this name already exists");
            else
                throw new DataVerificationException("Unknown server error");
        }
    }

    @PutMapping("/activators/{id}")
    public ResponseEntity<Activator> updateActivator(@PathVariable(value = "id") Long actId,
                                                   @Valid @RequestBody Activator actDetails)
            throws ResourceNotFoundException, DataVerificationException {
        Activator act = activatorRepository.findById(actId)
                .orElseThrow(() -> new ResourceNotFoundException("Activator not found for this id :: " + actId));

        try {

            act.name = actDetails.name;
            act.description = actDetails.description;
            act.confUrl = actDetails.confUrl;
            act.terminalIp = actDetails.terminalIp;
            act.confCa = actDetails.confCa;
            act.acquirerCa = actDetails.acquirerCa;
            act.kldCa = actDetails.kldCa;
            act.tmsCa = actDetails.tmsCa;
            act.tmsCaSign = actDetails.tmsCaSign;
            act.terminalModel = actDetails.terminalModel;

            final Activator updatedAct = activatorRepository.save(act);
            return ResponseEntity.ok(updatedAct);
        }
        catch (Exception ex)
        {
            String msg = ex.getMessage();
            if (msg.contains("name_UNIQUE"))
                throw new DataVerificationException("Activator with this name already exists");
            else
                throw new DataVerificationException("Unknown server error");
        }
    }

    @PostMapping("/deleteactivators")
    public ResponseEntity deleteActivators(@Valid @RequestBody List<Activator> acts) {
        activatorRepository.deleteAll(acts);
        return new ResponseEntity(HttpStatus.OK);
    }

    @DeleteMapping("/activators/{id}")
    public Map<String, Boolean> deleteActivator(@PathVariable(value = "id") Long actId)
            throws ResourceNotFoundException {
        Activator act = activatorRepository.findById(actId)
                .orElseThrow(() -> new ResourceNotFoundException("Activator not found"));
        activatorRepository.delete(act);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return response;
    }

    @GetMapping("/activators/{id}/runreset")
    public ResponseEntity<List<Map<String, String>>> runReset(@PathVariable(value = "id") Long actId)
            throws ResourceNotFoundException {
        Activator act = activatorRepository.findById(actId)
                .orElseThrow(() -> new ResourceNotFoundException("Activator not found"));
        act.cmd = null;
        act.activeFlag = "active";
        activatorRepository.save(act);
        KdsApplication.logger.debug("runreset");

        String cmd = Reset.appendCommand(actId, activatorRepository, "init");

        List<Map<String, String>> res = Utils.stringToMap(cmd);
        Reset.beginReset(act, activatorRepository, terminalRepository);
        return ResponseEntity.ok().body(res);
    }

    @GetMapping("/activators/{id}/stopreset")
    public ResponseEntity<List<Map<String, String>>> stopReset(@PathVariable(value = "id") Long actId)
            throws ResourceNotFoundException {
        Activator act = activatorRepository.findById(actId)
                .orElseThrow(() -> new ResourceNotFoundException("Activator not found"));

        List<Map<String, String>> xmap = Utils.stringToMap(act.cmd);
        act.activeFlag = null;
        activatorRepository.save(act);
        KdsApplication.logger.debug("stopReset");
        return ResponseEntity.ok().body(xmap);
    }

    @GetMapping("/activators/{id}/getstatus")
    public ResponseEntity<List<Map<String, String>>> getActivationStatus(@PathVariable(value = "id") Long actId)
            throws ResourceNotFoundException {
        Activator act = activatorRepository.findById(actId)
                .orElseThrow(() -> new ResourceNotFoundException("Activator not found"));
        List<Map<String, String>> xmap = Utils.stringToMap(act.cmd);
        return ResponseEntity.ok().body(xmap);
    }
}
