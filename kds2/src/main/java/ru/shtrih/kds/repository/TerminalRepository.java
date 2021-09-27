package ru.shtrih.kds.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.shtrih.kds.model.Terminal;
import ru.shtrih.kds.model.TerminalKey;

import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

@Repository
public interface TerminalRepository extends JpaRepository<Terminal, Long>
{
    @Query("select distinct tm.stage, tp.xml, tp.name from TerminalModel m, Terminal tm join tm.conf cp join cp.confTemplates tp where m.name = :model and tm.sn = :sn and tp.tag = :tag")
    List<Object[]> getTerminalConfig(String model, String sn, String tag);

    @Query("select distinct tm.tid, mh.mid, mh.categoryCode, mh.nameAndLocation, tm.conf.id, tm.xml from Terminal tm join tm.merchant mh where tm.sn = :sn")
    List<Object[]> getTerminalParameters(String sn);

    @Query("select distinct t from Terminal t  where t.sn = :sn and t.terminalModel.name = :model")
    Optional<Terminal> findByModelAndSerial(@Param("model") String model, @Param("sn") String sn);

    @Query("select distinct t from Terminal t join t.merchant m where t.tid = :tid and m.acquirer.tag = :acquirertag")
    Optional<Terminal>  findByAcquirerAndTid(@Param("acquirertag") String acquirerTag, @Param("tid") String tid);

    @Query("select t from Terminal t join t.groups g where g.id = :groupid")
    Page<Terminal> findAllByGroup(@Param("groupid") Long groupid, Pageable pageable);

    @Query("select t from Terminal t where t.merchant.id = :merchantid")
    Page<Terminal> findAllByMerchant(@Param("merchantid") Long merchantid, Pageable pageable);

};