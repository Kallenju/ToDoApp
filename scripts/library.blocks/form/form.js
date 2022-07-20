/* eslint-disable import/extensions */
/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */

import { defaults } from './defaults.js';

class Form {
  constructor(element, params = {}) {
    const form = this;

    form.form = typeof element === 'object' ? element : document.querySelector(element);

    form.params = { ...defaults, ...params };
    form.eventHandlers = [];
  }

  addListener(type, elem, handler) {
    const form = this;

    elem.addEventListener(type, handler);

    return form;
  }

  removeListener(type, elem, handler) {
    const form = this;

    elem.removeEventListener(type, handler);

    return form;
  }

  getListenerType(type) {
    switch (type) {
      case 'checkbox':
      case 'select-one':
      case 'file':
      case 'radio': {
        return 'change';
      }
      default: {
        return 'input';
      }
    }
  }

  setListenerOnField(elem, handler) {
    const form = this;

    const type = form.getListenerType(elem.type);

    if (elem.type === 'fieldset') {
      return;
    }

    form.addListener(type, elem, handler);
  }

  getElemValue(elem) {
    switch (elem.type) {
      case 'checkbox':
        return elem.checked;
      case 'file':
        return elem.files;
      default:
        return elem.value;
    }
  }

  isEmpty(value) {
    let newVal = value;
    if (typeof value === 'string') {
      newVal = value.trim();
    }
    return !newVal;
  }

  use(modules) {
    const form = this;

    for (const key of Object.keys(modules)) {
      const formKey = key.toLowerCase();
      if (Object.prototype.hasOwnProperty.call(form.params, key)) {
        form[formKey] = new modules[key](form, form.params[key]);
      } else {
        form[formKey] = new modules[key](form);
      }
    }
  }
}

export { Form };
