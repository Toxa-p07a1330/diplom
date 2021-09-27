package ru.shtrih.kds.model;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "logs")
@Access(AccessType.FIELD)
public class Log {

    public Log() { }

    public Log(String user, String level, Date date, String msg) {
        this.level = level;
        this.date = date;
        this.message = msg;
        this.user = user;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false)
    public long id;

    @Column(name = "date", nullable = false)
    public Date date;

    @Column(name = "level", nullable = true)
    public String level;

    @Column(name = "user")
    public String user;

    @Column(name = "message")
    public String message;

}