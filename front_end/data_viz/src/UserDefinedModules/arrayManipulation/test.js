const x = require("./index");

// let y1 = new x.Test();
// y1.showMetaData();
// console.log("-----------------------------------------------");
// let y2 = new x.Test([1, 2, 3]);
// y2.append(20)
// y2.showMetaData();
// y2.append([900,1000])
// y2.showMetaData();
// console.log("-----------------------------------------------");
let y3 = new x.Test([
  ["high", "date"],
  [3, 4],
  [5, 6],
]);
y3.showMetaData();
console.log(y3.arrangeData(["date", "high"]));
y3.append([10])
y3.append([10,20])
y3.append([10,20,30])
y3.showMetaData();
y3.append([[500,600],[700,800]])
y3.showMetaData();

// let data = JSON.parse(
//   '[{"date": "2020-04-20", "open": "22.00"}, {"date": "2020-04-21", "open": "22.25"}, {"date": "2020-04-22", "open": "21.60"}, {"date": "2020-04-23", "open": "21.60"}, {"date": "2020-04-24", "open": "21.10"}, {"date": "2020-04-27", "open": "20.95"}, {"date": "2020-04-28", "open": "20.75"}, {"date": "2020-04-29", "open": "21.00"}, {"date": "2020-04-30", "open": "21.30"}, {"date": "2020-05-04", "open": "21.70"}, {"date": "2020-05-05", "open": "24.65"}, {"date": "2020-05-06", "open": "23.05"}, {"date": "2020-05-07", "open": "22.90"}, {"date": "2020-05-08", "open": "23.35"}, {"date": "2020-05-11", "open": "22.55"}, {"date": "2020-05-12", "open": "22.40"}, {"date": "2020-05-13", "open": "23.10"}, {"date": "2020-05-14", "open": "26.90"}, {"date": "2020-05-15", "open": "27.50"}, {"date": "2020-05-18", "open": "27.70"}, {"date": "2020-05-19", "open": "26.40"}, {"date": "2020-05-20", "open": "25.10"}, {"date": "2020-05-21", "open": "26.00"}, {"date": "2020-05-22", "open": "25.40"}, {"date": "2020-05-26", "open": "25.00"}, {"date": "2020-05-27", "open": "25.25"}, {"date": "2020-05-28", "open": "25.40"}, {"date": "2020-05-29", "open": "26.80"}, {"date": "2020-06-01", "open": "28.40"}, {"date": "2020-06-02", "open": "28.20"}, {"date": "2020-06-03", "open": "28.20"}, {"date": "2020-06-04", "open": "27.90"}, {"date": "2020-06-05", "open": "27.00"}, {"date": "2020-06-08", "open": "28.55"}, {"date": "2020-06-09", "open": "28.25"}, {"date": "2020-06-10", "open": "31.50"}, {"date": "2020-06-11", "open": "30.80"}, {"date": "2020-06-12", "open": "28.40"}, {"date": "2020-06-15", "open": "29.25"}, {"date": "2020-06-16", "open": "29.90"}, {"date": "2020-06-17", "open": "28.30"}, {"date": "2020-06-18", "open": "28.65"}, {"date": "2020-06-19", "open": "32.65"}, {"date": "2020-06-22", "open": "32.95"}, {"date": "2020-06-23", "open": "34.10"}, {"date": "2020-06-24", "open": "36.00"}, {"date": "2020-06-25", "open": "36.30"}, {"date": "2020-06-26", "open": "38.70"}, {"date": "2020-06-29", "open": "36.20"}, {"date": "2020-06-30", "open": "36.60"}, {"date": "2020-07-01", "open": "36.30"}, {"date": "2020-07-02", "open": "37.00"}, {"date": "2020-07-03", "open": "37.00"}]'
// );
// var chartData = [];
// chartData.push(Object.keys(data[0]));
// for (var row in data) {
//   chartData.push(Object.values(data[row]));
// }
// let y4 = new x.Test(chartData);
// y4.showMetaData();
// console.log(y4.arrangeData(["open", "date"]));
// console.log(y4.getArray());
