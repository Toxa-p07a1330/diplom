import GroupActionsComponent from "../component/GroupActionsComponent";
import TerminalActionsComponent from "../component/TerminalActionsComponent";
import ActivatorListComponent from "../component/ActivatorListComponent";
import ActivatorActionsComponent from "../component/ActivatorActionsComponent";
import TerminalKeyListComponent from "../component/TerminalKeyListComponent";
import KeyloaderListComponent from "../component/KeyloaderListComponent";
import AcquirerListComponent from "../component/AcquirerListComponent";
import KeyImportComponent from "../component/KeyImportComponent";
import TerminalImportComponent from "../component/TerminalImportComponent";
import MerchantImportComponent from "../component/MerchantImportComponent";
import ApplicationListComponent from "../component/ApplicationListComponent";
import ApplicationComponent from "../component/ApplicationComponent";
import LogListComponent from "../component/LogListComponent";
import PaginationComponent from "../component/PaginationComponent";


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
            conf_single: "Please confirm you will delete user ",
            create: "Create",
            delete: "Delete",
            name: "Name",
            login: "Login",
            email: "Email",
            admin: "Admin",
            users_title: "Users"
        },
        ru: {
            conf_mult: "Пожалуйста, подтвердите удаление ",
            users: " пользователей",
            conf_single: "Пожалуйста, подтвержите удаление  ",
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
            admin: "User is administrator",
            ep: 'Please enter password',
            rp: 'Please repeat password',
            pl: 'Password length should be 8 or greater',
            notMatch: 'Passwords do not match'

        },
        ru: {
            name: 'Пожалуйста, введите имя',
            enter_login: 'Пожалуйста, введите логин',
            enter_email: 'Пожалуйста введите e-mail',
            nm: "Имя",
            login: "Логин",
            email: "EMail",
            pass: "Пароль",
            repeat: "Повторите пароль",
            change: "Изменить пароль",
            save: "Сохранить",
            admin: "Пользователь имеет права администратора",
            ep: 'Введите пароль',
            rp: 'Повторите пароль',
            pl: 'Длина пароля не менее 8ми символов',
            notMatch: 'Пароли не совпадают'
        }
    },
    groupListComponent: {
        en: {
            conf_mult: "Please confirm you will remove ",
            groups: " groups",
            conf1: "Please confirm you will remove group ",
            create: "Create",
            delete: "Delete",
            tag: "Tag",
            name: "Name",
            Groups: "Groups"

        },
        ru: {
            conf_mult: "Пожалуйста, подтверлите удаление ",
            groups: " групп",
            conf1: "Пожалуйста, подтвердите удаление группы ",
            create: "Создать",
            delete: "Удалить",
            tag: "Тег",
            name: "Имя",
            Groups: "Группы"
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
            name: "Name",
            Tag: "Tag",
            Description: "Description",
            titg: "Terminals in the group:",
            removeT: "Remove terminal from group",
            st: "Select terminal",

        },
        ru: {
            enterName: 'Пожалуйста, введите название группы',
            enterTag: 'Пожалуйста, введите тег',
            title: "Группа",
            back: "Назад",
            save: "Сохранить",
            append: "Добавить",
            remove: "Удалить",
            model: "Модель",
            sn: "Серийный номер",
            acquirer: "Покупатель",
            tid: "TID",
            name: "Название",
            Tag: "Тэг",
            Description: "Описание",
            titg: "Шаблоны в группах",
            removeT: "Удалить терминал из группы",
            st: "Выберите терминал"
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
            conf_m: "Пожалуйста, подтвердите удаление ",
            terms: " терминалов",
            conf1: "Пожалуйста, подтвердите удаление терминала ",
            terminals: "Терминалы",
            import: "Импортировать",
            create: "Создать",
            delete: "Удалить",
            model: "Модель",
            sn: "Серийный номер",
            acquirer: "Покупатель",
            tid: "TID",
            Merchant: "Продавец",
            Configuration: "Конфигурация",
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
            edit_off: " Turn editing off",
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
            selectG: "Select group",
            selectA: "Select application",
        },
        ru: {
            enterSn: 'Пожалуйста, введите серийный номер терминала',
            stageDef: '',
            tidLen: 'Длина идентификатора терминала должна составлять 8 символов',
            select_model: 'Пожалуйста, выберите модель терминала',
            select_merch: 'Необходимо выбрать продавца',
            ipCheck: 'Пожалуйста, введите действительный IP-адрес',
            xmlCheck: "Недопустимый XML-файл. Пожалуйста, обратитесь к аннотациям в редакторе XML",
            Actions: "Действия",
            Back: "Назад",
            sn: "Серийный номер",
            tn: "Номер терминала",
            Stage: "Стадия",
            Description: "Описание",
            ip: "IP-адрес",
            conf: "Пакет конфигурации",
            Merchant: "Продавец",
            Certificate: "Сертификат",
            Upload: "Загрузить",
            private: "Личные данные",
            edit_on: "Включить редактирование",
            edit_off: "Выключить редактирование",
            Prettify: "Добавить",
            Save: "Сохранить",
            Create: "Создать",
            delete: "Удалить",
            Tag: "Тег",
            Name: "Имя",
            Add: "Добавить",
            Remove: "Удалить",
            participants: "",
            addG: "Добавить в группу",
            removeG: "Удалить из группы",
            removeT: "Удалить терминал из группы",
            deleteK: "Удалить ключ",
            deleteA: "Удалить приложение",
            selectM: "Выбрать продавца",
            selectG: "Выбрать группу",
            selectA: "Выбрать приложение",
        }
    },
    templateListComponent: {
        en: {
            conf_m: "Please confirm you will delete ",
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
            conf_m: "Пожалуйста, подтвердите удаление ",
            temps: " шаблонов",
            conf1: "Пожалуйста, подтвердите удаление шаблона ",
            title: "Шаблоны конфигурации",
            Create: "Создать",
            delete: "Удалить",
            Tag: "Тег",
            Name: "Имя",
            Add: "Добавить",
            Remove: "Удалить",
            Stage: "Стадия",
            Section: "Секция",
            Description: "Описание",
            Delete: "Удалить",
        }
    },
    templateComponent: {
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
            Name: "Name",
            Stage: "Stage",

        },
        ru: {
            title: "Шаблон конфигурации",
            Back: "Назад",
            nameAlert: 'Имя шаблона должно быть заполнено',
            sectionAlert: 'Раздел шаблона должен быть заполнен',
            stageAlert: 'Стадия шаблона должна быть определена',
            invXML: "Недопустимый XML-файл. Пожалуйста, обратитесь к аннотациям в редакторе XML",
            Section: "Секция",
            Description: "Описание",
            Data: "Данные",
            Save: "Сохранить",
            edit_on: " Включить редактирование",
            edit_off: "Выключить редактирование",
            Prettify: "Добавить",
            upload: "Загрузить данные конфигурации",
            Name: "Имя",
            Stage: "Стадия",
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
            Create: "Create",
            Delete: "Delete"


        },
        ru: {
            conf_m: "Пожалуйста, подтвердите удаление ",
            confs: " конфигураций",
            conf1: "Пожалуйста, подтвердите удаление конфигурации ",
            title: "Пакет конфигурации",
            Tag: "Тег",
            Name: "Имя",
            deleteP: "Удалить пакет",
            Create: "Создать",
            Delete: "Удалить"
        }
    },
    configPackComponent: {
        en: {
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
            conf_m: "Пожалуйста, подтвердите удаление ",
            templated: " шаблоны",
            conf1: "Пожалуйста, подтвердите удаление шаблонов",
            enterName: 'Пожалуйста, введите имя пакета ',
            enterTag: 'Пожалуйста, введите тег',
            Back: "Назад",
            Tag: "Тег",
            Name: "Имя",
            Description: "Описание",
            Data: "Данные",
            Save: "Сохранить",
            title: "Включить шаблоны конфигурации:",
            Add: "Добавить",
            Remove: "Удалить",
            Section: "Секция",
            Stage: "Стадия",
            removeT: "Удалить шаблон из пакета",
            selectT: "Выбрать шаблон",
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
            deleteM: "Delete merchant",
            Merchants: "Merchants",
        },
        ru: {
            conf_m: "Пожалуйста, подтвердите удаление ",
            merchants: " продавцов",
            conf_1: "Пожалуйста, подтвердите удаление продавца ",
            Import: "Импортировать",
            Create: "Создать",
            Delete: "Удалить",
            Tag: "Тег",
            Name: "Имя",
            Acquirer: "Покупатель",
            Merchant: "ID продавца",
            deleteM: "Удалить продавца",
            Merchants: "Продавцы",
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
            eName: 'Пожалуйста, введите имя продавца',
            eTag: 'Пожалуйста, введите тег продавца',
            idLen: 'Длина идентификатора продавца должна составлять 15 символов',
            codeLen: 'Код категории продавца должен состоять из 2 символов',
            selectA: 'Пожалуйста, выберите покупателя',
            title: "Продавец",
            Back: "Назад",
            Name: "Имя",
            Tag: "Тег",
            id: "ID продавца",
            code: "Код категории",
            nl: "Имя и местонахождение продавца",
            Description: "Описание",
            Acquirer: "Покупатель",
            terminals: "Терминалы продавца",
            Model: "Модель",
            sn: "Серийный номер",
            TID: "TID",
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
        },
        ru: {
            pwdCheck: 'Пароль должен сотсоять не меньше чем из 8 символов',
            repeat: 'Пожалуйста, повторите пароль',
            match: 'Пароли не совпадают',
            Back: "Назад",
            title: "Мой аккаунт",
            update: "Информация об учетной записи обновлена",
            Name: "Имя",
            Login: "Логин",
            EMail: "EMail",
            admin: "Пользователь является администратором",
            Password: "Пароль",
            repeatPass: "Повторите пароль",
            change: "Изменить пароль",
            save: "Сохранить",
        }
    },
    groupActionsComponent: {
        en: {
            updateT: "Update configuration",
            updateM: "Please confirm you wish to update configuration for all terminals in the group",
            loadMk: "Load master keys",
            loadMkM: "Please confirm you wish to upload master keys to all terminals in the group",
            updateAT: "Update applications",
            updateAM: "Please confirm you wish to update applications for all terminals in the group",
            title: "Group",
            Edit: "Edit",
            Back: "Back",
            Name: "Name:",
            Description: "Description:",
            Current: "Current action:",
            Update: "Update",
            umk: "Upload master keys",
            Add: "Add",
            Remove: "Remove",
            dselAll: "Deselect all",
            selAll: "Select all",
            Model: "Model",
            sn: "Serial number",
            Acquirer: "Acquirer",
            TID: "TID",
            Status: "Status",
            selectApp: "Select application",
            Report: "Report",
            ttp: "Total terminals processed:",
            aaat: "Applications are added to:",
            nurf: "No update required for:",
            tmmi: "Terminal model mismatch in:",
            errs: "Other errors:",
            rao: "Remove applications on:",
            anfo: "Applications not found on:",
            errors: "Errors:",
            Close: "Close",

        },
        ru: {},
    },
    terminalActionsComponent: {
        en: {
            Terminal: "Terminal",
            Back: "Back",
            Model: "Model:",
            sn: "Serial number:",
            Acquirer: "Acquirer:",
            tn: "Terminal number:",
            Stage: "Stage:",
            Description: "Description:",
            id: "Merchant ID:",
            Configuration: "Configuration:",
            keys: "Keys:",
            Applications: "Applications:",
            groups: "Groups:",
            get: "Get Info",
            update: "Update config",
            getLog: "Get Log",
            loadKey: "Load keys",
            upSoft: "Update software",
            Command: "Command",
            Status: "Status",
            aId: "Acquirer ID:",
            tId: "Terminal ID:",
            dId: "Device ID:",
            mId: "Merchant ID:",
            mnl: "Merchant name and location:",
            appv: "Application version:",
            intV: "Internal version:",
            os: "OS:",
            secM: "Security module:",
            sdk: "SDK:",
            tcn: "Terminal config name:",
            tcs: "Terminal config stage:",
            ccn: "Common config name:",
            ccs: "Common config stage:",
            ecn: "EMV config name:",
            ecs: "EMV config stage:",
            Ccn: "CAPK config name:",
            Ccs: "CAPK config stage:",
            tmsH: "TMS host:",
            tmsca: "TMS host CA:",
            tmscert: "TMS client cert:",
            ahca: "Acquirer host CA:",
            aca: "Acquirer CA:",
            acc: "Acquirer client cert:",
            kca: "Keyloader CA:",
            kcc: "Keyloader client cert:",
            RemoveG: "Remove terminal from group",
        }
    },
    activatorListComponent: {
        en: {
            confm: "Please confirm you will delete ",
            activators: " activators",
            conf1: "Please confirm you will delete activator ",
            Create: "Create",
            Delete: "Delete",
            Activators: "Activators",
            Name: "Name",
            tm: "Terminal model",
            Description: "Description",
            delete: "Delete activator",

        },
        ru: {}
    },
    activatorComponent: {
        en: {
            conf: "Please confirm you will remove ",
            fact: " from act",
            enterN: 'Please enter activator name',
            enterIp: 'Please enter terminal IP address',
            enterURL: 'Please enter configuration URL',
            upCCA: 'Please upload configuration CA bundle',
            upACA: 'Please upload acquirer CA bundle',
            upKCA: 'Please upload keyloader CA bundle',
            upTCA: 'Please upload TMS CA',
            upTCAS: 'Please upload TMS CA signature',
            Activator: "Activator",
            Back: "Back",
            Name: "Name",
            Description: "Description",
            ip: "Terminal IP address",
            url: "Configuration URL",
            tm: "Terminal model",
            CSCA: "Configuration Server CA",
            CSCAS: ">Configuration Server CA signature",
            Upload: "Upload",
            CCA: "Configuration CA bundle",
            ACA: "Acquirer CA bundle",
            KCA: "Keyloader CA bundle",
            Save: "Save",
        },
        ru: {}
    },
    activatorActionsComponent: {
        en: {
            ta: "Terminal activation",
            Back: "Back",
            name: "Name:",
            Description: "Description:",
            ip: "Terminal IP address:",
            url: "Configuration URL:",
            reset: "Run reset",
            State: "State",
            Result: "Result",

        },
        ru: {}
    },
    terminalKeyListComponent: {
        en: {
            confm: "Please confirm you will delete ",
            keys: " keys",
            conf1: "Please confirm you will delete key ",
            Import: "Import",
            Delete: "Delete",
            Keys: "Keys",
            Model: "Model",
            sn: "Serial number",
            Tag: "Tag",
            Name: "Name",
        },
        ru: {}
    },
    terminalKeyComponent: {
        en: {
            enterN: "Please enter key name",
            enterT: 'Please enter key tag',
            enterM: 'Please enter key material',
            Key: "Key",
            Back: "Back",
            tn: "Terminal Model",
            tsm: "Terminal Serial Number",
            kn: "Key Name",
            Tag: "Tag",
            Material: "Material",
            kl: "Key Loader",
            Save: "Save",
        },
        ru: {}
    },
    keyloaderListComponent: {
        en: {
            confm: "Please confirm you will delete ",
            kload: " keyloaders",
            conf1: "Please confirm you will delete keyloader ",
            Keyloaders: "Keyloaders",
            Tag: "Tag",
            Name: "Name",
            Create: "Create",
            Delete: "Delete",
            deleteKload: "Delete keyloader",
        },
        ru: {}
    },
    keyloaderComponent: {
        en: {
            enterN: 'Please enter keyloader name',
            enterU: 'Please enter keyloader URL',
            enterSn: 'Please enter keyloader serial number',
            Keyloader: "Keyloader",
            Back: "Back",
            Name: "Name",
            Description: "Description",
            ip: "IP Address",
            sn: "Serial Number",
            keytag: "Key tag",
            Save: "Save",
        },
        ru: {}
    },
    acquirerListComponent: {
        en: {
            confm: "Please confirm you will delete ",
            acq: " acquirers",
            conf1: "Please confirm you will delete acquirer ",
            Acquirers: "Acquirers",
            Create: "Create",
            Delete: "Delete",
            Tag: "Tag",
            Name: "Name",
            deleteA: "Delete acquirer"
        },
        ru: {}
    },
    acquirerComponent: {
        en: {
            enterN: 'Please enter acquirer name',
            enterT: 'Please enter acquirer tag',
            Back: "Back",
            Name: "Name",
            Tag: "Tag",
            Description: "Description",
            Save: "Save",
            Merchants: "Merchants",
            MID: "MID",
            Acquirer: "Acquirer",

        },
        ru: {},
    },
    keyImportComponent: {
        en: {
            title: "Key import",
            Back: "Back",
            uploadK :" Upload keys",
            Report: "Report",
            tkp: "Total keys processed:",
            created: "Created:",
            updated: "Updated:",
            nur: "No update required:",
            errors: "Errors:",
            el: "Empty lines:",
            comments: "Comments:",
            tlp: "Total lines processed",
        },
        ru: {

        }
    },
    terminalImportComponent: {
        en: {
            ti: "Terminal Import",
            Back: "Back",
            uploadT: " Upload terminals",
            Report: "Report",
            ttp: "Total terminals processed:",
            created: "Created:",
            updated: "Updated:",
            nur: "No update required:",
            errors: "Errors:",
            el: "Empty lines:",
            comments: "Comments:",
            tlp: "Total lines processed:",

        },
        ru: {

        }
    },
    merchantImportComponent: {
        en: {
            title: "Merchant import",
            Back: "Back",
            uploadM: "Upload merchants",
            Report: "Report",
            tmp: "Total merchants processed:",
            created: "Created:",
            update: "Updated:",
            nur: "No update required:",
            errors: "Errors:",
            el: "Empty lines:",
            comms: "Comments:",
            tlp: "Total lines processed:",

        },
        ru: {

        }
    },
    applicationListComponent: {
        en: {
            confM :"Please confirm you will delete ",
            apps: " applications",
            conf1: "Please confirm you will delete application ",
            Applications: "Applications",
            Create: "Create",
            Delete: "Delete",
            Model: "Model",
            Tag: "Tag",
            Name: "Name",
            Version: "Version",
            deleteA: "Delete application",

        },
        ru: {

        }
    },
    applicationComponent: {
        en: {
            enterM: 'Please enter terminal model',
            enterA: 'Please enter application name',
            enterV: 'Please enter application version',
            enterT: 'Please enter application tag',
            enterTT: 'Please enter application type tag',
            Application: "Application",
            Back: "Back",
            tm: "Terminal model",
            appName:"Application name",
            appTag: "Application tag",
            appTT: "Application type tag",
            Description: "Description",
            Package: "Package",
            Upload: "Upload",
            Save: "Save",
            version: "Version"

        },
        ru: {

        }
    },
    logListComponent: {
        en: {
            title: "Logs",
            Time: "Time",
            Level: "Level",
            User: "User",
            Message :"Message",

        },
        ru: {

        }
    },
    home: {
        en: {
            title: "Terminal Management System",
            copiright: "(C) Shtrih-M 2020",
        },
        ru: {

        }
    },
    alert: {
        en: {
            ok: "Ok",
            cancel:"Cancel"
        },
        ru: {
            ok: "Принять",
            cancel:"Отменить"
        }
    },
    notMatch: {
        en: {
            notFound:"Requested resource is not found",
        },
        ru: {

        }
    },
    paginationComponent: {
        en: {
            Next: "Next",
            Previous: "Previous"
        },
        ru: {

        }
    },
    selectObject: {
        en: {
            Select: "Select",
            Cancel: "Cancel",
        },
        ru: {

        }
    },
    logoutBtn: {
        en: {
            Logout: "Logout"
        },
        ru: {

        }
    },
    sideBar: {
        en: {
            Groups: "Groups",
            Terminals: "Terminals",
            Merchants: "Merchants",
            Acquirers: "Acquirers",
            ct: "Config templates",
            cp: "Config packages",
            Applications: "Applications",
            Activation: "Activation",
            Keys: "Keys",
            kl: "Key Loaders",
            Users: "Users",
            Logs: "Logs",
            acc: "My account",

        },
        ru: {

        }
    }

}

let getTranslations = (page, lang) => {
    return translations[page][lang];
};

export {getTranslations}
