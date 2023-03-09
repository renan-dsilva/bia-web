import { Injectable } from '@angular/core';
import { Provider } from '../../providers/provider';
import { HttpClient } from '@angular/common/http';
import { User } from './user.model';

@Injectable({
    providedIn: 'root'
})
export class UserProvider extends Provider {

    constructor(public http: HttpClient) {
        super(http);
    }

    authenticate(data) {
        data.origin = 'STAFF';
        return this.http.post(`${this.url}/domain/authenticate`, data);
    }

    refreshToken() {
        return this.http.post(
            `${this.url}/domain/refreshToken`,
            null,
            { headers: this.composeHeaders() }
        );
    }

    create(data) {
        return this.http.post(`${this.url}/accounts`, data);
    }

    resetPassword(data) {
        return this.http.post(`${this.url}/accounts/reset-password`, data);
    }

    getProfile() {
        return this.http.get(`${this.url}/accounts`, { headers: this.composeHeaders() });
    }

    updateProfile(data) {
        return this.http.put(`${this.url}/accounts`, data, { headers: this.composeHeaders() });
    }

    saveMedia(data: Object) {
        return this.http.post(`${this.url}/domain/save-media`, data, { headers: this.composeHeaders() });
    }


}