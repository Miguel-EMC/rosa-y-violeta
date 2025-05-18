/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    //!DashBoard
    {
        id      : 'dashboards',
        title   : 'Dashboards',
        subtitle: 'Dashboards Principales de Corset Rosa y Violeta',
        type    : 'group',
        icon    : 'heroicons_outline:home',
        children: [
            {
                id   : 'dashboards.project',
                title: 'Principal Dashboard',
                subtitle: 'Dashboard Principal de Corset Rosa y Violeta',
                type : 'basic',
                icon : 'heroicons_outline:clipboard-document-check',
                link : '/dashboards/project',
            },
            // {
            //     id   : 'dashboards.analytics',
            //     title: 'Analisis de Datos',
            //     type : 'basic',
            //     icon : 'heroicons_outline:chart-pie',
            //     link : '/dashboards/analytics',
            // },
            // {
            //     id   : 'dashboards.finance',
            //     title: 'Finanzas y Contabilidad',
            //     type : 'basic',
            //     icon : 'heroicons_outline:banknotes',
            //     link : '/dashboards/finance',
            // },
        ],
    },
    {
        id      : 'apps',
        title   : 'Clientes e Inventario',
        subtitle: 'Aplicaciones de Clientes e Inventario de Corset Rosa y Violeta',
        type    : 'group',
        icon    : 'heroicons_outline:home',
        children: [
            {
                id   : 'apps.ecommerce.inventory',
                title: 'Inventario de Productos',
                type    : 'basic',
                icon    : 'heroicons_outline:shopping-cart',
                link : '/apps/ecommerce/inventory',
            },
            {
                id   : 'apps.clients',
                title: 'Ordenes de Clientes',
                subtitle: 'Ordenes de Clientes de Corset Rosa y Violeta',
                type : 'basic',
                icon : 'heroicons_outline:user-group',
                link : '/apps/clients',
            }
        ],
    },
    //!Pages
    {
        id      : 'pages',
        title   : 'Explorar',
        type    : 'group',
        icon    : 'heroicons_outline:document',
        children: [

            {
                id      : 'pages.invoice',
                title   : 'Categorías y Marcas',
                subtitle: 'Gestión de categorías y marcas de Corset Rosa y Violeta',
                type    : 'basic',
                icon    : 'heroicons_outline:swatch',
                link : '/apps/explorer',
            },
            // {
            //     id   : 'pages.maintenance',
            //     title: 'Maintenance',
            //     type : 'basic',
            //     icon : 'heroicons_outline:exclamation-triangle',
            //     link : '/pages/maintenance',
            // },
            // {
            //     id      : 'pages.pricing',
            //     title   : 'Pricing',
            //     type    : 'collapsable',
            //     icon    : 'heroicons_outline:banknotes',
            //     children: [
            //         {
            //             id   : 'pages.pricing.modern',
            //             title: 'Modern',
            //             type : 'basic',
            //             link : '/pages/pricing/modern',
            //         },
            //         {
            //             id   : 'pages.pricing.simple',
            //             title: 'Simple',
            //             type : 'basic',
            //             link : '/pages/pricing/simple',
            //         },
            //         {
            //             id   : 'pages.pricing.single',
            //             title: 'Single',
            //             type : 'basic',
            //             link : '/pages/pricing/single',
            //         },
            //         {
            //             id   : 'pages.pricing.table',
            //             title: 'Table',
            //             type : 'basic',
            //             link : '/pages/pricing/table',
            //         },
            //     ],
            // },
            // {
            //     id   : 'pages.profile',
            //     title: 'Profile',
            //     type : 'basic',
            //     icon : 'heroicons_outline:user-circle',
            //     link : '/pages/profile',
            // },
            // {
            //     id   : 'pages.settings',
            //     title: 'Settings',
            //     type : 'basic',
            //     icon : 'heroicons_outline:cog-8-tooth',
            //     link : '/pages/settings',
            // },
        ],
    },
   //!UI
    /*{
        id      : 'user-interface',
        title   : 'User Interface',
        subtitle: 'Building blocks of the UI & UX',
        type    : 'group',
        icon    : 'heroicons_outline:rectangle-stack',
        children: [
            {
                id   : 'user-interface.material-components',
                title: 'Material Components',
                type : 'basic',
                icon : 'heroicons_outline:square-3-stack-3d',
                link : '/ui/material-components',
            },
            {
                id   : 'user-interface.fuse-components',
                title: 'Fuse Components',
                type : 'basic',
                icon : 'heroicons_outline:square-3-stack-3d',
                link : '/ui/fuse-components',
            },
            {
                id   : 'user-interface.other-components',
                title: 'Other Components',
                type : 'basic',
                icon : 'heroicons_outline:square-3-stack-3d',
                link : '/ui/other-components',
            },
            {
                id   : 'user-interface.tailwindcss',
                title: 'TailwindCSS',
                type : 'basic',
                icon : 'heroicons_outline:sparkles',
                link : '/ui/tailwindcss',
            },
            {
                id   : 'user-interface.advanced-search',
                title: 'Advanced Search',
                type : 'basic',
                icon : 'heroicons_outline:magnifying-glass-circle',
                link : '/ui/advanced-search',
            },
            {
                id   : 'user-interface.animations',
                title: 'Animations',
                type : 'basic',
                icon : 'heroicons_outline:play',
                link : '/ui/animations',
            },
            {
                id   : 'user-interface.cards',
                title: 'Cards',
                type : 'basic',
                icon : 'heroicons_outline:square-2-stack',
                link : '/ui/cards',
            },
            {
                id   : 'user-interface.colors',
                title: 'Colors',
                type : 'basic',
                icon : 'heroicons_outline:swatch',
                link : '/ui/colors',
            },
            {
                id   : 'user-interface.confirmation-dialog',
                title: 'Confirmation Dialog',
                type : 'basic',
                icon : 'heroicons_outline:question-mark-circle',
                link : '/ui/confirmation-dialog',
            },
            {
                id   : 'user-interface.datatable',
                title: 'Datatable',
                type : 'basic',
                icon : 'heroicons_outline:table-cells',
                link : '/ui/datatable',
            },
            {
                id      : 'user-interface.forms',
                title   : 'Forms',
                type    : 'collapsable',
                icon    : 'heroicons_outline:pencil-square',
                children: [
                    {
                        id   : 'user-interface.forms.fields',
                        title: 'Fields',
                        type : 'basic',
                        link : '/ui/forms/fields',
                    },
                    {
                        id   : 'user-interface.forms.layouts',
                        title: 'Layouts',
                        type : 'basic',
                        link : '/ui/forms/layouts',
                    },
                    {
                        id   : 'user-interface.forms.wizards',
                        title: 'Wizards',
                        type : 'basic',
                        link : '/ui/forms/wizards',
                    },
                ],
            },
            {
                id      : 'user-interface.icons',
                title   : 'Icons',
                type    : 'collapsable',
                icon    : 'heroicons_outline:bolt',
                children: [
                    {
                        id   : 'user-interface.icons.heroicons-outline',
                        title: 'Heroicons Outline',
                        type : 'basic',
                        link : '/ui/icons/heroicons-outline',
                    },
                    {
                        id   : 'user-interface.icons.heroicons-solid',
                        title: 'Heroicons Solid',
                        type : 'basic',
                        link : '/ui/icons/heroicons-solid',
                    },
                    {
                        id   : 'user-interface.icons.heroicons-mini',
                        title: 'Heroicons Mini',
                        type : 'basic',
                        link : '/ui/icons/heroicons-mini',
                    },
                    {
                        id   : 'user-interface.icons.material-twotone',
                        title: 'Material Twotone',
                        type : 'basic',
                        link : '/ui/icons/material-twotone',
                    },
                    {
                        id   : 'user-interface.icons.material-outline',
                        title: 'Material Outline',
                        type : 'basic',
                        link : '/ui/icons/material-outline',
                    },
                    {
                        id   : 'user-interface.icons.material-solid',
                        title: 'Material Solid',
                        type : 'basic',
                        link : '/ui/icons/material-solid',
                    },
                    {
                        id   : 'user-interface.icons.feather',
                        title: 'Feather',
                        type : 'basic',
                        link : '/ui/icons/feather',
                    },
                ],
            },
            {
                id      : 'user-interface.page-layouts',
                title   : 'Page Layouts',
                type    : 'collapsable',
                icon    : 'heroicons_outline:rectangle-group',
                children: [
                    {
                        id   : 'user-interface.page-layouts.overview',
                        title: 'Overview',
                        type : 'basic',
                        link : '/ui/page-layouts/overview',
                    },
                    {
                        id   : 'user-interface.page-layouts.empty',
                        title: 'Empty',
                        type : 'basic',
                        link : '/ui/page-layouts/empty',
                    },
                    {
                        id: 'user-interface.page-layouts.carded',

                        title   : 'Carded',
                        type    : 'collapsable',
                        children: [
                            {
                                id   : 'user-interface.page-layouts.carded.fullwidth',
                                title: 'Fullwidth',
                                type : 'basic',
                                link : '/ui/page-layouts/carded/fullwidth',
                            },
                            {
                                id   : 'user-interface.page-layouts.carded.left-sidebar-1',
                                title: 'Left Sidebar #1',
                                type : 'basic',
                                link : '/ui/page-layouts/carded/left-sidebar-1',
                            },
                            {
                                id   : 'user-interface.page-layouts.carded.left-sidebar-2',
                                title: 'Left Sidebar #2',
                                type : 'basic',
                                link : '/ui/page-layouts/carded/left-sidebar-2',
                            },
                            {
                                id   : 'user-interface.page-layouts.carded.right-sidebar-1',
                                title: 'Right Sidebar #1',
                                type : 'basic',
                                link : '/ui/page-layouts/carded/right-sidebar-1',
                            },
                            {
                                id   : 'user-interface.page-layouts.carded.right-sidebar-2',
                                title: 'Right Sidebar #2',
                                type : 'basic',
                                link : '/ui/page-layouts/carded/right-sidebar-2',
                            },
                        ],
                    },
                    {
                        id      : 'user-interface.page-layouts.simple',
                        title   : 'Simple',
                        type    : 'collapsable',
                        children: [
                            {
                                id   : 'user-interface.page-layouts.simple.fullwidth-1',
                                title: 'Fullwidth #1',
                                type : 'basic',
                                link : '/ui/page-layouts/simple/fullwidth-1',
                            },
                            {
                                id   : 'user-interface.page-layouts.simple.fullwidth-2',
                                title: 'Fullwidth #2',
                                type : 'basic',
                                link : '/ui/page-layouts/simple/fullwidth-2',
                            },
                            {
                                id   : 'user-interface.page-layouts.simple.left-sidebar-1',
                                title: 'Left Sidebar #1',
                                type : 'basic',
                                link : '/ui/page-layouts/simple/left-sidebar-1',
                            },
                            {
                                id   : 'user-interface.page-layouts.simple.left-sidebar-2',
                                title: 'Left Sidebar #2',
                                type : 'basic',
                                link : '/ui/page-layouts/simple/left-sidebar-2',
                            },
                            {
                                id   : 'user-interface.page-layouts.simple.left-sidebar-3',
                                title: 'Left Sidebar #3',
                                type : 'basic',
                                link : '/ui/page-layouts/simple/left-sidebar-3',
                            },
                            {
                                id   : 'user-interface.page-layouts.simple.right-sidebar-1',
                                title: 'Right Sidebar #1',
                                type : 'basic',
                                link : '/ui/page-layouts/simple/right-sidebar-1',
                            },
                            {
                                id   : 'user-interface.page-layouts.simple.right-sidebar-2',
                                title: 'Right Sidebar #2',
                                type : 'basic',
                                link : '/ui/page-layouts/simple/right-sidebar-2',
                            },
                            {
                                id   : 'user-interface.page-layouts.simple.right-sidebar-3',
                                title: 'Right Sidebar #3',
                                type : 'basic',
                                link : '/ui/page-layouts/simple/right-sidebar-3',
                            },
                        ],
                    },
                ],
            },
            {
                id   : 'user-interface.typography',
                title: 'Typography',
                type : 'basic',
                icon : 'heroicons_outline:pencil',
                link : '/ui/typography',
            },
        ],
    },
    */
    // {
    //     id  : 'divider-1',
    //     type: 'divider',
    // },
    /*{
        id      : 'documentation',
        title   : 'Documentation',
        subtitle: 'Everything you need to know about Fuse',
        type    : 'group',
        icon    : 'heroicons_outline:information-circle',
        children: [
            {
                id   : 'documentation.changelog',
                title: 'Changelog',
                type : 'basic',
                icon : 'heroicons_outline:megaphone',
                link : '/docs/changelog',
                badge: {
                    title  : '19.0.0',
                    classes: 'px-2 bg-yellow-300 text-black rounded-full',
                },
            },
            {
                id   : 'documentation.guides',
                title: 'Guides',
                type : 'basic',
                icon : 'heroicons_outline:book-open',
                link : '/docs/guides',
            },
            {
                id   : 'user-interface.material-components',
                title: 'Material Components',
                type : 'basic',
                icon : 'heroicons_outline:square-3-stack-3d',
                link : '/ui/material-components',
            },
            {
                id   : 'user-interface.fuse-components',
                title: 'Fuse Components',
                type : 'basic',
                icon : 'heroicons_outline:square-3-stack-3d',
                link : '/ui/fuse-components',
            },
            {
                id   : 'user-interface.other-components',
                title: 'Other Components',
                type : 'basic',
                icon : 'heroicons_outline:square-3-stack-3d',
                link : '/ui/other-components',
            },
        ],
    },
    */
   //!NAVIGATION
    /*{
        id  : 'divider-2',
        type: 'divider',
    },
    {
        id      : 'navigation-features',
        title   : 'Navigation features',
        subtitle: 'Collapsable levels & badge styles',
        type    : 'group',
        icon    : 'heroicons_outline:bars-3',
        children: [
            {
                id      : 'navigation-features.level.0',
                title   : 'Level 0',
                icon    : 'heroicons_outline:check-circle',
                type    : 'collapsable',
                children: [
                    {
                        id      : 'navigation-features.level.0.1',
                        title   : 'Level 1',
                        type    : 'collapsable',
                        children: [
                            {
                                id      : 'navigation-features.level.0.1.2',
                                title   : 'Level 2',
                                type    : 'collapsable',
                                children: [
                                    {
                                        id      : 'navigation-features.level.0.1.2.3',
                                        title   : 'Level 3',
                                        type    : 'collapsable',
                                        children: [
                                            {
                                                id      : 'navigation-features.level.0.1.2.3.4',
                                                title   : 'Level 4',
                                                type    : 'collapsable',
                                                children: [
                                                    {
                                                        id      : 'navigation-features.level.0.1.2.3.4.5',
                                                        title   : 'Level 5',
                                                        type    : 'collapsable',
                                                        children: [
                                                            {
                                                                id   : 'navigation-features.level.0.1.2.3.4.5.6',
                                                                title: 'Level 6',
                                                                type : 'basic',
                                                            },
                                                        ],
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                id      : 'navigation-features.level.0',
                title   : 'Level 0',
                subtitle: 'With subtitle',
                icon    : 'heroicons_outline:check-circle',
                type    : 'collapsable',
                children: [
                    {
                        id   : 'navigation-features.level.0.1-1',
                        title: 'Level 1.1',
                        type : 'basic',
                    },
                    {
                        id   : 'navigation-features.level.0.1-2',
                        title: 'Level 1.2',
                        type : 'basic',
                    },
                ],
            },
            {
                id      : 'navigation-features.active',
                title   : 'Active item',
                subtitle: 'Manually marked as active',
                icon    : 'heroicons_outline:check-circle',
                type    : 'basic',
                active  : true,
            },
            {
                id      : 'navigation-features.disabled-collapsable',
                title   : 'Disabled collapsable',
                subtitle: 'Some subtitle',
                icon    : 'heroicons_outline:check-circle',
                type    : 'collapsable',
                disabled: true,
                children: [
                    {
                        id   : 'navigation-features.disabled-collapsable.child',
                        title: 'You shouldn\'t be able to see this child',
                        type : 'basic',
                    },
                ],
            },
            {
                id      : 'navigation-features.disabled-basic',
                title   : 'Disabled basic',
                subtitle: 'Some subtitle',
                icon    : 'heroicons_outline:check-circle',
                type    : 'basic',
                disabled: true,
            },
            {
                id   : 'navigation-features.badge-style-oval',
                title: 'Oval badge',
                icon : 'heroicons_outline:tag',
                type : 'basic',
                badge: {
                    title  : '8',
                    classes: 'w-5 h-5 bg-teal-400 text-black rounded-full',
                },
            },
            {
                id   : 'navigation-features.badge-style-rectangle',
                title: 'Rectangle badge',
                icon : 'heroicons_outline:tag',
                type : 'basic',
                badge: {
                    title  : 'Updated!',
                    classes: 'px-2 bg-teal-400 text-black rounded',
                },
            },
            {
                id   : 'navigation-features.badge-style-rounded',
                title: 'Rounded badge',
                icon : 'heroicons_outline:tag',
                type : 'basic',
                badge: {
                    title  : 'NEW',
                    classes: 'px-2.5 bg-teal-400 text-black rounded-full',
                },
            },
            {
                id   : 'navigation-features.badge-style-simple',
                title: 'Simple badge',
                icon : 'heroicons_outline:tag',
                type : 'basic',
                badge: {
                    title  : '87 Unread',
                    classes: 'text-teal-500',
                },
            },
            {
                id   : 'navigation-features.multi-line',
                title: 'A multi line navigation item title example which works just fine',
                icon : 'heroicons_outline:check-circle',
                type : 'basic',
            },
        ],
    },
    */
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id      : 'dashboards',
        title   : 'Dashboards',
        tooltip : 'Dashboards',
        type    : 'aside',
        icon    : 'heroicons_outline:home',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'apps',
        title   : 'Apps',
        tooltip : 'Apps',
        type    : 'aside',
        icon    : 'heroicons_outline:qrcode',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'pages',
        title   : 'Pages',
        tooltip : 'Pages',
        type    : 'aside',
        icon    : 'heroicons_outline:document-duplicate',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'user-interface',
        title   : 'UI',
        tooltip : 'UI',
        type    : 'aside',
        icon    : 'heroicons_outline:rectangle-stack',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'navigation-features',
        title   : 'Navigation',
        tooltip : 'Navigation',
        type    : 'aside',
        icon    : 'heroicons_outline:bars-3',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id      : 'dashboards',
        title   : 'DASHBOARDS',
        type    : 'group',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'apps',
        title   : 'APPS',
        type    : 'group',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id   : 'others',
        title: 'OTHERS',
        type : 'group',
    },
    {
        id      : 'pages',
        title   : 'Pages',
        type    : 'aside',
        icon    : 'heroicons_outline:document-duplicate',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'user-interface',
        title   : 'User Interface',
        type    : 'aside',
        icon    : 'heroicons_outline:rectangle-stack',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'navigation-features',
        title   : 'Navigation Features',
        type    : 'aside',
        icon    : 'heroicons_outline:bars-3',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id      : 'dashboards',
        title   : 'Dashboards',
        type    : 'group',
        icon    : 'heroicons_outline:home',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'apps',
        title   : 'Apps',
        type    : 'group',
        icon    : 'heroicons_outline:qrcode',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'pages',
        title   : 'Pages',
        type    : 'group',
        icon    : 'heroicons_outline:document-duplicate',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'user-interface',
        title   : 'UI',
        type    : 'group',
        icon    : 'heroicons_outline:rectangle-stack',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'navigation-features',
        title   : 'Misc',
        type    : 'group',
        icon    : 'heroicons_outline:bars-3',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
];
