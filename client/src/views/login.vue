<template>
    <v-container class="pa-2 pt-10 pb-10">
        <login-template></login-template>
    </v-container>
</template>

<script>
import loginVue from '../components/users/logintemplate.vue'
export default {
    components:{
        'login-template':loginVue
    }
}
</script>