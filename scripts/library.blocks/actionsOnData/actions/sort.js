/* eslint-disable import/prefer-default-export */

function getType(item) {
  return typeof item !== 'object' ? typeof item : Object.prototype.toString.call(item);
}

function compareString(array, propertyToSort, ascending = true) {
  const collator = new Intl.Collator(undefined, {
    sensitivity: 'base',
  });

  const multiplier = ascending ? 1 : -1;

  array.sort((a, b) => multiplier * collator.compare(a[propertyToSort], b[propertyToSort]));
}

function compareNumber(array, propertyToSort, ascending = true) {
  const multiplier = ascending ? 1 : -1;

  array.sort((a, b) => {
    if (a[propertyToSort] > b[propertyToSort]) return (1 * multiplier);
    if (a[propertyToSort] < b[propertyToSort]) return (-1 * multiplier);
    return 0;
  });
}

function compareDate(array, propertyToSort, ascending = true) {
  const multiplier = ascending ? 1 : -1;

  array.sort((a, b) => {
    if (a[propertyToSort].getTime() > b[propertyToSort].getTime()) return (1 * multiplier);
    if (a[propertyToSort].getTime() < b[propertyToSort].getTime()) return (-1 * multiplier);
    return 0;
  });
}

function defaultComparence(array, propertyToSort, ascending = true) {
  const multiplier = ascending ? 1 : -1;

  array.sort((a, b) => {
    if (a[propertyToSort] > b[propertyToSort]) return (1 * multiplier);
    if (a[propertyToSort] < b[propertyToSort]) return (-1 * multiplier);
    return 0;
  });
}

function sort({ propertyToSort, orderBy = 'ascending' }) {
  return (data) => {
    const dataToSort = data;
    if (data.length > 0) {
      let orderParam;

      if (orderBy === 'ascending') {
        orderParam = true;
      } else if (orderBy === 'descending') {
        orderParam = false;
      } else {
        return dataToSort;
      }

      switch (getType(data[0][propertyToSort])) {
        case 'string':
          compareString(data, propertyToSort, orderParam);
          break;
        case 'number':
          compareNumber(data, propertyToSort, orderParam);
          break;
        case '[object Date]':
          compareDate(data, propertyToSort, orderParam);
          break;
        default:
          defaultComparence(data, propertyToSort, orderParam);
      }
    }

    return dataToSort;
  };
}

export { sort };
