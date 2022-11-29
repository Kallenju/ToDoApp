/* eslint-disable import/extensions */
/* eslint-disable import/prefer-default-export */

import { hasProperty } from '../commonFunctions/index.js';

class LStorage {
  constructor(name) {
    const lStorage = this;

    lStorage.dBName = name;
    lStorage.storeNames = [];
  }

  createObjectStore(name, { keyPath }) {
    const lStorage = this;

    return new Promise((resolve) => {
      const db = JSON.parse(window.localStorage.getItem(lStorage.dBName));

      const objectStore = {
        keyPath,
        store: {},
      };

      db[name] = objectStore;

      lStorage.storeNames.push(name);

      window.localStorage.setItem(lStorage.dBName, JSON.stringify(db));

      resolve();
    });
  }

  open(stores) {
    const lStorage = this;

    return new Promise((resolve) => {
      let db;
      if (!window.localStorage.getItem(lStorage.dBName)) {
        db = {};
        window.localStorage.setItem(lStorage.dBName, JSON.stringify(db));
      }

      db = JSON.parse(window.localStorage.getItem(lStorage.dBName));

      for (const store of stores) {
        if (!hasProperty(db, store.name)) {
          lStorage.createObjectStore(store.name, { keyPath: store.keyPath });
        }
      }

      resolve();
    });
  }

  put(storeName, item) {
    const lStorage = this;

    return new Promise((resolve) => {
      const db = JSON.parse(window.localStorage.getItem(lStorage.dBName));

      const store = db[storeName];

      store.store[item[store.keyPath]] = item;

      window.localStorage.setItem(lStorage.dBName, JSON.stringify(db));

      resolve(item);
    });
  }

  add(storeName, item) {
    const lStorage = this;

    return new Promise((resolve, reject) => {
      const db = JSON.parse(window.localStorage.getItem(lStorage.dBName));

      const store = db[storeName];

      if (hasProperty(store.store, item[store.keyPath])) {
        reject();
      } else {
        store.store[item[store.keyPath]] = item;

        window.localStorage.setItem(lStorage.dBName, JSON.stringify(db));

        resolve(item);
      }
    });
  }

  get(storeName, key) {
    const lStorage = this;

    return new Promise((resolve) => {
      const db = JSON.parse(window.localStorage.getItem(lStorage.dBName));

      const store = db[storeName];
      let item;

      if (hasProperty(store.store, key)) {
        item = store.store[key];
        resolve(item);
      } else {
        reject(null);
      }
    });
  }

  getAll(storeName) {
    const lStorage = this;

    return new Promise((resolve) => {
      const db = JSON.parse(window.localStorage.getItem(lStorage.dBName));

      let items;

      if (hasProperty(db, storeName)) {
        const store = db[storeName];
        items = Object.values(store.store);
        resolve(items);
      } else {
        reject(null);
      }
    });
  }

  delete(storeName, key) {
    const lStorage = this;

    return new Promise((resolve) => {
      const db = JSON.parse(window.localStorage.getItem(lStorage.dBName));

      let item;

      const store = db[storeName];

      if (hasProperty(store.store, key)) {
        item = store.store[key];

        delete store.store[key];

        window.localStorage.setItem(lStorage.dBName, JSON.stringify(db));
        resolve(item);
      } else {
        reject();
      }
    });
  }
}

export { LStorage };
