import Axios from 'axios'
import globalConfig from '../../config/config.json'
import { todayFormatToPicker , generateRandomColor, isDiferentArray } from '../../utils/utils'

const state = {
    tasks: [],
    searchedTask:{},
    tasksForm: {
        name: '',
        description: '',
        link: '',
        color: '',
        workgroupsSelected: [],
        interestsSelected: [],
        startDate: todayFormatToPicker(),
        endDate: '',
        image:null,
        imagelink:''
    },
    loading:false,
    skeleton:false
}

const mutations = {
    clearTaskForm: (state) => {
        state.tasksForm.name = '',
            state.tasksForm.description = '',
            state.tasksForm.interestsSelected = [],
            state.tasksForm.workgroupsSelected = [],
            state.tasksForm.link = '',
            state.tasksForm.startDate = todayFormatToPicker(),
            state.tasksForm.endDate = '',
            state.tasksForm.image = null,
            state.tasksForm.imagelink = ''
    },
    tasksLoad: (state, tasks) => { state.tasks = tasks },
    changeSkeleton: (state, skeleton) => state.skeleton = skeleton,
    pullTask:(state,task) => {state.searchedTask = task},
    loadEditedTask:(state) => {
        state.tasksForm.name = state.searchedTask.name,
        state.tasksForm.description = state.searchedTask.description,
        state.tasksForm.link = state.searchedTask.link,
        state.tasksForm.image = state.searchedTask.image,
        state.tasksForm.newimage = null,
        state.tasksForm.color = state.searchedTask.color,
        state.tasksForm.startDate = todayFormatToPicker(state.searchedTask.eventStartDate),
        state.tasksForm.endDate = todayFormatToPicker(state.searchedTask.eventEndDate),
        state.tasksForm.workgroupsSelected = state.searchedTask.workgroups,
        state.tasksForm.interestsSelected = state.searchedTask.interests
    },
    randomTaskColor:(state) => {
        state.tasksForm.color = generateRandomColor(30).toUpperCase();
    }
}

const getters = {
    validTask: (state) => {
        if (
            state.tasksForm.name != '' &&
            state.tasksForm.description != '' &&
            state.tasksForm.endDate != '' &&
            state.tasksForm.startDate != '' &&
            state.tasksForm.description.length <= 380 &&
            state.tasksForm.workgroupsSelected.length != 0
        ) {
            return false
        }
        else {
            return true
        }
    },
    editedTask:(state) =>{
        if (
            state.tasksForm.name != state.searchedTask.name ||
            state.tasksForm.description != state.searchedTask.description ||
            state.tasksForm.endDate != todayFormatToPicker(state.searchedTask.eventEndDate) ||
            state.tasksForm.startDate != todayFormatToPicker(state.searchedTask.eventStartDate) ||
            state.tasksForm.link != state.searchedTask.link ||
            state.tasksForm.newimage != null ||
            state.tasksForm.color.toUpperCase() != state.searchedTask.color.toUpperCase() ||
            isDiferentArray(state.tasksForm.workgroupsSelected,state.searchedTask.workgroups,'_id','_id') ||
            isDiferentArray(state.tasksForm.interestsSelected,state.searchedTask.interests,'_id','_id') 
        ) {
            return false
        }
        else {
            return true
        }
    },
}

const actions = {
    async createTask({ state, commit, dispatch, rootGetters }, userId){
        try {
            if (state.tasksForm.image != null) {
                let formData = new FormData()
                const config = { headers: { 'Content-Type': 'multipart/form-data' } }
                formData.append('file', state.tasksForm.image)
                await Axios.post('/files/upload', formData, config)
                    .then(res => {
                        state.tasksForm.imagelink = globalConfig.global.hostnameApi + '/files/image/' + res.data.file.filename
                    });
            }
            else{
                state.tasksForm.imagelink = state.tasksForm.link
            }
            let color = generateRandomColor(135)
            let config = rootGetters['general/cookieAuth'];
            let body = {
                name: state.tasksForm.name,
                description: state.tasksForm.description,
                interests: state.tasksForm.interestsSelected,
                workgroups: state.tasksForm.workgroupsSelected,
                eventStartDate:state.tasksForm.startDate,
                eventEndDate:state.tasksForm.endDate,
                image:state.tasksForm.imagelink,
                color:color,
                createdBy: userId,
                link: state.tasksForm.link
            }
            await Axios.post('/tasks/', body, config);
            commit('menu/notification', ['info', 5, 'Task created'], { root: true });
            dispatch('loadTasks');
            commit('menu/cancelDialog', 'createtask', { root: true });
            commit('clearTaskForm');
        } catch (error) {
            commit('menu/notification', ['error', 5, error.response.data.message], { root: true });
        }
    },
    async loadTasks({ rootState, commit, dispatch }) {
        try {
            commit('menu/loadingstate', ['tasks',true], { root: true });
            await dispatch('interests/loadInterests',null,{root:true});
            await dispatch('workgroups/loadWorkgroups',null,{root:true});
            let res = await Axios.get('/tasks/');
            let tasks = res.data;
            for (let i = 0; i < tasks.length; i++) {
                let tempInterests = [], tempWorkgroups = [];
                for (let y = 0; y < tasks[i].interests.length; y++) {
                    for (let x = 0; x < rootState.interests.interests.length; x++) {
                        if (rootState.interests.interests[x]._id == tasks[i].interests[y]) {
                            tempInterests.push(rootState.interests.interests[x])
                        }
                    }
                }
                for (let y = 0; y < tasks[i].workgroups.length; y++) {
                    for (let x = 0; x < rootState.workgroups.workgroups.length; x++) {
                        if (rootState.workgroups.workgroups[x]._id == tasks[i].workgroups[y]) {
                            tempWorkgroups.push(rootState.workgroups.workgroups[x])
                        }
                    }
                }
                for (let y = 0; y < tasks[i].usersjoined.length; y++) {
                    await dispatch('users/loadUserByID',tasks[i].usersjoined[y], {root:true});
                    tasks[i].usersjoined[y] = rootState.users.temporaluser;
                }
                await dispatch('users/loadUserByID',tasks[i].createdBy, {root:true})
                tasks[i].creator = rootState.users.temporaluser
                tasks[i].interests = tempInterests
                tasks[i].workgroups = tempWorkgroups
            }
            commit('tasksLoad', tasks)
        } catch (error) {
            commit('menu/notification', ['error', 3, error], { root: true });
        }
    },
    async searchTask({ commit, dispatch, rootState, rootGetters }, id) {
        try {
            commit('changeSkeleton', true);
            let config = rootGetters['general/cookieAuth'];
            let res = await Axios.get('/tasks/' + id, config)
            let task = res.data
            await dispatch('users/loadUserByID',task.createdBy,{root:true});
            task['creator'] = rootState.users.temporaluser;
            let tempMembers = Array(task.usersjoined.length), tempWorkgroups = Array(task.workgroups.length), tempInterests = Array(task.interests.length);
            for (let x = 0; x < task.usersjoined.length; x++) {
                await dispatch('users/loadUserByID',task.usersjoined[x],{root:true});
                tempMembers[x] = rootState.users.temporaluser;
            }
            for (let x = 0; x < task.workgroups.length; x++) {
                await dispatch('workgroups/searchWorkgroupSilent',task.workgroups[x],{root:true});
                tempWorkgroups[x] = rootState.workgroups.searchedWorkgroup;
            }
            for (let x = 0; x < task.interests.length; x++) {
                await dispatch('interests/searchInterestSilent',task.interests[x],{root:true});
                tempInterests[x] = rootState.interests.searchedInterest;
            }
            task.members = tempMembers;
            task.workgroups = tempWorkgroups;
            task.interests = tempInterests;
            commit('pullTask', task);
            commit('changeSkeleton', false);
        } catch (error) {
            commit('menu/notification', ['error', 3, error.response.data.message], { root: true });
            commit('changeSkeleton', false);
        }
    },
    async searchTaskSilent({ commit, dispatch, rootState, rootGetters }, task) {
        try {
            if(task.constructor.name !== 'Object') {
                let config = rootGetters['general/cookieAuth'];
                let res = await Axios.get('/tasks/' + task, config)
                task = res.data
            }
            await dispatch('users/loadUserByID',task.createdBy,{root:true});
            task['creator'] = rootState.users.temporaluser;
            let tempMembers = Array(task.usersjoined.length), tempWorkgroups = Array(task.workgroups.length), tempInterests = Array(task.interests.length);
            for (let x = 0; x < task.usersjoined.length; x++) {
                await dispatch('users/loadUserByID',task.usersjoined[x],{root:true});
                tempMembers[x] = rootState.users.temporaluser;
            }
            for (let x = 0; x < task.workgroups.length; x++) {
                await dispatch('workgroups/searchWorkgroupSilent',task.workgroups[x],{root:true});
                tempWorkgroups[x] = rootState.workgroups.searchedWorkgroup;
            }
            for (let x = 0; x < task.interests.length; x++) {
                await dispatch('interests/searchInterestSilent',task.interests[x],{root:true});
                tempInterests[x] = rootState.interests.searchedInterest;
            }
            task.members = tempMembers;
            task.workgroups = tempWorkgroups;
            task.interests = tempInterests;
            commit('pullTask', task);
        } catch (error) {
            commit('menu/notification', ['error', 3, error.response.data.message], { root: true });
        }
    },
    async saveEditedTask({state,commit,dispatch, rootGetters},id) {
        try {
            let config = rootGetters['general/cookieAuth'], image = state.tasksForm.newimage;
            if (image != null) {
                let formData = new FormData();
                const config = { headers: { 'Content-Type': 'multipart/form-data' } }
                formData.append('file', state.tasksForm.newimage);
                await Axios.post('/files/upload', formData, config)
                .then(res => {
                    image = globalConfig.global.hostnameApi + '/files/upload/' + res.data.file.filename
                })
            }
            else{
                image = state.tasksForm.image;
            }
            let body = {
                name: state.tasksForm.name,
                description: state.tasksForm.description,
                color: state.tasksForm.color,
                eventStartDate:state.tasksForm.startDate,
                eventEndDate:state.tasksForm.endDate,
                questions: state.tasksForm.workgroupsSelected.map(q => q._id),
                interests: state.tasksForm.interestsSelected.map(q => q._id),
                image: image,
                link: state.tasksForm.link
            }
            let res = await Axios.put('/tasks/' + id, body, config);
            commit('menu/cancelDialog', 'edittask', { root: true });
            await dispatch('searchTaskSilent', res.data._id);
            commit('clearTaskForm');
            commit('menu/notification', ['success', 5, 'Task edited'], { root: true });
        } catch (error) {
            commit('menu/notification', ['error', 5, error.response.data.message], { root: true });
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