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
public class InnerConfTemplate {

    public InnerConfTemplate() {}

    public InnerConfTemplate(ConfTemplate t)
    {
        this.id = t.id;
        this.name = t.name;
        this.stage = t.stage;
        this.tag = t.tag;
        this.description = t.description;
        this.xml = t.xml;
        this.confPacks = t.confPacks;
    }

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

    @JsonIgnore
    @ManyToMany(mappedBy = "confTemplates")
    public List<ConfPack> confPacks = new ArrayList<ConfPack>();


}