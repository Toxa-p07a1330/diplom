package ru.shtrih.kds.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.codec.Hex;
import org.springframework.web.bind.annotation.*;
import ru.shtrih.kds.exception.ResourceNotFoundException;
import ru.shtrih.kds.model.*;
import ru.shtrih.kds.repository.ApplicationRepository;
import ru.shtrih.kds.repository.TerminalModelRepository;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1")
public class TerminalModelController {
    @Autowired
    private TerminalModelRepository terminalModelRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @GetMapping("/terminalmodels")
    public List<TerminalModel> getAllTerminalModels() {
        return terminalModelRepository.findAll();
    }

    @GetMapping("/terminalmodels/{id}/applications")
    public List<TerminalApplication> getTerminalModelApplications(@PathVariable(value = "id") Long modelId) {
        List<TerminalApplication> list = applicationRepository.findAllByModel(modelId);
        return list;
    }

}
