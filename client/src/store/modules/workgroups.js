import Vue from 'vue'
import Axios from 'axios'
import router from '@/router'
import { generateRandomColor, isDiferentArray, treeBuild } from '../../utils/utils'

const state = {
    workgroups: [],
    secretWorkgroups: [],
    nestedWorkgroups: [],
    secretNestedWorkgroups: [],
    workgroup: {},
    answers: [],
    rules: [],
    valid: true,
    workgroupForm: {
        workgroup: {
            name: '',
            parent: null,
            color: '#E0E0E0',
            questions: [],
            description: '',
            dossier: [],
            secret: false,
            link: '',
            newDossier: []
        },
        loading: false
    },
    editMemberForm: {
        members: [],
        coordinators: [],
        loading: false
    },
    loading: false,
    skeleton: false,
    usersforadd: [],
    loadedSuscription: {},
    workgroupsByUser: []
}

const mutations = {
    clearWorkgroupForm: (state) => {
        state.workgroupForm.workgroup.name = '';
        state.workgroupForm.workgroup.description = '';
        state.workgroupForm.workgroup.questions = [];
        state.workgroupForm.workgroup.parent = null;
        state.workgroupForm.workgroup.dossier = [];
        state.workgroupForm.workgroup.secret = false;
        state.workgroupForm.workgroup.link = '';
        state.workgroupForm.workgroup.color = '#E0E0E0';
    },
    loadEditedWorkgroup: (state) => {
        state.workgroupForm.workgroup = Object.assign({}, state.workgroup);
    },
    workgroupsLoad: (state, workgroups) => {
        state.workgroups = workgroups
    },
    secretWorkgroupsLoad: (state, secretWorkgroups) => {
        state.secretWorkgroups = secretWorkgroups
    },
    workgroupNested: (state, nestedWorkgroups) => {
        state.nestedWorkgroups = nestedWorkgroups
    },
    secretWorkgroupNested: (state, secretNestedWorkgroups) => {
        state.secretNestedWorkgroups = secretNestedWorkgroups
    },
    workgroupSuscription: (state, workgroup) => {
        state.loadedSuscription = workgroup[0]
    },
    pullWorkgroup: (state, workgroup) => {
        state.workgroup = Object.assign({}, workgroup);
    },
    setWorkgroup: (state, workgroup) => {
        Vue.set(state, 'workgroup', workgroup);
    },
    loadMembers: (state) => {
        state.editMemberForm.members = JSON.parse(JSON.stringify(state.workgroup.members));
        state.editMemberForm.coordinators = JSON.parse(JSON.stringify(state.workgroup.coordinators));
    },
    randomWorkgroupColor: (state) => {
        state.workgroupForm.workgroup.color = generateRandomColor(30);
    },
    changeLoading: (state, loading) => {
        state.loading = loading
    },
    changeSkeleton: (state, skeleton) => {
        state.skeleton = skeleton
    },
    setRules: (state, rules) => {
        state.rules = rules;
    },
    setAnswers: (state, answers) => {
        state.answers = answers;
    },
    clearJoinForm: (state) => {
        state.rules = [];
        state.answers = [];
    },
    setWorkgroupsByUser: (state, workgroups) => {
        state.workgroupsByUser = workgroups
    }
}

const getters = {
    validWorkgroup: (state) => {
        if (
            state.workgroupForm.workgroup.name != '' &&
            state.workgroupForm.workgroup.description != '' &&
            state.workgroupForm.workgroup.description.length <= 380 &&
            state.workgroupForm.workgroup.name.length >= 3 &&
            state.workgroupForm.workgroup.questions.length != 0
        ) {
            return false
        }
        else {
            return true
        }
    },

    editedWorkgroup: (state) => {
        if (
            state.workgroupForm.workgroup.name != state.workgroup.name ||
            state.workgroupForm.workgroup.description != state.workgroup.description ||
            state.workgroupForm.workgroup.link != state.workgroup.link ||
            state.workgroupForm.workgroup.parent != state.workgroup.parent ||
            state.workgroupForm.workgroup.color.toUpperCase() != state.workgroup.color.toUpperCase() ||
            state.workgroupForm.workgroup.newDossier != null ||
            state.workgroupForm.workgroup.secret != state.workgroup.secret ||
            isDiferentArray(state.workgroupForm.workgroup.questions, state.workgroup.questions, '_id', '_id')
        ) {
            return false
        }
        else {
            return true
        }
    },

    editedMembers: (state) => {
        if (isDiferentArray(state.workgroup.members, state.editMemberForm.members, '_id', '_id')) {
            return false
        }
        if (isDiferentArray(state.workgroup.coordinators, state.editMemberForm.coordinators, '_id', '_id')) {
            return false
        }
        return true
    },

    isValidJoin: (state) => {
        let valid = 0;
        let answers = state.answers;
        state.workgroup.questions.forEach((q, index) => {
            let check = q.type != 'text' ? state.rules[index](answers[index].answer) : state.rules[index](answers[index].text);
            if (typeof check == 'boolean') {
                valid++
            }
        });
        return valid == state.workgroup.questions.length;
    }
}

const actions = {
    async createWorkGroup({ state, commit, dispatch, rootGetters }, userId) {
        try {
            let config = rootGetters['general/cookieAuth'];
            commit('menu/notification', ['info', 5, state.workgroupForm.workgroup.dossier], { root: true });
            if (!state.workgroupForm.workgroup.dossier) {
                state.workgroupForm.workgroup.dossier = await dispatch('general/saveFile', state.workgroupForm.workgroup.dossier, { root: true });
            } else {
                state.workgroupForm.workgroup.dossier = null;
            }
            let body = state.workgroupForm.workgroup;
            body.creator = userId;
            body.coordinators = [userId];
            await Axios.post('/workgroups/', body, config)
            commit('menu/notification', ['info', 5, 'Workgroup created correctly'], { root: true });
            dispatch('loadWorkgroups');
            commit('menu/cancelDialog', 'createworkgroup', { root: true });
            commit('clearWorkgroupForm');
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },

    async loadWorkgroups({ commit, dispatch, rootGetters }) {
        try {
            commit('changeLoading', true);
            let config = rootGetters['general/cookieAuth'];
            let res = await Axios.get('/workgroups/', config);
            commit('workgroupsLoad', res.data);
            commit('workgroupNested', treeBuild(res.data));
            commit('changeLoading', false);
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
            commit('changeLoading', false);
        }
    },

    async loadSecretWorkgroups({ commit, dispatch, rootGetters }) {
        try {
            commit('changeLoading', true);
            let config = rootGetters['general/cookieAuth'];
            let res = await Axios.get('/workgroups/secret/', config);
            commit('secretWorkgroupsLoad', res.data);
            commit('secretWorkgroupNested', treeBuild(res.data));
            commit('changeLoading', false);
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
            commit('changeLoading', false);
        }
    },

    async searchWorkgroup({ commit, dispatch }, id) {
        try {
            commit('changeSkeleton', true);
            await dispatch('searchWorkgroupSilent', id);
            commit('changeSkeleton', false);
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
            commit('changeSkeleton', false);
        }
    },

    async searchWorkgroupSilent({ commit, dispatch, rootGetters }, id) {
        try {
            let config = rootGetters['general/cookieAuth'];
            let res = await Axios.get('/workgroups/' + id, config);
            commit('pullWorkgroup', res.data);
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },

    async saveEditedworkgroup({ state, commit, dispatch, rootGetters }, id) {
        try {
            let config = rootGetters['general/cookieAuth'];
            let body = state.workgroupForm.workgroup;
            if (state.workgroupForm.workgroup.newDossier != null) {
                body.dossier = await dispatch('general/saveFile', state.workgroupForm.workgroup.newDossier, { root: true });
            }
            let res = await Axios.put('/workgroups/' + id, body, config);
            commit('setWorkgroup', res.data);
            commit('menu/cancelDialog', 'editworkgroup', { root: true });
            commit('clearWorkgroupForm');
            commit('menu/notification', ['success', 5, 'Workgroup saved correctly'], { root: true });
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },
    // TODO: finally deleted not implemented
    async delWorkgroup({ state, commit, dispatch, rootGetters }) {
        try {
            let config = rootGetters['general/cookieAuth'];
            await Axios.delete('/workgroups/finally/' + state.workgroup._id, config);
            await dispatch('loadWorkgroups');
            router.push('/workgroups');
            commit('menu/notification', ['info', 3, 'Workgroup removed'], { root: true });
            commit('menu/cancelDialog', 'confirm', { root: true });
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },

    async delWorkgroupSoft({ state, commit, dispatch, rootGetters }) {
        try {
            let config = rootGetters['general/cookieAuth']
            let res = await Axios.delete('/workgroups/' + state.workgroup._id, config);
            commit('setWorkgroup', res.data);
            await dispatch('loadWorkgroups');
            router.push('/workgroups');
            commit('menu/notification', ['info', 3, 'Workgroup removed'], { root: true });
            commit('menu/cancelDialog', 'confirm', { root: true });
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },

    async joinWorkgroup({ state, commit, rootGetters, dispatch }, userId) {
        try {
            let config = rootGetters['general/cookieAuth'];
            let answers = state.answers.map(answer => {
                let a = answer;
                if (typeof a.answer === 'string') a.answer = [answer.answer];
                return a;
            })
            let res = await Axios.put('/workgroups/join/' + state.workgroup._id, { user: userId, answers: answers }, config);
            commit('setWorkgroup', res.data);
            commit('menu/notification', ['info', 10, 'Joined Succesfully 😀'], { root: true });
            commit('menu/cancelDialog', 'suscribeto', { root: true })
            commit('clearJoinForm');
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },

    async unjoinWorkgroup({ state, commit, rootGetters, dispatch }, { userId }) {
        try {
            let config = rootGetters['general/cookieAuth'];
            let res = await Axios.put('/workgroups/unjoin/' + state.workgroup._id, { user: userId }, config);
            commit('setWorkgroup', res.data);
            commit('menu/notification', ['info', 10, 'Unjoined Succesfully 🙁'], { root: true });
            commit('menu/cancelDialog', 'unsuscribeworkgroup', { root: true });
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },

    async saveMembers({ state, commit, dispatch, rootGetters }) {
        try {
            let config = rootGetters['general/cookieAuth'];
            let res = await Axios.put('/workgroups/' + state.workgroup._id, { members: state.editMemberForm.members, coordinators: state.editMemberForm.coordinators }, config);
            commit('setWorkgroup', res.data);
            await dispatch('user/refreshLoadedUser', null, { root: true });
            commit('menu/cancelDialog', 'editmembers', { root: true });
            commit('menu/notification', ['info', 10, 'Members updated'], { root: true });
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },

    async createRules({ state, commit, dispatch }) {
        try {
            let rules = state.workgroup.questions.map(q => {
                if (q.type == 'text') return (v) => !!v || "Required";
                else if (q.type == 'checkbox') return (v) => v.length != 0 || "Select one at least";
                else if (q.type == 'select') return (v) => v.length != 0 || "Select one";
                else if (q.type == 'radio') return (v) => v.length != 0 || "A selection is required";
            })
            commit('setRules', rules);
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },

    async createAnswers({ state, commit, dispatch }) {
        try {
            let answers = state.workgroup.questions.map(q => {
                return {
                    question: q._id,
                    answer: [],
                    text: ''
                }
            })
            commit('setAnswers', answers);
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },

    async loadWorkgroupsByUser({ commit, dispatch, rootGetters }, id) {
        try {
            let config = rootGetters['general/cookieAuth'];
            let res = await Axios.get('/workgroups/workgroupsByUser/' + id, config);
            commit('setWorkgroupsByUser', res.data);
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}