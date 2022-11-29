function hasProperty(object, property) {
  return Object.prototype.hasOwnProperty.call(object, property);
}

function isObject(element) {
  return typeof element === 'object'
  && !Array.isArray(element)
  && element !== null;
}

function getValue(path, obj) {
  if (!path) {
    return obj;
  }

  return path.split('.').reduce((previous, property) => previous && previous[property], obj);
}

function setProperty(path, obj, value) {
  if (!path) {
    return obj;
  }

  const splitPath = path.split('.');
  let aimedObj = obj[splitPath[0]];

  if (splitPath.length !== 1) {
    splitPath.shift();
    aimedObj = setProperty(path, obj, value);
  } else {
    obj[splitPath[0]] = value;
  }

  return aimedObj;
}

function extendParams(defaults, params) {
  const extendedParams = {};

  for (const param of Object.keys(defaults)) {
    if (hasProperty(params, param)) {
      if (typeof defaults[param] === 'object') {
        extendedParams[param] = {
          ...defaults[param],
          ...params[param],
        };
      } else if ((typeof defaults[param] !== 'object')) {
        extendedParams[param] = params[param];
      }
    } else {
      extendedParams[param] = defaults[param];
    }
  }

  for (const param of Object.keys(params)) {
    if (!hasProperty(defaults, param)) {
      extendedParams[param] = params[param];
    }
  }

  return extendedParams;
}

export {
  hasProperty,
  isObject,
  getValue,
  setProperty,
  extendParams,
};
