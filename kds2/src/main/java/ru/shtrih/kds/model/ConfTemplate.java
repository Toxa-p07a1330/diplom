package ru.shtrih.kds.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "conftemplates")
@Access(AccessType.FIELD)
public class ConfTemplate {

    public ConfTemplate() {}
    public ConfTemplate(Long id) { this.id = id; }


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false)
    public long id;

    @Column(name = "name", nullable = false)
    public String name;

    @Column(name = "stage", nullable = false)
    public String stage;

    @Column(name = "tag", nullable = false)
    public String tag;

    @Column(name = "description", nullable = true)
    public String description;

    @Column(name = "xml", nullable = true)
    public String xml;

    @ManyToMany(mappedBy = "confTemplates")
    public List<ConfPack> confPacks = new ArrayList<ConfPack>();

}