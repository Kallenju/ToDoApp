/* eslint-disable import/prefer-default-export */
/* eslint-disable import/extensions */

import { defaults } from './defaults.js';
import { extendParams, hasProperty } from '../../../../library.blocks/commonFunctions/index.js';

class ToDoDBsControl {
  constructor(toDoApp, params = {}) {
    const toDoDBsControl = this;

    toDoDBsControl.toDoApp = toDoApp;
    toDoDBsControl.extendedParams = extendParams(defaults, params);
    toDoDBsControl.dbNames = toDoDBsControl.extendedParams.dbNames;
    toDoDBsControl.alliasesForDBs = toDoDBsControl.extendedParams.alliasesForDBs;
    toDoDBsControl.currentDBName = toDoDBsControl.toDoApp.getNameOfCurrentDB();

    toDoDBsControl.toDoApp.setAction({
      actionName: 'switchDB',
      func: toDoDBsControl.switchDB.bind(toDoDBsControl),
    });
  }

  getFolderName(dbName) {
    return dbName.charAt(0).toLowerCase() + dbName.substring(1);
  }

  getPathToDB(dbName) {
    const toDoDBsControl = this;

    const dbFolderName = toDoDBsControl.getFolderName(dbName);

    return `./modules/dbs/${dbFolderName}/index.js`;
  }

  getTextContentForSwitchDBButton(dbName) {
    const toDoDBsControl = this;

    if(hasProperty(toDoDBsControl.alliasesForDBs, dbName)) {
      return toDoDBsControl.alliasesForDBs[dbName];
    }

    return dbName;
  }

  createSwitchDBButton(dbName) {
    const toDoDBsControl = this;

    const wrapperForSwitchDBButton = toDoDBsControl.createWrapperForSwitchDBButton();
    const svgForSwitchDBButton = toDoDBsControl.createSVGForSwitchDBButton();
    const switchDBButton = toDoDBsControl.createSwitchDBButtonElement(dbName);

    wrapperForSwitchDBButton.append(
      svgForSwitchDBButton,
      switchDBButton,
    );

    return wrapperForSwitchDBButton;
  }

  createWrapperForSwitchDBButton() {
    const toDoDBsControl = this;

    const params = toDoDBsControl.extendedParams.defaultClasses;

    const switchDBButtonWrapper = document.createElement('div');

    switchDBButtonWrapper.classList.add(...params.switchDBButtonWrapper);

    return switchDBButtonWrapper
  }

  createSVGForSwitchDBButton() {
    const toDoDBsControl = this;

    const params = toDoDBsControl.extendedParams.defaultClasses;

    const xmlns = 'http://www.w3.org/2000/svg';
    const boxWidth = 150;
    const boxHeight = 36;

    const svg = document.createElementNS(xmlns, 'svg');
    const use = document.createElementNS(xmlns, 'use');

    svg.classList.add(...params.switchDBButtonSVG);

    svg.setAttributeNS(null, 'viewBox', `0 0 ${boxWidth} ${boxHeight}`);
    svg.setAttributeNS(null, 'width', boxWidth);
    svg.setAttributeNS(null, 'height', boxHeight);
    use.setAttributeNS(null, 'href', './images/vectors/sprite.svg#switchDBButton');

    svg.append(use);

    return svg;
  }

  createSwitchDBButtonElement() {
    const toDoDBsControl = this;

    const params = toDoDBsControl.extendedParams.defaultClasses;

    const button = document.createElement('button');

    toDoDBsControl.toDoApp.setAttributesForAction({
      eventType: 'click',
      element: button,
      actionName: 'switchDB',
    });

    button.classList.add(...params.switchDBButton);
    button.textContent = toDoDBsControl.getTextContentForSwitchDBButton(toDoDBsControl.currentDBName);

    return button;
  }

  switchDB() {
    const toDoDBsControl = this;

    let nextDB;

    const { dbNames } = toDoDBsControl;

    const indexOfDBsName = dbNames.indexOf(toDoDBsControl.currentDBName);

    if (indexOfDBsName === (dbNames.length - 1)) {
      nextDB = dbNames[0];
    } else {
      nextDB = dbNames[indexOfDBsName + 1];
    }

    toDoDBsControl.toDoApp.setModuleToBeUsed(
      'db',
      toDoDBsControl.getPathToDB(nextDB),
      [nextDB],
    );

    window.location.reload();
  }
}

export { ToDoDBsControl }
