import { NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UserService, User } from 'app/services/user.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { NgClass } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
    selector: 'settings-team',
    templateUrl: './team.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [MatFormFieldModule, MatIconModule, MatInputModule, MatButtonModule, NgFor, NgIf,
        MatSelectModule, MatOptionModule, TitleCasePipe, ReactiveFormsModule, FormsModule,
        MatCardModule, NgClass, MatProgressSpinnerModule],
})
export class SettingsTeamComponent implements OnInit {
    users: User[] = [];
    roles: any[];
    newUserForm: FormGroup;
    isLoading = false;
    totalUsers = 0;
    currentPage = 0;
    pageSize = 10;

    constructor(
        private _userService: UserService,
        private _formBuilder: FormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
        private _toastr: ToastrService,
        private _fuseConfirmationService: FuseConfirmationService
    ) {
        this.newUserForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            username: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.loadUsers();
        this.roles = [
            {
                label: 'Admin',
                value: 'admin',
                description: 'Puede gestionar todos los recursos del sistema, incluidos usuarios y configuraciones.',
            }
        ];
    }

    loadUsers(): void {
        this.isLoading = true;
        this._userService.getUsers()
            .subscribe(
                (response) => {
                    this.users = response.results || [];
                    this.totalUsers = response.count || 0;
                    this.isLoading = false;
                    this._changeDetectorRef.markForCheck();
                },
                (error) => {
                    console.error('Error al cargar usuarios:', error);
                    this._toastr.error('No se pudieron cargar los usuarios', 'Error');
                    this.isLoading = false;
                    this._changeDetectorRef.markForCheck();
                }
            );
    }

    createUser(): void {
        if (this.newUserForm.invalid) {
            return;
        }
        const { username, email } = this.newUserForm.value;
        const newUser = {
            username,
            email,
            password: username,
            role: 'admin',
            is_active: true,
            is_superadmin: false
        };
        this.isLoading = true;
        this._userService.createUser(newUser).subscribe(
            (response) => {
                this.users.unshift(response);
                this.newUserForm.reset();
                this._toastr.success('Usuario creado correctamente', 'Éxito');
                this.isLoading = false;
                this._changeDetectorRef.markForCheck();
            },
            (error) => {
                this._toastr.error(error.error?.detail || 'Error al crear el usuario', 'Error');
                this.isLoading = false;
                this._changeDetectorRef.markForCheck();
                console.error('Error creating user:', error);
            }
        );
    }

    deleteUser(user: User): void {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Eliminar usuario',
            message: `¿Está seguro de eliminar al usuario "${user.username}"?`,
            icon: {
                show: true,
                name: 'heroicons_outline:trash',
                color: 'warn'
            },
            actions: {
                confirm: {
                    show: true,
                    label: 'Sí, eliminar',
                    color: 'warn'
                },
                cancel: {
                    show: true,
                    label: 'No'
                }
            }
        });

        confirmation.afterClosed().subscribe(result => {
            if (result === 'confirmed') {
                this.isLoading = true;
                this._userService.deleteUser(user.id).subscribe(
                    () => {
                        this.users = this.users.filter(u => u.id !== user.id);
                        this._toastr.success('Usuario eliminado correctamente', 'Éxito');
                        this.isLoading = false;
                        this._changeDetectorRef.markForCheck();
                    },
                    (error) => {
                        this._toastr.error('Error al eliminar el usuario', 'Error');
                        this.isLoading = false;
                        this._changeDetectorRef.markForCheck();
                        console.error('Error deleting user:', error);
                    }
                );
            }
        });
    }

    trackByFn(index: number, item: User): any {
        return item.id || index;
    }
}
