package ru.shtrih.kds.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.shtrih.kds.model.Command;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommandRepository extends JpaRepository<Command, Long>
{
    @Query("select c from Command c  join c.terminal t where t.id = :termid")
    List<Command> findByTerminal(@Param("termid") Long termid);
};