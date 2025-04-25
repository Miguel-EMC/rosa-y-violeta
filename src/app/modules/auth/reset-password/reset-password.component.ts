import { NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { finalize } from 'rxjs';

@Component({
    selector     : 'auth-reset-password',
    templateUrl  : './reset-password.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations,
    standalone   : true,
    imports      : [NgIf, FuseAlertComponent, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, RouterLink],
})
export class AuthResetPasswordComponent implements OnInit
{
    @ViewChild('resetPasswordNgForm') resetPasswordNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } | null = null;
    resetPasswordForm: FormGroup;
    loading = false;
    token: string;

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private _route: ActivatedRoute
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.token = this._route.snapshot.queryParams['token'];

        // Create the form
        this.resetPasswordForm = this._formBuilder.group({
            newPassword: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
        }, {
            validators: this.passwordMatchValidator
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Reset password
     */
    resetPassword(): void
    {
        // Return if the form is invalid
        if (this.resetPasswordForm.invalid)
        {
            return;
        }

        // Disable the form
        this.loading = true;

        const { newPassword, confirmPassword } = this.resetPasswordForm.value;

        // Send the request to the server
        this._authService.resetPassword(this.token, newPassword, confirmPassword)
            .pipe(
                finalize(() => this.loading = false)
            )
            .subscribe(
                response => {
                    this.alert = {
                        type: 'success',
                        message: 'La contraseña ha sido restablecida con éxito.'
                    };
                    setTimeout(() => this._router.navigate(['/sign-in']), 3000); // Redirect to login after 3 seconds
                },
                error => {
                    this.alert = {
                        type: 'error',
                        message: 'Hubo un error al restablecer tu contraseña.'
                    };
                }
            );
    }

    /**
     * Validator to check if passwords match
     */
    private passwordMatchValidator(form: UntypedFormGroup): { [key: string]: boolean } | null
    {
        const newPassword = form.get('newPassword')?.value;
        const confirmPassword = form.get('confirmPassword')?.value;
        if (newPassword !== confirmPassword)
        {
            return { 'mismatch': true };
        }
        return null;
    }
}
