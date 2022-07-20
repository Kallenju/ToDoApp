/* eslint-disable import/extensions */
/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */

import { defaults } from './defaults.js';

class Validate {
  constructor(formObject, params = {}) {
    const validate = this;

    validate.formObject = formObject;
    validate.form = formObject.form;
    validate.formElements = validate.form.elements;
    validate.isSubmitted = false;
    validate.fields = {};
    validate.params = { ...defaults, ...params };
    validate.eventHandlers = [];

    validate.setForm();
  }

  bindAndPushHandler(handler) {
    const validate = this;

    const bindedHandler = handler.bind(validate);

    validate.eventHandlers.push(bindedHandler);

    return bindedHandler;
  }

  handlerChange(event) {
    const validate = this;

    if (!event.target) {
      return;
    }

    if (validate.isSubmitted) {
      validate.handleFieldChange(event.target);
    }
  }

  handleFieldChange(target) {
    const validate = this;

    let currentFieldName;
    for (const fieldName of Object.keys(validate.fields)) {
      const field = validate.fields[fieldName];
      if (field.elem === target) {
        currentFieldName = fieldName;
        break;
      }
    }

    if (!currentFieldName) {
      return;
    }

    validate.validateField(currentFieldName);
    validate.renderErrors(currentFieldName);
    validate.showErrors(currentFieldName);
  }

  setForm() {
    const validate = this;

    validate.form.setAttribute('novalidate', 'novalidate');

    validate.formObject
      .addListener('submit', validate.form, (event) => event.preventDefault());
    validate.formObject
      .addListener('submit', validate.form, validate.bindAndPushHandler(validate.formSubmitHandler));
  }

  formSubmitHandler(event) {
    const validate = this;

    event.preventDefault();
    validate.isSubmitted = true;
    validate.validateHandler();
  }

  validateHandler() {
    const validate = this;

    if (validate.isSubmitted) {
      validate.validate();

      if (validate.isFormValid()) {
        if (Object.prototype.hasOwnProperty.call(validate, 'onSuccessCallback')) {
          validate.onSuccessCallback();
        }
        validate.refresh();
      } else {
        validate.renderErrors();
        validate.showErrors();
        if (Object.prototype.hasOwnProperty.call(validate, 'onFailCallback')) {
          validate.onFailCallback();
        }
      }
    }
  }

  clearFields() {
    const validate = this;

    for (const field of Object.values(validate.fields)) {
      field.elem.value = '';
    }
  }

  getWrapperForMessages() {
    const validate = this;

    if (Object.prototype.hasOwnProperty.call(validate, 'messagesWrapper')) {
      return;
    }

    validate.messagesWrapper = document.createElement('div');
    validate.messagesWrapper.classList.add(...validate.params.defaultsClasses.messagesWrapperClass);

    if (validate.form.querySelector('button')) {
      const element = validate.form.querySelectorAll('button')[validate.form.querySelectorAll('button').length - 1];
      element.before(validate.messagesWrapper);
    } else {
      validate.form.append(validate.messagesWrapper);
    }
  }

  deleteWrapperForMessages() {
    const validate = this;

    if (validate.isElementInDom(validate.messagesWrapper)) {
      validate.messagesWrapper.parentNode.removeChild(validate.messagesWrapper);
    }

    if (Object.prototype.hasOwnProperty.call(validate, 'messagesWrapper')) {
      delete validate.messagesWrapper;
    }
  }

  getFieldObject(singleFormElement) {
    const validate = this;

    return typeof singleFormElement === 'object' ? singleFormElement : validate.fields[singleFormElement];
  }

  getContainerForError(singleFormElement) {
    const validate = this;

    const field = validate.getFieldObject(singleFormElement);

    if (!Object.prototype.hasOwnProperty.call(field.config, 'errorsContainer')) {
      field.config.errorsContainer = document.createElement('div');

      const { errorsContainer } = field.config;

      const { defaultsClasses } = validate.params;
      errorsContainer.classList.add(...defaultsClasses.messageClass);
      errorsContainer.classList.add(...defaultsClasses.errorClass);
    } else {
      const { errorsContainer } = field.config;
      field.config.errorsContainer = typeof errorsContainer === 'object' ? errorsContainer : validate.form.querySelector(errorsContainer);
    }

    return field.config.errorsContainer;
  }

  renderErrors(singleField = null) {
    const validate = this;

    const currentField = validate.getFieldObject(singleField);

    if (!singleField) {
      for (const field of Object.values(validate.fields)) {
        if (!field.isValid) {
          const containerForError = validate.getContainerForError(field);
          const { errorMessage } = field;
          containerForError.textContent = errorMessage;
        } else {
          validate.deleteErrors(field);
        }
      }
    } else if (!currentField.isValid) {
      const errorsContainer = validate.getContainerForError(currentField);
      const { errorMessage } = currentField;
      errorsContainer.textContent = errorMessage;
    } else if (currentField.isValid) {
      validate.deleteErrors(currentField);
    }
  }

  isElementInDom(element) {
    if (typeof element === 'undefined') {
      return false;
    }
    return element.parentNode;
  }

  showErrors(singleFormElement = null) {
    const validate = this;

    const singleField = validate.getFieldObject(singleFormElement);

    function showMessagesTogether(field) {
      if (!field.isValid) {
        const { errorsContainer } = field.config;
        validate.messagesWrapper.append(errorsContainer);
      }
    }

    function showMessagesIndividually(field) {
      if (!field.isValid) {
        const { errorsContainer } = field.config;
        field.elem.after(errorsContainer);
      }
    }

    if (validate.params.allMessagesTogether) {
      validate.getWrapperForMessages();

      if (!singleFormElement) {
        for (const field of Object.values(validate.fields)) {
          showMessagesTogether(field);
        }
      } else if (!validate.isElementInDom(singleField.config.errorsContainer)) {
        showMessagesTogether(singleField);
        if (validate.isFormValid()) {
          validate.deleteWrapperForMessages();
        }
      }
    } else if (!singleFormElement) {
      for (const field of Object.values(validate.fields)) {
        showMessagesIndividually(field);
      }
    } else if (!validate.isElementInDom(singleField.config.errorsContainer)) {
      showMessagesIndividually(singleField);
    }
  }

  deleteErrors(singleFormElement) {
    const validate = this;

    const field = validate.getFieldObject(singleFormElement);

    if (validate.isFieldValidAfterChange(field)) {
      const { errorsContainer } = field.config;
      errorsContainer.parentNode.removeChild(errorsContainer);
      delete field.errorMessage;
    }
  }

  deleteMessagesWrapper() {
    const validate = this;

    if (Object.prototype.hasOwnProperty.call(validate, 'messagesWrapper')) {
      validate.messagesWrapper.parentNode.removeChild(validate.messagesWrapper);
    }
  }

  refresh() {
    const validate = this;

    validate.isSubmitted = false;

    validate.clearFields();
    validate.renderErrors();
    validate.deleteMessagesWrapper();
  }

  isFormValid() {
    const validate = this;

    let valid = true;

    for (const field of Object.values(validate.fields)) {
      if (!field.isValid) {
        valid = false;
        break;
      }
    }

    return valid;
  }

  isFieldValidAfterChange(element) {
    const validate = this;

    const field = typeof element === 'object' ? element : validate.fields[element];

    return field.isValid && Object.prototype.hasOwnProperty.call(field, 'errorMessage');
  }

  validateFieldRule(field, fieldRule) {
    const validate = this;

    const elemValue = validate.formObject.getElemValue(field.elem);

    if (fieldRule.value === 'required') {
      if (validate.formObject.isEmpty(elemValue)) {
        field.isValid = false;
      }
    } else if (!fieldRule.validator(elemValue)) {
      field.isValid = false;
    }
  }

  validateField(fieldName) {
    const validate = this;

    const field = validate.fields[fieldName];
    field.isValid = true;

    for (const rule of field.rules) {
      validate.validateFieldRule(field, rule);
      if (!field.isValid) {
        field.errorMessage = rule.errorMessage;
        break;
      }
    }
  }

  validate() {
    const validate = this;

    Object.keys(validate.fields).forEach((fieldName) => {
      validate.validateField(fieldName);
    });
  }

  addField(fieldName, rules, config = {}) {
    const validate = this;

    const elem = validate.formElements[fieldName];

    validate.fields[fieldName] = {
      elem,
      rules,
      isValid: false,
      config,
    };

    validate.formObject
      .setListenerOnField(elem, validate.bindAndPushHandler(validate.handlerChange));

    return validate;
  }

  removeField(singleFormElement) {
    const validate = this;

    const field = validate.getFieldObject(singleFormElement);

    const type = validate.formObject.getListenerType(field.elem.type);

    for (const eventHandler of validate.eventHandlers) {
      validate.formObject.removeListener(type, field.elem, eventHandler);
    }

    validate.deleteErrors(field);
    delete validate.fields.field;

    return validate;
  }

  onSuccess(callback) {
    const validate = this;

    validate.onSuccessCallback = callback;
    return validate;
  }

  onFail(callback) {
    const validate = this;

    validate.onFailCallback = callback;
    return validate;
  }
}

export { Validate };
