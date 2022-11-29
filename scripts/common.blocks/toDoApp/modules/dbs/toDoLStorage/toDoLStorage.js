/* eslint-disable import/prefer-default-export */
/* eslint-disable import/extensions */

import { defaults } from './defaults.js';
import { extendParams } from '../../../../../library.blocks/commonFunctions/index.js';
import { LStorage } from '../../../../../library.blocks/lStorage/index.js';

class ToDoLStorage {
  constructor(toDoApp, params = {}) {
    const toDoLStorage = this;

    toDoLStorage.toDoApp = toDoApp
    toDoLStorage.extendedParams = extendParams(defaults, params);
    toDoLStorage.lStorage = new LStorage(`ToDo-App. DB. Account: ${toDoApp.extendedParams.owner}`);
    toDoLStorage.stores = [...[{
      name: 'toDoObjects',
      keyPath: 'toDoId',
    }], ...toDoLStorage.extendedParams.stores];

    toDoLStorage.openedIDB = toDoLStorage.lStorage.open(toDoLStorage.stores);

    toDoLStorage.toDoApp
      .onAction('done', toDoLStorage.onDone.bind(toDoLStorage))
      .onAction('delete', toDoLStorage.onDelete.bind(toDoLStorage))
      .onAction('addToDo', toDoLStorage.onAddToDo.bind(toDoLStorage))
      .onAction('restoreToDoAppDataFromDB', toDoLStorage.onRestoreToDoAppDataFromDB.bind(toDoLStorage));
  }

  async onDone(toDoId) {
    const toDoLStorage = this;

    return toDoLStorage.openedIDB.then(async () => {
      const toDoObject = await toDoLStorage.lStorage.get('toDoObjects', toDoId);

      toDoObject.done = !toDoObject.done;

      return toDoLStorage.lStorage.put('toDoObjects', toDoObject);
    });
  }

  async onDelete(toDoId) {
    const toDoLStorage = this;

    return toDoLStorage.openedIDB.then(async () => toDoLStorage.lStorage.delete('toDoObjects', toDoId));
  }

  async onAddToDo(toDoObject) {
    const toDoLStorage = this;

    toDoObject.toDoId = Date.now().toString() + toDoObject.ownerId.toString();

    return toDoLStorage.openedIDB.then(async () => toDoLStorage.lStorage.add('toDoObjects', toDoObject));
  }

  async onRestoreToDoAppDataFromDB() {
    const toDoLStorage = this;

    return toDoLStorage.openedIDB.then(async () => toDoLStorage.lStorage.getAll('toDoObjects'));
  }
}

export { ToDoLStorage };
