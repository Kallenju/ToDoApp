/* eslint-disable import/prefer-default-export */
/* eslint-disable import/extensions */

import { defaults } from './defaults.js';
import { extendParams } from '../../../../../library.blocks/commonFunctions/index.js';
import { NetworkRequests } from '../../../../../library.blocks/networkRequests/index.js';
import { URLClass } from '../../../../../library.blocks/urlClass/index.js';

class ToDoRemoteServer {
  constructor(toDoApp, params = {}) {
    const toDoRemoteServer = this;

    toDoRemoteServer.toDoApp = toDoApp;
    toDoRemoteServer.extendedParams = extendParams(defaults, params);

    toDoRemoteServer.networkRequest = new NetworkRequests();
    toDoRemoteServer.url = new URLClass({
      urlBase: 'http://localhost:3000/api/todos/',
    });

    toDoRemoteServer.toDoApp
      .onAction('done', toDoRemoteServer.onDone.bind(toDoRemoteServer))
      .onAction('delete', toDoRemoteServer.onDelete.bind(toDoRemoteServer))
      .onAction('addToDo', toDoRemoteServer.onAddToDo.bind(toDoRemoteServer))
      .onAction('restoreToDoAppDataFromDB', toDoRemoteServer.onRestoreToDoAppDataFromDB.bind(toDoRemoteServer));
  }

  async onDone(toDoId) {
    const toDoRemoteServer = this;

    const urlForFetch = toDoRemoteServer.url.createURL({
      url: toDoId,
    });

    const toDoObject = await toDoRemoteServer.networkRequest.fetch(urlForFetch);

    toDoObject.done = !toDoObject.done;

    await toDoRemoteServer.networkRequest.fetch(urlForFetch, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: toDoObject.done }),
    });

    return toDoObject;
  }

  async onDelete(toDoId) {
    const toDoRemoteServer = this;

    const urlForFetch = toDoRemoteServer.url.createURL({
      url: toDoId,
    });

    const toDoObject = await toDoRemoteServer.networkRequest.fetch(urlForFetch);

    await toDoRemoteServer.networkRequest.fetch(urlForFetch, {
      method: 'DELETE',
    });

    return toDoObject;
  }

  async onAddToDo(toDoObject) {
    const toDoRemoteServer = this;

    const urlForFetch = toDoRemoteServer.url.createURL();

    toDoObject.toDoId = Date.now().toString() + toDoObject.ownerId.toString();

    await toDoRemoteServer.networkRequest.fetch(urlForFetch, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toDoObject),
    });

    return toDoObject;
  }

  async onRestoreToDoAppDataFromDB() {
    const toDoRemoteServer = this;

    const urlForFetch = toDoRemoteServer.url.createURL({ paramsToBeAdded: [['owner', toDoRemoteServer.toDoApp.extendedParams.owner]] });

    return toDoRemoteServer.networkRequest.fetch(urlForFetch);
  }
}

export { ToDoRemoteServer };
