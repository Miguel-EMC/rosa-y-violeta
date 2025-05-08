import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import {environment} from "../../../../../environments/environment";

@Injectable({providedIn: 'root'})
export class ProjectService {
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);
    private _rawApiData: BehaviorSubject<any> = new BehaviorSubject(null);
    private baseUrl = environment.apiUrl;

    constructor(private _httpClient: HttpClient) {}

    /**
     * Getter for data
     */
    get data$(): Observable<any> {
        return this._data.asObservable();
    }

    /**
     * Getter for raw API data
     */
    get rawApiData$(): Observable<any> {
        return this._rawApiData.asObservable();
    }

    /**
     * Get data from your API
     */
    getData(): Observable<any> {
        return this._httpClient.get(`${this.baseUrl}reports/dashboard/key_metrics`).pipe(
            tap((response: any) => {
                this._rawApiData.next(response);

                // Store processed data for the dashboard
                this._data.next(response);
            }),
        );
    }

    /**
     * Verify API data structure
     */
    verifyApiData(): Observable<any> {
        return this._httpClient.get(`${this.baseUrl}reports/dashboard/key_metrics`);
    }
}
