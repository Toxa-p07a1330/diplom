package ru.shtrih.kds.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.shtrih.kds.model.TerminalKey;

@Repository
public interface TerminalKeyRepository extends JpaRepository<TerminalKey, Long>
{
};