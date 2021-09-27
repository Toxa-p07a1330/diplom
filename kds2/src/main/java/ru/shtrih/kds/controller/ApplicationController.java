package ru.shtrih.kds.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.shtrih.kds.exception.DataVerificationException;
import ru.shtrih.kds.exception.ResourceNotFoundException;
import ru.shtrih.kds.model.TerminalApplication;
import ru.shtrih.kds.repository.ApplicationRepository;
import ru.shtrih.kds.tools.ApplicationPrivateProperties;
import ru.shtrih.kds.tools.Utils;

import javax.validation.Valid;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1")
public class ApplicationController {
    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    ApplicationPrivateProperties applicationPrivateProperties;

    @GetMapping("/applications")
    public List<TerminalApplication> getAllApplications() {
        List<TerminalApplication> m =  applicationRepository.findAll();
        return m;
    }

    @GetMapping("/applications/{id}")
    public ResponseEntity<TerminalApplication> getApplicationById(@PathVariable(value = "id") Long applicationId)
            throws ResourceNotFoundException {
        TerminalApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        return ResponseEntity.ok().body(application);
    }

    @PostMapping("/applications")
    public ResponseEntity<Object> createApplication(@Valid @RequestBody TerminalApplication application) throws DataVerificationException{
        try {
            TerminalApplication g = applicationRepository.save(application);
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

    @PutMapping("/applications/{id}")
    public ResponseEntity<TerminalApplication> updateApplication(@PathVariable(value = "id") Long applicationId,
                                           @Valid @RequestBody TerminalApplication applicationDetails)
            throws ResourceNotFoundException, DataVerificationException {
        TerminalApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        try {
            application.name = applicationDetails.name;
            application.tag = applicationDetails.tag;
            application.description = applicationDetails.description;
            application.signature = applicationDetails.signature;
            application.version = applicationDetails.version;
            application.typeTag = applicationDetails.typeTag;
            application.terminalModel = applicationDetails.terminalModel;
            final TerminalApplication updatedApplication = applicationRepository.save(application);
            return ResponseEntity.ok(updatedApplication);
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

    @PostMapping("/deleteapplications")
    public ResponseEntity deleteApplications(@Valid @RequestBody List<TerminalApplication> applications) {
        for (TerminalApplication ta : applications)
        {
            Optional<TerminalApplication> aa = applicationRepository.findById(ta.id);
            if (aa.isPresent())
            {
                TerminalApplication a = aa.get();
                String apath = a.path;
                if (apath != null && !apath.isEmpty()) {
                    Path p = Paths.get(applicationPrivateProperties.getUploadDir(), apath);

                    try {
                        Files.delete(p);
                    } catch (Exception ex) {

                    }
                    applicationRepository.delete(a);
                }
            }
        }
        return new ResponseEntity(HttpStatus.OK);
    }

    @PostMapping("/applications/{id}/upload")
    public ResponseEntity<TerminalApplication> singleFileUpload(@PathVariable(value = "id") Long appId,
                                                         @RequestParam("file") MultipartFile file) throws DataVerificationException {
        if (file.isEmpty()) {
            return ResponseEntity.ok(null);
        }
        try {
            TerminalApplication app = applicationRepository.findById(appId)
                    .orElseThrow(() -> new ResourceNotFoundException("Template not found for this id :: " + appId));
            String apath = app.path;

            app.fileName = file.getOriginalFilename();
            app.path = app.terminalModel.getName() + "_" + app.fileName + "_" + app.version;
            Path path = Paths.get(applicationPrivateProperties.getUploadDir(), app.path).toAbsolutePath().normalize();
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
            applicationRepository.save(app);
            if (apath != null && !apath.isEmpty() && !apath.equals(app.path))
            {
                Files.delete(Paths.get(applicationPrivateProperties.getUploadDir(), apath).toAbsolutePath().normalize());
            }
            return new ResponseEntity(HttpStatus.OK);
        } catch (Exception ex) {
            throw  new DataVerificationException("Failed to upload file");
        }
    }

}
