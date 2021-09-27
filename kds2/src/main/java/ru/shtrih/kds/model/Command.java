package ru.shtrih.kds.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

@Entity
@Table(name = "termcommands")
@Access(AccessType.FIELD)
public class Command {

    public Command() { }
    public Command(Long id) {
        this.id = id;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false)
    public long id;

    @Column(name = "cmd")
    public String cmd;

    @Column(name = "result")
    public String result;

    @Column(name = "status")
    public String status;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name="termid")
    public Terminal terminal;

}