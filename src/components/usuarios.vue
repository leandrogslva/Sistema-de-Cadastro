<template>
  <div style="height: auto;max-height: 400px;backgroundColor: #009999">
    <v-container>
      <h2 style="text-align:center" >Cadastrado de Usuários</h2>
        <v-layout row wrap>
           <v-flex xs6>
                <v-text-field dark
                v-model="search"
                append-icon="search"
                placeholder="Buscar"   
                ></v-text-field>
            </v-flex>
            <!-- Este comando cria a caixa de dialogo -->  
            <v-flex>
              <v-dialog v-model="dialog" max-width="800px" >
                <template v-slot:activator="{ on }" >
                  <v-btn 
                  style="float: right" 
                  color="blue" 
                  dark
                  v-on="on">
                  <v-icon>add</v-icon>
                  </v-btn>

                </template>  
                <v-card >
                  <v-card-text >  
                      <v-container grid-list-md > 
                        <v-layout wrap >  

                          <v-flex xs12 sm6 md4>
                            <v-text-field 
                            v-model="novosDados.id"
                            label="ID"
                            type="Number"></v-text-field>
                          </v-flex>

                          <v-flex xs12 sm6 md4>
                            <v-text-field 
                            v-model="novosDados.nome" 
                            label="Usuario"></v-text-field>
                          </v-flex>

                          <v-flex xs12 sm6 md4>
                            <v-text-field 
                            v-model="novosDados.dataCadastro" 
                            label="Data do Cadastro"
                            type="date"></v-text-field>
                          </v-flex>

                          <v-flex xs12 sm6 md4 >
                            <v-text-field 
                            v-model="novosDados.email" 
                            label="Email"
                            type="email"
                            ></v-text-field>
                          </v-flex>

                          <v-flex xs12 sm6 md4>
                            <v-select 
                              v-model="novosDados.departamentoUsuario"
                              label="Departamento"
                              :items="departamentosCadastrados"
                              required
                            ></v-select>
                          </v-flex>
                        </v-layout>
                    </v-container>
                  </v-card-text>
                  
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancelar">Cancelar</v-btn>
                    <v-btn color="blue darken-1" text @click="salvar">Salvar</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-flex>

            <v-snackbar 
              v-model="snackbarCamposPreenchidos"
              :timeout= 5000
              color="red"
              top
              > É obrigatório o preenchimento de todos os campos abaixo
              <v-icon> error </v-icon>
            </v-snackbar>

            <v-snackbar 
              v-model="snackbarIdValido"
              :timeout= 3500
              color="red"
              top > Já há um departamento cadastrado com este id!
              <v-icon> error </v-icon>
            </v-snackbar>

           
        </v-layout>
<!-- Comando utilizado para criar a tabela -->
        <v-layout row wrap>
          <v-flex xs12>
              <v-data-table
              :search="search"
              :headers="headers" 
              :items="usuarios"
              hide-default-footer
              class="elevation-1">

                <template v-slot:items="props"> 
                  <td class="text-xs-left">{{ props.item.id }}</td>
                  <td class="text-xs-left">{{ props.item.nome }}</td>
                  <td class="text-xs-left">{{ props.item.dataCadastro }}</td>
                  <td class="text-xs-left">{{ props.item.email }}</td>
                  <td class="text-xs-left">{{ props.item.departamentoUsuario }}</td>
                  
                   </template> 
                  <template v-slot:item.acoes="{item}">
                  <v-icon
                      small
                      class="mr-2"
                      color="green"
                      @click="editarUsuarioSelecionado(item)"
                    >
                      edit
                    </v-icon>
                    <v-icon
                      small
                      color="red"
                      @click="abrirDialogDeExclusao(item)"
                    >
                      delete
                    </v-icon>

                  <v-dialog v-model="dialogExcluir"
                                  max-width="290"
                                  persistent                               
                        >
                    <v-card-title class="headline">Confirmar Exclusão</v-card-title>
                      <v-card-text >Tem certeza que deseja deletar este usuário?</v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                            <v-btn color="green darken-1" text 
                              @click="excluirUsuarioSelecionado()"
                              >Sim</v-btn>
                            <v-btn color="green darken-1" text @click="dialogExcluir = false; snackbarExcluir = false"
                              >Cancelar</v-btn>
                        </v-card-actions>
                    </v-dialog>
                </template>
                
                <template v-slot:no-results>
                  <v-alert value="true" color="red" icon="warning">
                    Dados pesquisados não encontrados
                  </v-alert>
                </template>

                <template v-slot:no-data>
                    <v-alert :value="true" type="warning" color="orange">
                      Sem cadastros realizados
                    </v-alert>
                </template>
              </v-data-table>
            </v-flex> 
          </v-layout>
    </v-container>
  </div>  
</template>

<script>
export default {

  computed:{

    usuarios(){
      return this.$store.state.usuarios
    },
    
    departamentosCadastrados() {
      return this.$store.state.todosDepartamentos
    },
    
  },

  data(){
    return{
      snackbarCamposPreenchidos: false,
      snackbarIdValido: false,
      dialogExcluir: false,
      confirmarEdicao: false,
      dadosOk: true,
      itemRecebido: {},
      indexEditado: -1,
      indexId: -1,
      indexDepartamentoUsuario: -1,
      dialog: false,
      search: '',
      novosDados: {id: '', nome: '', dataCadastro: '', email: '', departamentoUsuario: ''},
      defaultDados: {id: '', nome: '', dataCadastro: '', email: '', departamentoUsuario: ''},
      headers:[
        { text: 'ID', value: 'id' },
        { text: 'Nome ', value: 'nome' },
        { text: 'Data do Cadastro', value: 'dataCadastro' },
        { text: 'Email',value: 'email' },
        { text: 'Departamento', value: 'departamentoUsuario' },
        { text: 'Ações', value: 'acoes'}
      ],
    }
  },

  methods:{

    abrirDialogDeExclusao(item){
      this.dialogExcluir = true
      this.itemRecebido = item
    },

    excluirUsuarioSelecionado(){
      this.indexEditado = this.$store.state.usuarios.indexOf(this.itemRecebido)
      this.indexId = this.$store.state.IdsUsuario.indexOf(this.itemRecebido.id)
      this.indexDepartamentoUsuario = this.$store.state.departamentosCadastradosDoUsuario.indexOf(this.itemRecebido.departamentoUsuario)
      this.$store.state.usuarios.splice(this.index,1) 
      this.$store.state.departamentosCadastradosDoUsuario.splice(this.indexDepartamentoUsuario)  
      this.$store.state.IdsUsuario.splice(this.indexId,1)
      this.indexEditado = -1
      this.indexId = -1
      this.indexDepartamentoUsuario = -1
      this.dialogExcluir = false 
    },

    editarUsuarioSelecionado(item){
      this.indexEditado = this.$store.state.usuarios.indexOf(item)
      this.indexDepartamentoUsuario = this.$store.state.departamentosCadastradosDoUsuario.indexOf(item.departamentoUsuario)
      this.indexId = this.$store.state.IdsUsuario.indexOf(item.id)
      this.novosDados = Object.assign({}, item)
      this.dialog = true
      this.confirmarEdicao = true
    },

    cancelar () {
      this.dialog = false
      this.novosDados = Object.assign({}, this.defaultDados)
      this.indexEditado = -1      
    },

    salvar () {
      this.validaCamposPreenchidos()
      this.confirmarSalvar()  
    },

    confirmarSalvar(){
      if(this.confirmarEdicao == true){
        this.$store.state.usuarios.splice(this.indexEditado, this.novosDados) 
        this.$store.state.departamentosCadastradosDoUsuario.splice(this.indexDepartamentoUsuario)  
        this.$store.state.IdsUsuario.splice(this.indexId)
        this.confirmarEdicao = false
      }
      if (this.indexEditado > -1) {
        Object.assign(this.$store.state.usuarios[this.indexEditado], this.novosDados)
        this.$store.state.departamentosCadastradosDoUsuario.push(this.novosDados.departamentoUsuario)
        this.$store.state.IdsUsuario.push(this.novosDados.id)
      } else if(this.dadosOk == true){
        this.$store.state.usuarios.push(this.novosDados)
        this.$store.state.departamentosCadastradosDoUsuario.push(this.novosDados.departamentoUsuario)
        this.$store.state.IdsUsuario.push(this.novosDados.id)
      }
      this.cancelar()
    },

    validaIdUsuario(){
      for(var i = 0; i < this.$store.state.IdsUsuario.length; i++){
        if(this.novosDados.id == this.$store.state.IdsUsuario[i]){
          this.snackbarIdValido = true
          this.dadosOk = false
        }else{
          this.snackbarIdValido = false
        }
      }
    },

    validaCamposPreenchidos(){
      this.validaIdUsuario()
      if(this.novosDados.id == '' || this.novosDados.nome == '' || this.novosDados.dataCadastro == '' 
      || this.novosDados.email == '' || this.novosDados.departamentoUsuario == ''){
        this.snackbarCamposPreenchidos = true
        this.dadosOk = false 
      }else{
        this.snackbarCamposPreenchidos = false
        this.dadosOk = true
      }
    }
  }, 
}
</script>