/* eslint-disable class-methods-use-this */
/* eslint-disable import/extensions */
/* eslint-disable import/prefer-default-export */
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

import { HTTPError } from './modules/error/index.js';
import { getValue } from '../commonFunctions/index.js';

class NetworkRequests {
  constructor({
    responseHandler = async (response) => response.json(),
  } = {}) {
    const networkRequests = this;

    networkRequests.responseHandler = responseHandler;
  }

  fetch(url = null, params = {}, responseHandler = null) {
    const networkRequests = this;

    try {
      if (!url) {
        throw new Error('Пустой адрес');
      }
    } catch (error) {
      if (error.name === 'Error') {
        console.error(error.message);
      } else {
        throw error;
      }
    }

    return fetch(url, params)
      .then((response) => {
        if (response.ok) {
          return responseHandler
            ? responseHandler(response) : networkRequests.responseHandler(response);
        }
        throw new HTTPError(response);
      });
  }

  async* fetchGenerator({
    url = null,
    params = {},
    responseHandler = null,
    pathToData = null,
    functionToGetNextPage,
  }) {
    const networkRequests = this;

    try {
      if (!url) {
        throw new Error('Пустой адрес');
      }
    } catch (error) {
      if (error.name === 'Error') {
        console.error(error.message);
      } else {
        throw error;
      }
    }

    let urlForLoop = url;

    while (urlForLoop) {
      // eslint-disable-next-line no-await-in-loop
      const body = await networkRequests.fetch(url, params, responseHandler);

      const data = getValue(pathToData, body);

      urlForLoop = functionToGetNextPage(body);

      for (const item of data) {
        yield item;
      }
    }
  }
}

export { NetworkRequests };
