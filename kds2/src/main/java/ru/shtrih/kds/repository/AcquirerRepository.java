package ru.shtrih.kds.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.shtrih.kds.model.Acquirer;
import ru.shtrih.kds.model.Merchant;

import java.util.Optional;

@Repository
public interface AcquirerRepository extends JpaRepository<Acquirer, Long>
{
    @Query("select distinct a from Acquirer a  where a.tag = :tag")
    Optional<Acquirer> findByTag(@Param("tag") String tag);
};