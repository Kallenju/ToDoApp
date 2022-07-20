/* eslint-disable import/prefer-default-export */

function deleteAllSpaces(string) {
  return string.trim().split(' ').join('');
}

function filterString(value, reference) {
  const valueCompared = value.toLowerCase();
  return valueCompared.includes(deleteAllSpaces(reference).toLowerCase());
}

function filterNumber(value, reference) {
  if (Number.isNaN(Number(reference))) {
    return false;
  }
  return Number(value) === Number(reference);
}

function deleteEmptyRequests(request) {
  const clearedRequest = request;

  for (const [name, value] of Object.entries(request)) {
    if (value === '' || value === null || value === 'undefined') {
      delete clearedRequest[name];
    }
  }

  return clearedRequest;
}

function deleteIncorrectRequests(data, request) {
  const clearedRequest = request;

  for (const name of Object.keys(request)) {
    if (!(name in data[0])) {
      delete clearedRequest[name];
    }
  }

  return clearedRequest;
}

function filter(request) {
  return (data) => {
    let filteredData = data;

    if (typeof request === 'undefined') {
      return filteredData;
    }

    let clearedRequest = deleteEmptyRequests(request);
    clearedRequest = deleteIncorrectRequests(data, clearedRequest);

    if (Object.keys(clearedRequest).length === 0) {
      return filteredData;
    }

    for (const [name, reference] of Object.entries(clearedRequest)) {
      filteredData = filteredData.filter((element) => {
        const valueForComparence = element[name];
        let result;

        switch (typeof element[name]) {
          case 'string':
            result = filterString(valueForComparence, reference);
            break;
          case 'number':
            result = filterNumber(valueForComparence, reference);
            break;
          default:
            result = filterString(valueForComparence, reference);
        }

        return result;
      });
    }

    return filteredData;
  };
}

export { filter };
