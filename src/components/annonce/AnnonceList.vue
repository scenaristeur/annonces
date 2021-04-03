<template>
  <b-container>
    <div v-if="webId != null">

      <!-- <AnnonceInbox /> -->



      <div class="d-flex">
        <b-button variant="info" class="ml-auto" @click="edit">Add a new annonce</b-button>
      </div>
      <h3>My Annonces</h3>

      <b-table striped hover :items="annoncesMy" :fields="fields" responsive >

        <!-- <template #cell(title)="row">
          <div  style="width=200px;height=200px">
            {{row.value}}
          </div>
        </template> -->

        <template #cell(action)="row">
          <!-- <b-button size="sm" @click="row.toggleDetails" class="mr-2">
          {{ row.detailsShowing ? 'Hide' : 'Show'}} Details
        </b-button> -->

        <b-button size="sm" variant="light" @click="edit(row.item)" style="margin-left:auto;">
          <b-icon icon="pen"></b-icon>
        </b-button>
        <b-button size="sm" variant="danger" @click="showDeleteConfirm(row.item)" style="margin-left:auto;" v-b-modal.modal-center>
          <b-icon icon="trash"></b-icon>
        </b-button>



        <!-- As `row.showDetails` is one-way, we call the toggleDetails function on @change -->
        <!-- <b-form-checkbox v-model="row.detailsShowing" @change="row.toggleDetails">
        Details via check
      </b-form-checkbox> -->
    </template>

  </b-table>



  <!-- <b-list-group>
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
</b-list-group> -->
</div>
<div v-else>
  You must login to manage your annonces.
</div>

<b-modal id="modal-center" variant="danger" centered title="Delete" @ok="onDelete">
  <div class="p-3"  v-html="deleteMessage"></div>
</b-modal>

</b-container>
</template>

<script>
export default {
  name: "AnnonceList",
  components: {
    // 'AnnonceInbox': () => import('@/components/annonce/AnnonceInbox'),
  },
  data(){
    return{
      deleteMessage: "",
      //  fields: ['title', 'category', 'price', 'currency', 'created'],
      fields: [
        {
          key: "action",
          label: "",
          variant: "secondary",
          stickyColumn: true
        },
        {
          key: 'title',
          sortable: true,
        },
        {
          key: 'category',
          sortable: true
        },
        {
          key: 'price',
          //label: 'Person age',
          sortable: true,
          // Variant applies to the whole column, including the header and footer
          variant: 'info',
          formatter: function(value, key, item) {return item.price+' '+item.currency || '**' }
        },
        // {
        //   key: 'currency',
        //   sortable: true,
        //   variant: 'info'
        // },
        {
          key: 'created',
          sortable: true,
          formatter: function(value){ return new Date(value).toLocaleDateString()}
        },
        {
          key: "images",
          "label": 'pics',
          sortable: true,
          formatter: function(value){ return value.length}
        }

      ]
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
      this.deleteMessage= '<b-alert show variant="danger">Do you really want to delete <b>'+a.title+'</b></b-alert>'
      this.idToDelete = a.id
    },
    onDelete(){
      console.log("delete")
      this.$store.dispatch('annonce/delete', this.idToDelete)
    },
    init(){
      if (this.storage != null){
        this.$store.dispatch('annonce/initMy')
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
    annoncesMy() {
      return this.$store.state.annonce.annoncesMy
    }
  },
}
</script>

<style>

</style>
