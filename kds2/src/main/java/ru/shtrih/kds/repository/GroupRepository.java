package ru.shtrih.kds.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import ru.shtrih.kds.model.Group;
import ru.shtrih.kds.model.Merchant;

import java.util.List;
import java.util.Optional;

@Repository
public interface GroupRepository extends JpaRepository<Group, Long>
{
    @Query("select distinct g from Group g  where g.tag = :tag")
    Optional<Group> findByTag(@Param("tag") String tag);
};