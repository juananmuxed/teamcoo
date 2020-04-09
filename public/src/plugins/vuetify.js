import '@fortawesome/fontawesome-free/css/all.css'
import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
    icons:{
        iconfont: 'fa'
    },
    theme:{
        dark:false,
        themes: {
            light: {
                primary: '#009c55', // #E53935
                secondary: '#b25b3d', // #FFCDD2
                error: '#FF7043',
                info: '#80CBC4',
                success: '#C0CA33',
                warning: '#FFB74D',
            },
            dark:{
                primary: '#b25b3d', // #E53935
                secondary: '#009c55', // #FFCDD2
                error: '#BF360C',
                info: '#00838F',
                success: '#1B5E20',
                warning: '#FF8F00',
            }
        },
    }
});
