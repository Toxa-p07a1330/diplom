package ru.shtrih.kds.tools;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import ru.shtrih.kds.model.Log;
import ru.shtrih.kds.repository.LogRepository;

import java.util.Date;

@Service
public class LogService {
    @Autowired
    LogRepository logRepository;

    public void info(String msg)
    {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String uname;
        if (authentication != null) {
            uname = authentication.getName();
        }
        else
            uname = "unknown";
        Log log = new Log(uname, "info", new Date(), msg);
        logRepository.save(log);
    }
}
