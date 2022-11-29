/* eslint-disable import/prefer-default-export */

const defaults = {
  owner: 'Я',
  appTitle: {
    appTitleTag: 'h2',
    titleText: 'Список дел',
    container: false,
    defaultClasses: {
      appTitleContainer: [],
      appTitleWrapper: [],
      title: ['mb-3', 'p-0'],
    },
  },
  addingForm: {
    container: false,
    inputGroup: true,
    defaultClasses: {
      formContainer: [],
      formWrapper: [],
      form: [],
      fieldset: ['mb-3', 'align-items-start'],
      legend: ['h5', 'mb-3'],
      label: ['form-label', 'visually-hidden'],
      input: ['form-control'],
      button: ['btn', 'btn-primary'],
      inputGroupWrapper: ['input-group'],
    },
  },
  toDoList: {
    container: false,
    defaultClasses: {
      toDoListContainer: ['col-sm-8', 'col-12', 'pe-sm-0', 'ps-sm-2', 'p-0'],
      toDoListWrapper: ['p-3', 'border', 'rounded', 'bg-white', 'shadow-sm'],
      list: ['list-group'],
      item: ['list-group-item', 'p-2', 'd-flex', 'justify-content-between', 'align-items-center'],
      itemSuccess: 'list-group-item-success',
      buttonGroup: ['btn-group', 'ms-3'],
      doneButton: ['btn', 'btn-success'],
      deleteButton: ['btn', 'btn-danger'],
    },
  },
  appContainer: {
    defaultClasses: {
      appContainer: ['container-fluid-with-paddings'],
      rowForMenuFormList: ['row'],
      containerForFormList: ['col-sm-8', 'col-12', 'pe-sm-0', 'ps-sm-2', 'p-0'],
      wrapperForFormList: ['p-3', 'border', 'rounded', 'bg-white', 'shadow-sm'],
    },
  },
  userInterface: {
    defaultClasses: {
      userInterfaceContainer: ['col-sm-4', 'col-12', 'mb-sm-0', 'mb-3', 'ps-sm-0', 'pe-sm-2', 'p-0'],
      userInterfaceWrapper: ['p-3', 'border', 'rounded', 'bg-white', 'shadow-sm'],
      list: ['list-group'],
      item: ['list-group-item', 'border-0'],
    },
    toDoDBsControl: {
      defaultClasses: {
        switchDBButtonWrapper: [],
        switchDBButtonSVG: ['d-block','w-100', 'h-auto', 'mb-1'],
        switchDBButton: ['btn', 'btn-primary'],
      },
    },
  },
  settings: {
    modulesToBeUsed: {
      db: {
        modulePath: './modules/dbs/toDoLStorage/index.js',
        exports: ['ToDoLStorage'],
      }
    },
  },
};

export { defaults };
