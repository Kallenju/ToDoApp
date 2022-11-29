/* eslint-disable import/extensions */
/* eslint-disable import/prefer-default-export */
/* eslint-disable class-methods-use-this */

import { defaults } from "./defaults.js";
import { extendParams } from "../../../../../library.blocks/commonFunctions/index.js";
import { List } from "../../../../../library.blocks/list/index.js";

class ToDoList {
  constructor(toDoApp, params = {}) {
    const toDoList = this;

    toDoList.toDoApp = toDoApp;
    toDoList.extendedParams = extendParams(defaults, params);

    toDoList.list = new List(null, {
      list: {
        defaultClasses: toDoList.extendedParams.defaultClasses.list,
      },
      listItem: {
        defaultClasses: toDoList.extendedParams.defaultClasses.item,
      },
    });

    toDoList.toDoApp
      .setAction({
        actionName: "getToDoDone",
        func: toDoList.getToDoDone.bind(toDoList),
      })
      .setAction({
        actionName: "deleteToDo",
        func: toDoList.deleteToDo.bind(toDoList),
      });
  }

  createToDoList() {
    const toDoList = this;

    const { list } = toDoList.list;

    if (toDoList.extendedParams.container) {
      const containerForToDoList = toDoList.createContainerForToDoList();
      containerForToDoList.toDoListWrapper.append(list);

      return {
        container: containerForToDoList.toDoListContainer,
        wrapper: containerForToDoList.toDoListWrapper,
        DOMObject: list,
      };
    }

    return {
      container: list,
      wrapper: list,
      DOMObject: list,
    };
  }

  createContainerForToDoList() {
    const toDoList = this;

    const params = toDoList.extendedParams.defaultClasses;

    const toDoListContainer = document.createElement("div");
    const toDoListWrapper = document.createElement("div");

    toDoListContainer.classList.add(...params.toDoListContainer);
    toDoListWrapper.classList.add(...params.toDoListWrapper);

    toDoListContainer.append(toDoListWrapper);

    return {
      toDoListContainer,
      toDoListWrapper,
    };
  }

  createToDoListItemElement(name, done) {
    const toDoList = this;

    const params = toDoList.extendedParams.defaultClasses;

    const item = toDoList.list.createListItem();
    const nameContainer = document.createElement("span");

    if (done) {
      item.classList.add(params.itemSuccess);
    }

    nameContainer.textContent = name;

    item.append(nameContainer);

    return item;
  }

  createDoneButton() {
    const toDoList = this;

    const params = toDoList.extendedParams.defaultClasses;

    const doneButton = document.createElement("button");

    toDoList.toDoApp.setAttributesForAction({
      eventType: "click",
      element: doneButton,
      actionName: "getToDoDone",
    });

    doneButton.classList.add(...params.doneButton);

    doneButton.textContent = "Done";

    return doneButton;
  }

  createDeleteButton() {
    const toDoList = this;

    const params = toDoList.extendedParams.defaultClasses;

    const deleteButton = document.createElement("button");

    toDoList.toDoApp.setAttributesForAction({
      eventType: "click",
      element: deleteButton,
      actionName: "deleteToDo",
    });

    deleteButton.classList.add(...params.deleteButton);

    deleteButton.textContent = "Delete";

    return deleteButton;
  }

  createToDoItem(toDoObject) {
    const toDoList = this;

    const params = toDoList.extendedParams.defaultClasses;

    const item = toDoList.createToDoListItemElement(
      toDoObject.name,
      toDoObject.done
    );
    const doneButton = toDoList.createDoneButton();
    const deleteButton = toDoList.createDeleteButton();
    const buttonGroup = document.createElement("div");

    item.dataset.toDoId = toDoObject.toDoId;

    buttonGroup.classList.add(...params.buttonGroup);

    buttonGroup.append(doneButton, deleteButton);

    item.append(buttonGroup);

    return item;
  }

  pasteToDoItem(toDoItem) {
    const toDoList = this;

    toDoList.list.list.append(toDoItem);

    return toDoList;
  }

  async getToDoDone(event) {
    const toDoList = this;

    const params = toDoList.extendedParams.defaultClasses;

    const item = event.target.closest("li[data-to-do-id]");

    item.classList.toggle(params.itemSuccess);

    if (toDoList.toDoApp.onActionCallbacks.has("onDone")) {
      const callback = toDoList.toDoApp.onActionCallbacks.get("onDone");
      await callback(item.dataset.toDoId);
    }
  }

  async deleteToDo(event) {
    const toDoList = this;

    const item = event.target.closest("li[data-to-do-id]");

    item.remove();

    if (toDoList.toDoApp.onActionCallbacks.has("onDelete")) {
      const callback = toDoList.toDoApp.onActionCallbacks.get("onDelete");
      await callback(item.dataset.toDoId);

      item.remove();
    }
  }

  addToDoToList(toDoObject) {
    const toDoList = this;

    const toDoItem = toDoList.createToDoItem(toDoObject);
    toDoList.pasteToDoItem(toDoItem);

    return toDoList;
  }

  async restoreToDoAppDataFromDB() {
    const toDoList = this;

    if (toDoList.toDoApp.onActionCallbacks.has("onRestoreToDoAppDataFromDB")) {
      const callback = toDoList.toDoApp.onActionCallbacks.get(
        "onRestoreToDoAppDataFromDB"
      );
      const data = await callback();

      for (const toDoObject of data) {
        toDoList.addToDoToList(toDoObject);
      }
    }
  }
}

export { ToDoList };
