import {Database} from './lib/recordDatabase'

const db = new Database('./store.db');

class Student{
  constructor(public stuID: Number, public name: String){

  }
}

class Reason{
  constructor(public reaID: Number, public name: String){

  }
}

class Abscence{
  constructor(public absID: Number, public student: Student, public reason: Reason, public dateFrom: Date, public dateTo: Date, public lesson: Array<Number>){

  }
}

class index{
  constructor(public stuIDs: Array<Number>, reaIDs: Array<Number>, absIDs: Array<Number>, odaIDs: Array<Number>){

  }
}
