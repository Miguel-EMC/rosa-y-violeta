import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    TemplateRef,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {MatDrawerToggleResult} from "@angular/material/sidenav";
import {ClientsListComponent} from "../list/list.component";
import {Subject} from "rxjs";
import {OverlayRef} from "@angular/cdk/overlay";


@Component({
    selector       : 'clients-details',
    templateUrl    : './details.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports        : [

    ],
})
export class ClientsDetailsComponent {
    @ViewChild('tagsPanel') private _tagsPanel: TemplateRef<any>;
    @ViewChild('tagsPanelOrigin') private _tagsPanelOrigin: ElementRef;
    editMode = false;

    private _tagsPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    //
    /**
     * Constructor
     */
    constructor(
        private _clientsListComponent: ClientsListComponent,
        private  _changeDetectorRef: ChangeDetectorRef,
        ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this._clientsListComponent.matDrawer.open();

    }


    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();

        // Dispose the overlays if they are still on the DOM
        if ( this._tagsPanelOverlayRef )
        {
            this._tagsPanelOverlayRef.dispose();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Close the drawer
     */
    closeDrawer(): Promise<MatDrawerToggleResult>
    {
        return this._clientsListComponent.matDrawer.close();
    }

    /**
     * Toggle edit mode
     *
     * @param editMode
     */
    toggleEditMode(editMode: boolean | null = null): void
    {
        if ( editMode === null )
        {
            this.editMode = !this.editMode;
        }
        else
        {
            this.editMode = editMode;
        }

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    // /**
    //  * Update the contact
    //  */
    // updateContact(): void
    // {
    //     // Get the contact object
    //     const contact = this.contactForm.getRawValue();
    //
    //     // Go through the contact object and clear empty values
    //     contact.emails = contact.emails.filter(email => email.email);
    //
    //     contact.phoneNumbers = contact.phoneNumbers.filter(phoneNumber => phoneNumber.phoneNumber);
    //
    //     // Update the contact on the server
    //     this._contactsService.updateContact(contact.id, contact).subscribe(() =>
    //     {
    //         // Toggle the edit mode off
    //         this.toggleEditMode(false);
    //     });
    // }

    // /**
    //  * Delete the contact
    //  */
    // deleteContact(): void
    // {
    //     // Open the confirmation dialog
    //     const confirmation = this._fuseConfirmationService.open({
    //         title  : 'Delete contact',
    //         message: 'Are you sure you want to delete this contact? This action cannot be undone!',
    //         actions: {
    //             confirm: {
    //                 label: 'Delete',
    //             },
    //         },
    //     });
    //
    //     // Subscribe to the confirmation dialog closed action
    //     confirmation.afterClosed().subscribe((result) =>
    //     {
    //         // If the confirm button pressed...
    //         if ( result === 'confirmed' )
    //         {
    //             // Get the current contact's id
    //             const id = this.contact.id;
    //
    //             // Get the next/previous contact's id
    //             const currentContactIndex = this.contacts.findIndex(item => item.id === id);
    //             const nextContactIndex = currentContactIndex + ((currentContactIndex === (this.contacts.length - 1)) ? -1 : 1);
    //             const nextContactId = (this.contacts.length === 1 && this.contacts[0].id === id) ? null : this.contacts[nextContactIndex].id;
    //
    //             // Delete the contact
    //             this._contactsService.deleteContact(id)
    //                 .subscribe((isDeleted) =>
    //                 {
    //                     // Return if the contact wasn't deleted...
    //                     if ( !isDeleted )
    //                     {
    //                         return;
    //                     }
    //
    //                     // Navigate to the next contact if available
    //                     if ( nextContactId )
    //                     {
    //                         this._router.navigate(['../', nextContactId], {relativeTo: this._activatedRoute});
    //                     }
    //                     // Otherwise, navigate to the parent
    //                     else
    //                     {
    //                         this._router.navigate(['../'], {relativeTo: this._activatedRoute});
    //                     }
    //
    //                     // Toggle the edit mode off
    //                     this.toggleEditMode(false);
    //                 });
    //
    //             // Mark for check
    //             this._changeDetectorRef.markForCheck();
    //         }
    //     });
    //
    // }




    /**
     * Open tags panel
     */
    openTagsPanel(): void
    {
        // // Create the overlay
        // this._tagsPanelOverlayRef = this._overlay.create({
        //     backdropClass   : '',
        //     hasBackdrop     : true,
        //     scrollStrategy  : this._overlay.scrollStrategies.block(),
        //     positionStrategy: this._overlay.position()
        //         .flexibleConnectedTo(this._tagsPanelOrigin.nativeElement)
        //         .withFlexibleDimensions(true)
        //         .withViewportMargin(64)
        //         .withLockedPosition(true)
        //         .withPositions([
        //             {
        //                 originX : 'start',
        //                 originY : 'bottom',
        //                 overlayX: 'start',
        //                 overlayY: 'top',
        //             },
        //         ]),
        // });
        //
        // // Subscribe to the attachments observable
        // this._tagsPanelOverlayRef.attachments().subscribe(() =>
        // {
        //     // Add a class to the origin
        //     this._renderer2.addClass(this._tagsPanelOrigin.nativeElement, 'panel-opened');
        //
        //     // Focus to the search input once the overlay has been attached
        //     this._tagsPanelOverlayRef.overlayElement.querySelector('input').focus();
        // });
        //
        // // Create a portal from the template
        // const templatePortal = new TemplatePortal(this._tagsPanel, this._viewContainerRef);
        //
        // // Attach the portal to the overlay
        // this._tagsPanelOverlayRef.attach(templatePortal);
        //
        // // Subscribe to the backdrop click
        // this._tagsPanelOverlayRef.backdropClick().subscribe(() =>
        // {
        //     // Remove the class from the origin
        //     this._renderer2.removeClass(this._tagsPanelOrigin.nativeElement, 'panel-opened');
        //
        //     // If overlay exists and attached...
        //     if ( this._tagsPanelOverlayRef && this._tagsPanelOverlayRef.hasAttached() )
        //     {
        //         // Detach it
        //         this._tagsPanelOverlayRef.detach();
        //
        //         // Reset the tag filter
        //         this.filteredTags = this.tags;
        //
        //         // Toggle the edit mode off
        //         this.tagsEditMode = false;
        //     }
        //
        //     // If template portal exists and attached...
        //     if ( templatePortal && templatePortal.isAttached )
        //     {
        //         // Detach it
        //         templatePortal.detach();
        //     }
        // });
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
