package ru.shtrih.kds.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.shtrih.kds.model.Terminal;
import ru.shtrih.kds.model.TerminalModel;

import java.util.Optional;

@Repository
public interface TerminalModelRepository extends JpaRepository<TerminalModel, Long>
{
    @Query("select distinct m from TerminalModel m  where m.name = :name")
    Optional<TerminalModel> findByName(@Param("name") String name);
};