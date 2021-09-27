package ru.shtrih.kds.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import javax.persistence.*;

@Entity
@Table(name = "keyloaders")
@Access(AccessType.FIELD)
public class Keyloader {

    public Keyloader() { }
    public Keyloader(Long id) { this.id = id; }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false)
    public long id;

    @Column(name = "name", nullable = false)
    public String name;

    @Column(name = "description", nullable = true)
    public String description;

    @Column(name = "url", nullable = false)
    public String url;

    @Column(name = "sn", nullable = true)
    public String serialNumber;

    @Column(name = "keytag", nullable = true)
    public String keyTag;


}
