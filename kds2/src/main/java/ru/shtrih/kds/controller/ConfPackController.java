package ru.shtrih.kds.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.shtrih.kds.exception.DataVerificationException;
import ru.shtrih.kds.exception.ResourceNotFoundException;
import ru.shtrih.kds.model.ConfPack;
import ru.shtrih.kds.model.ConfTemplate;
import ru.shtrih.kds.model.Group;
import ru.shtrih.kds.model.Terminal;
import ru.shtrih.kds.repository.ConfPackRepository;
import ru.shtrih.kds.repository.ConfTemplateRepository;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1")
public class ConfPackController {

    @Autowired
    private ConfPackRepository packRepository;

    @Autowired
    private ConfTemplateRepository templateRepository;

    @GetMapping("/confpacks")
    public List<ConfPack> getAllConfPacks()
    {
        List<ConfPack> t = packRepository.findAll();
        return t;
    }

    @GetMapping("/confpacks/{id}")
    public ResponseEntity<ConfPack> getConfPackById(@PathVariable(value = "id") Long packId)
            throws ResourceNotFoundException {
        ConfPack pack = packRepository.findById(packId)
                .orElseThrow(() -> new ResourceNotFoundException("Pack not found"));
        return ResponseEntity.ok().body(pack);
    }


    @PostMapping("/confpacks")
    public ResponseEntity<Object> createConfPack(@Valid @RequestBody ConfPack pack) throws DataVerificationException {
        try {
            ConfPack t = packRepository.save(pack);
            return new ResponseEntity<Object>(t, HttpStatus.OK);
        }
        catch (Exception ex)
        {
            String msg = ex.getMessage();
            if (msg.contains("name_UNIQUE"))
                throw new DataVerificationException("Pack with this name already exists");
            else if (msg.contains("tag_UNIQUE"))
                throw new DataVerificationException("Pack with this tag already exists");
            else
                throw new DataVerificationException("Unknown server error");
        }
    }

    @PutMapping("/confpacks/{id}")
    public ResponseEntity<ConfPack> updateConfPack(@PathVariable(value = "id") Long packId,
                                                   @Valid @RequestBody ConfPack packDetails) throws ResourceNotFoundException, DataVerificationException {
        ConfPack pack = packRepository.findById(packId)
                .orElseThrow(() -> new ResourceNotFoundException("Pack not found"));

        try {
            pack.name = packDetails.name;
            pack.description = packDetails.description;
            pack.tag = packDetails.tag;
            final ConfPack updatedPack = packRepository.save(pack);
            return ResponseEntity.ok(updatedPack);
        }
        catch (Exception ex)
        {
            String msg = ex.getMessage();
            if (msg.contains("name_UNIQUE"))
                throw new DataVerificationException("Pack with this name already exists");
            else if (msg.contains("tag_UNIQUE"))
                throw new DataVerificationException("Pack with this tag already exists");
            else
                throw new DataVerificationException("Unknown server error");
        }
    }

    @PostMapping("/deletepacks")
    public ResponseEntity deleteConfPacks(@Valid @RequestBody List<ConfPack> packs) {
        packRepository.deleteAll(packs);
        return new ResponseEntity(HttpStatus.OK);
    }

    @DeleteMapping("/confpacks/{id}")
    public Map<String, Boolean> deleteConfPack(@PathVariable(value = "id") Long packId)
            throws ResourceNotFoundException {
        ConfPack pack = packRepository.findById(packId)
                .orElseThrow(() -> new ResourceNotFoundException("Pack not found"));
        packRepository.delete(pack);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return response;
    }

    @GetMapping("/confpacks/{id}/appendtemplate/{tid}")
    public ResponseEntity<ConfPack> appendTemplate(@PathVariable(value = "id") Long packId,
                                                  @PathVariable(value = "tid") Long templateId)
            throws ResourceNotFoundException, DataVerificationException {
        ConfPack pack = packRepository.findById(packId)
                .orElseThrow(() -> new ResourceNotFoundException("Package not found"));

        ConfTemplate template = templateRepository.findById(templateId)
                .orElseThrow(() -> new ResourceNotFoundException("Template not found"));

        if (pack.confTemplates.stream().anyMatch(o-> o.tag.equals(template.tag)))
        {
            throw new DataVerificationException("Duplicate template section name " + template.tag);
        }

        pack.addTemplate(template);
        final ConfPack updatedPack = packRepository.save(pack);
        return ResponseEntity.ok(updatedPack);
    }

    @GetMapping("/confpacks/{id}/removetemplate/{tid}")
    public ResponseEntity<ConfPack> removeTemplate(@PathVariable(value = "id") Long packId,
                                                    @PathVariable(value = "tid") Long templateId) throws ResourceNotFoundException {
        ConfPack pack = packRepository.findById(packId)
                .orElseThrow(() -> new ResourceNotFoundException("Package not found"));
        pack.removeTemplate(templateId);
        final ConfPack updatedPack = packRepository.save(pack);
        return ResponseEntity.ok(updatedPack);
    }

    @PostMapping("/confpacks/{id}/appendtemplates")
    public ResponseEntity<ConfPack> appendTemplates(@PathVariable(value = "id") Long packId,
                                                 @Valid @RequestBody ConfTemplate[] templates)
            throws ResourceNotFoundException, DataVerificationException {
        ConfPack pack = packRepository.findById(packId)
                .orElseThrow(() -> new ResourceNotFoundException("Pack not found"));
        for (ConfTemplate t : templates)
        {
            Optional<ConfTemplate> tt = templateRepository.findById(t.id);
            if (tt.isPresent()) {
                ConfTemplate tc = tt.get();
                if (pack.confTemplates.stream().anyMatch(o -> o.tag.equals(tc.tag)))
                {
                    throw new DataVerificationException("Duplicate template section name " + tc.tag);
                }
                pack.addTemplate(tc);
            }
        }
        packRepository.save(pack);
        return ResponseEntity.ok(pack);
    }

    @PostMapping("/confpacks/{id}/removetemplates")
    public ResponseEntity<ConfPack> removeTemplates(@PathVariable(value = "id") Long packId,
                                                 @Valid @RequestBody ConfTemplate[] templates) throws ResourceNotFoundException {
        ConfPack pack = packRepository.findById(packId)
                .orElseThrow(() -> new ResourceNotFoundException("Pack not found"));
        for (ConfTemplate t : templates)
        {
            Optional<ConfTemplate> tt = templateRepository.findById(t.id);
            if (tt.isPresent())
                pack.removeTemplate(tt.get().id);
        }
        packRepository.save(pack);
        return ResponseEntity.ok(pack);
    }
}
