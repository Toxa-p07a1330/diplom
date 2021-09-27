package ru.shtrih.kds.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "merchants")
@Access(AccessType.FIELD)
public class Merchant {

    public Merchant() { }
    public Merchant(Long id) { this.id = id; }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false)
    public long id;

    @Column(name = "name", nullable = false)
    public String name;

    @Column(name = "mid")
    public String mid;

    @Column(name = "nameandlocation")
    public String nameAndLocation;

    @Column(name = "categorycode")
    public String categoryCode;

    @Column(name = "description", nullable = true)
    public String description;

    @ManyToOne
    @JoinColumn(name="acquirerid")
    public Acquirer acquirer;

    @JsonIgnore
    @OneToMany(mappedBy="merchant")
    public List<Terminal> terminals = new ArrayList<Terminal>();

    @Column(name = "tag")
    public String tag;

}