import Axios from 'axios'
import router from '@/router'
import { todayFormatToPicker, generateRandomColor, isDiferentArray } from '../../utils/utils'

const state = {
    tasks: [],
    task: {},
    tasksForm: {
        task: {
            name: '',
            description: '',
            link: '',
            color: '',
            workgroups: [],
            interests: [],
            eventStartDate: '',
            eventEndDate: '',
            image: null,
            newImage: null,
            imagelink: '',
            secret: false
        },
        loading: false
    },
    search: {
        name: null,
        creator: {},
        suscriber: {},
        interests: [],
        interestsAll: false,
        workgroups: [],
        workgroupsAll: false,
        options: {},
    },
    totalTasks: 0,
    loading: false,
    skeleton: false
}

const mutations = {
    clearTaskForm: (state) => {
        state.tasksForm.task.name = '';
        state.tasksForm.task.description = '';
        state.tasksForm.task.interests = [];
        state.tasksForm.task.workgroups = [];
        state.tasksForm.task.link = '';
        state.tasksForm.task.eventStartDate = '';
        state.tasksForm.task.eventEndDate = '';
        state.tasksForm.task.image = null;
        state.tasksForm.task.imagelink = '';
        state.tasksForm.task.secret = false;
    },
    tasksLoad: (state, tasks) => {
        state.tasks = tasks
    },
    changeSkeleton: (state) => {
        state.skeleton = !state.skeleton
    },
    pullTask: (state, task) => {
        state.task = task
    },
    loadEditedTask: (state) => {
        state.tasksForm.task = Object.assign({}, state.task);
        state.tasksForm.task.eventStartDate = todayFormatToPicker(state.task.eventStartDate);
        state.tasksForm.task.eventEndDate = todayFormatToPicker(state.task.eventEndDate);
        state.tasksForm.task.newimage = null;
    },
    randomTaskColor: (state) => {
        state.tasksForm.task.color = generateRandomColor(30);
    },
    changeLoading: (state) => {
        state.loading = !state.loading
    },
    loadMembers: (state) => {
        state.tasksForm.task.suscribers = JSON.parse(JSON.stringify(state.task.suscribers));
    },
    setTotalTasks: (state, total) => {
        state.totalTasks = total;
    },
}

const getters = {
    validTask: (state) => {
        if (
            state.tasksForm.task.name != '' &&
            state.tasksForm.task.description != '' &&
            state.tasksForm.task.eventStartDate != '' &&
            state.tasksForm.task.eventEndDate != '' &&
            state.tasksForm.task.description.length <= 380 &&
            state.tasksForm.task.workgroups.length != 0
        ) {
            return false
        }
        else {
            return true
        }
    },

    editedTask: (state) => {
        if (
            state.tasksForm.task.name != state.task.name ||
            state.tasksForm.task.description != state.task.description ||
            state.tasksForm.task.eventEndDate != todayFormatToPicker(state.task.eventEndDate) ||
            state.tasksForm.task.eventStartDate != todayFormatToPicker(state.task.eventStartDate) ||
            state.tasksForm.task.link != state.task.link ||
            state.tasksForm.task.newImage != null ||
            state.tasksForm.task.secret != state.task.secret ||
            state.tasksForm.task.color.toUpperCase() != state.task.color.toUpperCase() ||
            isDiferentArray(state.tasksForm.task.workgroups, state.task.workgroups, '_id', '_id') ||
            isDiferentArray(state.tasksForm.task.interests, state.task.interests, '_id', '_id')
        ) {
            return false
        }
        else {
            return true
        }
    },

    editedMembers: (state) => {
        return !isDiferentArray(state.task.suscribers, state.tasksForm.task.suscribers, '_id', '_id')
    },
}

const actions = {
    async createTask({ state, commit, dispatch, rootGetters }, userId) {
        try {
            if (state.tasksForm.task.image != null) {
                state.tasksForm.task.image = await dispatch('general/saveFile', state.tasksForm.task.image, { root: true });
            }
            let body = state.tasksForm.task;
            body.creator = userId;
            let config = rootGetters['general/cookieAuth'];
            await Axios.post('/tasks/', body, config);
            commit('menu/notification', ['info', 5, 'Task created correctly'], { root: true });
            dispatch('loadTasks');
            commit('menu/cancelDialog', 'createtask', { root: true });
            commit('clearTaskForm');
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },

    async loadTasks({ commit, dispatch }) {
        try {
            commit('changeLoading');
            let res = await Axios.get('/tasks/');
            commit('tasksLoad', res.data);
            commit('changeLoading');
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
            commit('changeLoading');
        }
    },

    async loadTasksPaged({ state, commit, dispatch, rootGetters }) {
        try {
            commit('changeLoading');
            let config = Object.assign({}, rootGetters['general/cookieAuth']);
            config.params = state.search.options;
            config.params.searchName = state.search.name;
            config.params.searchCreator = state.search.creator?._id;
            config.params.searchSuscriber = state.search.suscriber?._id;
            config.params.searchWorkgroups = state.search.workgroups.map(i => i._id);
            config.params.searchModeWorkgroups = state.search.workgroupsAll;
            config.params.searchInterests = state.search.interests.map(i => i._id);
            config.params.searchModeInterests = state.search.interestsAll;
            let res = await Axios.get('/tasks/paged', config);
            commit('tasksLoad', res.data.items);
            commit('setTotalTasks', res.data.totalItems);
            commit('changeLoading');
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
            commit('changeLoading');
        }
    },

    async searchTask({ commit, dispatch, rootGetters }, id) {
        try {
            commit('changeSkeleton');
            let config = rootGetters['general/cookieAuth'];
            let res = await Axios.get('/tasks/' + id, config);
            commit('pullTask', res.data);
            commit('changeSkeleton');
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
            commit('changeSkeleton');
        }
    },

    async searchTaskSilent({ commit, dispatch, rootGetters }, id) {
        try {
            let config = rootGetters['general/cookieAuth'];
            let res = await Axios.get('/tasks/' + id, config);
            commit('pullTask', res.data);
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },

    async saveEditedTask({ state, commit, dispatch, rootGetters }) {
        try {
            let config = rootGetters['general/cookieAuth'];
            let body = state.tasksForm.task;
            if (body.newImage != null) {
                body.image = await dispatch('general/saveFile', body.newImage, { root: true });
            }
            let res = await Axios.put('/tasks/' + body._id, body, config);
            commit('pullTask', res.data);
            commit('menu/cancelDialog', 'edittask', { root: true });
            commit('clearTaskForm');
            commit('menu/notification', ['success', 5, 'Task saved correctly'], { root: true });
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },
    // TODO: finally deleted not implemented
    async delTask({ state, commit, dispatch, rootGetters }) {
        try {
            let config = rootGetters['general/cookieAuth'];
            await Axios.delete('/tasks/finally/' + state.task._id, config);
            await dispatch('loadTasks');
            router.push('/tasks');
            commit('menu/notification', ['info', 3, 'Task removed'], { root: true });
            commit('menu/cancelDialog', 'confirm', { root: true });
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },

    async delTaskSoft({ state, commit, dispatch, rootGetters }) {
        try {
            let config = rootGetters['general/cookieAuth'];
            let res = await Axios.delete('/tasks/' + state.task._id, config);
            commit('pullTask', res.data);
            await dispatch('loadTasks');
            router.push('/tasks');
            commit('menu/notification', ['info', 3, 'Task removed'], { root: true });
            commit('menu/cancelDialog', 'confirm', { root: true });
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },

    async joinTask({ state, commit, rootGetters, dispatch }, { userId }) {
        try {
            let config = rootGetters['general/cookieAuth'];
            let res = await Axios.put('/tasks/join/' + state.task._id, { user: userId }, config);
            commit('pullTask', res.data);
            commit('menu/notification', ['info', 10, 'Joined Succesfully 😀'], { root: true });
            commit('menu/cancelDialog', 'savemembertask', { root: true })
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },

    async unjoinTask({ state, commit, rootGetters, dispatch }, { userId }) {
        try {
            let config = rootGetters['general/cookieAuth'];
            let res = await Axios.put('/tasks/unjoin/' + state.task._id, { user: userId }, config);
            commit('pullTask', res.data);
            commit('menu/notification', ['info', 10, 'Unjoined Succesfully 🙁'], { root: true });
            commit('menu/cancelDialog', 'savemembertask', { root: true });
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },

    async saveMembers({ state, commit, dispatch, rootGetters }) {
        try {
            let config = rootGetters['general/cookieAuth'];
            let res = await Axios.put('/tasks/' + state.task._id, { suscribers: state.tasksForm.task.suscribers }, config);
            commit('pullTask', res.data);
            await dispatch('user/refreshLoadedUser', null, { root: true });
            commit('menu/cancelDialog', 'editmembers', { root: true });
            commit('menu/notification', ['info', 10, 'Members updated'], { root: true });
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