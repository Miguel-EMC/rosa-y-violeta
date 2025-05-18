import { Routes } from '@angular/router';
import { ExplorersComponent } from './explorers.component';
import { ExplorersListComponent } from './list/list.component';
import { MarcaFormComponent } from './details/marca-form.component';
import { CategoriaFormComponent } from './details/categoria-form.component';

export default [
    {
        path: '',
        component: ExplorersComponent,
        children: [
            {
                path: '',
                component: ExplorersListComponent,
                children: [
                    {
                        path: 'crear-marca',
                        component: MarcaFormComponent
                    },
                    {
                        path: 'editar-marca/:id',
                        component: MarcaFormComponent
                    },
                    {
                        path: 'crear-categoria',
                        component: CategoriaFormComponent
                    },
                    {
                        path: 'editar-categoria/:id',
                        component: CategoriaFormComponent
                    }
                ]
            }
        ]
    }
] as Routes;
