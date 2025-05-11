/* eslint-disable */
export const shortcuts = [
    {
        id         : 'a1ae91d3-e2cb-459b-9be9-a184694f548b',
        label      : 'Configuración',
        description: 'Configura tu cuenta y la de tu equipo',
        icon       : 'heroicons_outline:cog-6-tooth',
        link       : '/pages/settings',
        useRouter  : true,
    },
    {
        id         : 'f5daf93e-b6f3-4199-8a0c-b951e92a6cb8',
        label      : 'Clientes',
        description: 'Lista de todos los clientes',
        icon       : 'heroicons_outline:user-group',
        link       : '/apps/clients',
        useRouter  : true,
     },
    // {
    //     id         : '989ce876-c177-4d71-a749-1953c477f825',
    //     label      : 'Documentation',
    //     description: 'Getting started',
    //     icon       : 'heroicons_outline:book-open',
    //     link       : '/docs/guides/getting-started/introduction',
    //     useRouter  : true,
    // },
    {
        id         : '0a240ab8-e19d-4503-bf68-20013030d526',
        label      : 'Recargar',
        description: 'Recargar la aplicación',
        icon       : 'heroicons_outline:arrow-path',
        link       : '/dashboards/project',
        useRouter  : false,
    },
    {
        id         : 'b2f7e1d4-5678-4def-9abc-12345fedcba0',
        label      : 'Cerrar sesión',
        description: 'Cerrar sesión de la aplicación',
        icon       : 'heroicons_outline:arrow-right-on-rectangle',
        link       : 'logout',  // Change this to a function name instead of a route
        useRouter  : false,     // Set to false since we'll handle this with a function
    },
];
