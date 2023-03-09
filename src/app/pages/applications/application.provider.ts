import { Injectable } from '@angular/core';
import { Provider } from '../../providers/provider';
import { HttpClient } from '@angular/common/http';
import { Application } from './application.model';

@Injectable({
    providedIn: 'root'
})
export class ApplicationProvider extends Provider {
    public application: Application;

    constructor(public http: HttpClient) {
        super(http);
    }

    get(id: string) {
        return this.http.get<Application>(`${this.url}/applications/${id}`, { headers: this.composeHeaders() });
    }

    getAll() {
        return this.http.get<Application[]>(`${this.url}/applications`, { headers: this.composeHeaders() });
    }

    save(application: Application) {
        if (application._id) {
            return this.http.put<Application>(`${this.url}/applications/${application._id}`, application, { headers: this.composeHeaders() });
        } else {
            return this.http.post<Application>(`${this.url}/applications`, application, { headers: this.composeHeaders() });
        }
    }

    delete(application: Application) {
        return this.http.delete<Application>(`${this.url}/applications/${application._id}`, { headers: this.composeHeaders() });
    }
}