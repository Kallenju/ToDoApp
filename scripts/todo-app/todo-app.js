/* eslint-disable import/extensions */
/* eslint-disable import/prefer-default-export */
/* eslint-disable class-methods-use-this */

import { defaults } from './defaults.js';
import { Form } from '../library.blocks/form/index.js';
import { IDB } from '../library.blocks/indexedDB/index.js';

class ToDoApp {
  constructor({
    container = document.querySelector('#todo-app'), title = 'Список дел', ownerName = 'Я', presettedTodos = [], params = {},
  }) {
    const toDoApp = this;

    toDoApp.params = { ...defaults, ...params };
    toDoApp.container = container;
    toDoApp.title = title;
    toDoApp.ownerName = ownerName;
    toDoApp.presettedTodos = presettedTodos;

    toDoApp.init();
  }

  createAppTitle() {
    const toDoApp = this;
    const { params } = toDoApp;

    let row = document.createElement('div');
    let col = document.createElement('div');
    let appTitle = document.createElement(params.appTitleTag);

    row.classList.add(...params.defaultClasses.appTitle.row);

    col.classList.add(...params.defaultClasses.appTitle.col);

    appTitle.classList.add(...params.defaultClasses.appTitle.mainTag);

    appTitle.textContent = toDoApp.title;

    row.append(col);
    col.append(appTitle);

    return row;
  }

  createTodoItemForm() {
    const toDoApp = this;
    const params = toDoApp.params.defaultClasses.formToAddANewToDo;

    let row = document.createElement('div');
    let col = document.createElement('div');
    let form = document.createElement('form');
    let fieldset = document.createElement('fieldset');
    let legend = document.createElement('legend');
    let label = document.createElement('label');
    let input = document.createElement('input');
    let button = document.createElement('button');

    row.classList.add(...params.row);

    col.classList.add(...params.col);

    form.classList.add(...params.form);
    form.name = 'formToAddANewToDo';
    form.action = '#';

    fieldset.classList.add(...params.fieldset);

    legend.classList.add(...params.legend);
    legend.textContent = 'Форма добавления нового дела';

    label.classList.add(...params.label);
    label.textContent = 'Поле для ввода названия нового дела';
    label.for = 'toDoName';

    input.id = 'toDoName';
    input.name = 'toDoName';
    input.classList.add(...params.input);
    input.placeholder = 'Введите название нового дела';

    button.classList.add(...params.button);
    button.textContent = 'Добавить дело';
    button.name = 'addNewToDo';
    button.disabled = true;

    input.addEventListener('input', () => {
      if (!input.value) {
        button.disabled = true;
      } else {
        button.disabled = false;
      }
    });

    row.append(col);
    col.append(form);
    form.append(fieldset);
    fieldset.append(legend, label, input);
    form.append(button);

    toDoApp.formContainer = row;

    return form;
  }

  createToDoList() {
    const toDoApp = this;
    const params = toDoApp.params.defaultClasses.toDoList;

    let row = document.createElement('div');
    let col = document.createElement('div');
    let list = document.createElement('ul');

    row.classList.add(...params.row);

    col.classList.add(...params.col);

    list.classList.add(...params.list);

    row.append(col);
    col.append(list);

    toDoApp.toDoListContainer = row;

    return list;
  }

  createTodoItem(toDoObject) {
    const toDoApp = this;
    const params = toDoApp.params.defaultClasses.toDoList;

    let item = document.createElement('li');
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    item.classList.add(...params.item);
    item.textContent = toDoObject.name;

    buttonGroup.classList.add(...params.buttonGroup);
    doneButton.classList.add(...params.doneButton);
    doneButton.textContent = 'Готово';
    deleteButton.classList.add(...params.deleteButton);
    deleteButton.textContent = 'Удалить';

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    if (toDoObject.done) {
      item.classList.add(params.itemSuccess);
    }

    doneButton.addEventListener('click', toDoApp.doneButtonEvent(item, toDoObject));
    deleteButton.addEventListener('click', toDoApp.deleteButtonEvent(item, toDoObject));

    return item;
  }

  doneButtonEvent(item, toDoObject) {
    const toDoApp = this;
    const { iDB } = toDoApp;
    const { params } = toDoApp;

    return () => {
      item.classList.toggle(params.defaultClasses.toDoList.itemSuccess);
      toDoObject.done = !toDoObject.done;
      iDB.put(params.indexedDB.toDoListStore, toDoObject);
    };
  }

  deleteButtonEvent(item, toDoObject) {
    const toDoApp = this;
    const { iDB } = toDoApp;
    const params = toDoApp.params.indexedDB;

    return () => {
      if (window.confirm('Вы уверены?')) {
        item.remove();
        iDB.delete(params.toDoListStore, toDoObject[params.toDoId]);
      }
    };
  }

  addNewItem(toDoObject) {
    const toDoApp = this;

    const { iDB } = toDoApp;
    const formInput = toDoApp.form.elements.toDoName;
    const formButton = toDoApp.form.elements.addNewToDo;

    const todoItem = toDoApp.createTodoItem(toDoObject);

    iDB.add(toDoApp.params.indexedDB.toDoListStore, toDoObject).then(() => {
      toDoApp.toDoList.append(todoItem);
      formInput.value = '';
      formButton.disabled = true;
    }).catch((result) => {
      if (result.name === 'ConstraintError') {
        formInput.value = '';
        formButton.disabled = true;
      }
    });
  }

  addNewToDoHandler(event) {
    event.preventDefault();

    const toDoApp = this;

    const formInput = toDoApp.form.elements.toDoName;
    const formButton = toDoApp.form.elements.addNewToDo;

    if (!formInput.value) {
      formInput.value = '';
      formButton.disabled = true;
      return;
    }

    const toDoObject = { name: formInput.value, done: false };

    toDoApp.addNewItem(toDoObject);
  }

  createIDB() {
    const toDoApp = this;
    const params = toDoApp.params.indexedDB;

    toDoApp.iDB = new IDB({ name: `ToDo-App. Account: ${toDoApp.ownerName}`, keyPath: params.toDoId });

    return toDoApp.iDB.open(params.toDoListStore);
  }

  addExistedToDos(openedIDB) {
    const toDoApp = this;
    const params = toDoApp.params.indexedDB;
    const { iDB } = toDoApp;

    openedIDB.then((result) => {
      const jobForPresettedTodos = [];

      for (const toDoObject of toDoApp.presettedTodos) {
        jobForPresettedTodos.push(iDB.add(params.toDoListStore, toDoObject).catch((res) => {
          if (res.name === 'ConstraintError') {
            console.log(`Задача: ${toDoObject.name} уже есть в списке!`);
          }
        }));
      }

      Promise.all(jobForPresettedTodos);

      return result;
    }).then(() => {
      let allData = iDB.getAll(params.toDoListStore);
      allData.then((result) => {
        for (const toDoObject of result.reverse()) {
          const todoItem = toDoApp.createTodoItem(toDoObject);
          toDoApp.toDoList.append(todoItem);
        }
      });
    });
  }

  init() {
    const toDoApp = this;

    const { params } = toDoApp;

    toDoApp.todoAppTitle = toDoApp.createAppTitle();
    toDoApp.formObject = new Form(toDoApp.createTodoItemForm());
    const { formObject } = toDoApp;
    toDoApp.form = formObject.form;
    toDoApp.toDoList = toDoApp.createToDoList();

    toDoApp.container.classList.add(...params.defaultClasses.container);

    toDoApp.container.append(toDoApp.todoAppTitle);
    toDoApp.container.append(toDoApp.formContainer);
    toDoApp.container.append(toDoApp.toDoListContainer);

    const openedIDB = toDoApp.createIDB();
    toDoApp.addExistedToDos(openedIDB);

    formObject.addListener('submit', toDoApp.form, toDoApp.addNewToDoHandler.bind(toDoApp));
  }
}

export { ToDoApp };
