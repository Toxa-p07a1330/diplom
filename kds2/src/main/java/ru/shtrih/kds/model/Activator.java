package ru.shtrih.kds.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import javax.persistence.*;

@Entity
@Table(name = "activators")
@Access(AccessType.FIELD)
public class Activator {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false)
    public long id;

    @Column(name = "name", nullable = false)
    public String name;

    @Column(name = "description", nullable = true)
    public String description;

    @Column(name = "confca", nullable = false)
    public String confCa;

    @Column(name = "confurl", nullable = false)
    public String confUrl;

    @Column(name = "acquirerca", nullable = false)
    public String acquirerCa;

    @Column(name = "kldca", nullable = false)
    public String kldCa;

    @Column(name = "ip", nullable = false)
    public String terminalIp;

    @Column(name = "tmsca", nullable = false)
    public String tmsCa;

    @Column(name = "tmscasign", nullable = false)
    public String tmsCaSign;

    @Column(name = "cmd", nullable = true)
    public String cmd;

    @Column(name = "activeflag", nullable = true)
    public String activeFlag;

    @ManyToOne
    @JoinColumn(name="modelid")
    public TerminalModel terminalModel;

}
