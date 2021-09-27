package ru.shtrih.kds.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.shtrih.kds.KdsApplication;
import ru.shtrih.kds.exception.ResourceNotFoundException;
import ru.shtrih.kds.model.Activator;
import ru.shtrih.kds.model.Keyloader;
import ru.shtrih.kds.repository.KeyloaderRepository;
import ru.shtrih.kds.tools.Reset;
import ru.shtrih.kds.tools.Utils;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1")
public class KeyloaderController {

    @Autowired
    private KeyloaderRepository keyloaderRepository;

    @GetMapping("/keyloaders")
    public List<Keyloader> getAllKeyloaders() {
        List<Keyloader> list = keyloaderRepository.findAll();
        return list;
    }


    @GetMapping("/keyloaders/{id}")
    public ResponseEntity<Keyloader> getKeyloaderById(@PathVariable(value = "id") Long keyId)
            throws ResourceNotFoundException {
        Keyloader key = keyloaderRepository.findById(keyId)
                .orElseThrow(() -> new ResourceNotFoundException("Keyloader not found for this id :: " + keyId));
        return ResponseEntity.ok().body(key);
    }


    @PostMapping("/keyloaders")
    public ResponseEntity<Object> createKeyloader(@Valid @RequestBody Keyloader key) {
        try {
            Keyloader t = keyloaderRepository.save(key);
            return new ResponseEntity<Object>(t, HttpStatus.OK);
        }
        catch (Exception ex)
        {
            ResponseEntity resp = Utils.UniqueTest(ex, "name", "Keyloader with this name already exists");
            if (resp == null)
                resp = Utils.ErrorResponse("Unknown server error");
            return resp;
        }
    }

    @PutMapping("/keyloaders/{id}")
    public ResponseEntity<Keyloader> updateKeyloader(@PathVariable(value = "id") Long keyId,
                                                   @Valid @RequestBody Keyloader keyDetails) throws ResourceNotFoundException {
        Keyloader key = keyloaderRepository.findById(keyId)
                .orElseThrow(() -> new ResourceNotFoundException("Keyloader not found for this id :: " + keyId));
        try {
            key.name = keyDetails.name;
            key.description = keyDetails.description;
            key.url = keyDetails.url;
            key.serialNumber = keyDetails.serialNumber;
            key.keyTag = keyDetails.keyTag;
            final Keyloader updatedKeyloader = keyloaderRepository.save(key);
            return ResponseEntity.ok(updatedKeyloader);
        }
        catch (Exception ex)
        {
            ResponseEntity resp = Utils.UniqueTest(ex, "name", "Keyloader with this name already exists");
            if (resp == null)
                resp = Utils.ErrorResponse("Unknown server error");
            return resp;
        }
    }

    @PostMapping("/deletekeyloaders")
    public ResponseEntity deleteKeyLoaders(@Valid @RequestBody List<Keyloader> keyloader) throws ResourceNotFoundException {
        keyloaderRepository.deleteAll(keyloader);
        return new ResponseEntity(HttpStatus.OK);
    }

    @DeleteMapping("/keyloaders/{id}")
    public Map<String, Boolean> deleteKeyloader(@PathVariable(value = "id") Long keyId)
            throws ResourceNotFoundException {
        Keyloader key = keyloaderRepository.findById(keyId)
                .orElseThrow(() -> new ResourceNotFoundException("Keyloader not found for this id :: " + keyId));
        keyloaderRepository.delete(key);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return response;
    }

}
