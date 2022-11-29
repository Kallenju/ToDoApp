/* eslint-disable import/prefer-default-export */

const defaults = {
  dbNames: ['ToDoLStorage', 'ToDoRemoteServer','ToDoIDB'],
  alliasesForDBs: {
    ToDoLStorage: 'localStorage',
    ToDoRemoteServer: 'Node.js Server',
    ToDoIDB: 'indexedDB',
  },
  defaultClasses: {
    switchDBButtonWrapper: [],
    switchDBButtonSVG: ['d-block','w-100', 'h-auto', 'mb-1'],
    switchDBButton: ['btn', 'btn-primary'],
  },
};

export { defaults };
