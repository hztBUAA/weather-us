import Vue from 'vue'
import VueRouter from 'vue-router'
import MapView from '../views/MapView.vue'
import LayoutView from "@/views/LayoutView.vue";
import UserView from "@/views/user/UserView.vue";
import ProfileView from "@/views/user/ProfileView.vue";
import ChangePassword from "@/views/user/ChangePassword.vue";
import CitySubsribe from "@/views/user/CitySubsribe.vue";

Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'layout',
            component: LayoutView,
            children: [
                // todo: 默认显示画面
                // {
                //
                // }
                {
                    path: "user",
                    component: UserView,
                    children: [
                        {
                            path: "profile",
                            component: ProfileView,
                            alias: ""
                        },
                        {
                            path: "changePassword",
                            component: ChangePassword
                        },
                        {
                            path: "citySubscribe",
                            component: CitySubsribe
                        }
                    ]
                }
            ]
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../views/AboutView.vue')
        },
        {
            path: '/map',
            name: 'map',
            component: MapView
        }
    ]
})

export default router
