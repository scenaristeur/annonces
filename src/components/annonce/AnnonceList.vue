<template>
  <b-container>
    <div v-if="webId != null">

      <AnnonceInbox />



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
            {{annonce.price}} {{annonce.currency}}
          </div>
          <div>
            <b-button variant="light" @click="edit(annonce)" style="margin-left:auto;">
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
    </div>
    <div v-else>
      You must login to manage your annonces.
    </div>

    <b-modal id="modal-center" centered title="Delete" @ok="onDelete">
      <div class="p-3" v-html="deleteMessage"></div>
    </b-modal>

  </b-container>
</template>

<script>
export default {
  name: "AnnonceList",
  components: {
    'AnnonceInbox': () => import('@/components/annonce/AnnonceInbox'),
  },
  data(){
    return{
      deleteMessage: "",
    }
  },
  created(){
    this.init()
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
      this.$store.dispatch('annonce/delete', this.idToDelete)
    },
    init(){
      if (this.storage != null){
        this.$store.dispatch('annonce/init')
      }
    }

  },
  watch:{
    storage(){
      this.init()
    }
  },
  computed:{
    webId() {
      return this.$store.state.solid.webId
    },
    storage(){
      return this.$store.state.solid.storage
    },
    annonces() {
      return this.$store.state.annonce.annonces
    }
  },
}
</script>

<style>

</style>
