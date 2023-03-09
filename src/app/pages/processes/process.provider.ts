import { Injectable } from '@angular/core';
import { Provider } from '../../providers/provider';
import { HttpClient } from '@angular/common/http';
import { Process } from './process.model';

@Injectable({
    providedIn: 'root'
})
export class ProcessProvider extends Provider {
    public process: Process;

    constructor(public http: HttpClient) {
        super(http);
    }

    get(id: string) {
        return this.http.get<Process>(`${this.url}/processes/${id}`, { headers: this.composeHeaders() });
    }

    getAll() {
        return this.http.get<Process[]>(`${this.url}/processes`, { headers: this.composeHeaders() });
    }

    save(process: Process) {
        if (process._id) {
            return this.http.put<Process>(`${this.url}/processes/${process._id}`, process, { headers: this.composeHeaders() });
        } else {
            return this.http.post<Process>(`${this.url}/processes`, process, { headers: this.composeHeaders() });
        }
    }

    delete(process: Process) {
        return this.http.delete<Process>(`${this.url}/processes/${process._id}`, { headers: this.composeHeaders() });
    }
}