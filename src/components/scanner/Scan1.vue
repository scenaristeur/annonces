<template>
  <div>
    Scan WIP
    Logger : {{ logger }}<br>

    <textarea v-model="text"  cols="100" rows="10"/>
    <b-button @click="resetText">Reset Text</b-button>
    <Upload :images="scan.images" @imagesUploaded="imagesUploaded"/>

  </div>
</template>

<script>
// https://openbase.com/categories/js/best-nodejs-ocr-libraries?orderBy=RECOMMENDED&
// alternative https://antimatter15.com/ocrad.js/demo.html
// https://github.com/naptha/tesseract.js/tree/develop
// npm install tesseract.js@next --save -->

// + tesseract.js@2.0.0-beta.2
// added 13 packages from 16 contributors and audited 1660 packages in 13.722s
//
// 102 packages are looking for funding
//   run `npm fund` for details
//
// found 1 high severity vulnerability
//   run `npm audit fix` to fix them, or `npm audit` for details
// npm audit fix -> 2.1.4 but error


import Tesseract from 'tesseract.js';

export default {
  name: "Scan1",
  components: {
    'Upload': () => import('@/components/portfolio/Upload'),
  },
  data(){
    return{
      scan: {images: []},
      text: "",
      logger : {}
    }
  },
  created(){
    console.log(navigator.language)
  },
  methods: {
    imagesUploaded(images){
      console.log(images)
      //  this.scan.images = images
      console.log(this.scan)
      images.forEach(async (item, i) => {
        await this.recognize(item)
        console.log(i)
      });

    },
    recognize(url){

      Tesseract.recognize(
        //'https://tesseract.projectnaptha.com/img/eng_bw.png',
        url,
        'eng',
        { logger: m => {
          console.log("logger",m)
          this.logger = m
        } }
      ).then(({ data: { text } }) => {
        console.log("text", text);
        this.text += text
      })
    },
    resetText()
    {
      this.logger = {}
      this.text = ""
    }

  }
}
</script>

<style>

</style>
