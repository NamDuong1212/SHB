import AppLayout from '@/layout/AppLayout.vue';
import initAuth from '@/middleware/auth';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        // Layout chính có bảo vệ bằng middleware
        {
            path: '/',
            component: AppLayout,
            meta: {
                middleware: [initAuth],
                permission: 'DashBoard_Read'
            },
            children: [
                {
                    path: '',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                // === Thiết lập hệ thống ===
                {
                    path: '/co-cau-to-chuc',
                    name: 'co-cau-to-chuc',
                    component: () => import('@/views/pages/ThietLapHeThong/CoCauToChuc/CoCauToChuc/page/index.vue')
                },

                // === Quản lý người dùng ===
                {
                    path: '/danh-muc-nguoi-dung',
                    name: 'danh-muc-nguoi-dung',
                    component: () => import('@/views/pages/QuanLyNguoiDung/page/index.vue')
                },
                {
                    path: '/danh-muc-vai-tro',
                    name: 'danh-muc-vai-tro',
                    component: () => import('@/views/pages/QuanLyVaiTro/page/index.vue')
                },
                // === Quản lý collection ===
                {
                    path: '/danh-sach-collection',
                    name: 'danh-sach-collection',
                    component: () => import('@/views/pages/Collection/page/index.vue')
                },

                // === Quản lý FAQ ===
                {
                    path: '/danh-sach-faq',
                    name: 'danh-sach-faq',
                    component: () => import('@/views/pages/FAQ/page/index.vue')
                },
                {
                    path: '/images',
                    name: 'images',
                    component: () => import('@/views/pages/Images.vue')
                },
                {
                    path: '/files',
                    name: 'files',
                    component: () => import('@/views/pages/FileUpload.vue')
                },
                {
                    path: '/collections',
                    name: 'collections',
                    component: () => import('@/views/pages/Collections.vue')
                },
                {
                    path: '/script-manage',
                    name: 'script-manage',
                    component: () => import('@/views/pages/ScriptManage.vue')
                },
                {
                    path: '/users',
                    name: 'users',
                    component: () => import('@/views/pages/Users.vue')
                },
                // === Trang đặc biệt ===
                {
                    path: 'pages/empty',
                    name: 'empty',
                    component: () => import('@/views/pages/Empty.vue')
                },
                {
                    path: 'pages/crud',
                    name: 'crud',
                    component: () => import('@/views/pages/Crud.vue')
                },
                {
                    path: 'documentation',
                    name: 'documentation',
                    component: () => import('@/views/pages/Documentation.vue')
                },
                {
                    path: '/chat',
                    name: 'chat',
                    component: () => import('@/views/pages/Chat.vue')
                },
            ]
        },

        // === Trang không sử dụng layout ===

        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },

        // === Auth ===
        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/signup',
            name: 'signup',
            component: () => import('@/views/pages/auth/Signup.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        },

        // === Redirect 404 cho route không khớp ===
        {
            path: '/:pathMatch(.*)*',
            redirect: '/pages/notfound'
        }
    ]
});

// function nextFactory(context, middleware, index) {
//     const subsequentMiddleware = middleware[index];
//     if (!subsequentMiddleware) return context.next;
//     return (...parameters) => {
//         context.next(...parameters);

//         const nextMiddleware = nextFactory(context, middleware, index + 1);
//         subsequentMiddleware({ ...context, next: nextMiddleware });
//     };
// }

// router.beforeEach((to, from, next) => {
//     if (to.meta.middleware) {
//         const middleware = Array.isArray(to.meta.middleware) ? to.meta.middleware : [to.meta.middleware];

//         const context = {
//             from,
//             next,
//             router,
//             to
//         };
//         const nextMiddleware = nextFactory(context, middleware, 1);

//         return middleware[0]({ ...context, next: nextMiddleware });
//     }
//     return next();
// });

export default router;
