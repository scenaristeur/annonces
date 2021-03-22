<template>
  <b-container>
    <div class="d-flex">
      <b-button variant="primary" class="ml-auto" @click="edit">add</b-button>
    </div>
    <h3>My Annonces</h3>
    <b-list-group>
      <b-list-group-item v-for="(annonce, i) in annonces" :key="i" class="d-flex justify-content-between align-items-center">

        <div>
          <b-badge variant="primary" pill class="mr-3">{{annonce.category}}</b-badge>
          <span>{{annonce.title}}</span>
        </div>
        <div>
          <b-button variant="light" @click="edit(annonce)" style="margin-left:auto;" v-b-modal.modal-center>
            <b-icon icon="pen"></b-icon>
          </b-button>
          <b-button variant="danger" @click="showDeleteConfirm(annonce)" style="margin-left:auto;" v-b-modal.modal-center>
            <b-icon icon="trash"></b-icon>
          </b-button>
        </div>

      </b-list-group-item>
      <b-list-group-item v-if="annonces.length == 0">
        no entries
      </b-list-group-item>
    </b-list-group>

    <b-modal id="modal-center" centered title="Delete" @ok="onDelete">
      <div class="p-3" v-html="deleteMessage"></div>
    </b-modal>

  </b-container>
</template>

<script>
export default {
  name: "AnnonceList",
  data(){
    return{
      //  annonces : [],
      deleteMessage: ""
    }
  },
  methods: {
    edit(a) {
      //this.$router.push('/add')
      this.$router.push({ name: 'Edit', params: { id: a.id }})
    },
    showDeleteConfirm(a){
      this.deleteMessage= "Do you want to delete <b>"+a.title+"</b>"
      this.idToDelete = a.id
    },
    onDelete(){
      console.log("delete")
      this.$store.commit('annonce/delete', this.idToDelete)
    }
  },
  computed:{
    annonces() {
      return this.$store.state.annonce.annonces
    }
  },
}
</script>

<style>

</style>
