import router from '@/router'
import Axios from 'axios'
import Cookies from 'js-cookie'
import { treeBuild , todayFormatToPicker , generateRandomColor , idEqualArray } from '../../utils/utils'

const state = {
    actions: [],
    workgroups: [],
    secretworkgroups: [],
    nestedWGs: [],
    secretnestedWGs: [],
    topics: [],
    searchedWG:{},
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
    editmemberform:{
        members:[],
        coordinators:[],
        loading: false
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
    usersforadd:[],
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
        state.temporaluser.lastname = user.lastname,
        state.temporaluser.rol = user.rol
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
    loadeditedwg:(state) => {
        state.workgroupForm.name = state.searchedWG.name,
        state.workgroupForm.description = state.searchedWG.description,
        state.workgroupForm.link = state.searchedWG.linktodocuments,
        state.workgroupForm.color = state.searchedWG.color,
        state.workgroupForm.textcolor = state.searchedWG.textcolor
        if(state.searchedWG.dossier != null){state.workgroupForm.oldDossier = state.searchedWG.dossier, state.workgroupForm.dossier = null}
        else{state.workgroupForm.oldDossier = null}
        state.workgroupForm.questionsSelected = []
        for (let x = 0; x < state.searchedWG.questions.length; x++) {
            let tempWGquestion = {
                text:state.searchedWG.questions[x].name,
                type:state.searchedWG.questions[x].type,
                value:state.searchedWG.questions[x]._id
            }
            state.workgroupForm.questionsSelected.push(tempWGquestion)
        }
    },
    actionsLoad: (state, actions) => { state.actions = actions },
    topicsLoad: (state, topics) => { state.topics = topics },
    wgLoad: (state, workgroups) => { state.workgroups = workgroups },
    secretwgLoad: (state, secretworkgroups) => { state.secretworkgroups = secretworkgroups },
    wgNested: (state, nestedWGs) => { state.nestedWGs = nestedWGs },
    secretwgNested: (state, secretnestedWGs) => { state.secretnestedWGs = secretnestedWGs },
    questionsLoad: (state, questions) => {
        state.questions = questions
        let tempQuestions = []
        for (let i = 0; i < questions.length; i++) {
            let question = {
                text: questions[i].name,
                value: questions[i]._id,
                type: questions[i].type
            }
            tempQuestions.push(question)
        }
        state.workgroupForm.questions = tempQuestions
    },
    addTopic: (state, topic) => { state.actions.topics.push(topic) },
    changeTextColor: (state, color) => { state.workgroupForm.textcolor = color },
    addselect: (state, value) => { state.questionForm.selectCount++; state.questionForm.selections.push({ answer: 'Answer ' + (state.questionForm.selectCount + 1), value: value + 1 }) },
    delselect: (state) => { state.questionForm.selectCount--; state.questionForm.selections.pop() },
    addcheck: (state, value) => { state.questionForm.checkboxCount++; state.questionForm.checkboxs.push({ answer: 'Option ' + (state.questionForm.checkboxCount + 1), value: value + 1 }) },
    delcheck: (state) => { state.questionForm.checkboxCount--; state.questionForm.checkboxs.pop() },
    addradio: (state, value) => { state.questionForm.radioCount++; state.questionForm.radios.push({ answer: 'Option ' + (state.questionForm.radioCount + 1), value: value + 1 }) },
    delradio: (state) => { state.questionForm.radioCount--; state.questionForm.radios.pop() },
    wgforsuscription: (state, wg) => { state.loadedSuscription = wg[0] },
    pullWG:(state,wg) => {state.searchedWG = wg},
    newmembers:(state,members) => {
        state.searchedWG.members = []
        for (let x = 0; x < members.length; x++) {
            state.searchedWG.members.push(members[x])
        }
    },
    newcoors:(state,coors) => {
        state.searchedWG.coordinators = []
        for (let x = 0; x < coors.length; x++) {
            state.searchedWG.coordinators.push(coors[x])
        }
    },
    addallusers:(state,users) => {
        state.usersforadd = []
        for (let x = 0; x < users.length; x++) {
            state.usersforadd.push(users[x])
        }
    },
    loadmembers:(state,members) => {
        state.editmemberform.members = []
        for (let x = 0; x < members.members.length; x++) {
            state.editmemberform.members.push(members.members[x])
        }
        state.editmemberform.coordinators = []
        for (let x = 0; x < members.coordinators.length; x++) {
            state.editmemberform.coordinators.push(members.coordinators[x])
        }
    }
}

const getters = {
    validWG: (state) => {
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
    validQuestion: (state) => {
        if (
            state.questionForm.name != '' &&
            state.questionForm.type.length != 0 &&
            state.questionForm.description.length <= 380
        ) {
            return false
        }
        else {
            return true
        }
    },
    editedwg:(state) =>{
        let invalidquestion = true
        for (let x = 0; x < state.workgroupForm.questionsSelected.length; x++) {
            if(state.searchedWG.questions.some(question => question._id == state.workgroupForm.questionsSelected[x].value)){
                invalidquestion = false
            }
        }
        if (
            state.workgroupForm.name != state.searchedWG.name ||
            state.workgroupForm.description != state.searchedWG.description ||
            state.workgroupForm.link != state.searchedWG.linktodocuments ||
            state.workgroupForm.color != state.searchedWG.color ||
            state.workgroupForm.oldDossier != state.searchedWG.dossier ||
            state.workgroupForm.dossier != null ||
            invalidquestion
        ) {
            return false
        }
        else {
            return true
        }
    },
    editedMembers:(state) => {
        if(idEqualArray(state.searchedWG.members,state.editmemberform.members,'id')){
            return false
        }
        if(idEqualArray(state.searchedWG.coordinators,state.editmemberform.coordinators,'id')){
            return false
        }
        return true
    },
    correctwg:(state) => {
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
                coordinators: [userId],
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
                    commit('menu/notification', ['info', 3, 'Question saved'], { root: true })
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

            case 'workgroup':
                url = "/wg/" + item.id
                message = 'Work Group Deleted'
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
                commit('menu/notification', ['info', 3, message], { root: true })
                dispatch('loadActions')
                router.push('/dashboard')
                commit('menu/cancelDialog', 'confirm', { root: true })
            })
        } catch (error) {
            commit('menu/notification', ['error', 5, error.response.data.message], { root: true });
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
            commit('menu/loadingstate', ['tasks',true], { root: true })
            await dispatch('loadTopics')
            await dispatch('loadWG')
            let res = await Axios.get("/actions/all")
            for (let i = 0; i < res.data.length; i++) {
                let tempTopics = []
                let tempWG = []
                await dispatch('loadUserByID',res.data[i].createdBy)
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
                commit('menu/loadingstate', ['tasks',false], { root: true })
            }, 800)
        } catch (error) {
            commit('menu/notification', ['error', 3, error], { root: true });
            commit('menu/loadingstate', ['tasks',false], { root: true })
        }
    },
    async loadUserByID({state,commit},userId){
        try {
            let token = Cookies.get("catapa-jwt");
            let config = {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
            await Axios.get("/users/user/" + userId, config)
                .then(res => {
                    state.temporaluser = {}
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
            commit('menu/loadingstate', ['wg',true], { root: true })
            commit('menu/loadingstate', ['secretwg',true], { root: true })
            let token = Cookies.get("catapa-jwt");
            let config = {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
            let res = await Axios.get("/wg/all", config)
            let data = []
            let secretdata = []
            for (let i = 0; i < res.data.length; i++) {
                let wg = res.data[i]
                await dispatch('loadUserByID',wg._userId)
                wg.creator = state.temporaluser
                let tempquestions = []
                for (let x = 0; x < wg.questions.length; x++) {
                    for (let y = 0; y < state.questions.length; y++) {
                        if(state.questions[y]._id == wg.questions[x]){
                            tempquestions.push(state.questions[y])
                        }
                    }
                }
                wg.questions = tempquestions
                let tempCoordinators = []
                for (let x = 0; x < wg.coordinators.length; x++) {
                    await dispatch('loadUserByID',wg.coordinators[x])
                    tempCoordinators.push(state.temporaluser)
                }
                wg.coordinators = tempCoordinators
                let tempMembers = []
                for (let x = 0; x < wg.members.length; x++) {
                    await dispatch('loadUserByID',wg.members[x])
                    tempMembers.push(state.temporaluser)
                }
                wg.members = tempMembers
                if (!wg.secret) {
                    data.push(wg)
                }
                else {
                    secretdata.push(wg)
                }
            }
            commit('wgLoad', data)
            commit('secretwgLoad', secretdata)
            let nestedWGs = treeBuild(data)
            let secretnestedWGs = treeBuild(secretdata)
            commit('wgNested', nestedWGs)
            commit('secretwgNested', secretnestedWGs)
            setTimeout(() => {
                commit('menu/loadingstate', ['secretwg',false], { root: true })
            }, 800);
            setTimeout(() => {
                commit('menu/loadingstate', ['wg',false], { root: true })
            }, 600)
        } catch (error) {
            commit('menu/notification', ['error', 3, error], { root: true })
            commit('menu/loadingstate', ['wg',false], { root: true })
            commit('menu/loadingstate', ['secretwg',false], { root: true })
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
    async searchWG({state,commit,dispatch},id) {
        commit('menu/loadingbar', ['info', true , 0], { root: true })
        commit('menu/loadingstate', ['itembig',true], { root: true })
        try {
            if(state.searchedWG._id != id){
                let token = Cookies.get("catapa-jwt");
                let config = {
                    headers: {
                        Authorization: "Bearer " + token
                    }
                }
                await dispatch('loadQuestions')
                commit('menu/loadingbar', ['info', null , 30], { root: true })
                let res = await Axios.get('/wg/' + id, config)
                let wg = res.data
                await dispatch('loadUserByID',wg._userId)
                let creator =  state.temporaluser
                let questionList = wg.questions
                wg['creator'] = creator
                let tempCoordinators = []
                for (let x = 0; x < wg.coordinators.length; x++) {
                    await dispatch('loadUserByID',wg.coordinators[x])
                    tempCoordinators.push(state.temporaluser)
                }
                wg.coordinators = tempCoordinators
                let tempMembers = []
                for (let x = 0; x < wg.members.length; x++) {
                    await dispatch('loadUserByID',wg.members[x])
                    tempMembers.push(state.temporaluser)
                }
                wg.members = tempMembers
                let tempQuestions = []
                for (let i = 0; i < questionList.length; i++) {
                    let question = await state.questions.find(q => q._id == questionList[i])
                    tempQuestions.push(question)
                }
                wg.questions.length = 0
                wg.questions = tempQuestions
                commit('pullWG', wg) 
                commit('menu/loadingbar', ['primary', null , 100], { root: true })
            }
        } catch (error) {
            commit('menu/notification', ['error', 3, error.response.data.message], { root: true })
            commit('menu/loadingbar', ['error', null , 100], { root: true })
        }
    },
    async saveEditedWG({state,commit,dispatch},id) {
        commit('menu/loadingstate', ['itembig',true], { root: true })
        try {
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
            else{
                dossier = state.workgroupForm.oldDossier
            }
            let tempQuestions = []
            for (let x = 0; x < state.workgroupForm.questionsSelected.length; x++) {
                if(state.workgroupForm.questionsSelected[x].value != null) {
                    tempQuestions.push(state.workgroupForm.questionsSelected[x].value)
                }
                else{
                    tempQuestions.push(state.workgroupForm.questionsSelected[x])
                }
            }
            let body = {
                name: state.workgroupForm.name,
                description: state.workgroupForm.description,
                textcolor: state.workgroupForm.textcolor,
                color: state.workgroupForm.color,
                questions: tempQuestions,
                dossier: dossier,
                linktodocuments: state.workgroupForm.link
            }
            let token = Cookies.get("catapa-jwt");
            let config = {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
            let res = await Axios.put("/wg/" + id, body, config)
            commit('menu/notification', ['info', 5, 'Work group edited'], { root: true })
            commit('menu/cancelDialog', 'editwg', { root: true })
            let wg = res.data
            await dispatch('loadUserByID',wg._userId)
            let creator =  state.temporaluser
            let questionList = wg.questions
            wg['creator'] = creator
            let tempCoordinators = []
            for (let x = 0; x < wg.coordinators.length; x++) {
                await dispatch('loadUserByID',wg.coordinators[x])
                tempCoordinators.push(state.temporaluser)
            }
            wg.coordinators = tempCoordinators
            let tempMembers = []
            for (let x = 0; x < wg.members.length; x++) {
                await dispatch('loadUserByID',wg.members[x])
                tempMembers.push(state.temporaluser)
            }
            wg.members = tempMembers
            let tempQuestionsLoaded = []
            for (let i = 0; i < questionList.length; i++) {
                let question = state.questions.find(q => q._id == questionList[i])
                tempQuestionsLoaded.push(question)
            }
            wg.questions.length = 0
            wg.questions = tempQuestionsLoaded
            commit('pullWG', wg)
            commit('clearwgform')
            setTimeout(() => {
                commit('menu/loadingstate', ['itembig',false], { root: true })
                commit('menu/loadingbar', [null,false,null], { root: true })
            }, 300)
            } catch (error) {
                commit('menu/notification', ['error', 5, error.response.data.message], { root: true })
                setTimeout(() => {
                    commit('menu/loadingbar', [null,false,null], { root: true })
                    commit('menu/loadingstate', ['itembig',false], { root: true })
                }, 300);
        }
    },
    async joinWG({state,commit,dispatch},ids) {
        try {
            let wg = state.searchedWG
            let members = []
            for (let x = 0; x < wg.members.length; x++) {
                members.push(wg.members[x].id)
            }
            for (let x = 0; x < ids.idUsers.length; x++) {
                members.push(ids.idUsers[x])
            }
            let body = {
                members: members
            }
            let token = Cookies.get("catapa-jwt");
            let config = {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
            let res = await Axios.put('/wg/' + ids.idWG,body,config)
            let reswg = res.data
            let tempMembers = []
            for (let x = 0; x < reswg.members.length; x++) {
                await dispatch('loadUserByID',reswg.members[x])
                tempMembers.push(state.temporaluser)
            }
            reswg.members = tempMembers
            commit('newmembers', reswg.members) 
            commit('menu/cancelDialog', 'suscribeto', { root: true })
        } catch (error) {
            commit('menu/notification', ['error', 5, error], { root: true })
        }
    },
    async unjoinWG({state,commit,dispatch},ids) {
        try {
            let wg = state.searchedWG
            let members = []
            for (let x = 0; x < wg.members.length; x++) {
                members.push(wg.members[x].id)
            }
            for (let x = 0; x < members.length; x++) {
                if(ids.idUsers.some(id => id == members[x])){
                    members.splice(x,1)
                }
            }
            let body = {
                members: members
            }
            let token = Cookies.get("catapa-jwt");
            let config = {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
            let res = await Axios.put('/wg/' + ids.idWG,body,config)
            let reswg = res.data
            let tempMembers = []
            for (let x = 0; x < reswg.members.length; x++) {
                await dispatch('loadUserByID',reswg.members[x])
                tempMembers.push(state.temporaluser)
            }
            reswg.members = tempMembers
            commit('newmembers', reswg.members) 
            commit('menu/cancelDialog', 'unsuscribewg', { root: true })
        } catch (error) {
            commit('menu/notification', ['error', 5, error], { root: true })
        }
    },
    async coorWG({state,commit,dispatch},ids) {
        try {
            let wg = state.searchedWG
            let coordinators = []
            for (let x = 0; x < wg.coordinators.length; x++) {
                coordinators.push(wg.coordinators[x].id)
            }
            for (let x = 0; x < ids.idUsers.length; x++) {
                coordinators.push(ids.idUsers[x])
            }
            let body = {
                coordinators: coordinators
            }
            let token = Cookies.get("catapa-jwt");
            let config = {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
            let res = await Axios.put('/wg/' + ids.idWG,body,config)
            let reswg = res.data
            let tempCoordinators = []
            for (let x = 0; x < reswg.coordinators.length; x++) {
                await dispatch('loadUserByID',reswg.coordinators[x])
                tempCoordinators.push(state.temporaluser)
            }
            reswg.coordinators = tempCoordinators
            commit('newcoors', reswg.coordinators)
        } catch (error) {
            commit('menu/notification', ['error', 5, error], { root: true })
        }
    },
    async uncoorWG({state,commit,dispatch},ids) {
        try {
            let wg = state.searchedWG
            let coordinators = []
            for (let x = 0; x < wg.coordinators.length; x++) {
                coordinators.push(wg.coordinators[x].id)
            }
            for (let x = 0; x < coordinators.length; x++) {
                if(ids.idUsers.some(id => id == coordinators[x])){
                    coordinators.splice(x,1)
                }
            }
            let body = {
                coordinators: coordinators
            }
            let token = Cookies.get("catapa-jwt");
            let config = {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
            let res = await Axios.put('/wg/' + ids.idWG,body,config)
            let reswg = res.data
            let tempCoordinators = []
            for (let x = 0; x < reswg.coordinators.length; x++) {
                await dispatch('loadUserByID',reswg.coordinators[x])
                tempCoordinators.push(state.temporaluser)
            }
            reswg.coordinators = tempCoordinators
            commit('newcoors', reswg.coordinators)
        } catch (error) {
            commit('menu/notification', ['error', 5, error], { root: true })
        }
    },
    async refreshingWG({state,commit,dispatch},id) {
        try {
            let token = Cookies.get("catapa-jwt");
            let config = {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
            let res = await Axios.get('/wg/' + id,config)
            let wg = res.data
            await dispatch('loadUserByID',wg._userId)
            let creator =  state.temporaluser
            let questionList = wg.questions
            wg['creator'] = creator
            let tempCoordinators = []
            for (let x = 0; x < wg.coordinators.length; x++) {
                await dispatch('loadUserByID',wg.coordinators[x])
                tempCoordinators.push(state.temporaluser)
            }
            wg.coordinators = tempCoordinators
            let tempMembers = []
            for (let x = 0; x < wg.members.length; x++) {
                await dispatch('loadUserByID',wg.members[x])
                tempMembers.push(state.temporaluser)
            }
            wg.members = tempMembers
            let tempQuestionsLoaded = []
            for (let i = 0; i < questionList.length; i++) {
                let question = state.questions.find(q => q._id == questionList[i])
                tempQuestionsLoaded.push(question)
            }
            wg.questions.length = 0
            wg.questions = tempQuestionsLoaded
            commit('pullWG', wg)
        } catch (error) {
            commit('menu/notification', ['error', 5, error], { root: true })
        }
    },
    async loadusers({state,commit}) {
        try {
            state.editmemberform.loading = true
            let token = Cookies.get("catapa-jwt");
            let config = {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
            let res = await Axios.get('/users/all',config)
            commit('addallusers',res.data)
            setTimeout(() => {
                state.editmemberform.loading = false
            }, 400)
        } catch (error) {
            commit('menu/notification', ['error', 5, error], { root: true })
        }
    },
    async saveMembers({state,commit,dispatch},ids) {
        try {
            state.editmemberform.loading = true
            let idWG = ids.idWG
            let idUsersToAdd = []
            let idUsersToDel = []
            let idCoorsToAdd = []
            let idCoorsToDel = []
            for (let x = 0; x < ids.idUsers.length; x++) {
                if(state.searchedWG.members.length > 0) {
                    if(!state.searchedWG.members.some(member => member.id == ids.idUsers[x].id)) {
                        idUsersToAdd.push(ids.idUsers[x].id)
                    }
                }
                else{
                    idUsersToAdd.push(ids.idUsers[x].id)
                }
            }
            for (let i = 0; i < state.searchedWG.members.length; i++) {
                if(ids.idUsers.length > 0) {
                    if(!ids.idUsers.some(user => user.id == state.searchedWG.members[i].id)) {
                        idUsersToDel.push(state.searchedWG.members[i].id)
                    }
                }
                else{
                    idUsersToDel.push(state.searchedWG.members[i].id)
                }
            }
            for (let x = 0; x < ids.idCoor.length; x++) {
                if(state.searchedWG.coordinators.length > 0) {
                    if(!state.searchedWG.coordinators.some(coor => coor.id == ids.idCoor[x].id)) {
                        idCoorsToAdd.push(ids.idCoor[x].id)
                    }
                }
                else{
                    idCoorsToAdd.push(ids.idCoor[x].id)
                }
            }
            for (let i = 0; i < state.searchedWG.coordinators.length; i++) {
                if(ids.idCoor.length > 0) {
                    if(!ids.idCoor.some(user => user.id == state.searchedWG.coordinators[i].id)) {
                        idCoorsToDel.push(state.searchedWG.coordinators[i].id)
                    }
                }
                else{
                    idCoorsToDel.push(state.searchedWG.coordinators[i].id)
                }
            }
            let token = Cookies.get("catapa-jwt")
            let config = {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
            if(idUsersToAdd.length != 0) {
                await dispatch('joinWG',{idWG:idWG,idUsers:idUsersToAdd})
                let wg = {
                    _wgId: idWG,
                    suscribedDate: Date.now(),
                    answers: 'Added by Coordinator'
                }
                for (let x = 0; x < idUsersToAdd.length; x++) {
                    let res = await Axios.get('/users/user/' + idUsersToAdd[x],config)
                    let user = res.data
                    let isWG = user.unsuscribedworkgroups.some(wg => wg._wgId === idWG)
                    if (isWG) {
                        let indexExtracted = await user.unsuscribedworkgroups.findIndex(wg => wg._wgId === idWG)
                        user.unsuscribedworkgroups.splice(indexExtracted, 1)
                    }
                    user.workgroups.push(wg)
                    await Axios.put("/users/user/" + user._id, user, config)
                }
            }
            if(idUsersToDel.length != 0) {
                await dispatch('unjoinWG',{idWG:idWG,idUsers:idUsersToDel})
                for (let x = 0; x < idUsersToDel.length; x++) {
                    let res = await Axios.get('/users/user/' + idUsersToDel[x],config)
                    let user = res.data
                    let isWG = user.workgroups.some(wg => wg._wgId === idWG)
                    if (isWG) {
                        let extractedItem = await user.workgroups.find(wg => wg._wgId === idWG)
                        let indexExtracted = await user.workgroups.findIndex(wg => wg._wgId === idWG)
                        user.unsuscribedworkgroups.push(extractedItem)
                        user.workgroups.splice(indexExtracted, 1)
                    }
                    await Axios.put("/users/user/" + user._id, user, config)
                }
            }
            if(idCoorsToAdd.length != 0) {
                await dispatch('coorWG',{idWG:idWG,idUsers:idCoorsToAdd})
            }
            if(idCoorsToDel.length != 0) {
                await dispatch('uncoorWG',{idWG:idWG,idUsers:idCoorsToDel})
            }
            await dispatch('user/userData',null,{root:true})
            setTimeout(() => {
                state.editmemberform.loading = false
            }, 400);
            commit('menu/cancelDialog', 'editmembers', { root: true });
            commit('menu/notification', ['info', 10, 'Members updated'], { root: true })
        } catch (error) {
            state.editmemberform.loading = false
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