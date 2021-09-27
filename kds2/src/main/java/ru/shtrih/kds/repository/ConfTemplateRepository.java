package ru.shtrih.kds.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.shtrih.kds.model.ConfTemplate;
import ru.shtrih.kds.model.Terminal;

@Repository
public interface ConfTemplateRepository extends JpaRepository<ConfTemplate, Long>
{

};