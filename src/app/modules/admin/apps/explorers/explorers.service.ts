import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {environment} from "../../../../../environments/environment";

export interface Product {
    id: number;
    name: string;
    description?: string;
    price?: number;
    brand_id?: number;
    category_id?: number;
    active?: boolean;
}

export interface Brand {
    id: number;
    name: string;
    description?: string;
    active?: boolean;
}

export interface Category {
    id: number;
    name: string;
    description?: string;
    active?: boolean;
}

export interface ProductsApiResponse {
    count: number;
    results: Product[];
}

export interface BrandsApiResponse {
    count: number;
    results: Brand[];
}

export interface CategoriesApiResponse {
    count: number;
    results: Category[];
}

@Injectable({providedIn: 'root'})
export class ExplorersService {
    private baseUrl = environment.apiUrl;

    constructor(private _httpClient: HttpClient) {}

    // Products methods
    getProducts(take = 10, skip = 0): Observable<ProductsApiResponse> {
        return this._httpClient.get<ProductsApiResponse>(
            `${this.baseUrl}products/?take=${take}&skip=${skip}`
        );
    }

    getProductById(id: number): Observable<Product> {
        return this._httpClient.get<Product>(`${this.baseUrl}products/${id}/`);
    }

    createProduct(product: Omit<Product, 'id'>): Observable<Product> {
        return this._httpClient.post<Product>(`${this.baseUrl}products/`, product);
    }

    updateProduct(id: number, product: Partial<Product>): Observable<Product> {
        return this._httpClient.put<Product>(`${this.baseUrl}products/${id}/`, product);
    }

    deleteProduct(id: number): Observable<any> {
        return this._httpClient.delete(`${this.baseUrl}products/${id}/`);
    }

    // Brand methods
    getBrands(take = 10, skip = 0): Observable<BrandsApiResponse> {
        return this._httpClient.get<BrandsApiResponse>(
            `${this.baseUrl}products/brands/?take=${take}&skip=${skip}`
        );
    }

    getBrandById(id: number): Observable<Brand> {
        return this._httpClient.get<Brand>(`${this.baseUrl}products/brands/${id}/`);
    }

    createBrand(brand: Omit<Brand, 'id'>): Observable<Brand> {
        return this._httpClient.post<Brand>(`${this.baseUrl}products/brands/`, brand);
    }

    updateBrand(id: number, brand: Partial<Brand>): Observable<Brand> {
        return this._httpClient.put<Brand>(`${this.baseUrl}products/brands/${id}/`, brand);
    }

    deleteBrand(id: number): Observable<any> {
        return this._httpClient.delete(`${this.baseUrl}products/brands/${id}/`);
    }

    // Category methods
    getCategories(take = 10, skip = 0): Observable<CategoriesApiResponse> {
        return this._httpClient.get<CategoriesApiResponse>(
            `${this.baseUrl}products/categories/?take=${take}&skip=${skip}`
        );
    }

    getCategoryById(id: number): Observable<Category> {
        return this._httpClient.get<Category>(`${this.baseUrl}products/categories/${id}/`);
    }

    createCategory(category: Omit<Category, 'id'>): Observable<Category> {
        return this._httpClient.post<Category>(`${this.baseUrl}products/categories/`, category);
    }

    updateCategory(id: number, category: Partial<Category>): Observable<Category> {
        return this._httpClient.put<Category>(`${this.baseUrl}products/categories/${id}/`, category);
    }

    deleteCategory(id: number): Observable<any> {
        return this._httpClient.delete(`${this.baseUrl}products/categories/${id}/`);
    }

    // Search methods
    searchProducts(body: { name?: string }, take = 10, skip = 0): Observable<ProductsApiResponse> {
        return this._httpClient.post<ProductsApiResponse>(
            `${this.baseUrl}products/search/?take=${take}&skip=${skip}`,
            body
        );
    }

    searchBrands(body: { name?: string }, take = 10, skip = 0): Observable<BrandsApiResponse> {
        return this._httpClient.post<BrandsApiResponse>(
            `${this.baseUrl}products/brands/search/?take=${take}&skip=${skip}`,
            body
        );
    }

    searchCategories(body: { name?: string }, take = 10, skip = 0): Observable<CategoriesApiResponse> {
        return this._httpClient.post<CategoriesApiResponse>(
            `${this.baseUrl}products/categories/search/?take=${take}&skip=${skip}`,
            body
        );
    }
}
