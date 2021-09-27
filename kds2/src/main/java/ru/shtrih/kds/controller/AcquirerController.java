package ru.shtrih.kds.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.shtrih.kds.exception.DataVerificationException;
import ru.shtrih.kds.exception.ResourceNotFoundException;
import ru.shtrih.kds.model.*;
import ru.shtrih.kds.repository.AcquirerRepository;
import ru.shtrih.kds.repository.MerchantRepository;
import ru.shtrih.kds.repository.TerminalRepository;
import ru.shtrih.kds.tools.Utils;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1")
public class AcquirerController {
    @Autowired
    private AcquirerRepository acquirerRepository;

    @Autowired
    MerchantRepository merchantRepository;

    @GetMapping("/acquirers")
    public List<Acquirer> getAllAcquirers() {
        return acquirerRepository.findAll();
    }

    @GetMapping("/acquirers/{id}")
    public ResponseEntity<Acquirer> getAcquirerById(@PathVariable(value = "id") Long acquirerId)
            throws ResourceNotFoundException {
        Acquirer acquirer = acquirerRepository.findById(acquirerId)
                .orElseThrow(() -> new ResourceNotFoundException("Acquirer not found"));
        return ResponseEntity.ok().body(acquirer);
    }

    @GetMapping("/acquirers/{id}/merchants")
    public Page<Merchant> getMerchantTerminals(@PathVariable(value = "id") Long acquirerId, @RequestParam("page") int page, @RequestParam("limit") int limit) {
        Pageable paged = PageRequest.of(page-1, limit);
        Page<Merchant> result = merchantRepository.findAllByAcquirer(acquirerId, paged);
        return result;
    }

    @PostMapping("/acquirers")
    public ResponseEntity<Object> createAcquirer(@Valid @RequestBody Acquirer acquirer) throws DataVerificationException {
        try {
            Acquirer g = acquirerRepository.save(acquirer);
            return new ResponseEntity<Object>(g, HttpStatus.OK);
        }
        catch (Exception ex)
        {
            String msg = ex.getMessage();
            if (msg.contains("name_UNIQUE"))
                throw new DataVerificationException("Template with this name already exists");
            else if (msg.contains("tag_UNIQUE"))
                throw new DataVerificationException("Template with this tag already exists");
            else
                throw new DataVerificationException("Unknown server error");
        }
    }

    @PutMapping("/acquirers/{id}")
    public ResponseEntity<Acquirer> updateAcquirer(@PathVariable(value = "id") Long acquirerId,
                                           @Valid @RequestBody Acquirer acquirerDetails) throws ResourceNotFoundException, DataVerificationException {
        Acquirer acquirer = acquirerRepository.findById(acquirerId)
                .orElseThrow(() -> new ResourceNotFoundException("Acquirer not found for this id :: " + acquirerId));

        try {
            acquirer.name = acquirerDetails.name;
            acquirer.tag = acquirerDetails.tag;
            acquirer.description = acquirerDetails.description;
            final Acquirer updatedAcquirer = acquirerRepository.save(acquirer);
            return ResponseEntity.ok(updatedAcquirer);
        }
        catch (Exception ex)
        {
            String msg = ex.getMessage();
            if (msg.contains("name_UNIQUE"))
                throw new DataVerificationException("Template with this name already exists");
            else if (msg.contains("tag_UNIQUE"))
                throw new DataVerificationException("Template with this tag already exists");
            else
                throw new DataVerificationException("Unknown server error");
        }

    }

    @PostMapping("/deleteacquirers")
    public ResponseEntity deleteAcquirers(@Valid @RequestBody List<Acquirer> acquirers)  {
        acquirerRepository.deleteAll(acquirers);
        return new ResponseEntity(HttpStatus.OK);
    }

    @DeleteMapping("/acquirers/{id}")
    public Map<String, Boolean> deleteAcquirer(@PathVariable(value = "id") Long acquirerId)
            throws ResourceNotFoundException {
        Acquirer acquirer = acquirerRepository.findById(acquirerId)
                .orElseThrow(() -> new ResourceNotFoundException("Acquirer not found"));

        acquirerRepository.delete(acquirer);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return response;
    }

}
