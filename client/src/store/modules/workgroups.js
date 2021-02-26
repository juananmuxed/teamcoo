import Axios from 'axios'
import router from '@/router'
import globalConfig from '../../config/config.json'
import { generateRandomColor, isDiferentArray, treeBuild } from '../../utils/utils'

const state = {
    workgroups: [],
    secretworkgroups: [],
    nestedWorkgroups: [],
    secretnestedWorkgroups: [],
    searchedWorkgroup:{},
    workgroupForm: {
        name: '',
        description: '',
        dossier: null,
        link: '',
        color: '',
        questionsSelected: [],
        parent: null,
        secretparent: null,
        secret: false
    },
    editmemberform:{
        members:[],
        coordinators:[],
        loading: false
    },
    loading: false,
    skeleton: false,
    usersforadd:[],
    loadedSuscription: {}
}

const mutations = {
    verifySecret: (state) => {
        if(state.workgroupForm.secret){state.workgroupForm.parent = null}
    },
    changeLoaded: (state, bool) => {state.loaded = bool},
    clearWorkgroupForm: (state) => {
        state.workgroupForm.name = '',
            state.workgroupForm.description = '',
            state.workgroupForm.questionsSelected = [],
            state.workgroupForm.parent = null,
            state.workgroupForm.dossier = null,
            state.workgroupForm.secret = false,
            state.workgroupForm.link = '',
            state.workgroupForm.color = '#E0E0E0'
    },
    loadEditedWorkgroup:(state) => {
        state.workgroupForm.name = state.searchedWorkgroup.name,
        state.workgroupForm.description = state.searchedWorkgroup.description,
        state.workgroupForm.link = state.searchedWorkgroup.linktodocuments,
        state.workgroupForm.color = state.searchedWorkgroup.color,
        state.workgroupForm.textcolor = state.searchedWorkgroup.textcolor
        if(state.searchedWorkgroup.dossier != null){state.workgroupForm.oldDossier = state.searchedWorkgroup.dossier, state.workgroupForm.dossier = null}
        else{state.workgroupForm.oldDossier = null}
        state.workgroupForm.questionsSelected = state.searchedWorkgroup.questions
    },
    workgroupLoad: (state, workgroups) => { state.workgroups = workgroups },
    secretWorkgroupLoad: (state, secretworkgroups) => { state.secretworkgroups = secretworkgroups },
    workgroupNested: (state, nestedWorkgroups) => { state.nestedWorkgroups = nestedWorkgroups },
    secretWorkgroupNested: (state, secretnestedWorkgroups) => { state.secretnestedWorkgroups = secretnestedWorkgroups },
    workgroupSuscription: (state, workgroup) => { state.loadedSuscription = workgroup[0] },
    pullWorkgroup:(state,workgroup) => {state.searchedWorkgroup = workgroup},
    newMembers:(state,members) => {
        state.searchedWorkgroup.members = []
        for (let x = 0; x < members.length; x++) {
            state.searchedWorkgroup.members.push(members[x])
        }
    },
    newCoordinators:(state,coors) => {
        state.searchedWorkgroup.coordinators = []
        for (let x = 0; x < coors.length; x++) {
            state.searchedWorkgroup.coordinators.push(coors[x])
        }
    },
    addallusers:(state,users) => {
        state.usersforadd = []
        for (let x = 0; x < users.length; x++) {
            state.usersforadd.push(users[x])
        }
    },
    loadMembers:(state,members) => {
        state.editmemberform.members = Array(members.members.length)
        for (let x = 0; x < members.members.length; x++) {
            state.editmemberform.members[x] = members.members[x];
        }
        state.editmemberform.coordinators = Array(members.coordinators.length)
        for (let x = 0; x < members.coordinators.length; x++) {
            state.editmemberform.coordinators[x] = members.coordinators[x];
        }
    },
    randomWorkgroupColor:(state) => {
        state.workgroupForm.color = generateRandomColor(30);
    },
    changeLoading: (state, loading) => state.loading = loading,
    changeSkeleton: (state, skeleton) => state.skeleton = skeleton
}

const getters = {
    validWorkgroup: (state) => {
        if (
            state.workgroupForm.name != '' &&
            state.workgroupForm.description != '' &&
            state.workgroupForm.description.length <= 380 &&
            state.workgroupForm.name.length >= 3 &&
            state.workgroupForm.questionsSelected.length != 0
        ) {
            return false
        }
        else {
            return true
        }
    },
    editedWorkgroup:(state) =>{
        if (
            state.workgroupForm.name != state.searchedWorkgroup.name ||
            state.workgroupForm.description != state.searchedWorkgroup.description ||
            state.workgroupForm.link != state.searchedWorkgroup.linktodocuments ||
            state.workgroupForm.color.toUpperCase() != state.searchedWorkgroup.color.toUpperCase() ||
            state.workgroupForm.oldDossier != state.searchedWorkgroup.dossier ||
            state.workgroupForm.dossier != null ||
            isDiferentArray(state.workgroupForm.questionsSelected,state.searchedWorkgroup.questions,'_id','_id')
        ) {
            return false
        }
        else {
            return true
        }
    },
    editedMembers:(state) => {
        if(isDiferentArray(state.searchedWorkgroup.members,state.editmemberform.members,'id','id')){
            return false
        }
        if(isDiferentArray(state.searchedWorkgroup.coordinators,state.editmemberform.coordinators,'id','id')){
            return false
        }
        return true
    },
    correctWorkgroup:(state) => {
        if (
            state.workgroupForm.name != '' &&
            state.workgroupForm.description != '' &&
            state.workgroupForm.description.length <= 380 &&
            state.workgroupForm.name.length >= 3 &&
            state.workgroupForm.questionsSelected.length != 0
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
            let dossier = state.workgroupForm.dossier
            if (dossier != null) {
                let formData = new FormData()
                const config = { headers: { 'Content-Type': 'multipart/form-data' } }
                formData.append('file', state.workgroupForm.dossier)
                await Axios.post("/files/upload", formData, config)
                    .then(res => {
                        dossier = globalConfig.global.hostnameApi + '/files/upload/' + res.data.file.filename
                    })
            }
            let body = {
                name: state.workgroupForm.name,
                description: state.workgroupForm.description,
                textcolor: state.workgroupForm.textcolor,
                color: state.workgroupForm.color,
                questions: state.workgroupForm.questionsSelected,
                secret: state.workgroupForm.secret,
                parent: state.workgroupForm.parent,
                _userId: userId,
                dossier: dossier,
                coordinators: [userId],
                linktodocuments: state.workgroupForm.link
            }
            await Axios.post('/workgroups/', body, config)
            commit('menu/notification', ['info', 5, 'Work group created'], { root: true })
            dispatch('loadWorkgroups')
            commit('menu/cancelDialog', 'createworkgroup', { root: true })
            commit('clearWorkgroupForm')
        } catch (error) {
            commit('menu/notification', ['error', 5, error.response.data.message], { root: true });
        }
    },
    async delWorkgroup({ commit, dispatch, rootGetters }, params ) {
        try {
            let config = rootGetters['general/cookieAuth'];
            let resActions = await Axios.get('/actions/',config);
            let resUsers = await Axios.get('/users/', config);
            let actions = resActions.data, users = resUsers.data;
            // TODO: eliminar de acciones cuando se termine el CRUD de acciones
            for (let i = 0; i < actions.length; i++) {
                console.log('T')
            }
            for (let i = 0; i < users.length; i++) {
                let workgroups = users[i].workgroups;
                if(workgroups.some(a => a._wgId == params.id)) {
                    let workgroupsUpdate = workgroups.filter(a => a._wgId != params.id)
                    await Axios.put( '/users/' + users[i].id, {workgroups:workgroupsUpdate}, config );
                }
            }
            await Axios.delete('/workgroups/' + params.id, config);

            await dispatch('loadWorkgroups');
            router.push('/workgroups');
            commit('menu/notification', ['info', 3, 'Workgroup deleted'], { root: true });
            commit('menu/cancelDialog', 'confirm', { root: true });
        } catch (error) {
            commit('menu/notification', ['error', 5, error.response.data], { root: true });
        }
    },
    async loadWorkgroups({ commit , dispatch, rootState, rootGetters }) {
        try {
            commit('changeLoading', true);
            let config = rootGetters['general/cookieAuth'];
            let res = await Axios.get("/workgroups/", config);
            let allWorkgroups = res.data;
            for (let i = 0; i < allWorkgroups.length; i++) {
                let workgroup = allWorkgroups[i];
                await dispatch('users/loadUserByID',workgroup._userId,{root:true});
                workgroup['creator'] = rootState.users.temporaluser;
                let tempCoordinators = Array(workgroup.coordinators.length), tempMembers = Array(workgroup.members.length), tempQuestions = Array(workgroup.questions.length);
                for (let x = 0; x < workgroup.coordinators.length; x++) {
                    await dispatch('users/loadUserByID',workgroup.coordinators[x],{root:true});
                    tempCoordinators[x] = rootState.users.temporaluser;
                }
                for (let x = 0; x < workgroup.members.length; x++) {
                    await dispatch('users/loadUserByID',workgroup.members[x],{root:true});
                    tempMembers[x] = rootState.users.temporaluser;
                }
                for (let x = 0; x < workgroup.questions.length; x++) {
                    await dispatch('questions/searchQuestionSilent',workgroup.questions[x],{root:true});
                    tempQuestions[x] = rootState.questions.searchedQuestion;
                }
                workgroup.coordinators = tempCoordinators;
                workgroup.members = tempMembers;
                workgroup.questions = tempQuestions;
            }
            let workgroups = allWorkgroups.filter(w => !w.secret);
            let secretWorkgroups = allWorkgroups.filter(w => w.secret);
            commit('workgroupLoad',workgroups);
            commit('secretWorkgroupLoad',secretWorkgroups);
            commit('workgroupNested', treeBuild(workgroups));
            commit('secretWorkgroupNested', treeBuild(secretWorkgroups));
            commit('changeLoading', false);
        } catch (error) {
            commit('menu/notification', ['error', 3, error], { root: true });
            commit('changeLoading', false);
        }
    },
    async searchWorkgroup({ commit, dispatch, rootState, rootGetters }, id) {
        try {
            commit('changeSkeleton', true);
            let config = rootGetters['general/cookieAuth'];
            let res = await Axios.get('/workgroups/' + id, config)
            let workgroup = res.data
            await dispatch('users/loadUserByID',workgroup._userId,{root:true});
            workgroup['creator'] = rootState.users.temporaluser;
            let tempCoordinators = Array(workgroup.coordinators.length), tempMembers = Array(workgroup.members.length), tempQuestions = Array(workgroup.questions.length);
            for (let x = 0; x < workgroup.coordinators.length; x++) {
                await dispatch('users/loadUserByID',workgroup.coordinators[x],{root:true});
                tempCoordinators[x] = rootState.users.temporaluser;
            }
            for (let x = 0; x < workgroup.members.length; x++) {
                await dispatch('users/loadUserByID',workgroup.members[x],{root:true});
                tempMembers[x] = rootState.users.temporaluser;
            }
            for (let x = 0; x < workgroup.questions.length; x++) {
                await dispatch('questions/searchQuestionSilent',workgroup.questions[x],{root:true});
                tempQuestions[x] = rootState.questions.searchedQuestion;
            }
            workgroup.coordinators = tempCoordinators;
            workgroup.members = tempMembers;
            workgroup.questions = tempQuestions;
            commit('pullWorkgroup', workgroup);
            commit('changeSkeleton', false);
        } catch (error) {
            commit('menu/notification', ['error', 3, error.response.data.message], { root: true });
            commit('changeSkeleton', false);
        }
    },
    async searchWorkgroupSilent({ commit, dispatch, rootState, rootGetters }, workgroup) {
        try {
            if(workgroup.constructor.name !== "Object") {
                let config = rootGetters['general/cookieAuth'];
                let res = await Axios.get('/workgroups/' + workgroup, config)
                workgroup = res.data
            }
            await dispatch('users/loadUserByID',workgroup._userId,{root:true});
            workgroup['creator'] = rootState.users.temporaluser;
            let tempCoordinators = Array(workgroup.coordinators.length), tempMembers = Array(workgroup.members.length), tempQuestions = Array(workgroup.questions.length);
            for (let x = 0; x < workgroup.coordinators.length; x++) {
                await dispatch('users/loadUserByID',workgroup.coordinators[x],{root:true});
                tempCoordinators[x] = rootState.users.temporaluser;
            }
            for (let x = 0; x < workgroup.members.length; x++) {
                await dispatch('users/loadUserByID',workgroup.members[x],{root:true});
                tempMembers[x] = rootState.users.temporaluser;
            }
            for (let x = 0; x < workgroup.questions.length; x++) {
                await dispatch('questions/searchQuestionSilent',workgroup.questions[x],{root:true});
                tempQuestions[x] = rootState.questions.searchedQuestion;
            }
            workgroup.coordinators = tempCoordinators;
            workgroup.members = tempMembers;
            workgroup.questions = tempQuestions;
            commit('pullWorkgroup', workgroup);
        } catch (error) {
            commit('menu/notification', ['error', 3, error.response.data.message], { root: true });
        }
    },
    async saveEditedworkgroup({state,commit,dispatch, rootGetters},id) {
        try {
            let config = rootGetters['general/cookieAuth'];
            let dossier = state.workgroupForm.dossier
            if (dossier != null) {
                let formData = new FormData()
                const config = { headers: { 'Content-Type': 'multipart/form-data' } }
                formData.append('file', state.workgroupForm.dossier)
                await Axios.post("/files/upload", formData, config)
                .then(res => {
                    dossier = globalConfig.global.hostnameApi + '/files/upload/' + res.data.file.filename
                })
            }
            else{
                dossier = state.workgroupForm.oldDossier
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
            let res = await Axios.put("/workgroups/" + id, body, config)
            await dispatch('searchWorkgroup', res.data._id)
            commit('menu/cancelDialog', 'editworkgroup', { root: true })
            commit('clearWorkgroupForm')
        } catch (error) {
            commit('menu/notification', ['error', 5, error.response.data.message], { root: true })
        }
    },
    async joinWorkgroup({ commit, rootState, rootGetters}, params) {
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
            await Axios.put('/users/' + userId, { unsuscribedworkgroups:unsuscribed, workgroups: suscribed }, config);
            commit('menu/cancelDialog', 'suscribeto', { root: true })
        } catch (error) {
            commit('menu/notification', ['error', 5, error], { root: true })
        }
    },
    async unjoinWorkgroup({ commit, rootState, rootGetters }, params) {
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
            await Axios.put('/users/' + userId, { unsuscribedworkgroups:unsuscribed, workgroups: suscribed }, config);
            commit('menu/cancelDialog', 'unsuscribeworkgroup', { root: true });
        } catch (error) {
            commit('menu/notification', ['error', 5, error], { root: true })
        }
    },
    async unsuscribeWorkgroup( { dispatch }, params ) {
        await dispatch('users/searchUser', params.idUser, {root: true})
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
                await dispatch('users/loadUserByID',idMembers[x],{root:true});
                if(!rootState.users.temporaluser.workgroups.some(w => w._wgId == idWorkgroup)) {
                    await dispatch('joinWorkgroup',{idWorkgroup:idWorkgroup,idUser: idMembers[x]});
                }
            }
            for (let x = 0; x < idMembersOld.length; x++) {
                await dispatch('users/loadUserByID',idMembersOld[x],{root:true});
                if(!idMembers.some(w => w == idMembersOld[x])) {
                    await dispatch('unjoinWorkgroup',{idWorkgroup:idWorkgroup,idUser: idMembersOld[x]});
                }
            }
            let res = await Axios.put('/workgroups/' + idWorkgroup, { members:idMembers, coordinators:idCoordinators }, config);
            await dispatch('searchWorkgroupSilent',res.data);
            await dispatch('user/userData',null,{root:true})
            commit('menu/cancelDialog', 'editmembers', { root: true });
            commit('menu/notification', ['info', 10, 'Members updated'], { root: true });
        } catch (error) {
            commit('menu/notification', ['info', 10, error], { root: true });
        }
    },
    async saveMember( { commit, dispatch, rootGetters }, params ) {
        try {            
            let userId = params.idUser, workgroupId = params.idWorkgroup;
            let config = rootGetters['general/cookieAuth'];
            let res = await Axios.get('/workgroups/' + workgroupId, config);
            let members = res.data.members;
            members = members.filter(m => m != userId);
            if(params.suscribe) members.push(userId);
            let resPut = await Axios.put('/workgroups/' + workgroupId, { members:members }, config);
            await dispatch('searchWorkgroupSilent',resPut.data);
            await dispatch('user/userData',null,{root:true});
            commit('menu/cancelDialog', 'suscribeto', { root: true });
            commit('menu/notification', ['info', 10, params.suscribe ? 'Joined Succesfully 😀' : 'Unjoined Succesfully 🙁'], { root: true })
        } catch (error) {
            commit('menu/notification', ['info', 10, error], { root: true })
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