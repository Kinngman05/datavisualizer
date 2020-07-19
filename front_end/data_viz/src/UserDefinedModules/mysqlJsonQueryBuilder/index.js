export class queyBuilder {
  constructor() {
    this.database = null;
    this.tableName = null;
    this.requestType = null;
    this.fields = null;
    this.set = null;
    this.where = null;
    this.metadata = null;
    this.dependency = null;
    this.comment = null;
    this.update = null;
  }

  setDatabase(databaseName) {
    this.database = databaseName;
  }
  setTableName(tableName) {
    this.tableName = tableName;
  }
  setRequestType(requestType) {
    this.requestType = requestType;
  }
  setFields(fields) {
    if (Array.isArray(fields) || fields == null) {
      this.fields = fields;
    } else {
      console.log("ERROR: fields is an Array!");
    }
  }
  addField() {}
  removeField() {}
  setSet(setValue) {
    this.set = setValue;
  }
  setWhere(where) {
    this.where = where;
  }
  setMetadata(metadata) {
    this.metadata = metadata;
  }
  setDependency(dependency) {
    if (
      (dependency instanceof Object && !(dependency instanceof Array)) ||
      dependency == null
    ) {
      this.dependency = dependency;
    } else {
      console.log("ERROR: dependency is an Object with select request type!");
    }
  }
  setComment(comment) {
    this.comment = comment;
  }
  setUpdate(update) {
    if (
      (update instanceof Object && !(update instanceof Array)) ||
      update == null
    ) {
      this.update = update;
    } else {
      console.log("ERROR: update is an Object with update request type!");
    }
  }

  buildQuery() {
    let database = { DATABASE: this.database };
    let table = { TABLE_NAME: this.tableName };
    let request = { REQUEST_TYPE: this.requestType };
    let fields = { FIELDS: this.fields };
    let set = { SET: this.set };
    let where = { WHERE: this.where };
    let metadata = { "DATA ABOUT THE REQUEST": this.metadata };
    let dependency = { DEP: this.dependency };
    let comment = { COMMENT: this.comment };
    let update = { UPDATE: this.update };
    let header = { HEADER: { ...database, ...table, ...request } };
    let data = { DATA: { ...fields, ...set, ...where } };
    let footer = {
      FOOTER: { ...metadata, ...dependency, ...comment, ...update },
    };
    let jsonQuery = { ...header, ...data, ...footer };
    return JSON.stringify(jsonQuery);
  }
}

// exports.queyBuilder = queyBuilder;
// export default queyBuilder;

// module.exports = queyBuilder;
// module.exports = queyBuilder;
