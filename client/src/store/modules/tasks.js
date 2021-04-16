import Axios from 'axios'
import Cookies from 'js-cookie'
import globalConfig from '../../config/config.json'
import { todayFormatToPicker , generateRandomColor } from '../../utils/utils'

// TODO: split this file by type.

const state = {
    tasks: [],
    tasksForm: {
        name: '',
        description: '',
        link: '',
        workgroupsSelected: [],
        interestsSelected: [],
        startDate: todayFormatToPicker(),
        endDate: '',
        image:null,
        imagelink:''
    }
}

const mutations = {
    cleartaskform: (state) => {
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
}

const actions = {
    async createTask({ state, commit, dispatch }, userId){
        try {
            if (state.tasksForm.image != null) {
                let formData = new FormData()
                const config = { headers: { 'Content-Type': 'multipart/form-data' } }
                formData.append('file', state.tasksForm.image)
                await Axios.post("/files/upload", formData, config)
                    .then(res => {
                        state.tasksForm.imagelink = globalConfig.global.hostnameApi + '/files/image/' + res.data.file.filename
                    })
                    .catch(error => {
                        commit('menu/notification', ['error', 10, error], { root: true });
                    })
            }
            else{
                state.tasksForm.imagelink = state.tasksForm.link
            }
            let color = generateRandomColor(135)
            let token = Cookies.get("catapa-jwt");
            let config = {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
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
            await Axios.post("/tasks/", body, config)
                .then(() => {
                    commit('menu/notification', ['info', 5, 'Task created'], { root: true })
                    dispatch('loadTasks')
                    commit('menu/cancelDialog', 'createtask', { root: true })
                    commit('cleartaskform')
                })
        } catch (error) {
            commit('menu/notification', ['error', 5, error.response.data.message], { root: true });
        }
    },
    async loadTasks({ state, commit, dispatch }) {
        try {
            commit('menu/loadingstate', ['tasks',true], { root: true })
            await dispatch('loadInterests')
            await dispatch('loadWG')
            let res = await Axios.get("/tasks/")
            for (let i = 0; i < res.data.length; i++) {
                let tempInterests = []
                let tempWG = []
                await dispatch('loadUserByID',res.data[i].createdBy)
                for (let y = 0; y < res.data[i].interests.length; y++) {
                    for (let x = 0; x < state.interests.length; x++) {
                        if (state.interests[x]._id == res.data[i].interests[y]) {
                            tempInterests.push(state.interests[x])
                        }
                    }
                }
                for (let y = 0; y < res.data[i].workgroups.length; y++) {
                    for (let x = 0; x < state.workgroups.length; x++) {
                        if (state.workgroups[x]._id == res.data[i].workgroups[y]) {
                            tempWG.push(state.workgroups[x])
                        }
                    }
                }
                res.data[i].creator = state.temporaluser
                res.data[i].interests = tempInterests
                res.data[i].workgroups = tempWG
            }
            commit('tasksLoad', res.data)
            setTimeout(() => {
                commit('menu/loadingstate', ['tasks',false], { root: true });
            }, 800);
        } catch (error) {
            commit('menu/notification', ['error', 3, error], { root: true });
            commit('menu/loadingstate', ['tasks',false], { root: true })
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