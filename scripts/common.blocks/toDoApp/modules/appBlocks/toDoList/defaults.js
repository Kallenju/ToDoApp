/* eslint-disable import/prefer-default-export */

const defaults = {
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
};

export { defaults };
