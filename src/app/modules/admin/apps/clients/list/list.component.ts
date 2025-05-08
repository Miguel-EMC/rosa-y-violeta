import {DOCUMENT, NgClass} from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatDrawer, MatSidenavModule} from '@angular/material/sidenav';
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from '@angular/router';
import {Observable, of, Subject} from 'rxjs';
import {ClientsService} from "../../../../../services/clients.service";
import {CommonModule} from '@angular/common';
import {MatPaginatorModule} from "@angular/material/paginator";
import {AddClientModalComponent} from "../../ecommerce/inventory/add-client-modal/add-client-modal.component";
import {ToastrService} from 'ngx-toastr';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'clients-list',
    templateUrl: './list.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CommonModule, MatSidenavModule, MatFormFieldModule, MatIconModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, RouterOutlet, NgClass, RouterLink, MatPaginatorModule, AddClientModalComponent],
})
export class ClientsListComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    drawerMode = 'side';
    searchInputControl = new FormControl('');
    selectedClient: any = null;


    /*** Variables of pagination ***/
    clients$: Observable<any[]>;
    clientsCount = 0;
    page = 0;
    pageSize = 10;

    /*** Variables to show the add client modal ***/
    showAddClientModal = false;


    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(DOCUMENT) private _document: any,
        private _router: Router,
        private _clientsService: ClientsService,
        private _toastrService: ToastrService,
        private _dialog: MatDialog,

    ) {
    }

    //
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */

    ngOnInit(): void {
        this.searchInputControl.valueChanges
            .pipe(debounceTime(300), distinctUntilChanged())
            .subscribe(value => {
                this.page = 0;
                this.loadClients();
            });
        this.loadClients();
        this._activatedRoute.params.subscribe(params => {
            const id = params['id'];
            if (id) {
                this.clients$?.subscribe(clients => {
                    this.selectedClient = clients.find(c => c.id == id);
                    this._changeDetectorRef.markForCheck();
                });
            } else {
                this.selectedClient = null;
            }
        });
    }

    loadClients(): void {
        const searchValue = this.searchInputControl.value?.trim();
        const body: any = {};
        if (searchValue) {
            body.full_name = searchValue;
            if (/^\d+$/.test(searchValue)) {
                body.cedula = searchValue;
            }
        }
        const request$ = searchValue
            ? this._clientsService.searchClients(body, this.pageSize, this.page * this.pageSize)
            : this._clientsService.getClients(this.pageSize, this.page * this.pageSize);

        request$.subscribe(response => {
            this.clientsCount = response.count;
            this.clients$ = of(response.results);
            this._changeDetectorRef.markForCheck();
        });
    }

    get pageIndex(): number {
        return this.page;
    }

    get totalPages(): number {
        return Math.ceil(this.clientsCount / this.pageSize) || 1;
    }

    goToPreviousPage(): void {
        if (this.page > 0) {
            this.page--;
            this.loadClients();
        }
    }

    goToNextPage(): void {
        if ((this.page + 1) < this.totalPages) {
            this.page++;
            this.loadClients();
        }
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
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
    onBackdropClicked(): void {
        // Go back to the list
        this._router.navigate(['./'], {relativeTo: this._activatedRoute});

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Create client
     */
    onAddClientModalCancel() {
        this.showAddClientModal = false;
        this._changeDetectorRef.markForCheck();
    }

    createClient(): void {
        const dialogRef = this._dialog.open(AddClientModalComponent, {
            width: '400px',
            disableClose: true
        });

        dialogRef.componentInstance.cancel.subscribe(() => {
            dialogRef.close();
        });

        dialogRef.componentInstance.add.subscribe((clientData: any) => {
            this._clientsService.createClient(clientData).subscribe({
                next: () => {
                    this._toastrService.success('Cliente añadido con éxito', 'Éxito');
                    this.loadClients();
                    dialogRef.close();
                    this._changeDetectorRef.markForCheck();
                },
                error: () => {
                    this._toastrService.error('Error al crear el cliente', 'Error');
                    this._changeDetectorRef.markForCheck();
                }
            });
        });
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
