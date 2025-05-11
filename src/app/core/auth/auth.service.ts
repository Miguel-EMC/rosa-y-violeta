import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Injector } from '@angular/core';
import { catchError, interval, Observable, of, switchMap, throwError } from 'rxjs';
import { UserService } from 'app/core/user/user.service';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import {environment} from "../../../environments/environment"; // Ensure HttpHeaders is imported

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _authenticated: boolean = false;
    private _httpClient = inject(HttpClient);
    private _injector = inject(Injector);
    private _router = inject(Router);

    private baseUrl = environment.apiUrl;

    constructor() {
        if (this.accessToken && this.refresh && this.getUserData()) {
            this._authenticated = true;
            this._userService.user = this.getUserData();
        }
    }

    private get _userService(): UserService {
        return this._injector.get(UserService);
    }

    // Accessors for tokens
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    set refresh(token: string) {
        localStorage.setItem('refresh', token);
    }

    get refresh(): string {
        return localStorage.getItem('refresh') ?? '';
    }

    // Public methods
    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post(`${this.baseUrl}password-reset/`, { email });
    }

    resetPassword(token: string, newPassword: string, confirmPassword: string): Observable<any> {
        return this._httpClient.post(`${this.baseUrl}password-reset-confirm/`, {
            token,
            new_password: newPassword,
            confirm_password: confirmPassword
        });
    }
    signIn(credentials: { username: string; password: string }): Observable<any> {
        if (this._authenticated) {
            return throwError('User is already logged in.');
        }
        return this._httpClient.post<any>(`${this.baseUrl}token/`, credentials).pipe(
            switchMap((response: any) => {
                if (response && response.access && response.refresh) {
                    this.accessToken = response.access;
                    this.refresh = response.refresh;
                    this.storeUserData({
                        id: response.id,
                        email: response.email,
                        username: response.username,
                        is_active: response.is_active,
                        is_superadmin: response.is_superadmin,
                        role: response.role
                    });

                    this._authenticated = true;
                    this._userService.user = response;
                    return of(response);
                } else {
                    return throwError('Invalid response format: ' + JSON.stringify(response));
                }
            }),
            catchError((error) => {
                return throwError(error);
            })
        );
    }

    storeUserData(userData: any): void {
        localStorage.setItem('userData', JSON.stringify(userData));
    }

    getUserData(): any {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    }

    signOut(): Observable<any> {
        this.logout();
        this._router.navigate(['/sign-in']);
        return of(true);
    }

    signUp(user: {
        name: string;
        email: string;
        password: string;
        username: string;
        last_name: string;
        cedula: string;
    }): Observable<any> {
        return this._httpClient.post(`${this.baseUrl}register/`, user);
    }

    unlockSession(credentials: { email: string; password: string }): Observable<any> {
        return this._httpClient.post(`${this.baseUrl}unlock-session`, credentials);
    }

    check(): Observable<boolean> {
        if (this._authenticated) {
            return of(true);
        }
        if (this.accessToken) {
            return of(true);
        }
        return of(false);
    }

    confirmEmail(token: string): Observable<any> {
        return this._httpClient.post(`${this.baseUrl}email-confirm/`, { token });
    }

    // New method for token refresh
    refreshAccessToken(): Observable<any> {
        const refresh = this.refresh;
        if (!refresh) {
            return throwError('No refresh token available');
        }

        return this._httpClient.post<any>(`${this.baseUrl}token/refresh/`, { refresh: refresh }).pipe(
            switchMap(response => {
                if (response && response.access) {
                    this.accessToken = response.access;
                    if (response.refresh) {
                        this.refresh = response.refresh;
                    }
                    return of(response);
                } else {
                    return throwError('Failed to refresh access token');
                }
            }),
            catchError((error) => {
                this.signOut();
                return throwError(error);
            })
        );
    }

    // Private methods
    private checkTokenValidity(): Observable<boolean> {
        const refresh = this.refresh;
        if (!refresh) {
            this.signOut();
            return of(false);
        }

        return this._httpClient.post<any>(`${this.baseUrl}token/refresh/`, { refresh: refresh }).pipe(
            switchMap(response => {
                if (response && response.access) {
                    this.accessToken = response.access;
                    return of(true);
                } else {
                    this.signOut();
                    return of(false);
                }
            }),
            catchError((error) => {
                this.signOut();
                return of(false);
            })
        );
    }

    logout(): Observable<any> {
        const accessToken = this.accessToken;
        const refresh = this.refresh;
        if (!accessToken || !refresh) {
            return throwError('No access or refresh token available');
        }
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        });
        return this._httpClient.post<any>(`${this.baseUrl}logout/`, { refresh: refresh }, { headers }).pipe(
            switchMap(() => {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refresh');
                localStorage.removeItem('userData');
                this._authenticated = false;
                this._router.navigate(['/sign-in']);
                return of(true);
            }),
            catchError((error) => {
                console.error('Error during logout:', error);
                return throwError('Failed to log out. Please try again.');
            })
        );
    }
}
