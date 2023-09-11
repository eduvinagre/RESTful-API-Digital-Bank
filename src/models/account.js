const database = require("../data/bancodedados");

const account = {
  findAll: () => {
    if (!database) {
      return undefined;
    }

    return database.contas;
  },

  findByPk: (numero) => {
    const obj = database.contas.find((obj) => obj.numero === numero);

    if (!obj) {
      return undefined;
    }

    return obj;
  },

  findOne: (prop, value) => {
    const obj = database.contas.find((obj) => obj.usuario[prop] === value);

    if (!obj) {
      return undefined;
    }

    return obj;
  },

  create: (obj) => {
    database.contas.push(obj);
    return true;
  },

  update: (obj) => {
    const accountIndex = database.contas.findIndex(
      (elemento) => elemento.numero === obj.numero
    );

    if (accountIndex === -1) {
      return undefined;
    }

    database.contas.splice(accountIndex, 1, obj);

    return true;
  },

  destroy: (numero) => {
    const accountIndex = database.contas.findIndex(
      (account) => account.numero === numero
    );

    if (accountIndex === -1) {
      return undefined;
    }

    database.contas.splice(accountIndex, 1);

    return true;
  },
};

module.exports = account;
