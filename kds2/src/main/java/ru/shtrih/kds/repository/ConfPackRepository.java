package ru.shtrih.kds.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.shtrih.kds.model.ConfPack;
import ru.shtrih.kds.model.ConfTemplate;
import ru.shtrih.kds.model.Terminal;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConfPackRepository extends JpaRepository<ConfPack, Long>
{
    @Query("select distinct p from ConfPack p  where p.tag = :tag")
    Optional<ConfPack> findByTag(@Param("tag") String tag);
};