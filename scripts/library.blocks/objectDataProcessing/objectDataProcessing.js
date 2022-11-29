/* eslint-disable no-continue */
/* eslint-disable import/extensions */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/prefer-default-export */
/* eslint no-console: ["error", { allow: ["error"] }] */

import {
  hasProperty,
  isObject,
  getValue,
  setProperty,
} from '../commonFunctions/index.js';

class ObjectDataProcessing {
  substitutePropertyValues({
    initialData,
    pathToData = null,
    entriesToChange = {},
  }) {
    const data = initialData;
    let dataToBeTransformed = getValue(pathToData, initialData);

    if (Array.isArray(dataToBeTransformed)) {
      let transformedData = [];

      for (const item of dataToBeTransformed) {
        for (const key of Object.keys(entriesToChange)) {
          if (hasProperty(item, key)) {
            item[key] = entriesToChange[key];
          }
        }

        transformedData.push(item);
      }
      setProperty(pathToData, data, transformedData);

      return data;
    }

    const dataItem = dataToBeTransformed;

    for (const key of Object.keys(entriesToChange)) {
      if (hasProperty(dataItem, key)) {
        dataItem[key] = entriesToChange[key];
      }
    }

    return dataItem;
  }

  createPropertyArr(propertiesToConcat, additionStrings) {
    let finishedArr = [...propertiesToConcat];

    if (additionStrings.length > 0) {
      for (const additionString of additionStrings) {
        const positionAfter = typeof additionString.after !== 'undefined';
        const place = positionAfter ? additionString.after : additionString.before;

        if (!additionString.value && finishedArr.indexOf(place) < 0) {
          continue;
        }

        const position = finishedArr.indexOf(place);

        if (positionAfter) {
          finishedArr.splice(position + 1, 0, { value: additionString.value });
        } else {
          finishedArr.splice(position, 0, { value: additionString.value });
        }
      }
    }

    return finishedArr;
  }

  concatValuesOfProperties(
    {
      dataItem,
      propertiesToConcat = [],
      additionStrings = [{ values: null, after: null, before: null }],
    },
  ) {
    const objectDataProcessing = this;

    try {
      if (!isObject(dataItem)) {
        throw new Error('Элемент должен быть объектом');
      }
      if (!Array.isArray(propertiesToConcat)) {
        throw new Error('Имена свойств должны быть представлены как массив!');
      }
      if (!Array.isArray(additionStrings)) {
        throw new Error('Дополнительные строки должны быть представлены как массив объектов!');
      }
    } catch (error) {
      if (error.name === 'Error') {
        console.error(error.message);
      } else {
        throw error;
      }
    }

    const propertyArr = objectDataProcessing.createPropertyArr(propertiesToConcat, additionStrings);

    let newString = '';

    for (const property of propertyArr) {
      if (isObject(property)) {
        newString += property.value;
      } else {
        newString += dataItem[property];
      }
    }

    return newString;
  }

  transformData({
    initialData,
    pathToData,
    itemTemplate = [
      {
        propertyName: null, trasformationFunction: null, functionParams: null, value: null,
      },
    ],
  }) {
    const objectDataProcessing = this;

    if (!itemTemplate && !pathToData) {
      return initialData;
    }

    let data = getValue(pathToData, initialData);

    if (!itemTemplate) {
      return data;
    }

    try {
      if (!Array.isArray(itemTemplate)) {
        throw new Error('Шаблон должен быть представлены как массив!');
      }
    } catch (error) {
      if (error.name === 'Error') {
        console.error(error.message);
      } else {
        throw error;
      }
    }

    function transformationProperties(dataItem) {
      const transformedDataItem = {};

      for (const property of itemTemplate) {
        if (!property.propertyName) {
          continue;
        }

        const { propertyName } = property;
        const { value } = property;

        if (!property.trasformationFunction || !property.functionParams) {
          if (hasProperty(dataItem, value.toString())) {
            const dataItemValue = dataItem[value.toString()];
            transformedDataItem[propertyName.toString()] = dataItemValue;
          } else if (value) {
            transformedDataItem[propertyName.toString()] = value;
          }
          continue;
        }

        const newDataItemValue = objectDataProcessing[property.trasformationFunction].call(
          objectDataProcessing,
          {
            dataItem,
            ...property.functionParams,
          },
        );

        transformedDataItem[propertyName.toString()] = newDataItemValue;
      }

      return transformedDataItem;
    }

    if (itemTemplate.length > 0) {
      if (Array.isArray(data)) {
        const transformedData = [];

        for (const dataItem of data) {
          const transformedDataItem = transformationProperties(dataItem);

          if (Object.keys(transformedDataItem).length > 0) {
            transformedData.push(transformedDataItem);
          }
        }

        return transformedData;
      }
      return transformationProperties(data);
    }

    return data;
  }

  generateData({
    initialData,
    pathToData,
    first,
    current,
    last,
    limit,
    gapBetweenStartAndCurrent,
    generateFunction,
  }) {
    const data = getValue(pathToData, initialData);

    const firstN = typeof first === 'number' ? first : getValue(first, data);
    const currN = typeof current === 'number' ? current : getValue(current, data);
    const lastN = typeof last === 'number' ? last : getValue(last, data);

    let start = currN - Number(gapBetweenStartAndCurrent) < firstN
      ? firstN : currN - Number(gapBetweenStartAndCurrent);
    let end = start + limit <= lastN ? start + limit : lastN;

    if (lastN - start < limit && lastN > limit) {
      start = lastN - limit + 1;
      end = start + limit;
    }

    const pages = [];

    for (let i = start; i < end; ++i) {
      pages.push(generateFunction(i));
    }

    return {
      current: generateFunction(currN),
      pages,
      first: generateFunction(firstN),
      last: generateFunction(lastN),
    };
  }

  processData(params) {
    const objectDataProcessing = this;

    let { initialData } = params;

    for (const [key, value] of Object.entries(params)) {
      if (hasProperty(objectDataProcessing, key)
        || hasProperty(Object.getPrototypeOf(objectDataProcessing), key)) {
        initialData = objectDataProcessing[key]({
          initialData,
          ...value,
        });
      }
    }

    return initialData;
  }
}

export { ObjectDataProcessing };
