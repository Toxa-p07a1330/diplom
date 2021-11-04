import GroupListComponent from "../component/GroupListComponent";
import TerminalListComponent from "../component/TerminalListComponent";
import TemplateListComponent from "../component/TemplateListComponent";
import ConfigPackListComponent from "../component/ConfigPackListComponent";
import MerchantListComponent from "../component/MerchantListComponent";
import MyAccountComponent from "../component/MyAccountComponent";

let translations = {
    login: {
        ru: {
            username: "Имя",
            name_is_required: "Треубется ввести имя",
            pass: "Пароль",
            pass_is_required: "Требуется ввести пароль",
            login: "Авторизация"
        },
        en: {
            username: "Username",
            name_is_required: "Username is required",
            pass: "Password",
            pass_is_required: "Password is required",
            login: "Login"
        }
    },
    userListComponent: {
        en: {
            conf_mult: "Please confirm you will delete ",
            users: " users",
            conf_single:"Please confirm you will delete user ",
            create: "Create",
            delete: "Delete",
            name: "Name",
            login: "Login",
            email: "Email",
            admin: "Admin",
            users_title: "Users"
        },
        ru: {
            conf_mult: "Пожайлуйста, подтвердите удаление ",
            users: " пользователей",
            conf_single:"Пожайлуйста, подтвержите удаление  ",
            create: "Создать",
            delete: "Удалить",
            name: "Имя",
            login: "Логин",
            email: "Электронная почта",
            admin: "Права администратора",
            users_title: "Пользователи"
        }
    },

    userComponent: {
        en: {
            name: 'Please enter user name',
            enter_login: 'Please enter login',
            enter_email: 'Please enter e-mail',
            nm: "Name",
            login: "Login",
            email: "EMail",
            pass: "Password",
            repeat: "Repeat password",
            change: "Change password",
            save: "Save",

        },
        ru: {

        }
    },
    groupListComponent: {
        en: {
            conf_mult: "Please confirm you will remove ",
            groups: " groups",
            conf1:  "Please confirm you will remove group ",
            create: "Create",
            delete: "Delete",
            tag: "Tag",
            name: "Name",
            Groups: "Groups"

        },
        ru: {

        }
    },
    groupComponent: {
        en: {
            enterName: 'Please enter group name',
            enterTag: 'Please enter tag',
            title: "Group",
            back: "Back",
            save: "Save",
            append: "Append",
            remove: "Remove",
            model: "Model",
            sn: "Serial number",
            acquirer: "Acquirer",
            tid: "TID",

        }
    },
    terminalListComponent: {
        en: {
            conf_m: "Please confirm you will delete ",
            terms: " terminals",
            conf1: "Please confirm you will delete terminal ",
            terminals: "Terminals",
            import: "Import",
            create: "Create",
            delete: "Delete",
            model: "Model",
            sn: "Serial number",
            acquirer: "Acquirer",
            tid: "TID",
            Merchant: "Merchant",
            Configuration: "Configuration",

        },
        ru: {

        }
    },

    terminalComponent: {
        en: {
            enterSn: 'Please enter terminal serial number',
            stageDef: 'Stage must be defined',
            tidLen: 'Terminal Id length should be 8 characters',
            select_model: 'Please select terminal model',
            select_merch: 'Merchant must be defined',
            ipCheck: 'Please enter valid IP Address',
            xmlCheck: "Invalid XML. Please refer to annotations in XML editor",
            Actions: "Actions",
            Back: "Back",
            sn: "Serial Number",
            tn: "Terminal Number",
            Stage: "Stage",
            Description: "Description",
            ip: "IP Address",
            conf: "Configuration package",
            Merchant: "Merchant",
            Certificate: "Certificate",
            Upload: "Upload",
            private: "Private data",
            edit_on: " Turn editing on",
            edit_off:  " Turn editing off",
            Prettify: "Prettify",
            Save: "Save",
            Create: "Create",
            delete: "Delete",
            Tag: "Tag",
            Name: "Name",
            Add: "Add",
            Remove: "Remove",
            participants: "Participate in groups",
            addG: "Add to groups",
            removeG: "Remove from groups",
            removeT: "Remove terminal from group",
            deleteK: "Delete key",
            deleteA: "Delete application",
            selectM: "Select Merchant",
            selectG :"Select group",
            selectA: "Select application",
        },
        ru: {

        }
    },
    templateListComponent: {
        en: {
            conf_m:"Please confirm you will delete ",
            temps: " templates",
            conf1: "Please confirm you will delete template ",
            title: "Configuration templates",
            Create: "Create",
            delete: "Delete",
            Tag: "Tag",
            Name: "Name",
            Add: "Add",
            Remove: "Remove",
            Stage: "Stage",
            Section: "Section",
            Description: "Description",
            Delete: "Delete",
        },
        ru: {

        }
    },
    templateComponent:{
        en: {
            title: "Configuration template",
            Back: "Back",
            nameAlert: 'Template name should not be empty',
            sectionAlert: 'Template section should not be empty',
            stageAlert: 'Template stage should be defined',
            invXML: "Invalid XML. Please refer to annotations in XML editor",
            Section: "Section",
            Description: "Description",
            Data: "Data",
            Save: "Save",
            edit_on: " Turn editing on",
            edit_off: " Turn editing off",
            Prettify: "Prettify",
            upload: "Upload configuration data",

        },
        ru: {

        },
    },
    configPackListComponent: {
        en: {
            conf_m: "Please confirm you will delete ",
            confs: " configurations",
            conf1: "Please confirm you will delete configuration ",
            title: "Configuration packages",
            Tag: "Tag",
            Name: "Name",
            deleteP: "Delete pack",

        },
        ru: {

        }
    },
    configPackComponent: {
        en :{
            conf_m: "Please confirm you will remove ",
            templated: " templates",
            conf1: "Please confirm you will remove template ",
            enterName: 'Please enter pack name',
            enterTag: 'Please enter tag',
            Back: "Back",
            Tag: "Tag",
            Name: "Name",
            Description: "Description",
            Data: "Data",
            Save: "Save",
            title: "Include configuration templates:",
            Add: "Add",
            Remove: "Remove",
            Section: "Section",
            Stage: "Stage",
            removeT: "Remove template from pack",
            selectT: "Select template",
        },
        ru: {

        }
    },
    merchantListComponent: {
        en: {
            conf_m: "Please confirm you will remove ",
            merchants: " merchants",
            conf_1: "Please confirm you will remove merchant ",
            Import: "Import",
            Create: "Create",
            Delete: "Delete",
            Tag: "Tag",
            Name: "Name",
            Acquirer: "Acquirer",
            Merchant: "Merchant ID",
            deleteM :"Delete merchant",
            Merchants: "Merchants",
        },
        ru: {

        }
    },
    merchantComponent: {
        en: {
            eName: 'Please enter merchant name',
            eTag: 'Please enter merchant tag',
            idLen: 'Merchant Id length should be 15 characters',
            codeLen: 'Merchant category code should be 2 characters',
            selectA: 'PLease select acquirer',
            title: "Merchant",
            Back: "Back",
            Name: "Name",
            Tag: "Tag",
            id: "Merchant ID",
            code: "Category code",
            nl: "Merchant name and Location",
            Description: "Description",
            Acquirer: "Acquirer",
            terminals: "Merchant terminals",
            Model: "Model",
            sn: "Serial number",
            TID: "TID",
        },
        ru: {

        }
    },
    myAccountComponent: {
        en: {
            pwdCheck: 'Password length should be 8 or greater',
            repeat: 'Please repeat password',
            match: 'Passwords do not match',
            Back: "Back",
            title: "My Account",
            update: "Account information is updated",
            Name: "Name",
            Login: "Login",
            EMail: "EMail",
            admin: "User is administrator",
            Password: "Password",
            repeatPass: "Repeat password",
            change: "Change password",
            save: "Save",

        }
    }
}

let getTranslations = (page, lang) => {
    return translations[page][lang];
};

export {getTranslations}
