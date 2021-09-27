package ru.shtrih.kds.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Repository;
import ru.shtrih.kds.model.Acquirer;
import ru.shtrih.kds.model.Log;

import java.util.Date;
import java.util.Optional;

@Repository
public interface LogRepository extends JpaRepository<Log, Long>
{

};