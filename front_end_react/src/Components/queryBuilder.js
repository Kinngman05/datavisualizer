const pyJSON = {
  jsonQuery: () => {
    var obj = {
      HEADER: {
        DATABASE: null,
        TABLE_NAME: null,
        REQUEST_TYPE: null
      },
      DATA: {
        FIELDS: null,
        SET: null,
        WHERE: null
      },
      FOOTER: {
        "DATA ABOUT THE REQUEST": null,
        COMMENT: null,
        DEP: null,
        UPDATE: null
      }
    };
    return obj;
  }
};

module.exports = pyJSON;
