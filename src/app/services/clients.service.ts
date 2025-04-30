// src/app/services/clients.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ClientsService {
    private baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

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

    patchClient(id: number, client: any): Observable<any> {
        return this.http.patch(`${this.baseUrl}clients/${id}/`, client);
    }

    deleteClient(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}clients/${id}/`);
    }

    getClientPurchaseHistory(id: number): Observable<any> {
        return this.http.get(`${this.baseUrl}clients/${id}/purchase_history/`);
    }

    // Orders endpoints
    getOrders(): Observable<any> {
        return this.http.get(`${this.baseUrl}orders/`);
    }

    createOrder(order: any): Observable<any> {
        return this.http.post(`${this.baseUrl}orders/`, order);
    }

    getOrderById(id: number): Observable<any> {
        return this.http.get(`${this.baseUrl}orders/${id}/`);
    }

    updateOrder(id: number, order: any): Observable<any> {
        return this.http.put(`${this.baseUrl}orders/${id}/`, order);
    }

    patchOrder(id: number, order: any): Observable<any> {
        return this.http.patch(`${this.baseUrl}orders/${id}/`, order);
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

    searchClients(body: { full_name?: string }, take = 10, skip = 0) {
        return this.http.post<any>(
            `${this.baseUrl}clients/search_clients/?take=${take}&skip=${skip}`,
            body
        );
    }
}
