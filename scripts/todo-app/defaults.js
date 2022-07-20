/* eslint-disable import/prefer-default-export */

const defaults = {
  defaultClasses: {
    container: ['container-fluid-with-paddings', 'mt-n2', 'mb-n2'],
    appTitle: {
      row: ['pb-2', 'pt-2', 'row', 'justify-content-center'],
      col: ['col-lg-6', 'col-12'],
      mainTag: ['mb-0', 'p-0', 'ps-3'],
    },
    formToAddANewToDo: {
      row: ['pb-2', 'pt-2', 'row', 'justify-content-center'],
      col: ['col-lg-6', 'col-12'],
      form: ['p-3', 'border', 'rounded', 'bg-white', 'shadow-sm'],
      fieldset: ['mb-3', 'align-items-start'],
      legend: ['h5', 'mb-3'],
      label: ['form-label', 'visually-hidden'],
      input: ['form-control'],
      button: ['btn', 'btn-primary'],
    },
    toDoList: {
      row: ['pb-2', 'pt-2', 'row', 'justify-content-center'],
      col: ['col-lg-6', 'col-12'],
      list: ['list-group', 'mb-0', 'p-3', 'border', 'rounded', 'bg-white', 'shadow-sm'],
      item: ['list-group-item', 'p-2', 'd-flex', 'justify-content-between', 'align-items-center'],
      itemSuccess: 'list-group-item-success',
      buttonGroup: ['btn-group', 'btn-group-sm'],
      doneButton: ['btn', 'btn-success'],
      deleteButton: ['btn', 'btn-danger'],
    },
  },
  appTitleTag: 'h2',
  indexedDB: {
    toDoListStore: 'toDoList',
    toDoId: 'name',
  },
};

export { defaults };
