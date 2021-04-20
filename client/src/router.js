import Vue from 'vue'
import Router from 'vue-router'
import store from './store/index'
import Cookies from 'js-cookie'
import home from './views/home.vue'
import notexist from './views/404.vue'
import login from './views/login.vue'
import signup from './views/signup.vue'
import dashboard from './views/dashboard.vue'
import validation from './views/validation.vue'
import resetpass from './views/resetpass.vue'
import sendreset from './views/resetpassword.vue'
import membership from './views/membership.vue'
import users from './views/users.vue'
import workgroups from './views/workgroups.vue'
import workgroup from './views/workgroup.vue'
import interests from './views/interests.vue'
import tasks from './views/tasks.vue'
import task from './views/task.vue'
import questions from './views/questions.vue'
import user from './views/user.vue'
import configuration from './views/configuration.vue'
import termsandcond from './views/termsandconditions.vue'
import privacypolicy from './views/privacypolicy.vue'
import cookiespolicy from './views/cookiespolicy.vue'

Vue.use(Router)

const router = new Router({
    mode:'history',
    routes:[
        {
            path: '*',
            redirect: '/404'
        },
        {
            path: '/404',
            name:'404',
            component: notexist
        },
        {
            path: '/validation/:token',
            name: 'validation',
            component: validation
        },
        {
            path: '/',
            name: 'home',
            component: home
        },
        {
            path: '/cookies-policy',
            name: 'cookiespolicy',
            component: cookiespolicy
        },
        {
            path: '/privacy-policy',
            name: 'privacypolicy',
            component: privacypolicy
        },
        {
            path: '/terms-and-conditions',
            name: 'termsandcond',
            component: termsandcond
        },
        {
            path: '/login',
            name:'login',
            component: login,
            meta:{
                withoutAuth: true,
            }
        },
        {
            path:'/signup',
            name: 'signup',
            component: signup,
            meta:{
                withoutAuth: true,
            }
        },
        {
            path:'/reset/password/:token',
            name: 'resetpass',
            component: resetpass,
            meta:{
                withoutAuth: true,
            }
        },
        {
            path:'/sendreset',
            name: 'sendreset',
            component: sendreset,
            meta:{
                withoutAuth: true,
            }
        },
        {
            path:'/dashboard',
            name: 'dashboard',
            component: dashboard,
            meta:{
                requiresAuth: true
            }
        },
        {
            path:'/membership',
            name: 'membership',
            component: membership,
            meta:{
                requiresAuth: true,
                validRol:true
            }
        },
        {
            path:'/users',
            name: 'users',
            component: users,
            meta:{
                requiresAuth: true,
                validRol:true
            }
        },
        {
            path:'/workgroups',
            name: 'workgroups',
            component: workgroups,
            meta:{
                requiresAuth: true,
                validRol:true
            }
        },
        {
            path:'/tasks',
            name: 'tasks',
            component: tasks,
            meta:{
                requiresAuth: true,
                validRol:true
            }
        },
        {
            path:'/interests',
            name: 'interests',
            component: interests,
            meta:{
                requiresAuth: true,
                validRol:true
            }
        },
        {
            path:'/questions',
            name: 'questions',
            component: questions,
            meta:{
                requiresAuth: true,
                validRol:true
            }
        },
        {
            path:'/workgroups/:id',
            name: 'workgroup',
            component: workgroup,
            meta:{
                requiresAuth: true,
                isUser:true
            }
        },
        {
            path:'/users/:id',
            name: 'user',
            component: user,
            meta:{
                requiresAuth: true,
                isUser:true
            }
        },
        {
            path:'/tasks/:id',
            name: 'task',
            component: task,
            meta:{
                requiresAuth: true,
                isUser:true
            }
        },
        {
            path:'/config',
            name:'config',
            component: configuration,
            meta: {
                requiresAuth: true,
                validRol: true
            }
        }
    ]
});

router.beforeEach((to,from,next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (Cookies.get('catapa-jwt') == undefined) {
            next({
                path: "/login"
            })
        } else {
            next()
        }
    } else {
        next()
    }
    if(to.matched.some(record => record.meta.withoutAuth)) {
        if(Cookies.get('catapa-jwt') != undefined) {
            next({
                path:"/dashboard"
            })
        } else {
            next()
        }
    } else {
        next()
    }
    if(to.matched.some(record => record.meta.validRol)) {
        let validRoles = []
        let menu = store.state.menu.menu.links.find(element => to.path.includes(element.link))
        validRoles = menu.roles
        if(validRoles.includes(store.state.user.loginuser.rol.value)){
            next()
        }else {
            next({
                path:"/404"
            })
        }
    }
    else {
        next()
    }
    if(to.matched.some(record => record.meta.isUser)) {
        if(store.state.user.loginuser.rol.value != 'user' || store.state.user.loginuser.id == to.params.id){
            next()
        }else{
            next({path:"/404"})
        }
    }
})

export default router