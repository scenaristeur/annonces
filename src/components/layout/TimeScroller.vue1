<template>
  <div>
    {{ debug}}
    <div v-if="debug">
      Timescroller <br>
      start : {{ start }}<br>
      root:  {{ root }}<br>
      filename: {{ filename}}<br>
      url : {{ url }}<br>
      <hr>
      fileUrl: {{ fileUrl}}<br>
      websocket : {{ websocket}}<br>
      limite :  {{ limite}}<br>
      data : {{ data}}

    </div>


    <div class="container" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="300">
      <div v-if="data.length == 0">Please Wait, I'm loading data ;-)</div>
      <h3 v-else>Data</h3>
      <b-list-group flush>
        <b-list-group-item v-for="d in data" :key="d">
          <div class="item">
            {{ d}}

          </div>
        </b-list-group-item>

      </b-list-group>
    </div>

    <b-alert
    v-model="busy"
    class="position-fixed fixed-bottom rounded-0"
    style="z-index: 2000; bottom:30px"
    variant="info"

    dismissible
    >{{title}}
  </b-alert>




</div>
</template>

<script>
import infiniteScroll from 'vue-infinite-scroll'
export default {
  name:"TimeScroller",
  directives: {infiniteScroll},
  props:{
    start: String,
    root: String,
    filename: String,
    extension: String,
    step: {
      type: String,
      default: "day" // accept day or month
    },
    //  debug: String,
    websocket: {
      type: Boolean,
      default: true
    },
  },
  data(){
    return{
      debug: true,
      url: "",
      fileUrl : "",
      limite: null,
      data: [],
      busy: true,

    }
  },
  created(){
    console.log("debug", this.debug)
    console.log("websocket", this.websocket)
    this.runToStart()
  },
  methods: {
    runToStart() {
      this.date = new Date()
      this.limite = new Date(this.start)
      this.data = []
      this.url = this.root.endsWith('/')  ? this.root : this.root+'/'

      this.fileUrl =  this.getFileUrl()

      if (this.websocket == true){
        this.subscribe(this.fileUrl)
      }

      this.loadMore()
    },
    loadMore: async function() {
      this.busy = true;

      if (this.limite <= this.date ){
        //  //console.log(this.limite)
        //  let date =  this.date
        //  //console.log(this.date)
        //    let path = [this.root, this.date.getFullYear(), ("0" + (this.date.getMonth() + 1)).slice(-2), ("0" + this.date.getDate()).slice(-2), "chat.ttl"].join("/")
        //  //console.log(path)
        this.fileUrl =  this.getFileUrl()

        //  let messages = this.read(path)
        //this.data = this.data.concat(messages);
        this.date.setDate(this.date.getDate() -1)
        //  this.showTop = true
        this.title = "loading "+this.date.toLocaleDateString()

        //  this.updateMessages(path, "bottom")
        //  await this.loadFile(this.fileUrl, "bottom")
        this.data.push(this.fileUrl)
        //  this.data.push({ name: count++ , date:date});
        //this.showTop = false

      }else{
        //console.log("STOP")
        this.data.push({id:Math.random(), maker:"https://System.solid-vue-panes", content: "This is the end, my friend, there are no message before that date", created: this.limite.toLocaleString()})
        //alert ("No message before "+this.limite)
        this.makeToast("No message before", this.limite.toLocaleString(), 'warning')
      }

    },

    async loadFile(path, sens){
      console.log("load",path, sens)

      //   try{
      //
      //     const chatDoc = await fetchDocument(path);
      //     let  subjects = chatDoc.findSubjects();
      //     subjects = subjects.filter( this.onlyUnique )
      //     //  //console.log(subjects)
      //     //let triples = []
      //     let messages = []
      //     var existingIds = this.data.map((obj) => obj.id);
      //     //    //console.log(existingIds)
      //     for  (let s of subjects) {
      //       //    //console.log("Compare",s.asRef(), this.root+"/index.ttl#this")
      //       if (s.asRef() != this.root+"/index.ttl#this" && ! existingIds.includes(s.asRef())){
      //         //  //console.log(s)
      //         //  let t = s.getTriples()
      //         let created = s.getString(dct.created)
      //         let content = s.getLiteral(sioc.content)
      //         let maker = s.getNodeRef(foaf.maker) || "anonymous"
      //
      //         let t={id:s.asRef(),
      //           created: new Date(created).toLocaleString(),
      //           content: content,
      //           maker: maker,
      //           //  pic: `${p}`
      //           //  parts: parts,
      //           //  parent: parent
      //         }
      //
      //         //  //console.log(t)
      //         //  triples.push(t)
      //         messages.unshift(t)
      //
      //       }
      //
      //
      //     }
      //     //console.log("m",messages)
      //     if (sens == "top"){
      //       this.today_messages = []
      //       this.today_messages = messages
      //       //console.log("TODAY",this.today_messages)
      //     }else{
      //       this.old_messages.push.apply(this.old_messages, messages)
      //       //console.log("OLD",this.old_messages)
      //     }
      //     ////console.log("TODAY",this.today_messages)
      //     ////console.log("OLD",this.old_messages)
      //     this.data = []
      //     this.data = this.today_messages.concat(this.old_messages)
      //
      //     ////console.log("TODAY",this.today_messages)
      //     ////console.log("OLD",this.old_messages)
      //     ////console.log("DATA",this.data)
      //     ////console.log("USERS",this.$store.state.chat.users)
      //     /*if (this.data.length == 0){
      //     this.loadMore()
      //   }*/
      //   //  //console.log(triples)
      //   //  messages = triples.reverse()
      // }catch(e){
      //   //   //console.log(e)
      //   //  this.showTop = true
      //   //  ! this.stopped ? this.loadMore() : ""
      // }
      /*  setTimeout(() => {
      for (var i = 0, j = 10; i < j; i++) {
      this.data.push({ name: count++ });
      //console.log(this.data)
    }
    this.busy = false;
    //console.log(this.busy)
  }, 1000);*/
  this.busy = false
  //console.log("loaded")
},

getFileUrl(){
  let fileUrl = this.url
  //[this.url, this.date.getFullYear(), ("0" + (this.date.getMonth() + 1)).slice(-2), ("0" + this.date.getDate()).slice(-2), "chat.ttl"].join("/")
  fileUrl+= this.step == "day" ? [this.date.getFullYear(), ("0" + (this.date.getMonth() + 1)).slice(-2), ("0" + this.date.getDate()).slice(-2)].join("/") : [this.date.getFullYear(), ("0" + (this.date.getMonth() + 1)).slice(-2)].join("/")
  fileUrl+= (this.filename != undefined && this.filename.length > 0) ? '/'+this.filename : "/"+("0" + this.date.getDate()).slice(-2)
  fileUrl+= (this.extension != undefined && this.extension.length > 0) ? '.'+this.extension : ""
  console.log("fileurl",fileUrl)

  return  fileUrl
},
subscribe(url){
  console.log("subscribe to ", url)
  let withoutProtocol = this.url.split('//')[1]
  let sock = withoutProtocol.split('/')[0]+"/"
  let socket = new WebSocket('wss://'+sock, ['solid.0.1.0']);
  socket.onopen = function() {
    socket.send('sub '+url);
    console.log("subscribed to ",url)
  }.bind(this)
  socket.onmessage = function(msg) {
    if (msg.data && msg.data.slice(0, 3) === 'pub') {
      // resource updated, refetch resource
      this.updateMessages(msg.data.substring(4), "top")
    }
  }.bind(this)
},
makeToast(title, content, variant = null) {
  this.$bvToast.toast(content , {
    title: title,
    variant: variant,
    solid: true
  })
},
}


}
</script>

<style>

</style>
