import Axios from 'axios'
import router from '@/router'
import { generateRandomColor, isDiferentArray, treeBuild } from '../../utils/utils'

const state = {
    workgroups: [],
    secretWorkgroups: [],
    nestedWorkgroups: [],
    secretNestedWorkgroups: [],
    workgroup: {},
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
        },
        loading: false
    },
    editmemberform: {
        members: [],
        coordinators: [],
        loading: false
    },
    loading: false,
    skeleton: false,
    usersforadd: [],
    loadedSuscription: {}
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
        state.workgroupForm.name = state.workgroup.name,
            state.workgroupForm.description = state.workgroup.description,
            state.workgroupForm.link = state.workgroup.linktodocuments,
            state.workgroupForm.color = state.workgroup.color,
            state.workgroupForm.textcolor = state.workgroup.textcolor
        if (state.workgroup.dossier != null) { state.workgroupForm.oldDossier = state.workgroup.dossier, state.workgroupForm.dossier = null }
        else { state.workgroupForm.oldDossier = null }
        state.workgroupForm.questionsSelected = state.workgroup.questions
    },
    workgroupLoad: (state, workgroups) => {
        state.workgroups = workgroups
    },
    secretWorkgroupLoad: (state, secretWorkgroups) => {
        state.secretWorkgroups = secretWorkgroups
    },
    workgroupNested: (state, nestedWorkgroups) => { state.nestedWorkgroups = nestedWorkgroups },
    secretWorkgroupNested: (state, secretNestedWorkgroups) => { state.secretNestedWorkgroups = secretNestedWorkgroups },
    workgroupSuscription: (state, workgroup) => { state.loadedSuscription = workgroup[0] },
    pullWorkgroup: (state, workgroup) => { state.workgroup = workgroup },
    newMembers: (state, members) => {
        state.workgroup.members = []
        for (let x = 0; x < members.length; x++) {
            state.workgroup.members.push(members[x])
        }
    },
    newCoordinators: (state, coors) => {
        state.workgroup.coordinators = []
        for (let x = 0; x < coors.length; x++) {
            state.workgroup.coordinators.push(coors[x])
        }
    },
    addallusers: (state, users) => {
        state.usersforadd = []
        for (let x = 0; x < users.length; x++) {
            state.usersforadd.push(users[x])
        }
    },
    loadMembers: (state, members) => {
        state.editmemberform.members = Array(members.members.length)
        for (let x = 0; x < members.members.length; x++) {
            state.editmemberform.members[x] = members.members[x];
        }
        state.editmemberform.coordinators = Array(members.coordinators.length)
        for (let x = 0; x < members.coordinators.length; x++) {
            state.editmemberform.coordinators[x] = members.coordinators[x];
        }
    },
    randomWorkgroupColor: (state) => {
        state.workgroupForm.workgroup.color = generateRandomColor(30);
    },
    changeLoading: (state, loading) => state.loading = loading,
    changeSkeleton: (state, skeleton) => state.skeleton = skeleton
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
            state.workgroupForm.workgroup.link != state.workgroup.linktodocuments ||
            state.workgroupForm.workgroup.color.toUpperCase() != state.workgroup.color.toUpperCase() ||
            state.workgroupForm.workgroup.oldDossier != state.workgroup.dossier ||
            state.workgroupForm.workgroup.dossier != null ||
            isDiferentArray(state.workgroupForm.workgroup.questions, state.workgroup.questions, '_id', '_id')
        ) {
            return false
        }
        else {
            return true
        }
    },
    editedMembers: (state) => {
        if (isDiferentArray(state.workgroup.members, state.editmemberform.members, 'id', 'id')) {
            return false
        }
        if (isDiferentArray(state.workgroup.coordinators, state.editmemberform.coordinators, 'id', 'id')) {
            return false
        }
        return true
    },
    correctWorkgroup: (state) => {
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
    }
}

const actions = {
    async createWorkGroup({ state, commit, dispatch, rootGetters }, userId) {
        try {
            let config = rootGetters['general/cookieAuth'];
            let dossier = state.workgroupForm.workgroup.dossier;
            if (dossier != null) {
                dossier = await dispatch('general/saveFile', dossier, { root: true });
            }
            let body = state.workgroupForm.workgroup;
            body.creator = userId;
            body.dossier = dossier;
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

    async delWorkgroup({ commit, dispatch, rootGetters }, params) {
        try {
            let config = rootGetters['general/cookieAuth'];
            let resTasks = await Axios.get('/tasks/', config);
            let resUsers = await Axios.get('/users/', config);
            let tasks = resTasks.data, users = resUsers.data;
            // TODO: eliminar de acciones cuando se termine el CRUD de acciones
            for (let i = 0; i < tasks.length; i++) {
                console.log('T')
            }
            for (let i = 0; i < users.length; i++) {
                let workgroups = users[i].workgroups;
                if (workgroups.some(a => a._wgId == params.id)) {
                    let workgroupsUpdate = workgroups.filter(a => a._wgId != params.id)
                    await Axios.put('/users/' + users[i].id, { workgroups: workgroupsUpdate }, config);
                }
            }
            await Axios.delete('/workgroups/' + params.id, config);

            await dispatch('loadWorkgroups');
            router.push('/workgroups');
            commit('menu/notification', ['info', 3, 'Workgroup deleted'], { root: true });
            commit('menu/cancelDialog', 'confirm', { root: true });
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },

    async loadWorkgroups({ commit, dispatch, rootGetters }) {
        try {
            commit('changeLoading', true);
            let config = rootGetters['general/cookieAuth'];
            let res = await Axios.get('/workgroups/', config);
            commit('workgroupLoad', res.data);
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
            commit('secretWorkgroupLoad', res.data);
            commit('secretWorkgroupNested', treeBuild(res.data));
            commit('changeLoading', false);
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
            commit('changeLoading', false);
        }
    },

    async searchWorkgroup({ commit, dispatch, rootGetters }, id) {
        try {
            commit('changeSkeleton', true);
            let config = rootGetters['general/cookieAuth'];
            let res = await Axios.get('/workgroups/' + id, config);
            commit('pullWorkgroup', res.data);
            commit('changeSkeleton', false);
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
            commit('changeSkeleton', false);
        }
    },

    async saveEditedworkgroup({ state, commit, dispatch, rootGetters }, id) {
        try {
            let config = rootGetters['general/cookieAuth'];
            let dossier = state.workgroupForm.dossier;
            if (dossier != null) {
                dossier = await dispatch('general/saveFile', dossier, { root: true });
            }
            else {
                dossier = state.workgroupForm.oldDossier;
            }
            let body = {
                name: state.workgroupForm.name,
                description: state.workgroupForm.description,
                textcolor: state.workgroupForm.textcolor,
                color: state.workgroupForm.color,
                questions: state.workgroupForm.questionsSelected.map(q => q._id),
                dossier: dossier,
                linktodocuments: state.workgroupForm.link
            }
            let res = await Axios.put('/workgroups/' + id, body, config);
            commit('menu/cancelDialog', 'editworkgroup', { root: true });
            await dispatch('searchWorkgroupSilent', res.data._id);
            commit('clearWorkgroupForm');
            commit('menu/notification', ['success', 5, 'Workgroup edited'], { root: true });
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },
    async joinWorkgroup({ commit, rootState, rootGetters, dispatch }, params) {
        try {
            let workgroupId = params.idWorkgroup, userId = params.idUser;
            let config = rootGetters['general/cookieAuth'];
            let res = await Axios.get('/users/' + userId, config);
            let unsuscribed = res.data.unsuscribedworkgroups.filter(w => w._wgId != workgroupId);
            let suscribed = res.data.workgroups;
            suscribed.push({
                _wgId: workgroupId,
                updatedDate: Date.now(),
                answers: params.answers ? params.answers : 'Joined by Coordinator/Admin: ' + rootState.user.loginuser.username
            });
            await Axios.put('/users/' + userId, { unsuscribedworkgroups: unsuscribed, workgroups: suscribed }, config);
            commit('menu/cancelDialog', 'suscribeto', { root: true })
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },
    async unjoinWorkgroup({ commit, rootState, rootGetters, dispatch }, params) {
        try {
            let workgroupId = params.idWorkgroup, userId = params.idUser;
            let config = rootGetters['general/cookieAuth'];
            let res = await Axios.get('/users/' + userId, config);
            let unsuscribed = res.data.unsuscribedworkgroups.filter(w => w._wgId != workgroupId);
            let suscribed = res.data.workgroups.filter(w => w._wgId != workgroupId);
            let suscription = res.data.workgroups.find(w => w._wgId == workgroupId);
            unsuscribed.push({
                _wgId: workgroupId,
                updatedDate: Date.now(),
                answers: suscription.answers instanceof Array ? suscription.answers : 'Unjoined by Coordinator/Admin: ' + rootState.user.loginuser.username
            });
            await Axios.put('/users/' + userId, { unsuscribedworkgroups: unsuscribed, workgroups: suscribed }, config);
            commit('menu/cancelDialog', 'unsuscribeworkgroup', { root: true });
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },
    async unsuscribeWorkgroup({ dispatch }, params) {
        await dispatch('users/searchUser', params.idUser, { root: true })
        await dispatch('unjoinWorkgroup', params);
        await dispatch('saveMember', params);
    },
    async saveMembers({ state, commit, dispatch, rootState, rootGetters }) {
        try {
            let idWorkgroup = state.searchedWorkgroup._id;
            let idMembersOld = state.searchedWorkgroup.members.map(m => m.id)
            let idMembers = state.editmemberform.members.map(m => m.id);
            let idCoordinators = state.editmemberform.coordinators.map(m => m.id);
            let config = rootGetters['general/cookieAuth'];
            for (let x = 0; x < idMembers.length; x++) {
                await dispatch('users/loadUserByID', idMembers[x], { root: true });
                if (!rootState.users.temporaluser.workgroups.some(w => w._wgId == idWorkgroup)) {
                    await dispatch('joinWorkgroup', { idWorkgroup: idWorkgroup, idUser: idMembers[x] });
                }
            }
            for (let x = 0; x < idMembersOld.length; x++) {
                await dispatch('users/loadUserByID', idMembersOld[x], { root: true });
                if (!idMembers.some(w => w == idMembersOld[x])) {
                    await dispatch('unjoinWorkgroup', { idWorkgroup: idWorkgroup, idUser: idMembersOld[x] });
                }
            }
            let res = await Axios.put('/workgroups/' + idWorkgroup, { members: idMembers, coordinators: idCoordinators }, config);
            await dispatch('searchWorkgroupSilent', res.data);
            await dispatch('user/refreshLoadedUser', null, { root: true });
            commit('menu/cancelDialog', 'editmembers', { root: true });
            commit('menu/notification', ['info', 10, 'Members updated'], { root: true });
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },
    async saveMember({ commit, dispatch, rootGetters }, params) {
        try {
            let userId = params.idUser, workgroupId = params.idWorkgroup;
            let config = rootGetters['general/cookieAuth'];
            let res = await Axios.get('/workgroups/' + workgroupId, config);
            let members = res.data.members;
            members = members.filter(m => m != userId);
            if (params.suscribe) members.push(userId);
            let resPut = await Axios.put('/workgroups/' + workgroupId, { members: members }, config);
            await dispatch('searchWorkgroupSilent', resPut.data);
            await dispatch('user/refreshLoadedUser', null, { root: true });
            commit('menu/cancelDialog', 'suscribeto', { root: true });
            commit('menu/notification', ['info', 10, params.suscribe ? 'Joined Succesfully 😀' : 'Unjoined Succesfully 🙁'], { root: true });
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}