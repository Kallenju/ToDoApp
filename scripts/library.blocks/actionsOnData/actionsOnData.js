/* eslint-disable import/extensions */
/* eslint-disable import/prefer-default-export */
import { defaults } from './defaults.js';

class ActionsOnData {
  constructor(params = {}) {
    const actionsOnData = this;

    actionsOnData.params = { ...defaults, ...params };
    actionsOnData.actions = {};
    actionsOnData.enabledActions = [];
  }

  addData(newDataObject) {
    const actionsOnData = this;

    if (Object.prototype.hasOwnProperty.call(actionsOnData, 'transformedData')) {
      actionsOnData.transformedData.push(newDataObject);
    }

    return actionsOnData;
  }

  transformData({ data, afterAddingNewItem = false }) {
    const actionsOnData = this;

    if (!Object.prototype.hasOwnProperty.call(actionsOnData, 'transformedData')) {
      actionsOnData.transformedData = data;
    }

    if (actionsOnData.enabledActions.length === 0) {
      return actionsOnData.transformedData;
    }

    actionsOnData.transformedData = afterAddingNewItem ? actionsOnData.transformedData : data;

    actionsOnData.enabledActions.forEach((actionName) => {
      const action = actionsOnData.actions[actionName];
      const functionAfterSettingParams = action.function(action.params);
      actionsOnData.transformedData = functionAfterSettingParams(actionsOnData.transformedData);
    });

    return actionsOnData.transformedData;
  }

  addActiion(actionName, func) {
    const actionsOnData = this;

    actionsOnData.actions[actionName].function = func;

    return actionsOnData;
  }

  use(actions = {}) {
    const actionsOnData = this;

    if (typeof actions === 'object') {
      for (const [actionName, func] of Object.entries(actions)) {
        actionsOnData.actions[actionName] = {};
        actionsOnData.addActiion(actionName, func);
      }
    }

    return actionsOnData;
  }

  setParametersOfAction(actionName, params) {
    const actionsOnData = this;

    if (!Object.prototype.hasOwnProperty.call(actionsOnData.actions, actionName)) {
      return;
    }

    actionsOnData.actions[actionName].params = params;
  }

  deleteParametersOfAction(actionName) {
    const actionsOnData = this;

    if (!Object.prototype.hasOwnProperty.call(actionsOnData.actions, actionName)) {
      return;
    }

    if (!Object.prototype.hasOwnProperty.call(actionsOnData.actions[actionName], 'params')) {
      return;
    }

    delete actionsOnData.actions[actionName].params;
  }

  enable(actionName) {
    const actionsOnData = this;

    const { enabledActions } = actionsOnData;

    if (enabledActions.indexOf(actionName) < 0) {
      enabledActions.push(actionName);
    }

    return actionsOnData;
  }

  disable(actionName) {
    const actionsOnData = this;

    const { enabledActions } = actionsOnData;

    if (enabledActions.indexOf(actionName) > 0) {
      enabledActions.splice(
        enabledActions.indexOf(actionName),
        1,
      );
    }

    return actionsOnData;
  }
}

export { ActionsOnData };
