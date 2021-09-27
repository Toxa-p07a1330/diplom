package ru.shtrih.kds.authentication;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.AbstractUserDetailsAuthenticationProvider;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import ru.shtrih.kds.repository.UserRepository;
import ru.shtrih.kds.tools.ApplicationPrivateProperties;

import java.time.LocalDateTime;
import java.util.Optional;

@Component
public class AuthenticationProvider extends AbstractUserDetailsAuthenticationProvider {

    @Autowired
    UserRepository userRepository;

    @Autowired
    ApplicationPrivateProperties applicationPrivateProperties;

    @Override
    protected void additionalAuthenticationChecks(UserDetails userDetails, UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken) throws AuthenticationException {

    }

    @Override
    protected UserDetails retrieveUser(String userName, UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken) throws AuthenticationException {

        Object token = usernamePasswordAuthenticationToken.getCredentials();
        Optional<ru.shtrih.kds.model.User> uu = userRepository.findByToken(String.valueOf(token));
        if (!uu.isPresent())
            throw new UsernameNotFoundException("user is not found");
        ru.shtrih.kds.model.User u = uu.get();
        LocalDateTime dt  = LocalDateTime.now();
        LocalDateTime xt = u.getTime();
        if (xt == null)
        {
            u.setTime(dt);
            userRepository.save(u);
        }
        else {
            LocalDateTime nt = xt.plusMinutes(applicationPrivateProperties.getSessionTimeout());
            if (dt.isAfter(nt)) {
                u.setTime(null);
                u.setToken(null);
                userRepository.save(u);
                throw new UsernameNotFoundException("user is not found");
            } else {
                u.setTime(dt);
                userRepository.save(u);
            }
        }
        org.springframework.security.core.userdetails.User user= new User(u.getLogin(), u.getPwd(),
                true,
                true,
                true,
                true,
                AuthorityUtils.createAuthorityList("USER"));
        return user;
    }
}
