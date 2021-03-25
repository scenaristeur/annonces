<template>
  <div class="container mt-3">
    <div class="row">
      <div class="col-12 col-md-4 ">
        <select v-model="langsel">
          <option value='afr'     > Afrikaans             </option>
          <option value='ara'     > Arabic                </option>
          <option value='aze'     > Azerbaijani           </option>
          <option value='bel'     > Belarusian            </option>
          <option value='ben'     > Bengali               </option>
          <option value='bul'     > Bulgarian             </option>
          <option value='cat'     > Catalan               </option>
          <option value='ces'     > Czech                 </option>
          <option value='chi_sim' > Chinese               </option>
          <option value='chi_tra' > Traditional Chinese   </option>
          <option value='chr'     > Cherokee              </option>
          <option value='dan'     > Danish                </option>
          <option value='deu'     > German                </option>
          <option value='ell'     > Greek                 </option>
          <option value='eng'     selected> English       </option>
          <option value='enm'     > English (Old)         </option>
          <option value='meme'    > Internet Meme         </option>
          <option value='epo'     > Esperanto             </option>
          <option value='epo_alt' > Esperanto alternative </option>
          <option value='equ'     > Math                  </option>
          <option value='est'     > Estonian              </option>
          <option value='eus'     > Basque                </option>
          <option value='fin'     > Finnish               </option>
          <option value='fra'     > French                </option>
          <option value='frk'     > Frankish              </option>
          <option value='frm'     > French (Old)          </option>
          <option value='glg'     > Galician              </option>
          <option value='grc'     > Ancient Greek         </option>
          <option value='heb'     > Hebrew                </option>
          <option value='hin'     > Hindi                 </option>
          <option value='hrv'     > Croatian              </option>
          <option value='hun'     > Hungarian             </option>
          <option value='ind'     > Indonesian            </option>
          <option value='isl'     > Icelandic             </option>
          <option value='ita'     > Italian               </option>
          <option value='ita_old' > Italian (Old)         </option>
          <option value='jpn'     > Japanese              </option>
          <option value='kan'     > Kannada               </option>
          <option value='kor'     > Korean                </option>
          <option value='lav'     > Latvian               </option>
          <option value='lit'     > Lithuanian            </option>
          <option value='mal'     > Malayalam             </option>
          <option value='mkd'     > Macedonian            </option>
          <option value='mlt'     > Maltese               </option>
          <option value='msa'     > Malay                 </option>
          <option value='nld'     > Dutch                 </option>
          <option value='nor'     > Norwegian             </option>
          <option value='pol'     > Polish                </option>
          <option value='por'     > Portuguese            </option>
          <option value='ron'     > Romanian              </option>
          <option value='rus'     > Russian               </option>
          <option value='slk'     > Slovakian             </option>
          <option value='slv'     > Slovenian             </option>
          <option value='spa'     > Spanish               </option>
          <option value='spa_old' > Old Spanish           </option>
          <option value='sqi'     > Albanian              </option>
          <option value='srp'     > Serbian (Latin)       </option>
          <option value='swa'     > Swahili               </option>
          <option value='swe'     > Swedish               </option>
          <option value='tam'     > Tamil                 </option>
          <option value='tel'     > Telugu                </option>
          <option value='tgl'     > Tagalog               </option>
          <option value='tha'     > Thai                  </option>
          <option value='tur'     > Turkish               </option>
          <option value='ukr'     > Ukrainian             </option>
          <option value='vie'     > Vietnamese            </option>
        </select>
      </div>


      <Upload :images="scan.images" @imagesUploaded="imagesUploaded"/>

      <textarea v-model="text"  cols="100" rows="10"/>
      <b-button @click="resetText">Reset Text</b-button>

      <div class="col-12 col-md-4 mt-3 mt-md-0">
        <!-- <div class="box">
          <input type="file" name="file-1[]" id="file-1" class="inputfile inputfile-1" data-multiple-caption="{count} files selected" multiple />
          <label for="file-1"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"/></svg> <span>Choose a file&hellip;</span></label>


        </div> -->
      </div>
    </div>
    <div class="row">
      <!-- <div class="col-12 col-md-5">
        <div class="image-container"><img id="selected-image"  src="https://github.com/bensonruan/Tesseract-OCR/raw/master/images/Funny-Minion-Quotes.jpg" class="col-12 p-0" /></div>
      </div> -->
      <div class="col-12 col-md-1">
        <i id="arrow-right" class="fas fa-arrow-right d-none d-md-block"></i>
        <i id="arrow-down" class="fas fa-arrow-down d-block d-md-none"></i>
      </div>
      <div class="col-12 col-md-6">
        <div id="log">
          <span id="startPre">
            <a id="startLink" href="#">Click here to recognize text in the demo</a>
            <br/> or choose your own image
          </span>
        </div>
      </div>
    </div>
  </div>

</template>

<script>

/* eslint-disable */
import { createWorker, PSM, OEM } from 'tesseract.js';
let worker = {}

export default {
  name: "Scan",
  components: {
    'Upload': () => import('@/components/portfolio/Upload'),
  },
  data(){
    return{
      scan: {images: []},
      text: "",
      langsel: "eng",
      logger : {}
    }
  },
  created(){
    console.log(navigator.language)
    worker = createWorker({
      logger: m => this.progressUpdate(m),
    });
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
    async recognize (url){
      //  const img = document.getElementById('text-img');
      //console.log(img);
      console.log(this.langsel)
      await worker.load();
      await worker.loadLanguage(this.langsel);
      await worker.initialize(this.langsel, OEM.LSTM_ONLY);
      await worker.setParameters({
        tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
      });
      const { data: { text } } = await worker.recognize(url)
      this.text += text


    },

    progressUpdate(packet){
      var log = document.getElementById('log');

      if(log.firstChild && log.firstChild.status === packet.status){
        if('progress' in packet){
          var progress = log.firstChild.querySelector('progress')
          progress.value = packet.progress
        }
      }else{
        var line = document.createElement('div');
        line.status = packet.status;
        var status = document.createElement('div')
        status.className = 'status'
        status.appendChild(document.createTextNode(packet.status))
        line.appendChild(status)

        if('progress' in packet){
          var progress = document.createElement('progress')
          progress.value = packet.progress
          progress.max = 1
          line.appendChild(progress)
        }


        if(packet.status == 'done'){
          log.innerHTML = ''
          var pre = document.createElement('pre')
          pre.appendChild(document.createTextNode(packet.data.text.replace(/\n\s*\n/g, '\n')))
          line.innerHTML = ''
          line.appendChild(pre)
          $(".fas").removeClass('fa-spinner fa-spin')
          $(".fas").addClass('fa-check')
        }

        log.insertBefore(line, log.firstChild)
      }
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
#log > div {
  color: #313131;
  border-top: 1px solid #dadada;
  padding: 9px;
  display: flex;
}
#log > div:first-child {
  border: 0;
}
.status {
  min-width: 250px;
}
#log {
  border: 1px solid #dadada;
  padding: 10px;
  min-height: 200px;
}
.image-container img{
  border: 1px solid #dadada;
}
progress {
  display: block;
  width: 100%;
  transition: opacity 0.5s linear;
}
progress[value="1"] {
  opacity: 0.5;
}
select {
  padding: 12px 5px;
  width: 209px;
}

.inputfile {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}

.inputfile + label {
  max-width: 80%;
  font-size: 1.25rem;
  /* 20px */
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  display: inline-block;
  overflow: hidden;
  padding: 0.625rem 1.25rem;
  /* 10px 20px */
}

.no-js .inputfile + label {
  display: none;
}

.inputfile:focus + label,
.inputfile.has-focus + label {
  outline: 1px dotted #000;
  outline: -webkit-focus-ring-color auto 5px;
}

.inputfile + label * {
  /* pointer-events: none; */
  /* in case of FastClick lib use */
}

.inputfile + label svg {
  width: 1em;
  height: 1em;
  vertical-align: middle;
  fill: currentColor;
  margin-top: -0.25em;
  /* 4px */
  margin-right: 0.25em;
  /* 4px */
}


/* style 1 */

.inputfile-1 + label {
  color: #f1e5e6;
  background-color: #d3394c;
}

.inputfile-1:focus + label,
.inputfile-1.has-focus + label,
.inputfile-1 + label:hover {
  background-color: #722040;
}

#arrow-right ,
#arrow-down {
  font-size: 3em;
}

#arrow-right {
  position: absolute;
  top: 60px;
}
#arrow-down{
  width: 50px;
  margin: 10px auto;
}

#arrow-right.fa-arrow-right ,
#arrow-right.fa-spin ,
#arrow-down.fa-arrow-down ,
#arrow-down.fa-spin  {
  color: #d3394c;
}

.fa-check{
  color:green;
}

#log pre {
  white-space: pre-wrap;       /* css-3 */
  white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
  white-space: -pre-wrap;      /* Opera 4-6 */
  white-space: -o-pre-wrap;    /* Opera 7 */
  word-wrap: break-word;       /* Internet Explorer 5.5+ */
}

#startLink{
  text-decoration: underline;
  margin-top: 100px;
}

@media screen and (min-width: 992px) {
  #startPre{
    position: absolute;
    top: 50px;
    padding: 20px;
  }
}
</style>
