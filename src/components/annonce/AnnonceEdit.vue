<template>
  <b-container>
    <div v-if="webId != null">
      <h3>Add an Annonce</h3>
      <b-form>

        <b-form-group
        id="input-group-title"
        label="Title:"
        label-for="input-title"
        description="Your annonce / 'small ad' need a explicit title."
        >
        <b-form-input
        id="input-title"
        v-model="annonce.title" :state="getState()" autofocus
        placeholder="Enter annonce title"
        required
        ></b-form-input>
      </b-form-group>


      <!-- <b-input placeholder="title" v-model="annonce.title" :state="getState()" autofocus /> -->

      <b-form-group
      id="input-group-category"
      label="Categories:"
      label-for="input-category"
      description="Please add 1 to 3 categories to specify where to find your annonce."
      >
      <b-form-input
      id="input-category"
      placeholder="3 categories max, comma separated"
      v-model="annonce.category"
      ></b-form-input>
    </b-form-group>

    <!-- <b-input placeholder="3 categories max, comma separated" v-model="annonce.category" /> -->



    <b-form-group
    id="input-group-category"
    label="Description:"
    label-for="input-description"
    description="Please give a clear description."
    >
    <b-textarea id="input-description" placeholder="Description" v-model="annonce.description"  rows="7"/>
    <!-- <b-form-input
    id="input-category"
    placeholder="3 categories max, comma separated"
    v-model="annonce.category"
    required
    ></b-form-input> -->
  </b-form-group>

  <b-form inline>
    <label class="mr-sm-2" for="input-price">Price:</label>
    <b-input id="input-price" placeholder="price" v-model="annonce.price" class="mr-sm-2" />
    <label class="mr-sm-2" for="input-currency">Currency:</label>
    <b-input id="input-currency" placeholder="currency (€,$...)" v-model="annonce.currency" class="mr-sm-2" />
  </b-form>
  <!-- <b-button variant="light" @click="addField()" style="margin-left:auto;">
  <b-icon icon="plus"></b-icon>
</b-button> -->



<b-form-group
id="input-group-images"
label="Images:"
label-for="input-images"
description="Add some images for a better description & visibility"
>




<!-- @vdropzone-success-multiple="vsuccessMuliple"
@vdropzone-sending-multiple="vsendingMuliple"
@vdropzone-queue-complete="vqueueComplete"
@vdropzone-total-upload-progress="vprogress"
@vdropzone-mounted="vmounted"
@vdropzone-drop="vddrop"
@vdropzone-drag-start="vdstart"
@vdropzone-drag-end="vdend"
@vdropzone-drag-enter="vdenter"
@vdropzone-drag-over="vdover"
@vdropzone-drag-leave="vdleave"
@vdropzone-duplicate-file="vdduplicate" -->
<!-- <vueDropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions"></vueDropzone> -->
<!-- <Upload id="input-images" :images="annonce.images" @imagesUploaded="imagesUploaded"/> -->

<!-- <b-form-input
id="input-title"
v-model="annonce.title" :state="getState()" autofocus
placeholder="Enter annonce title"
required
></b-form-input> -->
</b-form-group>
<!-- <p>If you add images, don't forget to hit the "send" button before hitting the "save" one.</p> -->



<vueDropzone ref="myVueDropzone" id="dropzone"
@vdropzone-file-added="vfileAdded"
@vdropzone-success="vsuccess"
@vdropzone-error="verror"
@vdropzone-removed-file="vremoved"
@vdropzone-sending="vsending"
@vdropzone-success-multiple="vsuccessMuliple"
@vdropzone-sending-multiple="vsendingMuliple"
@vdropzone-queue-complete="vqueueComplete"


:options="dropzoneOptions"
:duplicateCheck="true">
</vueDropzone>
<p>Files will be automatically upload at <small><a :href="path" target="_blank">{{ path }}</a></small></p>




<div class="d-flex" >

  <b-button class="ml-auto" variant="info" @click="add()" disbled="numberOfFiles != 0">save</b-button>
  <b-button class="ml-2" variant="secondary" @click="goBack()">back</b-button>
</div>
</b-form>



<!-- <Pica /> -->







</div>
<div v-else>
  You must login to manage your annonces.
</div>
</b-container>
</template>

<script>


let ldflex = window.solid
import FC from 'solid-file-client'
const fc = new FC( window.solid.auth )
import watermark from 'watermarkjs'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
//dropzone with pica https://stackoverflow.com/questions/66441805/using-dropzone-js-with-pica-or-other-image-compression-resize-libraries
// custom preview https://rowanwins.github.io/vue-dropzone/docs/dist/index.html#/custom-preview

import {Annonce} from './Annonce'


export default {
  name: "AnnonceEdit",
  components: {
    //  'Upload': () => import('@/components/portfolio/Upload'),
    'vueDropzone': () => import('vue2-dropzone'),
    //  'Pica': () => import('@/components/annonce/Pica')
  },
  data(){
    return{
      annonce: null,
      files: null,
      path: "",
      numberOfFiles: 0,
      dropzoneOptions: {
        url: 'https://spoggy-test4.solidcommunity.net/public/portfolio/',
        //thumbnailWidth: 200,
        maxFilesize: 1,
        headers: { "withCredentials": true },
        addRemoveLinks: true,
        //  resizeWidth: 200,
        autoQueue: false,
        //  resizeHeight: 400,
      },
      // fileAdded: false,
      // filesAdded: false,
      // success: false,
      // error: false,
      // removedFile: false,
      // sending: false,
      // successMultiple: false,
      // sendingMultiple: false,
      // queueComplete: false,
      // uploadProgress: false,
      // progress: false,
      // myProgress: 0,
      // isMounted: false,
      // dDrop: false,
      // dStarted: false,
      // dEnded: false,
      // dEntered: false,
      // dOver: false,
      // dLeave: false,
      // dDuplicate:false
    }
  },
  async created(){
    console.log(this.$route.params.id)
    this.annonce = this.$route.params.id != undefined ?  this.annoncesMy.find(x => x.id === this.$route.params.id): new Annonce()
    this.annonce.images == undefined ? this.annonce.images = [] : ""
    let storage = await ldflex.data.user.storage
    this.path = `${storage}`+'public/portfolio/'
    //  this.$refs.myVueDropzone.options.url =this.path

  },
  methods: {
    // vfileAdded(file){
    //   console.log(file)
    // },
    async vsuccess(file){
      console.log(file)
      //  this.files.push(file)

      //  this.annonce.images = images
    },
    verror(file){
      console.log(file)
    },
    vremoved(file){
      console.log(file)
    },
    async vsending1(file){
      console.log(file)
    },
    async vsending(file){
      console.log(file)
      this.numberOfFiles--
      try{
        console.log("success", this.numberOfFiles,file)
        let uri = encodeURI(this.path+file.name)
        console.log(uri)

        watermark([file])
        .image(watermark.text.center(this.path, '30px Josefin Slab', '#fff', 0.8))
        //.then(img => {
        // img.name = f.name
        // img.type = f.type
        // img.width = "250"
        // img.height = "250"
        // preview.appendChild(img)});

        //  !app.images.includes(uri) ? app.images.push(uri): ""
        //  var file = dataURLtoFile(i.src,i.name);

        await fc.createFile(uri, file, file.type)
        this.annonce.images.push(uri)
      }catch(e){
        alert(e)
      }
    },
    vsuccessMuliple(files){
      console.log("MUILTIPLE SUCCESS",files)
    },
    vsendingMuliple(files){
      console.log("MULTIPLE SENDING",files)
    },
    vqueueComplete(files){
      console.log("QUEUE COMPLETE",files)
    },
    vfileAdded1(origFile) {
      console.log(origFile)
    },

    vfileAdded(origFile) {
      this.numberOfFiles++
      //https://stackoverflow.com/questions/20533191/dropzone-js-client-side-image-resizing
      let dropzone = this.$refs.myVueDropzone
      //  console.log("DZ1", dropzone)
      let app = this
      var MAX_WIDTH  = 1024;
      var MAX_HEIGHT = 768;

      console.log("Orig",origFile)

      var reader = new FileReader();

      // Convert file to img

      reader.addEventListener("load", function(event) {

        var origImg = new Image();
        origImg.src = event.target.result;

        origImg.addEventListener("load", function(event) {

          var width  = event.target.width;
          var height = event.target.height;


          // Don't resize if it's small enough

          if (width <= MAX_WIDTH && height <= MAX_HEIGHT) {
            // dropzone.enqueueFile(origFile);
            //https://stackoverflow.com/questions/48225489/how-can-i-enqueue-a-file-manually-in-dropzone-vue-dropzone-2
            dropzone.dropzone.enqueueFile(origFile)
            return;
          }


          // Calc new dims otherwise

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }


          // Resize
          //  alert("resize")

          var canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          var ctx = canvas.getContext("2d");
          ctx.drawImage(origImg, 0, 0, width, height);

          var resizedFile = app.base64ToFile(canvas.toDataURL(), origFile);

          console.log("resized",resizedFile)

          // Replace original with resized
          console.log(dropzone)
          var origFileIndex = dropzone.dropzone.files.indexOf(origFile);
          dropzone.dropzone.files[origFileIndex] = resizedFile;


          // Enqueue added file manually making it available for
          // further processing by dropzone
          //    console.log("DZ",dropzone)

          //  dropzone.enqueueFile(resizedFile);
          //https://stackoverflow.com/questions/48225489/how-can-i-enqueue-a-file-manually-in-dropzone-vue-dropzone-2
          dropzone.dropzone.enqueueFile(resizedFile)
        });
      });

      reader.readAsDataURL(origFile);
    },



    add() {
      if (this.annonce.title.length < 1){
        alert("Title must not be empty !")
        return
      }
      console.log(this.annonce)
      this.$store.dispatch('annonce/update', this.annonce)
      this.$router.go(-1)
    },
    goBack(){
      this.$router.go(-1)
    },
    getState() {
      return this.annonce.title.length > 0;
    },
    imagesUploaded(images){
      console.log(images)
      this.annonce.images = images
    },
    base64ToFile(dataURI, origFile) {
      var byteString, mimestring;

      if(dataURI.split(',')[0].indexOf('base64') !== -1 ) {
        byteString = atob(dataURI.split(',')[1]);
      } else {
        byteString = decodeURI(dataURI.split(',')[1]);
      }

      mimestring = dataURI.split(',')[0].split(':')[1].split(';')[0];

      var content = new Array();
      for (var i = 0; i < byteString.length; i++) {
        content[i] = byteString.charCodeAt(i);
      }

      var newFile = new File(
        [new Uint8Array(content)], origFile.name, {type: mimestring}
      );


      // Copy props set by the dropzone in the original file

      var origProps = [
        "upload", "status", "previewElement", "previewTemplate", "accepted"
      ];

      origProps.forEach((p) => {
        newFile[p] = origFile[p];
      });

      return newFile;
    }
  },
  computed:{
    annoncesMy() {
      return this.$store.state.annonce.annoncesMy
    },
    webId() {
      return this.$store.state.solid.webId
    },
  },
}
</script>

<style>

</style>
