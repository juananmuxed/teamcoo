<template>
    <v-container
        class="pa-12"
        fluid
    >
    
        <v-row
            class="text-center"
        >
            <v-col>
                <v-icon
                    size="160"
                    color="primary lighten-1"
                >fas fa-car-crash</v-icon>
            </v-col>
        </v-row>

        <v-row
            class="text-center"
        >
            <v-col>
                <p class="display-4 font-weight-medium">404</p>
                <p class="display-1 font-weight-light text-uppercase">This {{ item }}</p>
                <p>The ID is invalid or it was removed. Try other direction.</p>
                <v-btn
                    height="160"
                    color="primary"
                    :to="goto"
                    block
                >Go HOME, you are drunk</v-btn>
            </v-col>
        </v-row>

    </v-container>
</template>

<script>
export default {
    props:{
        item:String,
        goto:String
    }
}
</script>