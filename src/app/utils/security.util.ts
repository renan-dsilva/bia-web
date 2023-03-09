import { User } from "../pages/user/user.model";

export class Security {
    public static set(user: User, token: string) {
        const data = unescape(encodeURIComponent(JSON.stringify(user)));
        localStorage.setItem('session-user', btoa(data));
        localStorage.setItem('session-token', token);
    }

    public static setUser(user: User) {
        const data = unescape(encodeURIComponent(JSON.stringify(user)));
        localStorage.setItem('session-user', btoa(data));
    }

    public static setToken(token: string) {
        localStorage.setItem('session-token', token);
    }

    public static getUser(): User {
        // TODO: Returning mocked user while mocked phase
        return this.getUserMocked();

        const data = localStorage.getItem('session-user');

        if (data) {
            return JSON.parse(atob(data));
        } else {
            return null;
        }
    }

    public static getUserMocked() {
        const user = new User(
            "4d5314f6-bd0c-11ed-afa1-0242ac120002",
            "Bradesco",
            "12345678900",
            "bia@foursys.com",
            // [],
            "aq1sw2de3",
            "token",
            false,
            "1111",
            "1111")

        return user
    }

    public static getToken(): string {
        const data = localStorage.getItem('session-token');
        if (data) {
            return data;
        } else {
            return null;
        }
    }

    public static hasToken(): boolean {
        if (this.getToken())
            return true;
        else
            return false;
    }

    public static clear() {
        localStorage.removeItem('session-user');
        localStorage.removeItem('session-token');
    }
}