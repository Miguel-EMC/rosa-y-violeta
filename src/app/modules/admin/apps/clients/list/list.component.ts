import {DOCUMENT, NgClass} from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {ClientsService} from "../../../../../services/clients.service";
import { CommonModule } from '@angular/common';

@Component({
    selector       : 'clients-list',
    templateUrl    : './list.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports: [CommonModule, MatSidenavModule, MatFormFieldModule, MatIconModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, RouterOutlet, NgClass, RouterLink],
})
export class ClientsListComponent implements OnInit, OnDestroy
{
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    drawerMode = 'side';
    clientsCount = 0;
    searchInputControl = new FormControl('');
    clients$: Observable<any[]>;
    selectedClient: any = null;
    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(DOCUMENT) private _document: any,
        private _router: Router,
        private _clientsService: ClientsService
    )
    {
    }
    //
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */

    ngOnInit(): void {
        this.clients$ = this._clientsService.getClients();
        this.clients$.subscribe(clients => {
            this.clientsCount = clients.length;
            const id = this._activatedRoute.snapshot.firstChild?.params['id'];
            if (id) {
                this.selectedClient = clients.find(c => c.id == id);
            }
            this._changeDetectorRef.markForCheck();
        });
        this._activatedRoute.params.subscribe(params => {
            const id = params['id'];
            if (id && this.clients$) {
                this.clients$.subscribe(clients => {
                    this.selectedClient = clients.find(c => c.id == id);
                    this._changeDetectorRef.markForCheck();
                });
            } else {
                this.selectedClient = null;
            }
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * On backdrop clicked
     */
    onBackdropClicked(): void
    {
        // Go back to the list
        this._router.navigate(['./'], {relativeTo: this._activatedRoute});

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Create client
     */
    createClient(): void
    {
        // Create the client
        this._clientsService.createClient(parseInt(localStorage.getItem('user_id') || '0', 10)
        ).subscribe((newClient) =>
        {
            // Go to the new client
            this._router.navigate(['./', newClient.id], {relativeTo: this._activatedRoute});

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
