import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { ClientsComponent } from 'app/modules/admin/apps/clients/clients.component';
import { catchError, throwError } from 'rxjs';
import {ClientsService} from "../../../../services/clients.service";
import {ClientsDetailsComponent} from "./details/details.component";
import {ClientsListComponent} from "./list/list.component";

/**
 * Client resolver
 *
 * @param route
 * @param state
 */
const clientResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) =>
{
    const clientsService = inject(ClientsService);
    const router = inject(Router);
    const clientId = parseInt(route.params['id'], 10);

    return clientsService.getClientById(clientId)
        .pipe(
            catchError((error) =>
            {
                console.error(error);
                const parentUrl = state.url.split('/').slice(0, -1).join('/');
                router.navigateByUrl(parentUrl);
                return throwError(error);
            }),
        );
};

/**
 * Can deactivate clients details
 *
 * @param component
 * @param currentRoute
 * @param currentState
 * @param nextState
 */
const canDeactivateClientsDetails = (
    component: ClientsDetailsComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot) =>
{
    // Get the next route
    let nextRoute: ActivatedRouteSnapshot = nextState.root;
    while ( nextRoute.firstChild )
    {
        nextRoute = nextRoute.firstChild;
    }

    // If the next state doesn't contain '/clients'
    // it means we are navigating away from the
    // clients app
    if ( !nextState.url.includes('/clients') )
    {
        // Let it navigate
        return true;
    }

    // If we are navigating to another client...
    if ( nextRoute.paramMap.get('id') )
    {
        // Just navigate
        return true;
    }

    // Otherwise, close the drawer first, and then navigate
    return component.closeDrawer().then(() => true);
};

export default [
    {
        path     : '',
        component: ClientsComponent,
        resolve  : {
            clients : () => inject(ClientsService).getClients(),
        },
        children : [
            {
                path     : '',
                component: ClientsListComponent,
                resolve  : {
                    clients : () => inject(ClientsService).getClients(),
                },
                children : [
                    {
                        path         : ':id',
                        component    : ClientsDetailsComponent,
                        resolve      : {
                            client  : clientResolver,
                        },
                        canDeactivate: [canDeactivateClientsDetails],
                    },
                ],
            },
        ],
    },
] as Routes;
