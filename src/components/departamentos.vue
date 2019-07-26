<template>
  <div style="height: auto;max-height: 400px;backgroundColor: #009999">
    <v-container>
      <h2 style="text-align:center">Cadastrado de Departamentos</h2>
        <v-layout row wrap>
            <v-flex xs6>
                <v-text-field dark
                v-model="search"
                append-icon="search"
                placeholder="Buscar"   
                ></v-text-field>
            </v-flex>

            <v-flex>
              <v-dialog v-model="dialog" max-width="800px">
                <template v-slot:activator="{ on }" >
                  <v-btn
                  style="float: right" 
                  color="blue" 
                  dark
                  v-on="on"
                  >
                  <v-icon>add</v-icon>
                  </v-btn>
                </template>  

                <v-card>
                  <v-card-text>  
                      <v-container grid-list-md> 
                        <v-layout wrap>  

                          <v-flex xs12 sm6 md4>
                            <v-text-field 
                            v-model="novosDados.id" 
                            label="ID"
                            type="Number"></v-text-field>
                          </v-flex>

                          <v-flex xs12 sm6 md4>
                            <v-text-field 
                            v-model="novosDados.departamento" 
                            label="Departamento"></v-text-field>
                          </v-flex>

                          <v-flex xs12 sm6 md4>
                            <v-text-field 
                            v-model="novosDados.descricao" 
                            label="Descrição"></v-text-field>
                          </v-flex>

                        </v-layout>
                    </v-container>
                  </v-card-text>
                  
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue" text @click="cancelar">Cancelar</v-btn>
                    <v-btn color="blue" text  @click="salvar">Salvar</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-flex>

            <v-snackbar 
              v-model="snackbarCamposPreenchidos"
              :timeout= 7000
              color="red"
              top
              > É obrigatório o preenchimento dos campos "ID" e "Departamento"
              <v-icon> error </v-icon>
            </v-snackbar>

            <v-snackbar 
              v-model="snackbarIdValido"
              :timeout= 5500
              color="red"
              top > Já há um departamento cadastrado com este id!
              <v-icon> error </v-icon>
            </v-snackbar>

            <v-snackbar 
              v-model="snackbarDepartamentoValido"
              :timeout= 4000
              color="red"
              top> Já há um departamento cadastrado com este nome!
              <v-icon> error </v-icon>
            </v-snackbar>
        </v-layout>      
        
        <v-layout row wrap>
            <v-flex xs12>
                <v-data-table
                    :search="search"
                    :headers="headers" 
                    :items="departamentosCadastrados"
                    hide-default-footer
                    class="elevation-1">
                    <template v-slot:items="props"> 
                        <td class="text-xs-left" style="width: 10%">{{ props.item.id }}</td>
                        <td class="text-xs-left" style="width: 30%">{{ props.item.departamento }}</td>
                        <td class="text-xs-left" style="width: 49%">{{ props.item.descricao }}</td>
                        
                    </template>
                    
                    <template v-slot:item.acoes="{item}">
                          <v-icon
                          small 
                          class="mr-2"
                          color="green" 
                          @click="editarDepartamentoSelecionado(item)"
                          >edit
                          </v-icon>
                              
                          <v-icon 
                          small
                          color="red"
                          @click="abrirDialogDeExclusão(item); verificaExclusãoEAtivaSnackbar()" 
                          >delete
                          </v-icon>

                          <v-dialog v-model="dialogExcluir"
                                  max-width="290"
                                  persistent                             
                        >
                          <v-card-title class="headline">Confirmar Exclusão</v-card-title>
                            <v-card-text >certeza que deseja deletar este departamento?</v-card-text>
                              <v-card-actions>
                                <v-spacer></v-spacer>
                                  <v-btn color="green darken-1" text
                                  @click="excluirDepartamentoSelecionado()"
                                  v-if="snackbarExcluir == false"
                                  >Sim</v-btn>
                                  <v-btn color="green darken-1" text @click="dialogExcluir = false; snackbarExcluir = false"
                                  >Cancelar</v-btn>
                              </v-card-actions>
                              <v-snackbar
                                v-model="snackbarExcluir"
                                color="red"
                                top> Não foi possível excluir este departamento, pois há usuários vinculados a ele
                                <v-icon> error </v-icon>
                              </v-snackbar>
                        </v-dialog>
                    </template>

                    <template v-slot:no-results>
                      <v-alert  color="red" icon="warning">
                      Dados pesquisados não encontrados
                      </v-alert>
                    </template>

                    <template v-slot:no-data>
                      <v-alert  type="warning" color="orange">
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
    departamentosCadastrados(){
      return this.$store.state.departamentosCadastrados;
    },

     departamentosCadastradosDoUsuario(){
      return this.$store.state.departamentosCadastradosDoUsuario;
    } 
  },

  data(){
    return{
      snackbarCamposPreenchidos: false,
      snackbarIdValido: false,
      snackbarDepartamentoValido: false,
      snackbarExcluir: false, 
      dialog: false,
      dialogExcluir: false, 
      exclusaoDialog: false,
      dialogAlerta: false, 
      dadosOk: true,
      confirmarEdicao: false,
      departamentoVinculado: false,
      indexEditadoDeps: -1,
      indexEditadoIds: -1,
      indexEditado: -1,      
      itemRecebido:{},
      search: '',
      novosDados: {id: '', departamento: '', descricao: ''},
      defaultDados: {id: '', departamento: '', descricao: ''},
      headers:[
        { text: 'ID', value: 'id' },
        { text: 'Departamento ', value: 'departamento' },
        { text: 'Descrição', value: 'descricao' },
        { text: 'Ações', value: 'acoes' }
      ],
    }
  },

  methods:{

    abrirDialogDeExclusão(item){
      this.dialogExcluir = true
      this.itemRecebido = item
    },

    excluirDepartamentoSelecionado(){
      this.dialogExcluir = false
      this.indexEditado = this.$store.state.departamentosCadastrados.indexOf(this.itemRecebido)
      this.indexEditadoDeps = this.$store.state.todosDepartamentos.indexOf(this.itemRecebido.departamento)
      this.indexEditadoIds = this.$store.state.IdsDepartamento.indexOf(this.itemRecebido.id)
      /* this.verificaExclusão()  */
      if(this.departamentoVinculado == false){
        this.$store.state.departamentosCadastrados.splice(this.indexEditado,1)  
        this.$store.state.todosDepartamentos.splice(this.indexEditadoDeps,1)  
        this.$store.state.IdsDepartamento.splice(this.indexEditadoIds,1)   
      }
        this.indexEditadoDeps= -1
        this.indexEditadoIds= -1
        this.indexEditado= -1
        this.confirmarExclusao = false  
    },

    verificaExclusãoEAtivaSnackbar(){
      for(var i = 0; i < this.$store.state.departamentosCadastradosDoUsuario.length; i++){
        for(var i2 = 0; i2 < this.$store.state.todosDepartamentos.length; i2++){
          if(this.$store.state.departamentosCadastradosDoUsuario[i] == this.$store.state.todosDepartamentos[i2]){
            this.snackbarExcluir = true
            this.departamentoVinculado = true
          }
        }
      }  
    },

    editarDepartamentoSelecionado(item){
      this.indexEditado = this.$store.state.departamentosCadastrados.indexOf(item)
      this.indexEditadoDeps = this.$store.state.todosDepartamentos.indexOf(item.departamento)
      this.indexEditadoIds = this.$store.state.IdsDepartamento.indexOf(item.id)
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

    validaDepartamento(){
      for(var i = 0; i < this.$store.state.todosDepartamentos.length; i++){
        if(this.novosDados.departamento == this.$store.state.todosDepartamentos[i]){
          this.snackbarDepartamentoValido = true
          this.dadosOk = false
        }else{          
          this.snackbarDepartamentoValido = false
        }
      }
    }, 
    
    validaIdDepartamento(){
      this.validaDepartamento()
      for(var i = 0; i < this.$store.state.IdsDepartamento.length; i++){
        if(this.novosDados.id == this.$store.state.IdsDepartamento[i]){
          this.snackbarIdValido = true
          this.dadosOk = false
        }else{
          this.snackbarIdValido = false
        }
      }
    },  

    validaCamposPreenchidos(){
      if(this.novosDados.id == '' || this.novosDados.departamento == ''){
        this.snackbarCamposPreenchidos = true
        this.dadosOk = false
      }else{
        this.dadosOk = true
        this.snackbarCamposPreenchidos = false
      }
      this.validaIdDepartamento()
    },
    
    confirmarSalvar(){
      if(this.confirmarEdicao == true){
        this.$store.state.departamentosCadastrados.splice(this.indexEditado, this.novosDados)
        this.$store.state.todosDepartamentos.splice(this.indexEditadoDeps)
        this.$store.state.IdsDepartamento.splice(this.indexEditadoIds)
        this.confirmarEdicao = false
      }
      if (this.indexEditado > -1) {
        Object.assign(this.$store.state.departamentosCadastrados[this.indexEditado], this.novosDados)
        this.$store.state.todosDepartamentos.push(this.novosDados.departamento)
        this.$store.state.IdsDepartamento.push(this.novosDados.id)
      } else if(this.dadosOk == true){
        this.$store.state.departamentosCadastrados.push(this.novosDados)
        this.$store.state.todosDepartamentos.push(this.novosDados.departamento)
        this.$store.state.IdsDepartamento.push(this.novosDados.id)
      } 
      this.cancelar()
    }, 
  },        
}
</script>