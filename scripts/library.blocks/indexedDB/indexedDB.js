/* eslint-disable import/prefer-default-export */

class IDB {
  constructor({
    name, keyPath, version = 1,
  }) {
    const iDB = this;

    iDB.name = name;
    iDB.version = version;
    iDB.db = null;
    iDB.keyPath = keyPath;
  }

  open(store) {
    const iDB = this;

    return new Promise((resolve, reject) => {
      const openRequest = window.indexedDB.open(iDB.name, iDB.version);
      openRequest.onupgradeneeded = () => {
        iDB.db = openRequest.result;
        if (!iDB.db.objectStoreNames.contains(store)) {
          const oStore = iDB.db.createObjectStore(store, { keyPath: iDB.keyPath });
          oStore.transaction.oncomplete = () => resolve();
          oStore.transaction.onerror = () => reject();
        } else {
          resolve();
        }
      };
      openRequest.onsuccess = (event) => {
        iDB.db = openRequest.result;
        iDB.db.onversionchange = () => {
          iDB.db.close();
          alert('Перезагрузите страницу');
          resolve();
        };
        if (
          ((typeof event.newVersion === 'undefined' && typeof event.oldVersion === 'undefined')
          || iDB.version >= event.newVersion)
          && event.newVersion !== 0
        ) {
          resolve();
        }
      };
      openRequest.onerror = () => {
        reject();
      };
    });
  }

  add(store, item) {
    const iDB = this;

    return new Promise((resolve, reject) => {
      let result;
      const transaction = iDB.db.transaction(store, 'readwrite');
      transaction.oncomplete = () => resolve(result);
      transaction.onerror = () => reject(result);

      const oStore = transaction.objectStore(store);
      const request = oStore.add(item);

      request.onsuccess = () => {
        result = request.result;
      };
      request.onerror = () => {
        result = request.error;
      };
    });
  }

  put(store, item) {
    const iDB = this;

    return new Promise((resolve) => {
      let result;
      const transaction = iDB.db.transaction(store, 'readwrite');
      transaction.oncomplete = () => resolve(result);

      const oStore = transaction.objectStore(store);
      const request = oStore.put(item);

      request.onsuccess = () => {
        result = request.result;
      };
      request.onerror = () => {
        result = request.error;
      };
    });
  }

  get(store, key) {
    const iDB = this;

    return new Promise((resolve) => {
      let result;
      const transaction = iDB.db.transaction(store, 'readonly');
      transaction.oncomplete = () => resolve(result);

      const oStore = transaction.objectStore(store);
      const request = oStore.get(key);

      request.onsuccess = () => {
        result = request.result;
      };
      request.onerror = () => {
        result = request.error;
      };
    });
  }

  getAll(store) {
    const iDB = this;

    return new Promise((resolve) => {
      let result;
      const transaction = iDB.db.transaction(store, 'readonly');
      transaction.oncomplete = () => resolve(result);

      const oStore = transaction.objectStore(store);
      const request = oStore.getAll();

      request.onsuccess = () => {
        result = request.result;
      };
      request.onerror = () => {
        result = request.error;
      };
    });
  }

  getAllKeys(store) {
    const iDB = this;

    return new Promise((resolve) => {
      let result;
      const transaction = iDB.db.transaction(store, 'readonly');
      transaction.oncomplete = () => resolve(result);

      const oStore = transaction.objectStore(store);
      const request = oStore.getAllKeys();

      request.onsuccess = () => {
        result = request.result;
      };
      request.onerror = () => {
        result = request.error;
      };
    });
  }

  delete(store, key) {
    const iDB = this;

    return new Promise((resolve) => {
      let result;
      const transaction = iDB.db.transaction(store, 'readwrite');
      transaction.oncomplete = () => resolve(result);

      const oStore = transaction.objectStore(store);
      const request = oStore.delete(key);

      request.onsuccess = () => {
        result = request.result;
      };
      request.onerror = () => {
        result = request.error;
      };
    });
  }
}

export { IDB };
