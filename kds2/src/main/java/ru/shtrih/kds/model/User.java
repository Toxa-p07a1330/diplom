package ru.shtrih.kds.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "users")
public class User {
    private long id;
    private String name;
    private String login;
    private String email;
    private String pwd;
    private String salt;
    private Boolean admin;
    private String token;
    private LocalDateTime time;

    public User() {

    }

    public User(String name, String login, String email, String pwd, String salt, Boolean admin, String token, LocalDateTime time) {
        this.name = name;
        this.login = login;
        this.email = email;
        this.pwd = pwd;
        this.salt = salt;
        this.admin = admin;
        this.token = token;
        this.time = time;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false)
    public long getId() {
        return id;
    }
    public void setId(long id) {
        this.id = id;
    }

    @Column(name = "name", nullable = false)
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    @Column(name = "login", nullable = false)
    public String getLogin() {
        return login;
    }
    public void setLogin(String login) {
        this.login = login;
    }

    @Column(name = "email", nullable = false)
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    @JsonIgnore
    @Column(name = "pwd", nullable = false)
    public String getPwd() {
        return pwd;
    }
    public void setPwd(String pwd) {
        this.pwd = pwd;
    }

    @JsonIgnore
    @Column(name = "salt", nullable = false)
    public String getSalt() {
        return salt;
    }
    public void setSalt(String salt) {
        this.salt = salt;
    }

    @Column(name = "admin")
    public Boolean getAdmin() {
        return admin;
    }
    public void setAdmin(Boolean admin) {
        this.admin = admin;
    }

    @Column(name = "token", nullable = true)
    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }

    @Column(name = "time", nullable = true)
    public LocalDateTime getTime() {
        return time;
    }
    public void setTime(LocalDateTime time) {
        this.time = time;
    }
}
