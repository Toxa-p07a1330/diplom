package ru.shtrih.kds.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import org.checkerframework.checker.index.qual.HasSubsequence;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "termgroups")
@Access(AccessType.FIELD)
public class Group {

    public Group() { }
    public Group(Long id)
    {
        this.id = id;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false)
    public long id;

    @Column(name = "legend", nullable = false)
    public String legend;

    @Column(name = "description", nullable = true)
    public String description;

    @ManyToMany(mappedBy = "groups", fetch = FetchType.LAZY)
    @JsonIgnore
    public Set<Terminal> terminals = new HashSet<Terminal>();

    @Column(name = "tag")
    public String tag;

    public void addTerminal(Terminal t) {
        this.terminals.add(t);
        t.groups.add(this);
    }

    public void removeTerminal(Terminal t) {
        this.terminals.remove(t);
        t.groups.remove(this);
    }

}