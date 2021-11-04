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
    }
}

let getTranslations = (page, lang) => {
    return translations[page][lang];
};

export {getTranslations}
