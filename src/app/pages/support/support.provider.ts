import { Injectable } from '@angular/core';
import { Provider } from '../../providers/provider';
import { HttpClient } from '@angular/common/http';
import { Support } from './support.model';

@Injectable({
    providedIn: 'root'
})
export class SupportProvider extends Provider {
    public support: Support;

    constructor(public http: HttpClient) {
        super(http);
    }

    get(id: string) {
        return this.http.get<Support>(`${this.url}/support/${id}`, { headers: this.composeHeaders() });
    }

    getAll() {
        return this.http.get<Support[]>(`${this.url}/support`, { headers: this.composeHeaders() });
    }

    save(support: Support) {
        if (support._id) {
            return this.http.put<Support>(`${this.url}/support/${support._id}`, support, { headers: this.composeHeaders() });
        } else {
            return this.http.post<Support>(`${this.url}/support`, support, { headers: this.composeHeaders() });
        }
    }

    delete(support: Support) {
        return this.http.delete<Support>(`${this.url}/support/${support._id}`, { headers: this.composeHeaders() });
    }
}