import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Product {
    id: number;
    sku: string;
    name: string;
    brand: number;
    size: string;
    stock: number;
    wholesale_price: string;
    unit_price: string;
}

@Injectable({
    providedIn: 'root'
})
export class ProductsService {
    private baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getProducts(token: string): Observable<Product[]> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'accept': 'application/json'
        });
        return this.http.get<Product[]>(`${this.baseUrl}products/`, { headers });
    }

    deleteProductById(token: string, productId: number): Observable<any> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'accept': 'application/json'
        });
        return this.http.delete(`${this.baseUrl}products/${productId}/`, { headers });
    }

    createProduct(token: string, product: Omit<Product, 'id'>): Observable<Product> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'accept': 'application/json',
            'Content-Type': 'application/json'
        });
        return this.http.post<Product>(`${this.baseUrl}products/`, product, { headers });
    }

    headProducts(token: string): Observable<any> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'accept': 'application/json'
        });
        return this.http.head(`${this.baseUrl}products/`, { headers, observe: 'response' });
    }

    optionsProducts(token: string): Observable<any> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'accept': 'application/json'
        });
        return this.http.options(`${this.baseUrl}products/`, { headers, observe: 'response' });
    }
}
