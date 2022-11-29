/* eslint-disable import/extensions */
/* eslint-disable import/prefer-default-export */
/* eslint-disable class-methods-use-this */

import { defaults } from "./defaults.js";
import {
  extendParams,
  hasProperty,
} from "../../library.blocks/commonFunctions/index.js";
import { LStorage } from "../../library.blocks/lStorage/index.js";
import { UserInterface } from "./modules/appBlocks/userInterface/index.js";
import { AppTitle } from "./modules/appBlocks/appTitle/index.js";
import { AddingForm } from "./modules/appBlocks/addingForm/index.js";
import { ToDoList } from "./modules/appBlocks/toDoList/index.js";

const modulesToBeInstalled = {
  appBlocks: {
    UserInterface,
    AppTitle,
    AddingForm,
    ToDoList,
  },
};

class ToDoApp {
  constructor(parentElement = "#todo-app", params = {}) {
    const toDoApp = this;

    toDoApp.extendedParams = extendParams(defaults, params);
    toDoApp.actions = {};
    toDoApp.onActionCallbacks = new Map();
    toDoApp.settings = toDoApp.extendedParams.settings;
    toDoApp.modules = {};
    toDoApp.owner = toDoApp.extendedParams.owner;
    toDoApp.makeOwnerId();
    toDoApp.appContainer =
      typeof parentElement === "object"
        ? parentElement
        : document.querySelector(parentElement);

    toDoApp
      .createSettingsStorage()
      .then(() =>
        toDoApp.loadModules(Object.values(toDoApp.settings.modulesToBeUsed))
      )
      .then(() => {
        for (const item of Object.values(modulesToBeInstalled)) {
          toDoApp.modules = { ...toDoApp.modules, ...item };
        }
      })
      .then(() => toDoApp.use(toDoApp.modules))
      .then(() => {
        const appContainer = toDoApp.setAppContainersForMainModules();
        const userInterface = toDoApp.userInterface.createUserInterface();
        const appTitle = toDoApp.appTitle.createAppTitle(
          `To Do List. Account: ${toDoApp.owner}`
        );
        const addingForm = toDoApp.addingForm.createAddingForm();
        const toDoList = toDoApp.toDoList.createToDoList();

        appContainer.appContainer.append(
          appTitle.container,
          appContainer.rowForMenuFormList
        );

        appContainer.containerForFormList.append(
          appContainer.wrapperForFormList
        );

        appContainer.wrapperForFormList.append(
          addingForm.container,
          toDoList.container
        );

        appContainer.rowForMenuFormList.append(
          userInterface.container,
          appContainer.containerForFormList
        );

        toDoApp.toDoList.restoreToDoAppDataFromDB();
      });
  }

  setAppContainersForMainModules() {
    const toDoApp = this;

    const params = toDoApp.extendedParams.appContainer.defaultClasses;

    const rowForMenuFormList = document.createElement("div");
    const containerForFormList = document.createElement("div");
    const wrapperForFormList = document.createElement("div");

    toDoApp.appContainer.addEventListener(
      "click",
      toDoApp.onClick.bind(toDoApp)
    );

    toDoApp.appContainer.innerHTML = "";

    toDoApp.appContainer.classList.add(...params.appContainer);
    rowForMenuFormList.classList.add(...params.rowForMenuFormList);
    containerForFormList.classList.add(...params.containerForFormList);
    wrapperForFormList.classList.add(...params.wrapperForFormList);

    return {
      appContainer: toDoApp.appContainer,
      rowForMenuFormList,
      containerForFormList,
      wrapperForFormList,
    };
  }

  makeOwnerId() {
    const toDoApp = this;

    toDoApp.ownerId = "";

    for (const char of toDoApp.extendedParams.owner) {
      toDoApp.ownerId += String.prototype.charCodeAt.call(char, 0);
    }

    toDoApp.ownerId = Number(toDoApp.ownerId).toString(36);
  }

  onClick(event) {
    const toDoApp = this;
    const { eventType, actionName } = event.target.dataset;
    if (eventType === "click" && hasProperty(toDoApp.actions, actionName)) {
      toDoApp.actions[actionName](event);
    }
  }

  setAction({ actionName, func }) {
    const toDoApp = this;

    toDoApp.actions[actionName] = func;

    return toDoApp;
  }

  normalizeActionName(name) {
    return name.charAt(0).toUpperCase() + name.substring(1);
  }

  setAttributesForAction({ eventType, element, actionName }) {
    const toDoApp = this;

    element.setAttribute("data-event-type", eventType);
    element.setAttribute("data-action-name", actionName);

    return toDoApp;
  }

  attachAction({ eventType, element, actionName, func }) {
    const toDoApp = this;

    toDoApp.setAttributesForAction({
      eventType,
      element,
      actionName,
    });

    toDoApp.setAction({
      actionName,
      func,
    });

    return toDoApp;
  }

  onAction(actionName, callback) {
    const toDoApp = this;

    const normalizedActionName = toDoApp.normalizeActionName(actionName);

    toDoApp.onActionCallbacks.set(`on${normalizedActionName}`, callback);

    return toDoApp;
  }

  use(modules) {
    const toDoApp = this;

    const modulesKeys = Object.keys(modules);

    if (modulesKeys.length === 0) {
      return;
    }

    for (const key of modulesKeys) {
      const toDoAppKey = toDoApp.normalizeModuleName(key);
      if (hasProperty(toDoApp.extendedParams, toDoAppKey)) {
        toDoApp[toDoAppKey] = new modules[key](
          toDoApp,
          toDoApp.extendedParams[toDoAppKey]
        );
      } else {
        toDoApp[toDoAppKey] = new modules[key](toDoApp);
      }
    }

    return toDoApp;
  }

  normalizeModuleName(name) {
    return name.charAt(0).toLowerCase() + name.substring(1);
  }

  async loadModules(moduleArr) {
    const toDoApp = this;

    const amountOfModules = moduleArr.length;

    if (amountOfModules === 0) {
      return;
    }

    const jobs = [];

    for (const module of moduleArr) {
      const job = import(module.modulePath);
      jobs.push(job);
    }

    const importObjects = await Promise.all(jobs);

    for (let i = 0; i < amountOfModules; ++i) {
      const { exports } = moduleArr[i];

      for (const exportItem of exports) {
        toDoApp.modules[exportItem] = importObjects[i][exportItem];
      }
    }
  }

  setModuleToBeUsed(name, modulePath, exports) {
    const toDoApp = this;

    toDoApp.settingsStorage.put("modulesToBeUsed", {
      modulePath,
      exports,
      keyPath: name,
    });

    return toDoApp;
  }

  createKeyPathForSettings() {
    const toDoApp = this;

    const settingNames = Object.keys(toDoApp.extendedParams.settings);

    for (const settingName of settingNames) {
      for (const key of Object.keys(
        toDoApp.extendedParams.settings[settingName]
      )) {
        toDoApp.extendedParams.settings[settingName][key].keyPath = key;
      }
    }
  }

  async createSettingsStorage() {
    const toDoApp = this;

    toDoApp.settingsStorage = new LStorage(
      `ToDo-App. Settings. Account: ${toDoApp.extendedParams.owner}`
    );
    toDoApp.createKeyPathForSettings();
    const settingNames = Object.keys(toDoApp.extendedParams.settings);

    let stores = [];

    for (const settingName of settingNames) {
      stores.push({ name: settingName, keyPath: "keyPath" });
    }

    await toDoApp.settingsStorage.open(stores);

    const jobs = [];

    for (const settingName of settingNames) {
      const values = Object.values(
        toDoApp.extendedParams.settings[settingName]
      );
      for (const value of values) {
        const job = toDoApp.settingsStorage
          .add(settingName, value)
          .catch(async () =>
            toDoApp.restoreSettingValueFromStorage(settingName, value.keyPath)
          );
        jobs.push(job);
      }
    }

    return Promise.all(jobs);
  }

  async restoreSettingValueFromStorage(settingName, valueName) {
    const toDoApp = this;

    const setting = await toDoApp.settingsStorage.get(settingName, valueName);

    toDoApp.settings[settingName][valueName] = setting;
  }

  getNameOfCurrentDB() {
    const toDoApp = this;

    const moduleObject = toDoApp.settings.modulesToBeUsed.db;

    return moduleObject.exports[0];
  }
}

export { ToDoApp };
