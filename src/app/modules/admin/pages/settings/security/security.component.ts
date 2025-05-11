import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { UserService } from 'app/services/user.service';
import { MatCardModule } from '@angular/material/card';
import { NgClass, NgIf } from '@angular/common';

@Component({
    selector       : 'settings-security',
    templateUrl    : './security.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports        : [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSlideToggleModule, MatButtonModule, MatCardModule, NgClass, NgIf],
})
export class SettingsSecurityComponent implements OnInit
{
    securityForm: UntypedFormGroup;
    userId: number;
    saveStatus: 'success' | 'error' | null = null;
    statusMessage: string = '';
    hideCurrentPassword: boolean = true;
    hideNewPassword: boolean = true;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _userService: UserService,
        private _changeDetectorRef: ChangeDetectorRef
    ) {
        const userData = localStorage.getItem('userData');
        if (userData) {
            this.userId = JSON.parse(userData).id;
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Create the form
        this.securityForm = this._formBuilder.group({
            currentPassword: ['', Validators.required],
            newPassword: ['', [
                Validators.required,
                Validators.minLength(8),
            ]],
        });
    }

    updatePassword(): void {
        if (this.securityForm.invalid) {
            return;
        }

        const password = this.securityForm.value.newPassword;

        this._userService.updatePassword(this.userId, password).subscribe(
            (response) => {
                this.saveStatus = 'success';
                this.statusMessage = 'Contraseña actualizada correctamente';
                this.securityForm.reset();
                this._changeDetectorRef.markForCheck();

                setTimeout(() => {
                    this.saveStatus = null;
                    this._changeDetectorRef.markForCheck();
                }, 3000);
            },
            (error) => {
                this.saveStatus = 'error';
                this.statusMessage = error.error?.error || 'Error al actualizar la contraseña';
                this._changeDetectorRef.markForCheck();
            }
        );
    }
}
