import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
    id: number;
    username: string;
    email: string;
    is_active: boolean;
    is_superadmin: boolean;
    role: string;
}

export interface UsersApiResponse {
    count: number;
    results: User[];
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getUsers(): Observable<UsersApiResponse> {
        return this.http.get<any>(`${this.baseUrl}users/users/`).pipe(
            map(response => {
                if (Array.isArray(response)) {
                    return {
                        count: response.length,
                        results: response
                    };
                }
                return response;
            })
        );
    }

    getUserById(id: number): Observable<User> {
        return this.http.get<User>(`${this.baseUrl}users/users/${id}/`);
    }

    updatePassword(userId: number, password: string): Observable<any> {
        return this.http.post<{message: string}>(`${this.baseUrl}users/users/${userId}/set_password/`, { password });
    }

    createUser(user: Omit<User, 'id'>): Observable<User> {
        return this.http.post<User>(`${this.baseUrl}users/users/`, user);
    }

    updateUser(id: number, user: Partial<User>): Observable<User> {
        return this.http.put<User>(`${this.baseUrl}users/users/${id}/`, user);
    }

    deleteUser(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}users/users/${id}/`);
    }

    searchUsers(body: { username?: string; email?: string }, take = 10, skip = 0): Observable<UsersApiResponse> {
        return this.http.post<UsersApiResponse>(
            `${this.baseUrl}users/users/search/?take=${take}&skip=${skip}`,
            body
        );
    }
}
