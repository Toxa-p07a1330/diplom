package ru.shtrih.kds.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.shtrih.kds.model.Acquirer;
import ru.shtrih.kds.model.TerminalApplication;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<TerminalApplication, Long>
{
    @Query("select distinct a from TerminalApplication a  where a.tag = :tag")
    Optional<TerminalApplication> findByTag(@Param("tag") String tag);

    @Query("select a from TerminalApplication a  where a.terminalModel.id = :modelid")
    List<TerminalApplication> findAllByModel(@Param("modelid") Long modelid);
};