import Cookies from 'js-cookie';

const state = {
    rules: {
        required: v => !!v || 'Required',
        maxSize: v => !v || v.size < 5000000 || 'Dossier size should be less than 5 MB!',
        emailrules: v => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(v) || 'Invalid e-mail'
        },
        validlink: v => {
            const pattern = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/
            if (v == '') {
                return true
            }
            else {
                if (pattern.test(v)) {
                    return true
                }
                else {
                    return false || 'Invalid link'
                }
            }
        },
        zerolength: v => v.length != 0 || 'Select one at least',
        minletter: v => v.length >= 3 || 'At least 3 letters',
        maxletters: v => v.length <= 20 || 'Max 20 characters',
        maxdescletters: v => v.length <= 380 || 'Max 380 characters',
        nospaces: v => {
            const pattern = /\s/;
            return !pattern.test(v) || 'No spaces'
        },
        passwordrules: v => {
            const pattern = /^.*(?=.{8,})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/
            return pattern.test(v) || 'Password too weak'
        },
        passwordconfirm: (x,y) => {
            if (x == y) {
                return true
            }
            else {
                return false || 'Passwords must match'
            }
        },
        acceptchecks: v => !!v || 'Check the policy.',
        acceptterms: v => !!v || 'Check the terms.',
        delete: v => {
            if (v != 'DELETE') {
                return false || 'DELETE'
            }
            else {
                return true
            }
        }
    },
    tab: null,
    tabs: [
        { name: 'General', icon: 'fas fa-cog' },
        { name: 'Common Questions', icon: 'fas fa-question-circle' },
        { name: 'Customization', icon: 'fas fa-paint-brush' },
        { name: 'Mails', icon: 'fas fa-envelope' },
    ]
}

const mutations = {

}

const getters = {
    cookieAuth: () => {
        return {
            headers: {
                Authorization: "Bearer " + Cookies.get("catapa-jwt")
            }
        } 
    }
}

const actions = {

}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}