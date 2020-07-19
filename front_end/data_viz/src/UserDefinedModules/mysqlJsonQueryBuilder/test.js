build = require("./index");
let x = new build.queyBuilder();

x.setDatabase("database-name");
x.setTableName("table-name");
x.setRequestType("request-type");
x.setFields(["fields", "allo"]);
x.setSet("setValue");
x.setDependency({ dependency: 20 });
x.setWhere("where");
x.setComment("comment");
x.setUpdate({ update: 30 });

console.log(x.buildQuery());
