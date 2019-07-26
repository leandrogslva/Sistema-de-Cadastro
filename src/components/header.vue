<template>
    <div style="height: 60px;backgroundColor: #009999">
        <v-app-bar  style="backgroundColor: #009999;" height="45px">
                <v-toolbar-items>
                    <v-chip label style="backgroundColor: #009999">
                        <v-icon medium dark>person</v-icon>
                        <router-link to="usuarios" style="text-decoration: none; color:white" > Usuários
                        </router-link>
                        </v-chip>

                        

                        <v-chip label style="backgroundColor: #009999">
                            <v-icon medium dark>gavel</v-icon>
                        <router-link to="departamentos" style="text-decoration: none; color:white">Departamentos
                        </router-link>
                    </v-chip>
                </v-toolbar-items>
        </v-app-bar>    
    </div>    
</template>

<script>
export default {
    
}
</script>

<style>

</style>
