import { v4 as uuidv4 } from 'uuid';

export class Annonce {
  constructor(){
    this.id = uuidv4()
    this.title = ""
    this.category = ""
    this.description = ""
    this.price = null
    this.currency = null
    console.log('new annonce', this)
  }

}
