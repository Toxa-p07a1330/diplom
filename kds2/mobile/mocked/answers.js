const loginResp = "" +
    "<login>\n" +
    "<status>ok</status>\n" +
    "<token>DE9773A8CB888560AB0F89C07623FE03</token>\n" +
    "</login>" +
    ""

const logoutResp = '<logout>\n' +
    '<status>ok</status>\n' +
    '</logout>'

const changeResp = '<changepassword>\n' +
    '<status>ok</status>\n' +
    '</changepassword>'

const updateResp = '<updateconfiguration>\n' +
    '<status>ok</status>\n' +
    '</updateconfiguration>'
const loadWorkREsp = '<loadworkkeys>\n' +
    '<status>ok</status>\n' +
    '<mac-change-receipt>\n' +
    '<rrn>123456789123</rrn>\n' +
    '</mac-change-receipt>\n' +
    '<net-change-receipt>\n' +
    '<rrn>023456789120</rrn>\n' +
    '</net-change-receipt>\n' +
    '</loadworkkeys>'

const loadMasterKey = '<loadmasterkeys>\n' +
    '<status>ok</status>\n' +
    '<receipt><pkcv>123456</pkcv><mkcv>789ABC</mkcv></receipt>\n' +
    '</loadmasterkeys>'
const testResp = "<testconnection>\n" +
    "<status>ok</status>\n" +
    "</testconnection>"

const paramsResp = '<getparameters>\n' +
    '<status>ok</status>\n' +
    '<parameters>\n' +
    '<sn>000000000009</sn>\n' +
    '<app>1.0.67.6</app>\n' +
    '<firmware-mcu>1.5.3</firmware-mcu>\n' +
    '<firmware-boot>2.0.1</firmware-boot>\n' +
    '<os>CS10_V1.07_181127PK</os>\n' +
    '<sdk>1.0.4</sdk>\n' +
    '<tid>1000000001</tid>\n' +
    '<mid>243423434122313</mid>\n' +
    '<tconf>19-04-01.01</tconf>\n' +
    '<ntconf>cname</ntconf>\n' +
    '<cconf>18-10-25.06</cconf>\n' +
    '<ncconf>cname_test</ncconf>\n' +
    '<econf>19-04-13.02</econf>\n' +
    '<neconf>2can_jibe_emv</neconf>\n' +
    '<kconf>18-08-30.04</kconf>\n' +
    '<nkconf>combined_ca_database</nkconf>\n' +
    '<acqid>twocan</acqid>\n' +
    '<cccert>24.03.2027</cccert>\n' +
    '<csca>20.11.2037</csca>\n' +
    '<cshost>192.168.0.185</cshost>\n' +
    '<accert>24.03.2027</accert>\n' +
    '<asca>12.10.2020</asca>\n' +
    '<ashost>192.168.0.2</ashost>\n' +
    '<kccert>24.03.2027</kccert>\n' +
    '<ksca>none</ksca>\n' +
    '<devid>M2100-0000005164</devid>\n' +
    '</parameters>\n' +
    '</getparameters>'
const clearResp = '<clear>\n' +
    '<status>ok</status>\n' +
    '<sreport>\n' +
    '<resp-code>000</resp-code>\n' +
    '<approval-number>ASD002</approval-number>\n' +
    '<rrn>837495759322</rrn>\n' +
    '<orig-amount>D003030001000</orig-amount>\n' +
    '<amount>D003030001000</amount>\n' +
    '<datetime>180322102354</datetime>\n' +
    '<tid>1000000001</tid>\n' +
    '<mid>123456789012345</mid>\n' +
    '</sreport>\n' +
    '</clear>'
const resetResp = '<resetpassword>\n' +
    '<status>ok</status>\n' +
    '</resetpassword>'

export {resetResp,paramsResp,testResp,clearResp,updateResp,changeResp,logoutResp,loginResp,loadMasterKey,loadWorkREsp}