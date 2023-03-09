import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class Provider {

    public url = environment.apiUrl;

    constructor(public http: HttpClient) { }

    public composeHeaders() {
        const token = localStorage.getItem('session-token');
        const headers = new HttpHeaders().set('Authorization', `${token}`);
        return headers;
    }
}

export class ApiResponse {
    constructor(
        public success: boolean,
        public message: string,
        public data: any,
    ) { }
}