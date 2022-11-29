/* eslint-disable import/prefer-default-export */
/* eslint-disable import/extensions */

import { defaults } from './defaults.js';
import { extendParams } from '../../../../../library.blocks/commonFunctions/index.js';
import { IDB } from '../../../../../library.blocks/indexedDB/index.js';

class ToDoIDB {
  constructor(toDoApp, params = {}) {
    const toDoIDB = this;

    toDoIDB.toDoApp = toDoApp;
    toDoIDB.extendedParams = extendParams(defaults, params);
    toDoIDB.iDB = new IDB({
      name: `ToDo-App. DB. Account: ${toDoApp.extendedParams.owner}`,
      version: toDoIDB.extendedParams.version,
    });
    toDoIDB.stores = [...[{
      name: 'toDoObjects',
      keyPath: 'toDoId',
    }], ...toDoIDB.extendedParams.stores];

    toDoIDB.openedIDB = toDoIDB.iDB.open(toDoIDB.stores);

    toDoIDB.toDoApp
      .onAction('done', toDoIDB.onDone.bind(toDoIDB))
      .onAction('delete', toDoIDB.onDelete.bind(toDoIDB))
      .onAction('addToDo', toDoIDB.onAddToDo.bind(toDoIDB))
      .onAction('restoreToDoAppDataFromDB', toDoIDB.onRestoreToDoAppDataFromDB.bind(toDoIDB));
  }

  async onDone(toDoId) {
    const toDoIDB = this;

    let toDoObject;

    await toDoIDB.openedIDB.then(async () => {
      toDoObject = await toDoIDB.iDB.get('toDoObjects', toDoId);

      toDoObject.done = !toDoObject.done;

      toDoIDB.iDB.put('toDoObjects', toDoObject);
    });

    return toDoObject;
  }

  async onDelete(toDoId) {
    const toDoIDB = this;

    const item = await toDoIDB.openedIDB.then(async () => toDoIDB.iDB.get('toDoObjects', toDoId));

    await toDoIDB.openedIDB.then(async () => toDoIDB.iDB.delete('toDoObjects', toDoId));

    return item;
  }

  async onAddToDo(toDoObject) {
    const toDoIDB = this;

    toDoObject.toDoId = Date.now().toString() + toDoObject.ownerId.toString();

    await toDoIDB.openedIDB.then(async () => toDoIDB.iDB.add('toDoObjects', toDoObject));

    return toDoObject;
  }

  async onRestoreToDoAppDataFromDB() {
    const toDoIDB = this;

    return toDoIDB.openedIDB.then(async () => toDoIDB.iDB.getAll('toDoObjects'));
  }
}

export { ToDoIDB };
