/* eslint-disable import/extensions */
/* eslint-disable import/prefer-default-export */
/* eslint-disable class-methods-use-this */

import { defaults } from './defaults.js';
import { extendParams } from '../../../../../library.blocks/commonFunctions/index.js';

class AppTitle {
  constructor(toDoApp, params = {}) {
    const appTitle = this;

    appTitle.toDoApp = toDoApp;
    appTitle.extendParams = extendParams(defaults, params);
  }

  createContainerForAppTitle() {
    const appTitle = this;

    const params = appTitle.extendParams.defaultClasses;

    const appTitleContainer = document.createElement('div');
    const appTitleWrapper = document.createElement('div');

    appTitleContainer.classList.add(...params.appTitleContainer);
    appTitleWrapper.classList.add(...params.appTitleWrapper);

    appTitleContainer.append(appTitleWrapper);

    return {
      appTitleContainer,
      appTitleWrapper,
    };
  }

  createAppTitleElement(textContent) {
    const appTitle = this;

    const params = appTitle.extendParams;

    const title = document.createElement(params.appTitleTag);

    title.classList.add(...params.defaultClasses.title);
    title.textContent = textContent;

    return title;
  }

  createAppTitle(textContent) {
    const appTitle = this;

    const title = appTitle.createAppTitleElement(textContent);

    if (appTitle.extendParams.container) {
      const containerForAppTitle = appTitle.createContainerForAppTitle();

      containerForAppTitle.appTitleWrapper.append(title);

      return {
        container: containerForAppTitle.appTitleContainer,
        wrapper: containerForAppTitle.appTitleWrapper,
        DOMObject: title,
      }
    }

    return {
      container: title,
      wrapper: title,
      DOMObject: title,
    }
  }
}

export { AppTitle };
