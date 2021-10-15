import { createRouter, createWebHashHistory } from 'vue-router';
import { projectAuth } from '../firebase/config';

// route level code-splitting
// this generates a separate chunk (about.[hash].js) for this route
// which is lazy-loaded when the route is visited.
const AboutPage = () => import(/* webpackChunkName: "about" */ '../views/About.vue');
const Homepage = () => import(/* webpackChunkName: "otherhomepage" */ '../views/Home.vue');

// Halaman login
const LoginPage = () => import(/* webpackChunkName: "login-page" */ '../views/auth/LoginPage.vue');
const SignUpPage = () => import(/* webpackChunkName: "signup-page" */ '../views/auth/SignUp.vue');
const CreatePlaylist = () =>
    import(/* webpackChunkName: "create-playlist" */ '../views/playlist/CreatePlaylist.vue');
const PlaylistDetail = () =>
    import(/* webpackChunkName: "detail-playlist" */ '../views/playlist/PlaylistDetails.vue');

const UserPlaylist = () =>
    import(/* webpackChunkName: "user-playlist" */ '../views/playlist/UserPlaylist.vue');

// router guard
const requireAuth = (to, from, next) => {
    const userdata = projectAuth.currentUser;
    if (!userdata) {
        next({ name: 'Login' });
    } else {
        next();
    }
};

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Homepage,
        beforeEnter: requireAuth,
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginPage,
    },
    {
        path: '/signup',
        name: 'Signup',
        component: SignUpPage,
    },
    {
        path: '/playlists/create',
        name: 'CreatePlaylist',
        component: CreatePlaylist,
        beforeEnter: requireAuth,
    },
    {
        path: '/playlists/:id',
        name: 'PlaylistDetail',
        component: PlaylistDetail,
        beforeEnter: requireAuth,
        props: true,
    },
    {
        path: '/playlists/user',
        name: 'UserPlaylist',
        component: UserPlaylist,
        beforeEnter: requireAuth,
    },
    {
        path: '/about',
        name: 'About',
        component: AboutPage,
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
