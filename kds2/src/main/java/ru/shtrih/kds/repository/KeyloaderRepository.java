package ru.shtrih.kds.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.shtrih.kds.model.Keyloader;
import ru.shtrih.kds.model.Terminal;

import java.util.Optional;

@Repository
public interface KeyloaderRepository extends JpaRepository<Keyloader, Long>
{
    @Query("select k from Keyloader k where k.keyTag = :keyTag")
    Optional<Keyloader> findByKeyTag(@Param("keyTag") String keyTag);
};