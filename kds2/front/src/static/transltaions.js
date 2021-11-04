import GroupListComponent from "../component/GroupListComponent";

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
    }
}

let getTranslations = (page, lang) => {
    return translations[page][lang];
};

export {getTranslations}
