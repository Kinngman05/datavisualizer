export class EasyArray {
  constructor(arr) {
    if (arr == undefined) {
      //   this.array = null;
      //   this.shape = null;
      //   this.header = null;
      //   this.data = null;
      //   this.dimension = null;
    } else {
      if (Array.isArray(arr)) {
        this.array = arr;
        if (Array.isArray(arr[0])) {
          this.dimension = 2;
          this.header = arr[0];
          this.shape = [arr.length, this.header.length];
          this.data = arr.slice();
          this.data.shift();
        } else {
          this.dimension = 1;
          //   this.shape = [ 1,arr.length ]
        }
      }
    }
  }

  showMetaData() {
    console.log("header", this.header);
    console.log("data", this.data);
    console.log("array", this.array);
    console.log("shape", this.shape);
    console.log("dimension", this.dimension);
    //   console.log();
    //   console.log();
    //   console.log();
  }

  arrangeData(headerList) {
    if (this.dimension == 2) {
      if (Array.isArray(headerList)) {
        var arrayIndices = [];
        for (let header of headerList) {
          for (let index in this.header) {
            if (header == this.header[index]) {
              arrayIndices.push(index);
              break;
            }
          }
        }
        var result = [];
        for (let row of this.array) {
          var newRow = [];
          for (let something of arrayIndices) {
            newRow.push(row[something]);
          }
          result.push(newRow);
        }
        return result;
      }
    }
  }
  setData(arr) {
    this.data = arr; //Check Error correction!
  }
  getArray() {
    return this.array;
  }
  addHeader(header) {
    if (Array.isArray(header)) {
      this.header = header;
    }
  }
  append(rows) {
    if (this.dimension == 1) {
      if (Array.isArray(rows)) {
        this.array.push(...rows);
      } else if (typeof rows == "number") {
        this.array.push(rows);
      }
    } else if (this.dimension == 2) {
      if (Array.isArray(rows)) {
        //Remember to check the shape
        if (Array.isArray(rows[0])) {
          for (var blah of rows) if (blah.length != this.shape[1]) return;
          this.array.push(...rows);
          this.data.push(...rows);
          this.shape[0] = this.shape[0] + rows.length
        } else {
          if (rows.length == this.shape[1]) {
          this.shape[0] = this.shape[0] + 1
          this.array.push(rows);
            this.data.push(rows);
          }
        }
      }
    }
  }
}

// exports.Test = Test;
