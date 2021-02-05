<template>
    <v-container>
        <change-pass></change-pass>
    </v-container>
</template>

<script>
import changePassword from '../components/users/changepass.vue'
export default {
    components:{
        'change-pass': changePassword
    }
}
</script>