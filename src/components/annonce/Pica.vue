<template>
      <div class="container">
        <div class="col-sm-8">
            <h3><button id='upload-btn' class="btn btn-secondary btn-xs" @click="onClick()">Upload</button></h3>
            <h3>Preview</h3>
            <div class="canvas-containter" id="preview-container">
                <!-- <canvas id="preview-pica" class="img-responsive" style="max-width: 300px;"></canvas> -->
                <img v-if="previewImage" :src="previewImage" style="max-width: 300px;">
            </div>

            <form method="post" action="/upload.php" @submit.prevent="onSubmit">
                <div id="files"></div>
                <!-- <input id="file" name="img" type="hidden" value="111"> -->
                <div>
                    <input id="upload" type="file" style="position: absolute; left: -2000px" ref="uploadFiles" @change="onFileChange($event)">
                    <button type="submit" id="submit" class="btn btn-primary" disabled>Submit</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
//https://gist.github.com/tangoslee/ff9954aafcd02a0cc0c564e49a112a88
//https://blog.bitsrc.io/image-manipulation-libraries-for-javascript-187fde1ad5af
import Pica from 'pica'

const options = {
  // esize quality (filter/window) (0..3)
  quality: 3,
  // Unsharp amount (0..200):
  unsharpAmount: 80,
  // Unsharp radius (0.5..2):
  unsharpRadius: 0.6,
  // Unsharp threshold (0..255)
  unsharpThreshold: 2,
  // true, false
  alpha: true,
  transferable: true
}

const resizer = Pica({
  features: ['js', 'wasm', 'ww']
})

export default {
  name: 'PicaSample',
  data () {
    return {
      msg: 'Pica Sample',
      files: [],
      previewImage: ''
    }
  },
  methods: {
    onClick: function () {
      console.log('click')
      this.$refs.uploadFiles.click()
    },

    onFileChange: function (event) {
      this.files = event.target.files
      console.log('change', this.files[0])
      this.resizeImage(this.files[0])
    },

    onSubmit: function () {
      console.log(this.name, this.files)
    },

    updateResized: function (img, options = {}) {
      console.log('updateResized init')
      return new Promise((resolve, reject) => {
        const width = 1024
        // Make origin
        const from = document.createElement('canvas')
        from.width = img.width
        from.height = img.height
        from.getContext('2d').drawImage(img, 0, 0)
        // Resize with pica
        const preview = document.createElement('canvas')
        preview.width = width
        preview.height = img.height * width / img.width
        // $('#preview-container').append(preview)
        console.log({ preview: img.src })
        const to = document.createElement('canvas')
        to.width = preview.width
        to.height = preview.height
        resizer.resize(from, to, options)
          .then(result => {
            // preview
            preview.getContext('2d', {
              alpha: Boolean(options.alpha)
            }).drawImage(to, 0, 0)
            // set image
            const el = document.createElement('input')
            el.setAttribute('name', 'img[]')
            el.setAttribute('style', 'position: absolute; left: -2000px')
            el.value = result.toDataURL('image/jpeg')
            console.log({img: el.value})
            this.previewImage = el.value
            // $('#files').append(el)
            resolve()
          })
          .catch(function (err) {
            console.error(err)
            reject(err)
          })
      })
    },

    resizeImage: function (file) {
      const tasks = []
      const img = new Image()
      img.src = window.URL.createObjectURL(file)
      img.onload = () => {
        tasks.push(this.updateResized(img, options))
        Promise.all(tasks).then(task => {
          console.log('task complete:', task)
        })
      }
    }

  }

}
</script>

<style scoped>
  #preview-container canvas { max-width: 200px !important; }
</style>
