import { Injectable } from '@angular/core';
import { Provider } from '../../providers/provider';
import { HttpClient } from '@angular/common/http';
import { Integration } from './integration.model';

@Injectable({
    providedIn: 'root'
})
export class IntegrationProvider extends Provider {
    public integration: Integration;

    constructor(public http: HttpClient) {
        super(http);
    }

    get(id: string) {
        return this.http.get<Integration>(`${this.url}/integrations/${id}`, { headers: this.composeHeaders() });
    }

    getAll() {
        return this.http.get<Integration[]>(`${this.url}/integrations`, { headers: this.composeHeaders() });
    }

    getByApplication(id: string) {
        return this.http.get<Integration[]>(`${this.url}/integrations/application/${id}`, { headers: this.composeHeaders() });
    }

    save(integration: Integration) {
        if (integration._id) {
            return this.http.put<Integration>(`${this.url}/integrations/${integration._id}`, integration, { headers: this.composeHeaders() });
        } else {
            return this.http.post<Integration>(`${this.url}/integrations`, integration, { headers: this.composeHeaders() });
        }
    }

    delete(integration: Integration) {
        return this.http.delete<Integration>(`${this.url}/integrations/${integration._id}`, { headers: this.composeHeaders() });
    }
}