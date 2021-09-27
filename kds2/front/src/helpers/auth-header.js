export function authHeader() {
    // return authorization header with jwt token
    let user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        console.log("token = ", user.token)
        return { 'Authorization': 'Bearer ' + user.token };
    } else {
        return {};
    }
}

export function authToken() {
    let user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        return 'Bearer ' + user.token;
    } else {
        return null;
    }
}