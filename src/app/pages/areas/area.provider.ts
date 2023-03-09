import { Injectable } from '@angular/core';
import { Provider } from '../../providers/provider';
import { HttpClient } from '@angular/common/http';
import { Area } from './area.model';

@Injectable({
    providedIn: 'root'
})
export class AreaProvider extends Provider {
    public area: Area;

    constructor(public http: HttpClient) {
        super(http);
    }

    get(id: string) {
        return this.http.get<Area>(`${this.url}/areas/${id}`, { headers: this.composeHeaders() });
    }

    getAll() {
        return this.http.get<Area[]>(`${this.url}/areas`, { headers: this.composeHeaders() });
    }

    save(area: Area) {
        if (area._id) {
            return this.http.put<Area>(`${this.url}/areas/${area._id}`, area, { headers: this.composeHeaders() });
        } else {
            return this.http.post<Area>(`${this.url}/areas`, area, { headers: this.composeHeaders() });
        }
    }

    delete(area: Area) {
        return this.http.delete<Area>(`${this.url}/areas/${area._id}`, { headers: this.composeHeaders() });
    }
}