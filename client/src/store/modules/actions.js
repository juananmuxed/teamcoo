import router from '@/router'
import Axios from 'axios'
import Cookies from 'js-cookie'
import globalConfig from '../../config/config.json'
import { treeBuild , todayFormatToPicker , generateRandomColor , isDiferentArray, idealTextColor } from '../../utils/utils'

// TODO: split this file by type.

const state = {
    actions: [],
    workgroups: [],
    secretworkgroups: [],
    nestedWGs: [],
    secretnestedWGs: [],
    interests: [],
    searchedWG:{},
    searchedQuestion:{},
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
    loading:{
        workgroups:false,
        secretworkgroups:false,
        questions: false
    },
    usersforadd:[],
    questionForm: {
        name: '',
        loading: false,
        type: null,
        description: '',
        selectionsSelected:[],
        types: [
            { text: "Selection from a list", value: 'select' },
            { text: "Multiple checkboxs", value: 'checkbox' },
            { text: "Radio select", value: 'radio' },
            { text: "Open question", value: 'text' }
        ],
        text: ''
    },
    loadedSuscription: {}
}

const mutations = {
    loadEditedQuestion: (state,question) => {
        state.searchedQuestion = question
        state.questionForm.name = question.name,
        state.questionForm.description = question.description,
        state.questionForm.type = question.type
        state.questionForm.selectionsSelected = question.selections
        if(question.type == 'text') {
            state.questionForm.text = question.selections[0]
        }
    },
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
            state.questionForm.selectionsSelected = [],
            state.questionForm.text = ''
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
    interestsLoad: (state, interests) => { state.interests = interests },
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
    addInterests: (state, interest) => { state.actions.interests.push(interest) },
    changeTextColor: (state, color) => { state.workgroupForm.textcolor = color },
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
        let validating = null
        if(state.questionForm.type != 'text') {
            validating = state.questionForm.selectionsSelected.length != 0
        } else {
            validating = state.questionForm.text != ''
        }
        if (
            state.questionForm.name != '' &&
            state.questionForm.type != '' &&
            validating &&
            state.questionForm.description.length <= 380
        ) {
            return false
        }
        else {
            return true
        }
    },
    isEditedQuestion: (state) => {
        let validating = null
        if (state.questionForm.type == 'text') {
            validating = state.questionForm.text != state.searchedQuestion.selections
        } else {
            validating = isDiferentArray(state.questionForm.selectionsSelected,state.searchedQuestion.selections)
        }
        if(
            state.questionForm.name != state.searchedQuestion.name ||
            state.questionForm.type != state.searchedQuestion.type ||
            state.questionForm.description != state.searchedQuestion.description ||
            validating
            ) {
            return true
        }
        else {
            return false
        }
    },
    editedwg:(state) =>{
        if (
            state.workgroupForm.name != state.searchedWG.name ||
            state.workgroupForm.description != state.searchedWG.description ||
            state.workgroupForm.link != state.searchedWG.linktodocuments ||
            state.workgroupForm.color != state.searchedWG.color ||
            state.workgroupForm.oldDossier != state.searchedWG.dossier ||
            state.workgroupForm.dossier != null ||
            isDiferentArray(state.workgroupForm.questionsSelected,state.searchedWG.questions,'value','_id')
        ) {
            return false
        }
        else {
            return true
        }
    },
    editedMembers:(state) => {
        if(isDiferentArray(state.searchedWG.members,state.editmemberform.members,'id','id')){
            return false
        }
        if(isDiferentArray(state.searchedWG.coordinators,state.editmemberform.coordinators,'id','id')){
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
            let selections = state.questionForm.selectionsSelected
            let questionsAxios = await Axios.get('/questions/all',config)
            let resQuestion = questionsAxios.data
            if(resQuestion.some(question => question.name == state.questionForm.name)) {
                throw new Error('Question name in use: ' + state.questionForm.name)
            }
            let interests = []
            if(state.questionForm.type != 'text') {
                let interestsAxios = await Axios.get('/interests/all', config)
                let resInter = interestsAxios.data
                for (let x = 0; x < selections.length; x++) {
                    if(resInter.some(interest => interest.name == selections[x])) {
                        throw new Error('Interest duplicated, use another: ' + selections[x])
                    }
                    let interest = {
                        name: selections[x],
                        description: 'From ' + state.questionForm.name + ' question',
                        color: '#C8EAEF'
                    }
                    interests.push(interest)
                }
            } else {
                selections = state.questionForm.text
            }
            let body = {
                name: state.questionForm.name,
                description: state.questionForm.description,
                type: state.questionForm.type,
                _userId: userId,
                selections: selections,
            }
            if(state.questionForm.type != 'text'){
                for (let x = 0; x < interests.length; x++) {
                    await Axios.post('/interests/create',interests[x],config)
                }
            }
            await Axios.post('/questions/create', body, config)
            commit('menu/notification', ['info', 3, 'Question saved'], { root: true })
            dispatch('loadQuestions')
            commit('menu/cancelDialog', 'createquestion', { root: true })
            commit('clearquestionForm')
        } catch (error) {
            if(!error.message){
                commit('menu/notification', ['error', 5, error.response.data.message], { root: true });
            }
            else{
                commit('menu/notification', ['error', 5, error.message], { root: true });
            }
        }
    },
    // TODO: Revisar el vaciado completo Miembros/Coordinadores/Tareas todo lo asociado.
    async delSomething({commit,dispatch},item) {
        let url = ''
        let message = ''
        let push = '/'
        let actionfordispatch = null
        switch (item.type) {
            case 'task':
                push = 'tasks'
                url = "/actions/action/" + item.id
                message = 'Task Deleted'
                break
            case 'workgroup':
                url = "/wg/" + item.id
                message = 'Work Group Deleted'
                actionfordispatch = 'loadWG'
                push = {go: true, path: '',number: -1}
                break
            case 'question':
                push = {go: false, path: '/questions',number: 0}
                actionfordispatch = 'loadQuestions'
                url = "/questions/question/" + item.id
                message = 'Question Deleted. The asociated Interests are actives.'
                break
            default:
                break
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
                dispatch(actionfordispatch)
                if(push.go) {
                    router.go(push.number)
                }
                else{
                    router.push(push.path)
                }
                commit('menu/cancelDialog', 'confirm', { root: true })
            })
        } catch (error) {
            commit('menu/notification', ['error', 5, error.response.data], { root: true });
        }
    },
    idealTextColor({ commit }, color) {
        commit('changeTextColor', idealTextColor(color))
    },
    async loadActions({ state, commit, dispatch }) {
        try {
            commit('menu/loadingstate', ['tasks',true], { root: true })
            await dispatch('loadInterests')
            await dispatch('loadWG')
            let res = await Axios.get("/actions/all")
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
            commit('actionsLoad', res.data)
            setTimeout(() => {
                commit('menu/loadingstate', ['tasks',false], { root: true });
            }, 800);
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
            await Axios.get("/users/" + userId, config)
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
    async loadWG({state ,  commit , dispatch }) {
        try {
            state.loading.workgroups = true
            state.loading.secretworkgroups = true
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
                        if(state.questions[y]._id == wg.questions[x]) tempquestions.push(state.questions[y])
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
                !wg.secret ? data.push(wg) : secretdata.push(wg);
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
            state.loading.secretworkgroups = false
            state.loading.workgroups = false
        } catch (error) {
            state.loading.secretworkgroups = false
            state.loading.workgroups = false
            commit('menu/notification', ['error', 3, error], { root: true })
            commit('menu/loadingstate', ['wg',false], { root: true })
            commit('menu/loadingstate', ['secretwg',false], { root: true })
        }
    },
    async loadInterests({ commit }) {
        try {
            let token = Cookies.get("catapa-jwt");
            let config = {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
            await Axios.get("/interests/all", config)
                .then(res => {
                    commit('interestsLoad', res.data)
                })
                .catch(error => {
                    commit('menu/notification', ['error', 3, error], { root: true })
                })
        } catch (error) {
            commit('menu/notification', ['error', 3, error], { root: true })
        }
    },
    async loadQuestions({ commit , dispatch }) {
        try {
            state.loading.questions = true
            let token = Cookies.get("catapa-jwt")
            let config = {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
            let res = await Axios.get("/questions/all", config)
            let questions = res.data
            for (let x = 0; x < questions.length; x++) {
                await dispatch('loadUserByID',questions[x]._userId)
                let creator =  state.temporaluser
                questions[x]['creator'] = creator
            }
            commit('questionsLoad', res.data)
            state.loading.questions = false
        } catch (error) {
            state.loading.questions = false
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
                // wg.questions.length = 0
                wg.questions = tempQuestions
                commit('pullWG', wg) 
                commit('menu/loadingbar', ['primary', null , 100], { root: true })
                setTimeout(() => {
                    commit('menu/loadingbar', [null, false , null], { root: true })
                    commit('menu/loadingstate', ['itembig',false], { root: true })
                }, 400);
            }
        } catch (error) {
            commit('menu/notification', ['error', 3, error.response.data.message], { root: true })
            commit('menu/loadingbar', ['error', null , 100], { root: true })
        }
    },
    async searchQuestion({state,commit,dispatch},id){
        try {
            commit('clearquestionForm')
            state.questionForm.loading = true
            let token = Cookies.get("catapa-jwt");
            let config = {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
            let res = await Axios.get('/questions/question/' + id, config)
            let question = res.data
            await dispatch('loadUserByID',question._userId)
            let creator =  state.temporaluser
            question['creator'] = creator
            commit('loadEditedQuestion', question)
            setTimeout(() => {
                state.questionForm.loading = false
            }, 400)
        } catch (error) {
            setTimeout(() => {
                state.questionForm.loading = false
            }, 400)
            commit('menu/notification', ['error', 3, error.response.data.message], { root: true })
        }
    },
    async saveEditedQuestion({state,commit},id){
        let exit = JSON.stringify(state.questionForm.selectionsSelected)
        let exit2 = JSON.stringify(state.searchedQuestion.selections)
        commit('menu/notification', ['primary', 5, id + ': ' + exit + ' / ' + exit2], { root: true })
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
                    dossier = globalConfig.global.hostnameApi + '/files/upload/' + res.data.file.filename
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
                    let res = await Axios.get('/users/' + idUsersToAdd[x],config)
                    let user = res.data
                    let isWG = user.unsuscribedworkgroups.some(wg => wg._wgId === idWG)
                    if (isWG) {
                        let indexExtracted = await user.unsuscribedworkgroups.findIndex(wg => wg._wgId === idWG)
                        user.unsuscribedworkgroups.splice(indexExtracted, 1)
                    }
                    user.workgroups.push(wg)
                    await Axios.put("/users/" + user._id, user, config)
                }
            }
            if(idUsersToDel.length != 0) {
                await dispatch('unjoinWG',{idWG:idWG,idUsers:idUsersToDel})
                for (let x = 0; x < idUsersToDel.length; x++) {
                    let res = await Axios.get('/users/' + idUsersToDel[x],config)
                    let user = res.data
                    let isWG = user.workgroups.some(wg => wg._wgId === idWG)
                    if (isWG) {
                        let extractedItem = await user.workgroups.find(wg => wg._wgId === idWG)
                        let indexExtracted = await user.workgroups.findIndex(wg => wg._wgId === idWG)
                        user.unsuscribedworkgroups.push(extractedItem)
                        user.workgroups.splice(indexExtracted, 1)
                    }
                    await Axios.put("/users/" + user._id, user, config)
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