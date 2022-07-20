/* eslint-disable import/prefer-default-export */
function getAllProperties(obj) {
  let lastPrototype = Object.getPrototypeOf(obj);
  let allPropertiesAndGetters = [];

  while (lastPrototype.constructor !== Object) {
    const getters = Object.keys(Object.getOwnPropertyDescriptors(lastPrototype));
    getters.splice(getters.indexOf('constructor'), 1);
    allPropertiesAndGetters = [...allPropertiesAndGetters, ...getters];
    lastPrototype = Object.getPrototypeOf(lastPrototype);
  }

  return [...Object.keys(Object.getOwnPropertyDescriptors(obj)), ...allPropertiesAndGetters];
}

function deleteAllSpaces(string) {
  return string.trim().split(' ').join('');
}

function filterString(value, reference) {
  const valueCompared = deleteAllSpaces(value).toLowerCase();
  return valueCompared.includes(reference.toLowerCase());
}

function filterNumber(value, reference) {
  if (Number.isNaN(Number(reference))) {
    return false;
  }
  return Number(value) === Number(reference);
}

function compareValueWithAllReferences(reference, element, keys) {
  let result = false;

  for (const key of keys) {
    if (typeof element[key] === 'undefined') {
      break;
    }

    if (typeof element[key] === 'string') {
      result = filterString(element[key], reference);
    } else if (typeof element[key] === 'number') {
      result = filterNumber(element[key], reference);
    }

    if (result) {
      break;
    }
  }

  return result;
}

function search(request) {
  return (data) => {
    let dataToSearch = data;

    if (typeof request === 'undefined') {
      return dataToSearch;
    }

    const searchReq = Object.keys(request).find((element) => element.toLowerCase().includes('search'));

    if (!searchReq) {
      return dataToSearch;
    }

    const references = request[searchReq].split(' ');

    dataToSearch = dataToSearch.filter((element) => {
      const allKeys = getAllProperties(element);
      const result = [];

      for (const reference of references) {
        result.push(compareValueWithAllReferences(reference, element, allKeys));
      }

      return result.indexOf(false) < 0;
    });

    return dataToSearch;
  };
}

export { search };
