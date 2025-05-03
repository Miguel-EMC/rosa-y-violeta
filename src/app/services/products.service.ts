import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
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

export interface Client {
    client_id: number;
    client_name: string;
    quantity: number;
    total_price: string;
    unit_price: string;
}

export interface ProductsApiResponse {
    count: number;
    results: Product[];
}
@Injectable({
    providedIn: 'root'
})
export class ProductsService {
    private baseUrl = environment.apiUrl;
    private productsUpdatedSource = new Subject<void>();
    productsUpdated$ = this.productsUpdatedSource.asObservable();

    constructor(private http: HttpClient) {}

    getProducts(take = 10, skip = 0): Observable<ProductsApiResponse> {
        return this.http.get<ProductsApiResponse>(`${this.baseUrl}products/?take=${take}&skip=${skip}`);
    }

    deleteProductById(productId: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}products/${productId}/`);
    }

    getClientsForProduct(productId: number): Observable<any> {
        return this.http.get(`${this.baseUrl}products/assign_product/by_product/${productId}/`);
    }

    sendClientsForProduct(productId: number, payload: any): Observable<any> {
        return this.http.put(
            `${this.baseUrl}products/assign_product/by_product/${productId}/`,
            payload
        );
    }

    getProductById(productId: number): Observable<Product> {
        return this.http.get<Product>(`${this.baseUrl}products/${productId}/`);
    }

    notifyProductsUpdated() {
        this.productsUpdatedSource.next();
    }

    createProduct(product: Omit<Product, 'id'>): Observable<Product> {
        return this.http.post<Product>(`${this.baseUrl}products/`, product);
    }

    headProducts(): Observable<any> {
        return this.http.head(`${this.baseUrl}products/`, { observe: 'response' });
    }

    optionsProducts(): Observable<any> {
        return this.http.options(`${this.baseUrl}products/`, { observe: 'response' });
    }
    searchProducts(body: { sku?: string; name?: string }, take = 10, skip = 0): Observable<ProductsApiResponse> {
        return this.http.post<ProductsApiResponse>(
            `${this.baseUrl}products/assign_product/search_products/?take=${take}&skip=${skip}`,
            body
        );
    }
}
