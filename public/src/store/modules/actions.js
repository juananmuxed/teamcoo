import Axios from 'axios'
import Cookies from 'js-cookie'
import { treeBuild , todayFormatToPicker , generateRandomColor } from '../../utils/utils'

const state = {
    actions: [],
    workgroups: [],
    secretworkgroups: [],
    nestedWGs: [],
    secretnestedWGs: [],
    topics: [],
    temporaluser:{
        firstname:'',
        lastname:'',
        avatar:'',
        id:''
    },
    questions: [],
    workgroupForm: {
        name: '',
        description: '',
        dossier: null,
        link: '',
        color: '#E0E0E0',
        textcolor: 'black',
        questionsSelected: [],
        questions: [],
        parent: null,
        secretparent: null,
        secret: false
    },
    interestForm: {
        name: '',
        color:''
    },
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
    },
    questionForm: {
        name: '',
        type: null,
        description: '',
        types: [
            { text: "Selection from a list", value: 'select' },
            { text: "Multiple checkboxs", value: 'checkbox' },
            { text: "Radio select", value: 'radio' },
            { text: "Open question", value: 'text' }
        ],
        selections: [
            { answer: 'Answer 1', value: 0 }
        ],
        selectCount: 0,
        checkboxs: [
            { answer: 'Option 1', value: 0 }
        ],
        checkboxCount: 0,
        radios: [
            { answer: 'Option 1', value: 0 }
        ],
        radioCount: 0,
        text: 'Simple question'
    },
    loadedSuscription: {}
}

const mutations = {
    temporaluser: (state,user) => {
        state.temporaluser.id = user._id,
        state.temporaluser.avatar = user.image,
        state.temporaluser.firstname = user.firstname,
        state.temporaluser.lastname = user.lastname
    },
    verifySecret: (state) => {
        if(state.workgroupForm.secret){state.workgroupForm.parent = null}
    },
    clearquestionForm: (state) => {
        state.questionForm.name = '',
            state.questionForm.description = '',
            state.questionForm.type = null,
            state.questionForm.selections = [{ answer: 'Answer 1', value: 0 }],
            state.questionForm.selectCount = 0,
            state.questionForm.checkboxs = [{ answer: 'Option 1', value: 0 }],
            state.questionForm.checkboxCount = 0,
            state.questionForm.radios = [{ answer: 'Option 1', value: 0 }],
            state.questionForm.radioCount = 0,
            state.questionForm.text = 'Simple question'
    },
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
    clearwgform: (state) => {
        state.workgroupForm.name = '',
            state.workgroupForm.description = '',
            state.workgroupForm.questionsSelected = [],
            state.workgroupForm.parent = null,
            state.workgroupForm.dossier = null,
            state.workgroupForm.secret = false,
            state.workgroupForm.link = '',
            state.workgroupForm.color = '#E0E0E0',
            state.workgroupForm.textcolor = 'black'
    },
    actionsLoad: (state, actions) => { state.actions = actions },
    topicsLoad: (state, topics) => { state.topics = topics },
    wgLoad: (state, workgroups) => { state.workgroups = workgroups },
    secretwgLoad: (state, secretworkgroups) => { state.secretworkgroups = secretworkgroups },
    wgNested: (state, nestedWGs) => { state.nestedWGs = nestedWGs },
    secretwgNested: (state, secretnestedWGs) => { state.secretnestedWGs = secretnestedWGs },
    questionsLoad: (state, questions) => {
        state.questions = questions
        for (let i = 0; i < questions.length; i++) {
            let question = {
                text: questions[i].name,
                value: questions[i]._id,
                type: questions[i].type
            }
            state.workgroupForm.questions.push(question)
        }
    },
    addTopic: (state, topic) => { state.actions.topics.push(topic) },
    changeTextColor: (state, color) => { state.workgroupForm.textcolor = color },
    addselect: (state, value) => { state.questionForm.selectCount++; state.questionForm.selections.push({ answer: 'Answer ' + (state.questionForm.selectCount + 1), value: value + 1 }) },
    delselect: (state) => { state.questionForm.selectCount--; state.questionForm.selections.pop() },
    addcheck: (state, value) => { state.questionForm.checkboxCount++; state.questionForm.checkboxs.push({ answer: 'Option ' + (state.questionForm.checkboxCount + 1), value: value + 1 }) },
    delcheck: (state) => { state.questionForm.checkboxCount--; state.questionForm.checkboxs.pop() },
    addradio: (state, value) => { state.questionForm.radioCount++; state.questionForm.radios.push({ answer: 'Option ' + (state.questionForm.radioCount + 1), value: value + 1 }) },
    delradio: (state) => { state.questionForm.radioCount--; state.questionForm.radios.pop() },
    wgforsuscription: (state, wg) => { state.loadedSuscription = wg[0] }
}

const getters = {
    validWG: (state) => {
        if (
            state.workgroupForm.name != '' &&
            state.workgroupForm.description != '' &&
            state.workgroupForm.description.length <= 200 &&
            state.workgroupForm.name.length >= 3 &&
            state.workgroupForm.questionsSelected.length != 0
        ) {
            return false
        }
        else {
            return true
        }
    },
    validTask: (state) => {
        if (
            state.tasksForm.name != '' &&
            state.tasksForm.description != '' &&
            state.tasksForm.endDate != '' &&
            state.tasksForm.startDate != '' &&
            state.tasksForm.description.length <= 200 &&
            state.tasksForm.workgroupsSelected.length != 0
        ) {
            return false
        }
        else {
            return true
        }
    },
    validQuestion: (state) => {
        if (
            state.questionForm.name != '' &&
            state.questionForm.type.length != 0 &&
            state.questionForm.description.length <= 200
        ) {
            return false
        }
        else {
            return true
        }
    }
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
                        state.tasksForm.imagelink = 'http://localhost:3000/api/files/image/' + res.data.file.filename
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
                topics: state.tasksForm.interestsSelected,
                workgroups: state.tasksForm.workgroupsSelected,
                eventStartDate:state.tasksForm.startDate,
                eventEndDate:state.tasksForm.endDate,
                image:state.tasksForm.imagelink,
                color:color,
                createdBy: userId,
                link: state.tasksForm.link
            }
            await Axios.post("/actions/create", body, config)
                .then(() => {
                    commit('menu/notification', ['info', 5, 'Task created'], { root: true })
                    dispatch('loadActions')
                    commit('menu/cancelDialog', 'createtask', { root: true })
                    commit('cleartaskform')
                })
        } catch (error) {
            commit('menu/notification', ['error', 5, error.response.data.message], { root: true });
        }
    },
    async createWorkGroup({ state, commit, dispatch }, userId) {
        try {
            let token = Cookies.get("catapa-jwt");
            let config = {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
            let dossier = state.workgroupForm.dossier
            if (dossier != null) {
                let formData = new FormData()
                const config = { headers: { 'Content-Type': 'multipart/form-data' } }
                formData.append('file', state.workgroupForm.dossier)
                await Axios.post("/files/upload", formData, config)
                    .then(res => {
                        dossier = 'http://localhost:3000/api/files/upload/' + res.data.file.filename
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
                linktodocuments: state.workgroupForm.link
            }
            await Axios.post("/wg/create", body, config)
                .then(() => {
                    commit('menu/notification', ['info', 5, 'Work group created'], { root: true })
                    dispatch('loadWG')
                    commit('menu/cancelDialog', 'createwg', { root: true })
                    commit('clearwgform')
                })
        } catch (error) {
            commit('menu/notification', ['error', 5, error.response.data.message], { root: true });
        }
    },
    async createQuestion({ state, commit, dispatch }, userId) {
        try {
            let token = Cookies.get("catapa-jwt");
            let config = {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
            let selections = []
            switch (state.questionForm.type) {
                case 'select':
                    selections = state.questionForm.selections
                    break;

                case 'checkbox':
                    selections = state.questionForm.checkboxs
                    break;

                case 'radio':
                    selections = state.questionForm.radios
                    break;

                case 'text':
                    selections = state.questionForm.text
                    break;

                default:
                    break;
            }
            let body = {
                name: state.questionForm.name,
                description: state.questionForm.description,
                type: state.questionForm.type,
                _userId: userId,
                selections: selections,
            }
            await Axios.post("/questions/create", body, config)
                .then(() => {
                    commit('menu/notification', ['info', 5, 'Question saved'], { root: true })
                    dispatch('loadQuestions')
                    commit('menu/cancelDialog', 'createquestion', { root: true })
                    commit('clearquestionForm')
                })
        } catch (error) {
            commit('menu/notification', ['error', 5, error.response.data.message], { root: true });
        }
    },
    async delSomething({commit,dispatch},item) {
        let url = ''
        let message = ''
        switch (item.type) {
            case 'task':
                url = "/actions/action/" + item.id
                message = 'Task Deleted'
                break;
        
            default:
                break;
        }
        try {
            let token = Cookies.get("catapa-jwt");
            let config = {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
            await Axios.delete(url, config)
            .then(() => {
                commit('menu/notification', ['info', 5, message], { root: true })
                dispatch('loadActions')
                commit('menu/cancelDialog', 'deletesome', { root: true })
            })
        } catch (error) {
            commit('menu/notification', ['error', 5, error], { root: true });
        }
    },
    idealTextColor({ commit }, color) {

        let r = color.substring(1, 3)
        let g = color.substring(3, 5)
        let b = color.substring(5, 7)

        let components = { R: parseInt(r, 16), G: parseInt(g, 16), B: parseInt(b, 16) }

        const nThreshold = 105
        let bgDelta = (components.R * 0.299) + (components.G * 0.587) + (components.B * 0.114)

        if ((255 - bgDelta) < nThreshold) {
            commit('changeTextColor', "black")
        }
        else {
            commit('changeTextColor', "white")
        }
    },
    async loadActions({ state, commit, dispatch }) {
        try {
            commit('menu/loadingstate', 'tasks', { root: true })
            await dispatch('loadTopics')
            await dispatch('loadWG')
            await Axios.get("/actions/all")
                .then(res => {
                    for (let i = 0; i < res.data.length; i++) {
                        let tempTopics = []
                        let tempWG = []
                        dispatch('loadcreator',res.data[i].createdBy)
                        for (let y = 0; y < res.data[i].topics.length; y++) {
                            for (let x = 0; x < state.topics.length; x++) {
                                if (state.topics[x]._id == res.data[i].topics[y]) {
                                    tempTopics.push(state.topics[x])
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
                        res.data[i].topics = tempTopics
                        res.data[i].workgroups = tempWG
                    }
                    commit('actionsLoad', res.data)
                    setTimeout(() => {
                        commit('menu/loadingstate', 'tasks', { root: true })
                    }, 800);
                })
                .catch(error => {
                    commit('menu/notification', ['error', 3, error], { root: true });
                    commit('menu/loadingstate', 'tasks', { root: true })
                })
        } catch (error) {
            commit('menu/notification', ['error', 3, error], { root: true });
            commit('menu/loadingstate', 'tasks', { root: true })
        }
    },
    async loadcreator({commit},userId){
        try {
            let token = Cookies.get("catapa-jwt");
            let config = {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
            await Axios.get("/users/user/" + userId, config)
                .then(res => {
                    commit('temporaluser', res.data);
                })
                .catch(error => {
                    commit('menu/notification', ['error', 3, error.response.data.message], { root: true });
                })
        } catch (error) {
            commit('menu/notification', ['error', 3, error], { root: true });
        }
    },
    async loadWG({ commit , dispatch }) {
        try {
            commit('menu/loadingstate', 'wg', { root: true });
            commit('menu/loadingstate', 'secretwg', { root: true });
            let token = Cookies.get("catapa-jwt");
            let config = {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
            await Axios.get("/wg/all", config)
                .then(res => {
                    let data = []
                    let secretdata = []
                    for (let i = 0; i < res.data.length; i++) {
                        dispatch('loadcreator',res.data[i]._userId)
                        res.data[i].creator = state.temporaluser
                        if (!res.data[i].secret) {
                            data.push(res.data[i])
                        }
                        else {
                            secretdata.push(res.data[i])
                        }
                    }
                    commit('wgLoad', data)
                    commit('secretwgLoad', secretdata)
                    let nestedWGs = treeBuild(data)
                    let secretnestedWGs = treeBuild(secretdata)
                    commit('wgNested', nestedWGs)
                    commit('secretwgNested', secretnestedWGs)
                    setTimeout(() => {
                        commit('menu/loadingstate', 'secretwg', { root: true })
                    }, 800);
                    setTimeout(() => {
                        commit('menu/loadingstate', 'wg', { root: true })
                    }, 600);
                })
                .catch(error => {
                    commit('menu/notification', ['error', 3, error], { root: true })
                    commit('menu/loadingstate', 'wg', { root: true })
                    commit('menu/loadingstate', 'secretwg', { root: true })
                })
        } catch (error) {
            commit('menu/notification', ['error', 3, error], { root: true })
            commit('menu/loadingstate', 'wg', { root: true })
            commit('menu/loadingstate', 'secretwg', { root: true })
        }
    },
    async loadTopics({ commit }) {
        try {
            let token = Cookies.get("catapa-jwt");
            let config = {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
            await Axios.get("/topics/all", config)
                .then(res => {
                    commit('topicsLoad', res.data)
                })
                .catch(error => {
                    commit('menu/notification', ['error', 3, error], { root: true })
                })
        } catch (error) {
            commit('menu/notification', ['error', 3, error], { root: true })
        }
    },
    async loadQuestions({ commit }) {
        try {
            let token = Cookies.get("catapa-jwt")
            let config = {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
            await Axios.get("/questions/all", config)
                .then(res => {
                    commit('questionsLoad', res.data)
                })
                .catch(error => {
                    commit('menu/notification', ['error', 3, error], { root: true })
                })
        } catch (error) {
            commit('menu/notification', ['error', 3, error], { root: true })
        }
    },
    async loadWGsuscription({ state, commit, dispatch }, id) {
        try {
            if (state.questions.length == 0) {
                await dispatch('loadQuestions')
            }
            let workgroup = state.workgroups.filter(wg => wg._id == id)
            let questionList = workgroup[0].questions
            let tempQuestions = []
            for (let i = 0; i < questionList.length; i++) {
                let question = state.questions.find(q => q._id == questionList[i])
                tempQuestions.push(question)
            }
            workgroup[0].questions.length = 0
            workgroup[0].questions = tempQuestions
            commit('wgforsuscription', workgroup)
        } catch (error) {
            commit('menu/notification', ['error', 3, error], { root: true })
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