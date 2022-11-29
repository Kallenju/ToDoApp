/* eslint-disable class-methods-use-this */
/* eslint-disable import/extensions */
/* eslint-disable import/prefer-default-export */
/* eslint no-console: ["error", { allow: ["error"] }] */

class URLClass {
  constructor({
    url = '',
    urlBase = null,
    paramsToBeAddedToPathname = [],
    urlToSearchParams = null,
    urlToAddParams = null,
    paramNamesToBeAdded = [],
    paramNamesToBeDeleted = [],
  }) {
    const urlClass = this;

    urlClass.url = url;
    urlClass.urlBase = urlBase;
    urlClass.paramsToBeAddedToPathname = paramsToBeAddedToPathname;
    urlClass.urlToSearchParams = urlToSearchParams;
    urlClass.urlToAddParams = urlToAddParams;
    urlClass.paramNamesToBeAdded = paramNamesToBeAdded;
    urlClass.paramNamesToBeDeleted = paramNamesToBeDeleted;
  }

  searchParams({ urlToSearchParams = null, params = [] }) {
    const urlClass = this;

    try {
      if (!urlToSearchParams && !urlClass.urlToSearchParams) {
        throw new Error('Пустой адрес');
      } else if (!Array.isArray(params)) {
        throw new Error('Параметры должны быть представлены как массив!');
      }
    } catch (error) {
      if (error.name === 'Error') {
        console.error(error.message);
      } else {
        throw error;
      }
    }

    if (params.length === 0) {
      return params;
    }

    const url = urlToSearchParams || urlClass.urlToSearchParams;

    const paramsToSearch = new URLSearchParams(url.search);

    const pageParams = [];

    for (const param of params) {
      const paramValue = paramsToSearch.get(param);
      if (paramValue) {
        pageParams.push([param, paramValue]);
      }
    }

    return pageParams;
  }

  addSearchParams({ urlToAddParams = null, params = [] }) {
    const urlClass = this;

    const urlToBeTransformed = urlToAddParams || urlClass.urlToAddParams;

    try {
      if (!urlToBeTransformed) {
        throw new Error('Пустой адрес');
      } else if (!Array.isArray(params)) {
        throw new Error('Параметры должны быть представлены как массив!');
      }
    } catch (error) {
      if (error.name === 'Error') {
        console.error(error.message);
      } else {
        throw error;
      }
    }

    if (params.length === 0) {
      return urlToBeTransformed;
    }

    let { pathname } = urlToBeTransformed;

    if (String.prototype.endsWith.call(pathname, '/')) {
      pathname = pathname.slice(0, -1);
    }

    return new URL(
      `${urlToBeTransformed.origin}${pathname}?${new URLSearchParams([
        ...Array.from(urlToBeTransformed.searchParams.entries()),
        ...params,
      ]).toString()}`,
    );
  }

  deleteSearchParams({ urlToDeleteParams = null, params = [] }) {
    const urlClass = this;

    const urlToBeTransformed = urlToDeleteParams || urlClass.urlToDeleteParams;

    try {
      if (!urlToBeTransformed) {
        throw new Error('Пустой адрес');
      } else if (!Array.isArray(params)) {
        throw new Error('Параметры должны быть представлены как массив!');
      }
    } catch (error) {
      if (error.name === 'Error') {
        console.error(error.message);
      } else {
        throw error;
      }
    }

    if (params.length === 0) {
      return urlToBeTransformed;
    }

    const newParams = new URLSearchParams(urlToBeTransformed.search).delete(...params);

    return new URL(
      `${urlToBeTransformed.origin}${urlToBeTransformed.pathname}?${new URLSearchParams([
        ...newParams,
      ]).toString()}`,
    );
  }

  deleteAllParams(urlToDeleteParams) {
    const url = new URL(urlToDeleteParams);
    return new URL(
      `${url.origin}${url.pathname}`,
    );
  }

  createURL({
    url = null,
    base = null,
    paramsToBeAddedToPathname = [],
    paramsToBeAdded = [],
    paramsToBeDeleted = [],
  } = {}) {
    const urlClass = this;

    try {
      if (!url && !urlClass.url && ((typeof url !== 'string') && (typeof urlClass.url !== 'string'))) {
        throw new Error('Пустой адрес');
      }
    } catch (error) {
      if (error.name === 'Error') {
        console.error(error.message);
      } else {
        throw error;
      }
    }

    let urlForConstruct = url || urlClass.url;

    if (typeof urlForConstruct !== 'string') {
      if (typeof url === 'string') {
        urlForConstruct = url;
      } else {
        urlForConstruct = urlClass.url;
      }
    }

    let newURL = base || urlClass.urlBase
      ? new URL(urlForConstruct, base || urlClass.urlBase) : new URL(urlForConstruct);

    if (paramsToBeAddedToPathname.length !== 0) {
      const params = urlClass.searchParams({ params: paramsToBeAddedToPathname });

      let pathToAdd = '';

      for (const [, paramValue] of params) {
        pathToAdd += `/${paramValue}`;
      }

      newURL = new URL(newURL.href + pathToAdd);
    }

    if (urlClass.paramsToBeAddedToPathname.length !== 0 && paramsToBeAddedToPathname.length === 0) {
      const params = urlClass.searchParams({ params: urlClass.paramsToBeAddedToPathname });

      let pathToAdd = '';

      for (const [, paramValue] of params) {
        pathToAdd += `/${paramValue}`;
      }

      newURL = new URL(newURL.href + pathToAdd);
    }

    if (paramsToBeAdded.length !== 0) {
      newURL = urlClass.addSearchParams({ urlToAddParams: newURL, params: paramsToBeAdded });
      return newURL;
    }

    if (paramsToBeDeleted.length !== 0) {
      newURL = urlClass.deleteSearchParams({
        urlToDeleteParams: newURL,
        params: paramsToBeDeleted,
      });
      return newURL;
    }

    if (urlClass.paramNamesToBeAdded.length !== 0 && paramsToBeAdded.length === 0) {
      const params = urlClass.searchParams({ params: urlClass.paramNamesToBeAdded });
      newURL = urlClass.addSearchParams({ urlToAddParams: newURL, params });
      return newURL;
    }

    if (urlClass.paramNamesToBeDeleted.length !== 0 && paramsToBeDeleted.length === 0) {
      newURL = urlClass.deleteSearchParams({
        urlToDeleteParams: newURL,
        params: urlClass.paramNamesToBeDeleted,
      });
      return newURL;
    }

    return newURL;
  }
}

export { URLClass };
