import { v4 as uuidv4 } from 'uuid';

export class Annonce {
  constructor(){
    this.id = uuidv4()
    this.title = ""
    console.log('new annonce', this)
  }

}
