import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import {ExplorersService} from "./explorers.service";
import {ExplorersDetailsComponent} from "./details/details.component";
import {ExplorersComponent} from "./explorers.component";
import {ExplorersListComponent} from "./list/list.component";

/**
 * Task resolver
 *
 * @param route
 * @param state
 */
const explorerResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) =>
{
    const explorersService = inject(ExplorersService);
    const router = inject(Router);

    return explorersService.getTaskById(route.paramMap.get('id'))
        .pipe(
            // Error here means the requested task is not available
            catchError((error) =>
            {
                // Log the error
                console.error(error);

                // Get the parent url
                const parentUrl = state.url.split('/').slice(0, -1).join('/');

                // Navigate to there
                router.navigateByUrl(parentUrl);

                // Throw an error
                return throwError(error);
            }),
        );
};

/**
 * Can deactivate tasks details
 *
 * @param component
 * @param currentRoute
 * @param currentState
 * @param nextState
 */
const canDeactivateTasksDetails = (
    component: ExplorersDetailsComponent,
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

    // If the next state doesn't contain '/tasks'
    // it means we are navigating away from the
    // tasks app
    if ( !nextState.url.includes('/explorers') )
    {
        // Let it navigate
        return true;
    }

    // If we are navigating to another task...
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
        component: ExplorersComponent,
        resolve  : {
            tags: () => inject(ExplorersService).getTags(),
        },
        children : [
            {
                path     : '',
                component: ExplorersListComponent,
                resolve  : {
                    tasks: () => inject(ExplorersService).getTasks(),
                },
                children : [
                    {
                        path         : ':id',
                        component    : ExplorersDetailsComponent,
                        resolve      : {
                            task: explorerResolver,
                        },
                        canDeactivate: [canDeactivateTasksDetails],
                    },
                ],
            },
        ],
    },
] as Routes;
