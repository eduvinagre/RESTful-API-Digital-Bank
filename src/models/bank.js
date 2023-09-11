const database = require("../data/bancodedados");

const bank = {
  findAllInfos: () => {
    if (!database) {
      return undefined;
    }

    return database;
  },
};

module.exports = bank;
