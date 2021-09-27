package ru.shtrih.kds.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "confpacks")
@Access(AccessType.FIELD)
public class ConfPack {

    public ConfPack() {}

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false)
    public long id;

    @Column(name = "name", nullable = false)
    public String name;

    @Column(name = "description", nullable = true)
    public String description;

    @ManyToMany(cascade = {
            CascadeType.PERSIST,
            CascadeType.MERGE
    })
    @JoinTable(name = "pack_template",
            joinColumns = @JoinColumn(name = "packid"),
            inverseJoinColumns = @JoinColumn(name = "templateid")
    )
    public List<InnerConfTemplate> confTemplates;

    @Column(name = "tag")
    public String tag;

    public void addTemplate(ConfTemplate t)
    {
       confTemplates.add( new InnerConfTemplate(t));
    }

    public void removeTemplate(Long templateId)
    {
        confTemplates.removeIf(x -> x.id == templateId);
    }
}