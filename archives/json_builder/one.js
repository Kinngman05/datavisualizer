class User {
  constructor(name) {
    this.name = name;
  }

  sayHi() {
    console.log(this.name);
  }
}

// Usage:
// let user = new User("John");
// user.sayHi();

const __header            = 'HEADER'
const __requestType       = 'REQUEST_TYPE'
const __body              = 'DATA'
const __objectType        = 'what'
const __objectName        = 'name'
const __tableConstraints  = 'table_constraints'
const __indexConstraints  = 'index_constrains'
const __primaryKey        = 'primary_key'
const __foreignKey        = 'foreign_key'
const __initialData       = 'initial_data'
const __values            = 'values'
const __attribute         = 'attributes'
// const __from              = 'from'
const __where             = 'where'
const __groupBy           = 'group_by'
const __having            = 'having'
const __orderBy           = 'order_by'
const __offset            = 'offset'
const __limit             = 'limit'
const __footer            = 'FOOTER'


class JsonBuilder {

    constructor(header={},body={},footer={}){
        // let this.__header__ = ""
        this._jsonString = ""
        this._json = {}
        this.header = {}
        this.body = {}
        this.footer = {}
    }

    addHeaderEntry(key,value){
        this.header[key] = value
    }

    addBodyEntry(key,value){
        this.body[key] = value
    }

    addFooterEntry(key,value){
        this.footer[key] = value
    }

    setQueryType(value){
        // this.header["REQUEST_TYPE"] = typeof(value) == 'string' ? value.toUpperCase() : value
        this.header[__requestType] = value.toUpperCase()
    }

    //For CREATE query
    // createAttributeList(attribute,dataType) //To create the attribute list -- Do I need to implement this?
    setObjectType(type){

    }
    setObjectConstraints(jsonObject){

    }
    setObjectIndexConstraints(listOfIndices){

    }
    setObjectPrimaryKey(constraintName){

    }
    setObjectForeignKey(constraintName){

    }
    setInitialData(constraintName){

    }
    //For USE query
    setObjectName(name){
        this.body[__objectName] = name
    }
    //For INSERT query
    setValues(object){
        this.body[__values] = object
    }
    //For SELECT query
    setObjectName(name){
        if(this.header[__requestType] == "SELECT" && !Array.isArray(name)){
            console.log("setObjectName takes an array of tables when its a SELECT query.")
            return
        }
        this.body[__objectName] = name //Only in the case of a select will this be a list(otherwise string)
        console.log(__objectName,"has been assigned")
    }
    setAttributes(attribList){
        this.body[__attribute] = attribList
    }
    setWhere(whereObject){
        this.body[__where] = whereObject
    }
    setGroupBy(groupByList){
        this.body[__groupBy] = groupByList
    }
    setHaving(having){
        this.body[__having] = having
    }
    setOrderBy(orderByList){
        this.body[__orderBy] = orderByList
    }
    setOffset(offsetValue){
        this.body[__offset] = offsetValue
    }
    setLimit(limitValue){
        this.body[__limit] = limitValue
    }
    //For UPDATE query
    //For DELETE query
    //For DROP query

    buildJson(){
        this._json[__header] = this.header
        this._json[__body] = this.body
        this._json[__footer] = this.footer
    }

    showJson() {
        console.log("The json string is:",this._json)
    }
}

let x = new JsonBuilder()
// x.addHeaderEntry("REQUEST_TYPE","SELECT")
x.setQueryType("select")
x.setObjectName(["test_db"])
x.setAttributes(["name","age","*"])
x.setWhere({"name":"trun","id":10})
// x.setQueryType(1)
// x.addBodyEntry("waoe","blah")
// x.addFooterEntry("footer","bleh")
x.buildJson()
// for(let x=0;x<10000000;x++){
//     let y=0
//     y++;
// }
x.showJson()
