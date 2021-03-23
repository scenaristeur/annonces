let ldflex = window.solid
import auth from 'solid-auth-client';
import FC from 'solid-file-client'
const fc = new FC( auth )

const { namedNode } = require('@rdfjs/data-model');

export class Notif {
  constructor(path, annonce){
    let date = new Date()

    //    this.path = [path, date.getFullYear(), ("0" + (date.getMonth() + 1)).slice(-2), ("0" + date.getDate()).slice(-2), "annonces.ttl"].join("/")
    this.path = [path+date.getFullYear(), ("0" + (date.getMonth() + 1)).slice(-2), ("0" + date.getDate()).slice(-2)+".ttl#this"].join("/")
    this.annonce = annonce

    this.notify()
  }

  async notify(){
    await this.fileUrl()
    console.log('new notif', this)

    await ldflex.data[this.path]['http://purl.org/dc/terms/hasPart'].add(namedNode(this.annonce.url))
  }
  async  fileUrl(){
    if( !await fc.itemExists( this.path )) {
      // REVOIR POUR INSERER LES prefix
      // let baseFileContent = `@prefix : <#>.
      // @prefix terms: <http://purl.org/dc/terms/>.`
      // await fc.postFile(this.path, baseFileContent, "text/turtle")
      await fc.postFile(this.path, "", "text/turtle")
      .then((content) => {
        console.log("File Created",content)
      })
      .catch(err => console.error(`Error: ${err}`))
    }else{
      console.log("File exist",this.path)
    }
  }


}
