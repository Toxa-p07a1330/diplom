package ru.shtrih.kds.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import javax.persistence.*;

@Entity
@Table(name = "acquirers")
@Access(AccessType.FIELD)
public class Acquirer {

    public Acquirer() { }
    public Acquirer(Long id) { this.id = id; }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false)
    public long id;

    @Column(name = "name", nullable = false)
    public String name;

    @Column(name = "description", nullable = true)
    public String description;

    @Column(name = "tag")
    public String tag;

}