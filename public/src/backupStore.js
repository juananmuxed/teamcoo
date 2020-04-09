import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'
import router from '@/router'
import createPersistedState from 'vuex-persistedstate'
import Cookies from 'js-cookie'
import Vuetify from './plugins/vuetify'

Vue.use(Vuex)

const state = {
    menu:{
        active:true,
        drawerMini:true,
        scroll:0,
        upDown:false,
        links:[
            {name:'Dashboard', link:'/dashboard', roles:{} , icon:'fas fa-columns'},
            {name:'Actions', link:'/', roles:{} , icon:'fas fa-calendar'},
            {name:'Users', link:'/', roles:{} , icon:'fas fa-users'},
        ],
        dialogs:{
            login:false,
            logout:false,
            edituser:false
        },
        cookie: false
    },
    loginuser:{
        firstname:'',
        lastname: '',
        username:'',
        email:'',
        rol:{},
        bio:'',
        id:'',
        image:'',
        verifiedemail:null,
        logged: false,
        dark: false
    },
    user:{
        passshow:false,
        password: '',
        email:'',
    },
    newuser:{
        firstname:'',
        lastname: '',
        username:'',
        email:'',
        password:'',
        passwordconfirm:'',
        passshow:false,
        verifiedemail:false,
        accept:{
            termsconditions:false,
            privacycookiepolicy:false
        }
    },
    alert:{
        message:'Message',
        color:'primary',
        icon:'fas fa-user'
    },
    notEditUser:{
        firstname:'',
        lastname: '',
        bio:'',
        image:'',
        imagefile:null,
        rol:{},
    },
    edituser:{
        firstname:'',
        lastname: '',
        id:'',
        bio:'',
        image:'',
        imagefile:null,
        save:false,
        rol:{},
        roles:[
            { name: 'User', value: 'user'},
            { name: 'Volunteer', value: 'volu'},
            { name: 'Coordinator', value: 'coor'},
            { name: 'Director', value: 'dire'},
            { name: 'Member', value: 'memb'},
            { name: 'Admin', value: 'admin'}
        ]
    },
    snackbar:{
        active: false,
        color: 'info',
        message: ''
    },
    rules:{
        required: v => !!v || 'Required',
        emailrules: v => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(v) || 'Invalid e-mail'
        },
        minletter: v => v.length >= 3 || 'At least 3 letters',
        maxbioletter: v => v.length <= 200 || 'Max 200 characters',
        nospaces: v => {
            const pattern = /\s/;
            return !pattern.test(v) || 'No spaces'
        },
        passwordrules: v => {
            const pattern = /^.*(?=.{8,})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/
            return pattern.test(v) || 'Password too weak'
        },
        passwordconfirm: v => {
            if(state.newuser.password == v)  {
                return true
            }
            else{
                return false || 'Passwords must match' 
            }
        },
        notsame: v => {
            if(state.edituser.oldpassword == v) {
                return false || 'Passwords must not match'
            }
            else{
                return true
            }
        },
        acceptchecks: v => !!v || 'Check the policy.'
    },
    actions:[],
    workgroups:[],
    topics:[],
    loader:{
        skeletonLoader:false
    }
}

const getters = {
    isvalid(state){
        if(state.user.password != '' && state.user.email != '' && !state.rules.emailrules(state.user.email)[0]){
            return false
        }
        else{return true}
    },
    signUpIsValid(state){
        if(state.newuser.firstname != '' &&
        state.newuser.lastname != '' &&
        state.newuser.username != '' &&
        state.newuser.passwrod != '' &&
        state.newuser.passwordconfirm != '' &&
        state.newuser.accept.privacycookiepolicy &&
        state.newuser.accept.termsconditions && 
        state.newuser.passwordconfirm == state.newuser.password &&
        !state.rules.emailrules(state.newuser.email)[0] &&
        !state.rules.minletter(state.newuser.username)[0] &&
        !state.rules.nospaces(state.newuser.username)[0] &&
        !state.rules.nospaces(state.newuser.password)[0]){
            return false
        }
        else{return true}
    },
    isChangeUser(state){
        if(
            state.edituser.firstname == state.notEditUser.firstname &&
            state.edituser.lastname == state.notEditUser.lastname &&
            state.edituser.rol.value == state.notEditUser.rol.value &&
            state.edituser.bio == state.notEditUser.bio &&
            state.edituser.image == state.notEditUser.image
        ){
            return false
        }
        else{return true}
    },
    isValidSave(state){
        if(
            state.edituser.firstname != '' &&
            state.edituser.bio.length <= 200
        ){
            return true
        }
        else{
            return false
        }
    },
    isLogged(state){
        if(state.loginuser.logged){
            return true
        }
        else {
            return false
        }
    },
    isDark(){
        if(Vuetify.framework.theme.dark){
            return false
        }
        else{
            return true
        }
    }
}

const mutations = {
    onScroll: (state,value) => {
        state.menu.scroll = value.target.defaultView.scrollY
        if(value.target.defaultView.scrollY != 0){
            state.menu.drawerMini = true
        }
        if(value.target.defaultView.scrollY >= 150){
            state.menu.upDown = true
        }
        else{
            state.menu.upDown = false
        }
    },
    notification: (state, [color,time,message]) => {
        state.snackbar.active = true;
        state.snackbar.color = color;
        state.snackbar.message = message;
        setTimeout(() => {
            state.snackbar.active = false;
        }, time * 1000);
    },
    alert: (state, [color,message,icon]) => {
        state.alert.icon = icon
        state.alert.message = message
        state.alert.color = color
    },
    cookieChange: (state) => {state.menu.cookie = !state.menu.cookie},
    userStore: (state,user) => {
        state.loginuser.username = user.data.username,
        state.loginuser.firstname = user.data.firstname,
        state.loginuser.lastname = user.data.lastname,
        state.loginuser.email = user.data.email,
        state.loginuser.rol = user.data.rol,
        state.loginuser.bio = user.data.bio,
        state.loginuser.id = user.data._id
        state.loginuser.image = user.data.image,
        state.loginuser.verifiedemail = user.data.verifiedemail,
        state.loginuser.logged = true
    },
    usertoedit: (state,user) => {
        state.edituser.firstname = user.data.firstname,
        state.edituser.lastname = user.data.lastname,
        state.edituser.rol = user.data.rol,
        state.edituser.bio = user.data.bio,
        state.edituser.image = user.data.image,
        state.edituser.id = user.data._id,
        state.notEditUser.firstname = user.data.firstname,
        state.notEditUser.lastname = user.data.lastname,
        state.notEditUser.rol = user.data.rol,
        state.notEditUser.bio = user.data.bio,
        state.notEditUser.image = user.data.image
    },
    undoEdit:(state) => {
        state.edituser.firstname = state.notEditUser.firstname,
        state.edituser.lastname = state.notEditUser.lastname,
        state.edituser.rol = state.notEditUser.rol,
        state.edituser.bio = state.notEditUser.bio,
        state.edituser.image = state.notEditUser.image
    },
    verifiedEmailOk:(state) => { state.loginuser.verifiedemail = true},
    clearUser:(state) => {
        state.loginuser.username = '',
        state.loginuser.firstname = '',
        state.loginuser.lastname = '',
        state.loginuser.email = '',
        state.loginuser.rol = {},
        state.loginuser.bio = '',
        state.loginuser.image = '',
        state.loginuser.verifiedemail = null,
        state.loginuser.logged = false
    },
    cancelDialog: (state,dialog) => {state.menu.dialogs[dialog] = false},
    onOffLights: (state) => {
        state.loginuser.dark = !state.loginuser.dark,
        Vuetify.framework.theme.dark = state.loginuser.dark
    },
    actionsLoad:(state,actions) => {state.actions = actions},
    topicsLoad:(state,topics) => {state.topics = topics},
    wgLoad:(state,workgroups) => {state.workgroups = workgroups},
    addTopic:(state,topic) => {state.actions.topics.push(topic)}
}

const actions = {
    async loadActions({state,commit,dispatch}){
        try {
            await dispatch('loadTopics')
            await dispatch('loadWB')
            await Axios.get("/actions/all")
            .then(res => {
                for (let i = 0; i < res.data.length; i++) {
                    let tempTopics = []
                    let tempWG = []
                    for (let y = 0; y < res.data[i].topics.length; y++) {
                        for (let x = 0; x < state.topics.length; x++) {
                            if(state.topics[x]._id == res.data[i].topics[y]){
                                tempTopics.push(state.topics[x])
                            }
                        }
                    }
                    for (let y = 0; y < res.data[i].workgroups.length; y++) {
                        for (let x = 0; x < state.workgroups.length; x++) {
                            if(state.workgroups[x]._id == res.data[i].workgroups[y]){
                                tempWG.push(state.workgroups[x])
                            }
                        }
                    }
                    res.data[i].topics = tempTopics
                    res.data[i].workgroups = tempWG
                }
                commit('actionsLoad',res.data);
            })
            .catch(error => {
                commit('notification',['error',3,error]);
            })
        } catch (error) {
            commit('notification',['error',3,error]);
        }
    },
    async loadWB({commit}){
        try {
            let token = Cookies.get("catapa-jwt");
            let config = {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
            await Axios.get("/wg/all",config)
            .then(res => {
                commit('wgLoad',res.data);
            })
            .catch(error => {
                commit('notification',['error',3,error]);
            })
        } catch (error) {
            commit('notification',['error',3,error]);
        }
    },
    async loadTopics({commit}){
        try {
            let token = Cookies.get("catapa-jwt");
            let config = {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
            await Axios.get("/topics/all",config)
            .then(res => {
                commit('topicsLoad',res.data);
            })
            .catch(error => {
                commit('notification',['error',3,error]);
            })
        } catch (error) {
            commit('notification',['error',3,error]);
        }
    },
    async signup({state,commit,dispatch}) {
        try{        
            let response = await Axios.post("/users/signup",state.newuser);
            let token = response.data.token;
            if(token){
                Cookies.set("catapa-jwt",token, { expires: 30});
                await dispatch('userData');
                router.push('/dashboard');
                commit('notification', ['success',3,'Correct registration. Welcome to Catapa, ' + response.data.data.firstname + '. Please verify your mail.']);
            }
            else{
                commit('notification', ['error',5,'Error: Something Went Wrong']);
            }
        }
        catch (err) {
            let error = err.response;
            if (error.status == 409) {
                commit('notification', ['error',5,'Error: ' + error.data.message]);
                
            } else {
                commit('notification', ['error',5,'Error: ' + error.data.err.message]);
            }
      }
    },
    async login({state,commit,dispatch}) {
        try{
            let response = await Axios.post("/users/login", state.user)
            let token = response.data.token;
            if(Cookies.get("catapa-jwt") == undefined){
                Cookies.set("catapa-jwt",token, { expires: 30});
            }
            if(token) {
                await dispatch('userData');
                commit('cancelDialog','login');
                commit('notification', ['success',3,'Correct Login. Welcome ' + response.data.user.username]);
                router.push('/dashboard');
            }
            else{
                commit('notification', ['error',3,'Server error. Try again.']);
            }
        } catch (err) {
            commit('notification',['error',3,'Incorrect login.']);
        }
    },
    async logOut({commit}){
        try {
            Cookies.remove('catapa-jwt')
            commit('cancelDialog','logout');
            commit('clearUser')
            router.push('/');
            commit('notification', ['success',3,'You are correctly log out.']);
        } catch (err) {
            commit('notification',['error',3,'Error: Something Went Wrong.']);
        }
    },
    async userData({commit}){
        try {
            let token = Cookies.get("catapa-jwt");
            let config = {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
            await Axios.get("/users/me",config)
            .then(res => {
                commit('userStore',res);
            })
            .catch(error => {
                commit('notification',['error',3,error]);
            })
        } catch (error) {
            commit('notification',['error',3,error]);
        }
    },
    sendVerificationMail({commit},email){
        Axios.post("/tokens/resend",{email:email})
        .then(() => {
            commit('notification',['primary',3,'Verification email send to ' + email + '. Please check your account.']);
        })
        .catch(error => {
            let color = ''
            switch (error.response.data.type) {
                case 'not-verified':
                    color = 'error'
                    break;
                case 'not-user':
                    color = 'error'
                    break;
                default:
                    break;
            }
            commit('notification',[color,3,'Something Went Wrong: ' + error.response.data.message]);
        })
    },
    verifyEmail({commit},token){
        Axios.post("/tokens/confirmation",{token:token})
        .then(() => {
            setTimeout(() => {
                router.push('/dashboard');
            }, 6000);
            commit('verifiedEmailOk')
            commit('alert',['primary','Your email is now verified. Thanks a lot. In a few seconds you are redirected to your Dashboard or Login.','fas fa-smile-wink'])
        })
        .catch(error => {
            let icon = 'fas fa-frown-open'
            let color = ''
            switch (error.response.data.type) {
                case 'not-verified':
                    icon = 'fas fa-angry'
                    color = 'error'
                    break;
                    
                case 'not-user':
                    
                    icon = 'fas fa-sad-tear'
                    color = 'error'
                    break;

                case 'already-verified':
                    
                    icon = 'fas fa-laugh-wink'
                    break;

                default:
                    break;
            }
            commit('alert',[color,error.response.data.message,icon]);
        })
    },
    async loadUserData({commit},user) {
        try {
            let token = Cookies.get("catapa-jwt");
            let config = {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
            await Axios.get("/users/user/" + user,config)
            .then(res => {
                commit('usertoedit', res);
            })
            .catch(error => {
                commit('notification',['error',3,error]);
            })
        } catch (error) {
            commit('notification',['error',3,error]);
        }
    },
    async saveEditedData({commit},user){
        try {
            let id = user.id
            let token = Cookies.get("catapa-jwt");
            let config = {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
            await Axios.put("/users/user/" + id,user, config)
            .then(res => {
                commit('notification',['primary',3,'Changed data Succesfully']);
                commit('undoEdit');
                commit('cancelDialog','edituser');
                commit('userStore',res)
            })
            .catch(error => {
                commit('notification',['error',3,error]);
            })
        }
        catch (error){
            commit('notification',['error',3,error]);
        }
    },
    goToSignin({state}){
        if(state.menu.dialogs.login){
            state.menu.dialogs.login = false
        }
        router.push('/signup')
    },
    goToRemeberme({state}){
        if(state.menu.dialogs.login){
            state.menu.dialogs.login = false
        }
        router.push('/rememberme')
    },
    changeLight({commit}){
        commit('onOffLights');
        if(Vuetify.framework.theme.dark){
            commit('notification', ['primary',1,'Lights Off']);
        }
        else{
            commit('notification', ['primary',1,'Lights On']); 
        }
    }

}

export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions,
    plugins:[
        createPersistedState({
            key:'teamcoo-catapa-userdata',
            paths:['loginuser','menu'],
            storage: {
                getItem: key => Cookies.get(key),
                setItem: (key, value) => Cookies.set(key, value, { expires: 30}),
                removeItem: key => Cookies.remove(key)
            }
        })
    ]
})