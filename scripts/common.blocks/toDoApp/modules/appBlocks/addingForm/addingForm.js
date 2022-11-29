/* eslint-disable import/extensions */
/* eslint-disable import/prefer-default-export */
/* eslint-disable class-methods-use-this */

import { defaults } from "./defaults.js";
import { extendParams } from "../../../../../library.blocks/commonFunctions/index.js";
import { Form } from "../../../../../library.blocks/form/index.js";

class AddingForm {
  constructor(toDoApp, params = {}) {
    const addingForm = this;

    addingForm.toDoApp = toDoApp;
    addingForm.extendParams = extendParams(defaults, params);
  }

  createContainerForAddingForm() {
    const addingForm = this;

    const params = addingForm.extendParams.defaultClasses;

    const formContainer = document.createElement("div");
    const formWrapper = document.createElement("div");

    formContainer.classList.add(...params.formContainer);
    formWrapper.classList.add(...params.formWrapper);

    formContainer.append(formWrapper);

    return {
      formContainer,
      formWrapper,
    };
  }

  createAddingFormElement() {
    const addingForm = this;

    const params = addingForm.extendParams.defaultClasses;

    const form = document.createElement("form");
    const fieldset = document.createElement("fieldset");
    const legend = document.createElement("legend");
    const label = document.createElement("label");
    const input = document.createElement("input");
    const button = document.createElement("button");

    form.classList.add(...params.form);
    form.name = "addingForm";
    form.action = "#";

    fieldset.classList.add(...params.fieldset);

    legend.classList.add(...params.legend);
    legend.textContent = "Form for adding a new to do";

    label.classList.add(...params.label);
    label.textContent = "Field for entering the name of the new to do";
    label.for = "toDoName";

    input.id = "toDoName";
    input.name = "toDoName";
    input.classList.add(...params.input);
    input.placeholder = "Enter the name of the new to do";

    button.classList.add(...params.button);
    button.textContent = "Add to do";
    button.name = "addToDo";
    button.disabled = true;

    form.append(fieldset);
    fieldset.append(legend, label);

    if (addingForm.extendParams.inputGroup) {
      const inputGroupWrapper = document.createElement("div");
      inputGroupWrapper.classList.add(...params.inputGroupWrapper);

      inputGroupWrapper.append(input, button);
      fieldset.append(inputGroupWrapper);
    } else {
      fieldset.append(input);
      form.append(button);
    }
    return form;
  }

  createAddingForm() {
    const addingForm = this;

    const form = addingForm.createAddingFormElement();
    const formClass = new Form(form);
    const inputToDoName = form.elements["toDoName"];
    const buttonAddToDo = form.elements["addToDo"];

    addingForm.formClass = formClass;

    formClass.setListenerOnField(
      inputToDoName,
      () => {
        if (!inputToDoName.value) {
          buttonAddToDo.disabled = true;
        } else {
          buttonAddToDo.disabled = false;
        }
      },
      "inputToDoNameHandler"
    );

    formClass.addListener(
      "submit",
      form,
      (event) => {
        event.preventDefault();
      },
      "addingFormPreventDefault"
    );

    formClass.addListener(
      "submit",
      form,
      addingForm.addToDo.bind(addingForm),
      "addingForAddToDo"
    );

    if (addingForm.extendParams.container) {
      const containerForAddingForm = addingForm.createContainerForAddingForm();

      containerForAddingForm.formWrapper.append(form);

      return {
        container: containerForAddingForm.formContainer,
        wrapper: containerForForm.formWrapper,
        DOMObject: form,
        elementClass: formClass,
      };
    }

    return {
      container: form,
      wrapper: form,
      DOMObject: form,
      elementClass: formClass,
    };
  }

  async addToDo() {
    const addingForm = this;

    const formElements = addingForm.formClass.form.elements;
    const formInput = formElements.toDoName;
    const formButton = formElements.addToDo;

    if (!formInput.value) {
      formInput.value = "";
      formButton.disabled = true;
      return;
    }

    let toDoObject = {
      name: formInput.value,
      owner: addingForm.toDoApp.owner,
      ownerId: addingForm.toDoApp.ownerId,
      done: false,
    };

    if (addingForm.toDoApp.onActionCallbacks.has("onAddToDo")) {
      const callback = addingForm.toDoApp.onActionCallbacks.get("onAddToDo");
      toDoObject = await callback(toDoObject);
    }

    addingForm.toDoApp.toDoList.addToDoToList(toDoObject);
    formInput.value = "";
    formButton.disabled = true;
  }
}

export { AddingForm };
