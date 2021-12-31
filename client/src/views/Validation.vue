<template>
    <v-container>
        <v-row>
            <v-col>
                <v-alert
                    :icon="alert.icon"
                    :color="alert.color"
                    border="left"
                >{{ alert.message }}</v-alert>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
    computed: {
        ...mapState({
            alert: state => state.menu.alert
        })
    },
    methods: {
        ...mapActions('user',['verifyEmail'])  
    },
    created() {
        this.verifyEmail(this.$route.params.token)
    },
}
</script>