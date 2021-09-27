package ru.shtrih.kds.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.shtrih.kds.model.Merchant;
import ru.shtrih.kds.model.Terminal;

import java.util.Optional;

@Repository
public interface MerchantRepository extends JpaRepository<Merchant, Long>
{
    @Query("select distinct m from Merchant m  where m.tag = :tag")
    Optional<Merchant> findByTag(@Param("tag") String tag);

    @Query("select m from Merchant m where m.acquirer.id = :acquirerid")
    Page<Merchant> findAllByAcquirer(@Param("acquirerid") Long acquirerid, Pageable pageable);

};