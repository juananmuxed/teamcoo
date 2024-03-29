import Vue from 'vue'
import Router from 'vue-router'
import store from './store/index'
import Cookies from 'js-cookie'
import home from './views/Home.vue'
import notexist from './views/404.vue'
import login from './views/Login.vue'
import signup from './views/Signup.vue'
import dashboard from './views/Dashboard.vue'
import validation from './views/Validation.vue'
import resetpass from './views/ResetPass.vue'
import sendreset from './views/ResetPassword.vue'
import membership from './views/Membership.vue'
import users from './views/Users.vue'
import user from './views/User.vue'
import workgroups from './views/Workgroups.vue'
import privateworkgroups from './views/PrivateWorkgroups.vue'
import workgroup from './views/Workgroup.vue'
import tasks from './views/Tasks.vue'
import task from './views/Task.vue'
import questions from './views/Questions.vue'
import interests from './views/Interests.vue'
import configuration from './views/Configuration.vue'
import staticPage from './views/pages/Static.vue'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '*',
            redirect: '/404'
        },
        {
            path: '/404',
            name: '404',
            component: notexist,
            meta: { title: 'Not Found' }
        },
        {
            path: '/validation/:token',
            name: 'validation',
            component: validation,
            meta: { title: 'Validation Email' }
        },
        {
            path: '/',
            name: 'home',
            component: home,
            meta: { title: 'Home' }
        },
        {
            path: '/page/:slug',
            name: 'page',
            component: staticPage
        },
        {
            path: '/login',
            name: 'login',
            component: login,
            meta: {
                withoutAuth: true,
                title: 'Login'
            }
        },
        {
            path: '/signup',
            name: 'signup',
            component: signup,
            meta: {
                withoutAuth: true,
                title: 'Sign Up'
            }
        },
        {
            path: '/reset/password/:token',
            name: 'resetpass',
            component: resetpass,
            meta: {
                withoutAuth: true,
                title: 'Reset Password'
            }
        },
        {
            path: '/sendreset',
            name: 'sendreset',
            component: sendreset,
            meta: {
                withoutAuth: true,
                title: 'Password recovery'
            }
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: dashboard,
            meta: {
                requiresAuth: true,
                title: 'Dashboard'
            }
        },
        {
            path: '/membership',
            name: 'membership',
            component: membership,
            meta: {
                requiresAuth: true,
                validRol: true,
                title: 'Membership'
            }
        },
        {
            path: '/users',
            name: 'users',
            component: users,
            meta: {
                requiresAuth: true,
                validRol: true,
                title: 'Users'
            }
        },
        {
            path: '/workgroups',
            name: 'workgroups',
            component: workgroups,
            meta: {
                requiresAuth: true,
                validRol: true,
                title: 'Workgroups'
            }
        },
        {
            path: '/privateworkgroups',
            name: 'privateworkgroups',
            component: privateworkgroups,
            meta: {
                requiresAuth: true,
                validRol: true,
                title: 'Private Workgroups'
            }
        },
        {
            path: '/tasks',
            name: 'tasks',
            component: tasks,
            meta: {
                requiresAuth: true,
                validRol: true,
                title: 'Tasks'
            }
        },
        {
            path: '/interests',
            name: 'interests',
            component: interests,
            meta: {
                requiresAuth: true,
                validRol: true,
                title: 'Interests'
            }
        },
        {
            path: '/questions',
            name: 'questions',
            component: questions,
            meta: {
                requiresAuth: true,
                validRol: true,
                title: 'Questions'
            }
        },
        {
            path: '/workgroups/:id',
            name: 'workgroup',
            component: workgroup,
            meta: {
                requiresAuth: true,
                isUser: true,
                title: 'Workgroup'
            }
        },
        {
            path: '/users/:id',
            name: 'user',
            component: user,
            meta: {
                requiresAuth: true,
                isUser: true,
                title: 'User'
            }
        },
        {
            path: '/tasks/:id',
            name: 'task',
            component: task,
            meta: {
                requiresAuth: true,
                isUser: true,
                title: 'Task'
            }
        },
        {
            path: '/config',
            name: 'config',
            component: configuration,
            meta: {
                requiresAuth: true,
                validRol: true,
                title: 'Configuration'
            }
        }
    ]
});

router.beforeEach(async (to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (Cookies.get('teamcoo-jwt') == undefined) {
            await store.dispatch('user/expiredLogOut');
        } else {
            next()
        }
    } else {
        next()
    }
    if (to.matched.some(record => record.meta.withoutAuth)) {
        if (Cookies.get('teamcoo-jwt') != undefined) {
            next({
                path: "/dashboard"
            })
        } else {
            next()
        }
    } else {
        next()
    }
    if (to.matched.some(record => record.meta.validRol)) {
        let validRoles = []
        let menu = store.state.menu.menu.links.find(element => to.path.includes(element.link))
        validRoles = menu.roles
        if (validRoles.includes(store.state.user.loginUser.rol.value)) {
            next()
        } else {
            next({
                path: "/404"
            })
        }
    }
    else {
        next()
    }
    if (to.matched.some(record => record.meta.isUser)) {
        if (store.state.user.loginUser.rol.value != 'user' || store.state.user.loginUser._id == to.params.id) {
            next()
        } else {
            next({ path: "/404" })
        }
    }
});

router.afterEach(async (to, from) => {
    if (!from.name) {
        await store.dispatch('menu/getWebName')
    }
    let title = store.state.menu.web.name + ' |';
    if (to.meta.title) {
        title += ' ' + to.meta.title
    }
    if (to.params.slug) {
        let slugTitle = to.params.slug.split('-').join(' ')
        title += ' ' + slugTitle.charAt(0).toUpperCase() + slugTitle.slice(1)
    }
    document.title = title;
})

export default router