import { Injectable } from '@angular/core';
import { Provider } from '../../providers/provider';
import { HttpClient } from '@angular/common/http';
import { Dashboard } from './dashboard.model';

@Injectable({
    providedIn: 'root'
})
export class DashboardProvider extends Provider {
    public dashboard: Dashboard;

    constructor(public http: HttpClient) {
        super(http);
    }

    getAll() {
        return this.http.get<Dashboard[]>(`${this.url}/dashboard`, { headers: this.composeHeaders() });
    }

}