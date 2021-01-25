import Axios from 'axios'
import Cookies from 'js-cookie'

const state = {
    tab: null,
    tabs: [
        { name: 'General', icon: 'fas fa-cog' },
        { name: 'Common Questions', icon: 'fas fa-question-circle' },
        { name: 'Customization', icon: 'fas fa-paint-brush' },
        { name: 'Mails', icon: 'fas fa-envelope' },
    ],
    commonQuestions: []
}

const mutations = {
    updateQuestions: (state, questions) => {state.commonQuestions = questions}
}

const getters = {

}

const actions = {
    async loadCommonQuestions({commit}) {
        try {
            let token = Cookies.get("catapa-jwt")
            let config = {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
            let res = await Axios.get("/questions/all", config)
            let questions = res.data.filter(q => q.common);
            commit('updateQuestions', questions);
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