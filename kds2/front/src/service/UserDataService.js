import axios from 'axios'
import {authToken} from "../helpers/auth-header";
import {history} from "../helpers/history";
import {alertActions} from "../rdx/rdx";
import {store} from "../helpers/store";

const API_URL = 'https://localhost:8080/api/v1'
const AUTH_URL = 'https://localhost:8080/auth'

function showErrorMessage(text)
{
    console.log(text)
    store.dispatch(alertActions.error(text))
 //   setTimeout(() => {
 //       store.dispatch(alertActions.clear())
 //   }, 3000);
}

axios.interceptors.response.use(undefined,
    error => {
        //console.log(error.response)
        if (error.response && error.response.status && [401, 403].indexOf(error.response.status) !== -1) {
            localStorage.removeItem('user');
            history.push('/');
            return Promise.reject(error);
        }
        else if (error.response && error.response.data && error.response.data.message)
        {
            showErrorMessage(error.response.data.message)
        }
        else
        {
            showErrorMessage(error.message)
        }
        return Promise.reject(error);
})

axios.interceptors.request.use(
    config => {
        let token = authToken();
        if (token)
            config.headers.Authorization = token;
        store.dispatch(alertActions.clear());
        return config; },
        error => showErrorMessage(error.message))

class UserDataService {

    retrieveAllLogs(currentPage, pageLimit) {
        return axios.get(`${API_URL}/logs?page=${currentPage}&limit=${pageLimit}`);
    }

    retrieveAllUsers(name) {
        return axios.get(`${API_URL}/users`);
    }

    deleteUsers(users) {
        return axios.post(`${API_URL}/deleteusers`, users);
    }

    deleteUser(id) {
        return axios.delete(`${API_URL}/users/${id}`);
    }

    retrieveUser(id) {
        return axios.get(`${API_URL}/users/${id}`);
    }

    updateUser(id, user) {
      return axios.put(`${API_URL}/users/${id}`, user);
    }

    updateAccount(id, user) {
        return axios.put(`${API_URL}/accounts/${id}`, user);
    }

    createUser(user) {
      return axios.post(`${API_URL}/users`, user);
    }

    login(login, password) {
        return axios.post(`${AUTH_URL}/login`, {login, password});
    }

    logout() {
        axios.get (`${AUTH_URL}/logout`).finally(() =>
        {
            localStorage.removeItem('user');
            history.push("/");
        })
    }

    checkSession() {
        return axios.get (`${AUTH_URL}/session`);
    }

    /* Merchants */

    uploadMerchantFile(file) {
        var fd = new FormData();
        fd.append('file', file);
        return axios({ method: 'POST', url: `${API_URL}/merchants/upload`, headers: {"Cache-Control": "no-cache" }, data: fd});
    }


    retrieveAllMerchants(currentPage, pageLimit) {
        return axios.get(`${API_URL}/merchants?page=${currentPage}&limit=${pageLimit}`);
    }

    deleteMerchant(id) {
        return axios.delete(`${API_URL}/merchants/${id}`);
    }

    deleteMerchants(merchants) {
        return axios.post(`${API_URL}/deletemerchants`, merchants);
    }

    retrieveMerchant(id) {
        return axios.get(`${API_URL}/merchants/${id}`);
    }

    updateMerchant(id, merchant) {
        return axios.put(`${API_URL}/merchants/${id}`, merchant);
    }

    createMerchant(merchant) {
        return axios.post(`${API_URL}/merchants`, merchant);
    }

    /* Acquirers */

    retrieveAllAcquirers() {
        return axios.get(`${API_URL}/acquirers`);
    }

    deleteAcquirer(id) {
        return axios.delete(`${API_URL}/acquirers/${id}`);
    }

    deleteAcquirers(acquirers) {
        return axios.post(`${API_URL}/deleteacquirers`, acquirers);
    }

    retrieveAcquirer(id) {
        return axios.get(`${API_URL}/acquirers/${id}`);
    }

    updateAcquirer(id, acquirer) {
        return axios.put(`${API_URL}/acquirers/${id}`, acquirer);
    }

    createAcquirer(acquirer) {
        return axios.post(`${API_URL}/acquirers`, acquirer);
    }

    /* Commands */

    retrieveAllCommands(currentPage, pageLimit) {
        return axios.get(`${API_URL}/commands?page=${currentPage}&limit=${pageLimit}`);
    }

    deleteTerminalCommands(tid) {
        return axios.delete(`${API_URL}/terminals/${tid}/commands`);
    }

    deleteGroupCommands(gid) {
        return axios.delete(`${API_URL}/groups/${gid}/commands`);
    }

    retrieveCommand(id) {
        return axios.get(`${API_URL}/commands/${id}`);
    }

    createTerminalCommand(tid, cmd) {
        return axios.post(`${API_URL}/terminals/${tid}/commands`, cmd);
    }

    createCommandsForGroup(gid, cmd, currentPage, pageLimit) {
        return axios.post(`${API_URL}/groups/${gid}/commands?page=${currentPage}&limit=${pageLimit}`, cmd);
    }
    /* Applications */

    retrieveAllApplications() {
        return axios.get(`${API_URL}/applications`);
    }

    uploadApplicationPackageFile(id, file)
    {
        var fd = new FormData();
        fd.append('file', file);
        return axios.post(`${API_URL}/applications/${id}/upload`, fd);
    }

    deleteApplications(apps) {
        return axios.post(`${API_URL}/deleteapplications`, apps);
    }

    retrieveApplication(id) {
        return axios.get(`${API_URL}/applications/${id}`);
    }

    updateApplication(id, app) {
        return axios.put(`${API_URL}/applications/${id}`, app);
    }

    createApplication(app) {
        return axios.post(`${API_URL}/applications`, app);
    }

    /* Groups */

    addGroupApplications(id, apps) {
        return axios.post(`${API_URL}/groups/${id}/addapplications`, apps)
    }

    removeGroupApplications(id, apps) {
        return axios.post(`${API_URL}/groups/${id}/removeapplications`, apps)
    }

    retrieveAllGroups(currentPage, pageLimit) {
        return axios.get(`${API_URL}/groups?page=${currentPage}&limit=${pageLimit}`);
    }

    deleteGroup(id) {
        return axios.delete(`${API_URL}/groups/${id}`);
    }

    deleteGroups(groups) {
        return axios.post(`${API_URL}/deletegroups`, groups);
    }

    retrieveGroup(id) {
        return axios.get(`${API_URL}/groups/${id}`);
    }

    updateGroup(id, group) {
      return axios.put(`${API_URL}/groups/${id}`, group);
    }

    createGroup(group) {
      return axios.post(`${API_URL}/groups`, group);
    }

    appendToGroupTerminal(id, tid) {
        return axios.get(`${API_URL}/groups/${id}/appendterminal/${tid}`)
    }

    appendToGroupMultipleTerminals(id, terminals) {
        return axios.post(`${API_URL}/groups/${id}/appendterminals`, terminals)
    }

    removeFromGroupMultipleTerminals(id, terminals) {
        return axios.post(`${API_URL}/groups/${id}/removeterminals`, terminals)
    }

        /* Terminals */

        uploadTerminalFile(file) {
            var fd = new FormData();
            fd.append('file', file);
            return axios.post(`${API_URL}/terminals/upload`, fd);
        }

        pushTerminalCommand(id, cmd) {
            return axios.get(`${API_URL}/terminals/${id}/pushcommand/${cmd}`);
        }

        clearTerminalCommand(id) {
            return axios.get(`${API_URL}/terminals/${id}/clearcommand/`);
        }

        getTerminalCommandStatus(id) {
            return axios.get(`${API_URL}/terminals/${id}/commandstatus/`);
        }

        retrieveAllTerminals(currentPage, pageLimit) {
            return axios.get(`${API_URL}/terminals?page=${currentPage}&limit=${pageLimit}`);
        }

        retrieveGroupTerminals(gid, currentPage, pageLimit) {
            return axios.get(`${API_URL}/groups/${gid}/terminals?page=${currentPage}&limit=${pageLimit}`);
        }

        retrieveMerchantTerminals(mid, currentPage, pageLimit) {
            return axios.get(`${API_URL}/merchants/${mid}/terminals?page=${currentPage}&limit=${pageLimit}`);
        }

        retrieveAcquirerMerchants(id, currentPage, pageLimit) {
            return axios.get(`${API_URL}/acquirers/${id}/merchants?page=${currentPage}&limit=${pageLimit}`);
        }

        deleteTerminal(id) {
            return axios.delete(`${API_URL}/terminals/${id}`);
        }

        deleteTerminals(terminals) {
            return axios.post(`${API_URL}/deleteterminals`, terminals);
        }

        retrieveTerminal(id) {
            return axios.get(`${API_URL}/terminals/${id}`);
        }

        updateTerminal(id, terminal) {
          return axios.put(`${API_URL}/terminals/${id}`, terminal);
        }

        appendTerminalToGroup(id, gid) {
            return axios.get(`${API_URL}/terminals/${id}/appendtogroup/${gid}`)
        }

        appendTerminalToGroups(id, groups) {
            return axios.post(`${API_URL}/terminals/${id}/appendtogroups`, groups)
        }

        removeTerminalFromGroups(id, groups) {
            return axios.post(`${API_URL}/terminals/${id}/removefromgroups`, groups)
        }

        addTerminalApplications(id, apps) {
            return axios.post(`${API_URL}/terminals/${id}/addapplications`, apps)
        }

        removeTerminalApplications(id, apps) {
            return axios.post(`${API_URL}/terminals/${id}/removeapplications`, apps)
        }

        createTerminal(terminal) {
          return axios.post(`${API_URL}/terminals`, terminal);
        }

        /* Terminal models */
        retrieveAllTerminalModels() {
            return axios.get(`${API_URL}/terminalmodels`);
        }

        retrieveAllModelApplications(id) {
            return axios.get(`${API_URL}/terminalmodels/${id}/applications`);
        }

        /* Configuration templates */

        retrieveAllConfigTemplates() {
            return axios.get(`${API_URL}/conftemplates`);
        }

        retrieveConfigTemplate(id) {
            return axios.get(`${API_URL}/conftemplates/${id}`);
        }

        createConfigTemplate(template) {
          return axios.post(`${API_URL}/conftemplates`, template);
        }

        updateConfigTemplate(id, template) {
          return axios.put(`${API_URL}/conftemplates/${id}`, template);
        }

        deleteConfigTemplate(id) {
            return axios.delete(`${API_URL}/conftemplates/${id}`);
        }

        deleteConfigTemplates(templates) {
            return axios.post(`${API_URL}/deletetemplates`, templates);
        }

        uploadConfigTemplateFile(id, file) {
            var fd = new FormData();
            fd.append('file', file);
            return axios.post(`${API_URL}/conftemplates/${id}/upload`, fd);
        }


    /* Keyloaders */

    retrieveAllKeyloaders() {
        return axios.get(`${API_URL}/keyloaders`);
    }

    retrieveKeyloader(id) {
        return axios.get(`${API_URL}/keyloaders/${id}`);
    }

    createKeyloader(template) {
        return axios.post(`${API_URL}/keyloaders`, template);
    }

    updateKeyloader(id, template) {
        return axios.put(`${API_URL}/keyloaders/${id}`, template);
    }

    deleteKeyloader(id) {
        return axios.delete(`${API_URL}/keyloaders/${id}`);
    }

    deleteKeyloaders(keyloaders) {
        return axios.post(`${API_URL}/deletekeyloaders`, keyloaders);
    }

    /* Keys */

    uploadKeyFile(file) {
        var fd = new FormData();
        fd.append('file', file);
        return axios.post(`${API_URL}/keys/upload`, fd);
    }

    retrieveAllKeys(currentPage, pageLimit) {
        return axios.get(`${API_URL}/keys?page=${currentPage}&limit=${pageLimit}`);
    }

    retrieveKey(id) {
        return axios.get(`${API_URL}/keys/${id}`);
    }

    createKey(key) {
        return axios.post(`${API_URL}/keys`, key);
    }

    updateKey(id, tkey) {
        return axios.put(`${API_URL}/keys/${id}`, tkey);
    }

    deleteKeys(keys) {
        return axios.post(`${API_URL}/deletekeys`, keys);
    }

    deleteKey(id) {
        return axios.delete(`${API_URL}/keys/${id}`);
    }


    /* Activators */

    retrieveAllActivators() {
        return axios.get(`${API_URL}/activators`);
    }

    retrieveActivator(id) {
        return axios.get(`${API_URL}/activators/${id}`);
    }

    createActivator(act) {
        return axios.post(`${API_URL}/activators`, act);
    }

    updateActivator(id, act) {
        return axios.put(`${API_URL}/activators/${id}`, act);
    }

    deleteActivator(id) {
        return axios.delete(`${API_URL}/activators/${id}`);
    }

    deleteActivators(acts) {
        return axios.post(`${API_URL}/deleteactivators`, acts);
    }

    runResetActivator(id) {
        return axios.get(`${API_URL}/activators/${id}/runreset`);
    }

    getActivatorStatus(id) {
        return axios.get(`${API_URL}/activators/${id}/getstatus`);
    }

    stopActivation(id) {
        return axios.get(`${API_URL}/activators/${id}/stopreset`);
    }
    /* Configuration packs */

        retrieveAllConfigPacks() {
            return axios.get(`${API_URL}/confpacks`);
        }

        retrieveConfigPack(id) {
            return axios.get(`${API_URL}/confpacks/${id}`);
        }

        createConfigPack(pack) {
          return axios.post(`${API_URL}/confpacks`, pack);
        }

        updateConfigPack(id, pack) {
          return axios.put(`${API_URL}/confpacks/${id}`, pack);
        }

        deleteConfigPacks(packs) {
            return axios.post(`${API_URL}/deletepacks`, packs);
        }

        deleteConfigPack(id) {
            return axios.delete(`${API_URL}/confpacks/${id}`);
        }

        appendTemplateToPack(id, tid) {
            return axios.get(`${API_URL}/confpacks/${id}/appendtemplate/${tid}`)
        }

        appendToPackMultipleTemplates(id, templates) {
            return axios.post(`${API_URL}/confpacks/${id}/appendtemplates`, templates)
        }

        removeFromPackMultipleTemplates(id, templates) {
            return axios.post(`${API_URL}/confpacks/${id}/removetemplates`, templates)
        }


    removeTemplateFromPack(id, tid) {
            return axios.get(`${API_URL}/confpacks/${id}/removetemplate/${tid}`)
        }

        incrementStage(st) {
            let stage = st;
            return axios.post(`${API_URL}/conf/incrementstage`, {stage})
        }

    handleResponse(response) {
        return response.text().then(text => {
            const data = text && JSON.parse(text);
            if (!response.ok) {
                if ([401, 403].indexOf(response.status) !== -1) {
                    console.log("logout 2")
                    this.logout();
                }

                const error = (data && data.message) || response.statusText;
                return Promise.reject(error);
            }

            return data;
        });
    }
}

export default new UserDataService()