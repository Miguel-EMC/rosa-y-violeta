import { TextFieldModule } from '@angular/cdk/text-field';
import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { UserService } from 'app/services/user.service';
import {NgClass, NgIf} from "@angular/common";
import {MatCardModule} from "@angular/material/card";

@Component({
    selector       : 'settings-account',
    templateUrl    : './account.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatIconModule, MatInputModule, TextFieldModule, MatSelectModule, MatOptionModule, MatButtonModule, MatSlideToggleModule, NgClass, MatCardModule, NgIf],
})
export class SettingsAccountComponent implements OnInit
{
    accountForm: UntypedFormGroup;
    userId: number;
    saveStatus: 'success' | 'error' | null = null;
    statusMessage: string = '';
    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _userService: UserService,
        private _changeDetectorRef: ChangeDetectorRef
    )
    {
        const userData = localStorage.getItem('userData');
        if (userData) {
            this.userId = JSON.parse(userData).id;
        }

        // Initialize the form with only the fields we have
        this.accountForm = this._formBuilder.group({
            username  : ['', Validators.required],
            email     : ['', [Validators.required, Validators.email]],
            role      : [{value: '', disabled: true}], // Read-only field
            is_active : [{value: true, disabled: true}] // Read-only field
        });
    }

    ngOnInit(): void
    {
        // Fetch user data by ID
        if (this.userId) {
            this._userService.getUserById(this.userId).subscribe(
                (user) => {
                    // Update form with user data
                    this.accountForm.patchValue({
                        username: user.username,
                        email: user.email,
                        role: user.role,
                        is_active: user.is_active
                    });
                    this._changeDetectorRef.markForCheck();
                },
                (error) => {
                    console.error('Error fetching user data:', error);
                }
            );
        }
    }

    saveUserData(): void {
        if (this.accountForm.invalid) {
            return;
        }

        const userData = {
            username: this.accountForm.value.username,
            email: this.accountForm.value.email
        };

        this._userService.updateUser(this.userId, userData).subscribe(
            (response) => {
                const userData = localStorage.getItem('userData');
                if (userData) {
                    const updatedData = JSON.parse(userData);
                    updatedData.username = response.username;
                    updatedData.email = response.email;
                    localStorage.setItem('userData', JSON.stringify(updatedData));
                }
                this.saveStatus = 'success';
                this.statusMessage = 'Perfil actualizado correctamente';
                this._changeDetectorRef.markForCheck();
                setTimeout(() => {
                    this.saveStatus = null;
                    this._changeDetectorRef.markForCheck();
                }, 3000);
            },
            (error) => {
                this.saveStatus = 'error';
                this.statusMessage = 'Error al actualizar el perfil. Inténtalo de nuevo.';
                this._changeDetectorRef.markForCheck();
                console.error('Error updating user data', error);
            }
        );
    }
}
