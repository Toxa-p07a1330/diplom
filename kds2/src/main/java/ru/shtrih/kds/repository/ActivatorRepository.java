package ru.shtrih.kds.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.shtrih.kds.model.Activator;

@Repository
public interface ActivatorRepository extends JpaRepository<Activator, Long>
{
};