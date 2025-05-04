import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ClientsService {
    private baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getClients(take = 10, skip = 0): Observable<{ count: number, results: any[] }> {
        return this.http.get<{ count: number, results: any[] }>(
            `${this.baseUrl}clients/?take=${take}&skip=${skip}`
        );
    }

    createClient(client: any): Observable<any> {
        return this.http.post(`${this.baseUrl}clients/`, client);
    }

    getClientById(id: number): Observable<any> {
        return this.http.get(`${this.baseUrl}clients/${id}/`);
    }

    updateClient(id: number, client: any): Observable<any> {
        return this.http.put(`${this.baseUrl}clients/${id}/`, client);
    }

    deleteClient(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}clients/${id}/`);
    }

    searchClients(body: { full_name?: string }, take = 10, skip = 0) {
        return this.http.post<any>(
            `${this.baseUrl}clients/search_clients/?take=${take}&skip=${skip}`,
            body
        );
    }

    /*** Orders Product by Clients ***/
    getOrders(): Observable<any> {
        return this.http.get(`${this.baseUrl}orders/`);
    }

    getOrderById(id: number): Observable<any> {
        return this.http.get(`${this.baseUrl}orders/${id}/`);
    }

    deleteOrder(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}orders/${id}/`);
    }

    getOrdersByClient(clientId: number): Observable<any> {
        return this.http.get(`${this.baseUrl}orders/by_client/${clientId}/`);
    }

    updateOrdersByClient(clientId: number, payload: any): Observable<any> {
        return this.http.put(`${this.baseUrl}orders/update_by_client/${clientId}/`, payload);
    }
}
