package ru.shtrih.kds.controller;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.*;

import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import javax.validation.Valid;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Example;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.codec.Hex;

import ru.shtrih.kds.exception.DataVerificationException;
import ru.shtrih.kds.exception.ResourceNotFoundException;
import ru.shtrih.kds.model.TerminalKey;
import ru.shtrih.kds.repository.LogRepository;
import ru.shtrih.kds.repository.UserRepository;
import ru.shtrih.kds.model.User;
import ru.shtrih.kds.tools.LogService;
import ru.shtrih.kds.tools.Utils;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LogService log;

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable(value = "id") Long userId)
            throws ResourceNotFoundException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return ResponseEntity.ok().body(user);
    }

    @PostMapping("/users")
    public ResponseEntity<Object> createUser(@Valid @RequestBody User user)
        throws DataVerificationException
    {
        byte[] b = new byte[32];
        new Random().nextBytes(b);
        String salt = new String(Hex.encode(b));
        String pwd = user.getPwd();
        if (pwd == null)
        {
            throw new DataVerificationException("Password is not set");
        }
        user.setPwd(Utils.ComputeHash(pwd, salt));
        user.setSalt(salt);
        try {
            User u = userRepository.save(user);
            log.info("User " + user.getLogin() + " is created");
            return new ResponseEntity<Object>(u, HttpStatus.OK);
        }
        catch (Exception ex)
        {
            String msg = ex.getMessage();
            if (msg.contains("login_UNIQUE"))
                throw new DataVerificationException("Login already in use");
            else if (msg.contains("name_UNIQUE"))
                throw new DataVerificationException("User name must be unique");
            else if (msg.contains("email_UNIQUE"))
                throw new DataVerificationException("User E-Mail must be unique");
            else
                throw new DataVerificationException("Unknown server error");
        }
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable(value = "id") Long userId,
                                                   @Valid @RequestBody User userDetails)
            throws ResourceNotFoundException ,DataVerificationException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        try {
            user.setName(userDetails.getName());
            user.setEmail(userDetails.getEmail());
            user.setLogin(userDetails.getLogin());
            user.setAdmin(userDetails.getAdmin());
            String pwd = userDetails.getPwd();
            if (pwd != null && !pwd.isEmpty()) {
                byte[] b = new byte[32];
                new Random().nextBytes(b);
                String salt = new String(Hex.encode(b));
                user.setPwd(Utils.ComputeHash(pwd, salt));
                user.setSalt(salt);
            }
            final User updatedUser = userRepository.save(user);
            log.info("User " + user.getLogin() + " is updated");
            return ResponseEntity.ok(updatedUser);
        }
        catch (Exception ex)
        {
            String msg = ex.getMessage();
            if (msg.contains("login_UNIQUE"))
                throw new DataVerificationException("Login already in use");
            else if (msg.contains("name_UNIQUE"))
                throw new DataVerificationException("User name must be unique");
            else if (msg.contains("email_UNIQUE"))
                throw new DataVerificationException("User E-Mail must be unique");
            else
                throw new DataVerificationException("Unknown server error");
        }
    }

    @PutMapping("/accounts/{id}")
    public ResponseEntity<User> updateAccount(@PathVariable(value = "id") Long userId,
                                           @Valid @RequestBody User userDetails) throws ResourceNotFoundException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String pwd = userDetails.getPwd();
        if (!pwd.isEmpty())
        {
            byte[] b = new byte[32];
            new Random().nextBytes(b);
            String salt = new String(Hex.encode(b));
            user.setPwd(Utils.ComputeHash(pwd, salt));
            user.setSalt(salt);
        }
        final User updatedUser = userRepository.save(user);
        log.info("User account" + user.getLogin() + " is updated");
        return ResponseEntity.ok(updatedUser);
    }

    @PostMapping("/deleteusers")
    public ResponseEntity deleteUsers(@Valid @RequestBody List<User> users) {
        userRepository.deleteAll(users);
        return new ResponseEntity(HttpStatus.OK);
    }

    @DeleteMapping("/users/{id}")
    public Map<String, Boolean> deleteUser(@PathVariable(value = "id") Long userId)
            throws ResourceNotFoundException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        userRepository.delete(user);
        log.info("User " + user.getLogin() + " is deleted");
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return response;
    }

}
