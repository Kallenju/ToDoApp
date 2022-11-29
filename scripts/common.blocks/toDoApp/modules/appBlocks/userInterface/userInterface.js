/* eslint-disable import/extensions */
/* eslint-disable import/prefer-default-export */
/* eslint-disable class-methods-use-this */

import { defaults } from './defaults.js';
import { extendParams } from '../../../../../library.blocks/commonFunctions/index.js';
import { List } from '../../../../../library.blocks/list/index.js';
import { ToDoDBsControl } from '../../dbs/index.js';

class UserInterface{
  constructor(toDoApp, params = {}) {
    const userInterface = this;

    userInterface.toDoApp = toDoApp;
    userInterface.extendedParams = extendParams(defaults, params);

    userInterface.list = new List(null, {
      list: {
        defaultClasses: userInterface.extendedParams.defaultClasses.list,
      },
      listItem: {
        defaultClasses: userInterface.extendedParams.defaultClasses.item,
      },
    });
  }

  createUserInterface() {
    const userInterface = this;

    const userInterfaceList = userInterface.createUserInterfaceList();

    const uiElements = [];

    const toDoDBsControl = new ToDoDBsControl(userInterface.toDoApp, userInterface.extendedParams.toDoDBsControl);
    const switchDBButton = toDoDBsControl.createSwitchDBButton();

    uiElements.push(switchDBButton);

    for (const uiElement of uiElements) {
      const li = userInterface.list.createListItem();
      li.append(uiElement);
      userInterfaceList.DOMObject.append(li);
    }

    return userInterfaceList;
  }

  createUserInterfaceList() {
    const userInterface = this;

    const containerForUserInterface = userInterface.createContainerForUserInterfaceList();
    const { list } = userInterface.list;

    containerForUserInterface.userInterfaceWrapper.append(list);

    return {
      container: containerForUserInterface.userInterfaceContainer,
      wrapper: containerForUserInterface.userInterfaceWrapper,
      DOMObject: list,
    }
  }

  createContainerForUserInterfaceList() {
    const userInterface = this;

    const params = userInterface.extendedParams.defaultClasses;

    const userInterfaceContainer = document.createElement('div');
    const userInterfaceWrapper = document.createElement('div');

    userInterfaceContainer.classList.add(...params.userInterfaceContainer);
    userInterfaceWrapper.classList.add(...params.userInterfaceWrapper);

    userInterfaceContainer.append(userInterfaceWrapper);

    return {
      userInterfaceContainer,
      userInterfaceWrapper,
    };
  }
}

export { UserInterface };
