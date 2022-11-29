/* eslint-disable import/extensions */
/* eslint-disable import/prefer-default-export */

import { defaults } from './defaults.js';
import { extendParams, hasProperty } from '../commonFunctions/index.js';

class List {
  constructor(element = null, params = {}) {
    const list = this;

    list.extendedParams = extendParams(defaults, params);
    list.eventHandlers = [];

    if (element) {
      list.list = typeof element === 'object' ? element : document.querySelector(element);
      list.list.innerHTML = '';
      list.list.className = '';
      list.setList();
    } else {
      list.createList();
    }
  }

  addListener(type, elem, handler) {
    const link = this;

    elem.addEventListener(type, handler);

    link.eventHandlers.push(handler);

    return link;
  }

  removeListener(type, elem, handler) {
    const link = this;

    elem.removeEventListener(type, handler);

    return link;
  }

  setList() {
    const list = this;

    const params = list.extendedParams.list;

    list.list.classList.add(...params.defaultClasses);
  }

  createList() {
    const list = this;

    list.list = document.createElement('ul');

    list.setList();

    return list.list;
  }

  createListItem(attributes = [{ attributeName: null, attributeValue: null }]) {
    const list = this;

    const params = list.extendedParams.listItem;

    let item = document.createElement('li');

    item.classList.add(...params.defaultClasses);

    if (Array.isArray(attributes)) {
      for (const attribute of attributes) {
        if (hasProperty(attribute, 'attributeName') && hasProperty(attribute, 'attributeValue')) {
          if (attribute.attributeName && attribute.attributeValue) {
            item.setAttribute(attribute.attributeName, attribute.attributeValue);
          }
        }
      }
    }

    return item;
  }
}

export { List };
