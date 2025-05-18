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
    category?: number;
    category_name?: string;
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

export interface Brand {
    id: number;
    name: string;
}

export interface Category {
    id: number;
    name: string;
}

export interface BrandsApiResponse {
    count: number;
    results: Brand[];
}

export interface CategoriesApiResponse {
    count: number;
    results: Category[];
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
        return this.http.get(`${this.baseUrl}products/assign/by_product/${productId}/`);
    }

    sendClientsForProduct(productId: number, payload: any): Observable<any> {
        return this.http.post(
            `${this.baseUrl}products/assign/by_product/${productId}/`,
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

    editProduct(productId: number, product: Partial<Product>): Observable<Product> {
        return this.http.patch<Product>(`${this.baseUrl}products/${productId}/`, product);
    }
    headProducts(): Observable<any> {
        return this.http.head(`${this.baseUrl}products/`, { observe: 'response' });
    }

    optionsProducts(): Observable<any> {
        return this.http.options(`${this.baseUrl}products/`, { observe: 'response' });
    }
    searchProducts(body: { sku?: string; name?: string }, take = 10, skip = 0): Observable<ProductsApiResponse> {
        return this.http.post<ProductsApiResponse>(
            `${this.baseUrl}products/assign/search_products/?take=${take}&skip=${skip}`,
            body
        );
    }


    getBrands(take = 10, skip = 0, orderBy?: string): Observable<BrandsApiResponse> {
        let url = `${this.baseUrl}products/brands/?take=${take}&skip=${skip}`;
        if (orderBy) {
            url += `&orderBy=${orderBy}`;
        }
        return this.http.get<BrandsApiResponse>(url);
    }
    getBrandById(id: number): Observable<Brand> {
        return this.http.get<Brand>(`${this.baseUrl}products/brands/${id}/`);
    }
    createBrand(brand: { name: string }): Observable<Brand> {
        return this.http.post<Brand>(`${this.baseUrl}products/brands/`, brand);
    }

    updateBrand(id: number, brand: { name: string }): Observable<Brand> {
        return this.http.patch<Brand>(`${this.baseUrl}products/brands/${id}/`, brand);
    }

    deleteBrand(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}products/brands/${id}/`);
    }

    // Category API methods
    getCategories(take = 10, skip = 0, orderBy?: string): Observable<CategoriesApiResponse> {
        let url = `${this.baseUrl}products/categories/?take=${take}&skip=${skip}`;
        if (orderBy) {
            url += `&orderBy=${orderBy}`;
        }

        return this.http.get<CategoriesApiResponse>(url);
    }

    getCategoryById(id: number): Observable<Category> {
        return this.http.get<Category>(`${this.baseUrl}products/categories/${id}/`);
    }

    createCategory(category: { name: string }): Observable<Category> {
        return this.http.post<Category>(`${this.baseUrl}products/categories/`, category);
    }

    updateCategory(id: number, category: { name: string }): Observable<Category> {
        return this.http.patch<Category>(`${this.baseUrl}products/categories/${id}/`, category);
    }

    deleteCategory(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}products/categories/${id}/`);
    }
}
