package ru.shtrih.kds.controller;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.codec.Hex;
import org.springframework.web.bind.annotation.*;
import ru.shtrih.kds.exception.ResourceNotFoundException;
import ru.shtrih.kds.model.User;
import ru.shtrih.kds.repository.LogRepository;
import ru.shtrih.kds.repository.UserRepository;
import ru.shtrih.kds.tools.LogService;
import ru.shtrih.kds.tools.Utils;

import javax.validation.Valid;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/auth")
public class LoginController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LogService log;

    @PostMapping("/login")
    public ResponseEntity<Object> login(@Valid @RequestBody Map<String, String> credentials) {
        System.out.println("HERE");
        String login="";
        String pwd="";
        try {
            login = credentials.get("login");
            pwd = credentials.get("password");
        }
        catch (Exception e){
            System.out.println(e);
        }

        System.out.println("login");
        System.out.println(login);
        System.out.println("pwd");
        System.out.println(pwd);
        if (!pwd.isEmpty() && !login.isEmpty()) {
            Optional<User> uu = userRepository.findByLogin(login);
            if (uu.isPresent()) {
                User u2 = uu.get();
                String hash1 = u2.getPwd();
                String salt = u2.getSalt();
                String hash2 = Utils.ComputeHash(pwd, salt);
                System.out.println("H1");
                System.out.println(hash1);
                System.out.println("H2");
                System.out.println(hash2);
                System.out.println("s");
                System.out.println(salt);
                String tem = Utils.ComputeHash("password", "1234");
                System.out.println("IN BD should be");
                System.out.println(tem);
                if (hash1.equals(hash2)) {
                    String token = UUID.randomUUID().toString();
                    u2.setToken(token);
                    u2.setTime(LocalDateTime.now());
                    User u3 = userRepository.saveAndFlush(u2);

                    log.info("User " + u2.getLogin() + " is logged in");
                    return new ResponseEntity<Object>(u3, HttpStatus.OK);
                }
                else
                {
                    log.info("User " + u2.getLogin() + " enters invalid password");
                }
            }
        }
        return new ResponseEntity<Object>(HttpStatus.UNAUTHORIZED);
    }

    @GetMapping("/logout")
    public ResponseEntity logout(@RequestHeader(value = "Authorization", required = false) String token) {
        if (token != null && !token.isEmpty()) {
            token = StringUtils.removeStart(token, "Bearer").trim();
            Optional<User> uu = userRepository.findByToken(token);
            if (uu.isPresent()) {
                User u = uu.get();
                u.setToken(null);
                u.setTime(null);
                userRepository.save(u);
            }
        }
        return new ResponseEntity(HttpStatus.OK);
    }

    @GetMapping("/session")
    public ResponseEntity<Object> session(@RequestHeader(value = "Authorization", required = false) String token) {
        Map<String, String> rsp = new HashMap<>();
        if (token != null && !token.isEmpty()) {
            token = StringUtils.removeStart(token, "Bearer").trim();
            Optional<User> uu = userRepository.findByToken(token);
            if (uu.isPresent()) {
                rsp.put("status", "ok");
                return new ResponseEntity(rsp, HttpStatus.OK);
            }
        }
        rsp.put("status", "denied");
        return new ResponseEntity(rsp, HttpStatus.OK);
    }
}
