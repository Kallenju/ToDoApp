/* eslint-disable no-console */
const { existsSync, readFileSync, writeFileSync } = require('fs');
const { createServer } = require('http');
const path = require('path');

const DB_FILE = path.resolve(__dirname, './db.json');
const URI_PREFIX = '/api/todos';

class TodoApiError extends Error {
  constructor(statusCode, data) {
    super();
    this.statusCode = statusCode;
    this.data = data;
  }
}

function drainJson(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      resolve(JSON.parse(data));
    });
  });
}

function makeTodoItemFromData(data) {
  const errors = [];

  const todoItem = {
    owner: data.owner && String(data.owner),
    ownerId: data.ownerId && String(data.ownerId),
    name: data.name && String(data.name),
    done: Boolean(data.done),
    toDoId: data.toDoId && String(data.toDoId),
  };

  if (!todoItem.owner)
    errors.push({ field: 'owner', message: 'Не указан ответственный' });
  if (!todoItem.name)
    errors.push({ field: 'name', message: 'Не указан заголовок задачи' });
  if (!todoItem.done) todoItem.done = false;

  if (errors.length) throw new TodoApiError(422, { errors });

  return todoItem;
}

function getTodoList(params = {}) {
  const todoList = JSON.parse(readFileSync(DB_FILE) || '[]');
  if (params.owner)
    return todoList.filter(({ owner }) => owner === params.owner);
  return todoList;
}

function createTodoItem(data) {
  const newItem = makeTodoItemFromData(data);
  writeFileSync(DB_FILE, JSON.stringify([...getTodoList(), newItem]), {
    encoding: 'utf8',
  });
  return newItem;
}

function getTodoItem(itemId) {
  const todoItem = getTodoList().find(({ toDoId }) => toDoId === itemId);
  if (!todoItem)
    throw new TodoApiError(404, { message: 'TODO Item Not Found' });
  return todoItem;
}

function updateTodoItem(itemId, data) {
  const todoItems = getTodoList();
  const itemIndex = todoItems.findIndex(({ toDoId }) => toDoId === itemId);
  if (itemIndex === -1)
    throw new TodoApiError(404, { message: 'TODO Item Not Found' });
  Object.assign(
    todoItems[itemIndex],
    makeTodoItemFromData({ ...todoItems[itemIndex], ...data })
  );
  writeFileSync(DB_FILE, JSON.stringify(todoItems), { encoding: 'utf8' });
  return todoItems[itemIndex];
}

function deleteTodoItem(itemId) {
  const todoItems = getTodoList();
  const itemIndex = todoItems.findIndex(({ toDoId }) => toDoId === itemId);
  if (itemIndex === -1)
    throw new TodoApiError(404, { message: 'TODO Item Not Found' });
  todoItems.splice(itemIndex, 1);
  writeFileSync(DB_FILE, JSON.stringify(todoItems), { encoding: 'utf8' });
  return {};
}

if (!existsSync(DB_FILE)) writeFileSync(DB_FILE, '[]', { encoding: 'utf8' });

createServer(async (req, res) => {
  if (req.url.startsWith('/api/todos')) {
    res.setHeader('Content-Type', 'application/json');

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PATCH, DELETE, OPTIONS'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.end();
      return;
    }

    if (!req.url || !req.url.startsWith(URI_PREFIX)) {
      res.statusCode = 404;
      res.end(JSON.stringify({ message: 'Not Found' }));
      return;
    }

    const [uri, query] = req.url.substr(URI_PREFIX.length).split('?');
    const queryParams = {};

    if (query) {
      // eslint-disable-next-line no-restricted-syntax
      for (const piece of query.split('&')) {
        const [key, value] = piece.split('=');
        queryParams[key] = value ? decodeURIComponent(value) : '';
      }
    }

    try {
      const body = await (async () => {
        if (uri === '' || uri === '/') {
          if (req.method === 'GET') return getTodoList(queryParams);
          if (req.method === 'POST') {
            const newTodoItem = createTodoItem(await drainJson(req));
            res.statusCode = 201;
            res.setHeader('Location', `${URI_PREFIX}/${newTodoItem.toDoId}`);
            return newTodoItem;
          }
        } else {
          const itemId = uri.substr(1);
          if (req.method === 'GET') return getTodoItem(itemId);
          if (req.method === 'PATCH')
            return updateTodoItem(itemId, await drainJson(req));
          if (req.method === 'DELETE') return deleteTodoItem(itemId);
        }
        return null;
      })();
      res.end(JSON.stringify(body));
    } catch (err) {
      if (err instanceof TodoApiError) {
        res.writeHead(err.statusCode);
        res.end(JSON.stringify(err.data));
      } else {
        res.statusCode = 500;
        res.end(JSON.stringify({ message: 'Server Error' }));
        console.error(err);
      }
    }
  } else if (req.url === '/' || req.url.endsWith('.html')) {
    let pageName = null;
    switch (req.url) {
      case '/dad.html': {
        pageName = '../dad.html';
        break;
      }
      case '/mom.html': {
        pageName = '../mom.html';
        break;
      }
      default: {
        pageName = '../index.html';
      }
    }

    res.writeHead(200, { 'Content-Type': 'text/html' });

    const html = readFileSync(path.resolve(__dirname, pageName), {
      encoding: 'utf8',
    });

    res.end(html);
  } else {
    let contentType = null;

    switch (req.url.match(/\.[0-9a-z]+$/)[0]) {
      case '.css': {
        contentType = 'text/css';
        break;
      }
      case '.js': {
        contentType = 'text/javascript';
        break;
      }
      case '.svg': {
        contentType = 'image/svg+xml';
        break;
      }
      default: {
        contentType = null;
      }
    }

    if (contentType) {
      res.writeHead(200, {
        'Content-Type': contentType,
      });

      const file = readFileSync(path.resolve(__dirname, `..${req.url}`), {
        encoding: 'utf8',
      });

      res.end(file);
    }
  }
})
  .on('listening', () => {
    console.log(
      `The TODO server is running. You can use it at http://localhost:3000`
    );
    console.log('Press CTRL+C to stop the server');
    console.log('Available methods:');
    console.log(
      `GET ${URI_PREFIX} - get to do list, query parameter owner filters by owner`
    );
    console.log(
      `POST ${URI_PREFIX} - create a new to do, you need to pass an object in the request body: { name: string, owner: string, done?: boolean }`
    );
    console.log(`GET ${URI_PREFIX}/{toDoId} - get a to do on it ID`);
    console.log(
      `PATCH ${URI_PREFIX}/{toDoId} - change a to do with ID, you need to pass an object in the request body: { name?: string, owner?: string, done?: boolean }`
    );
    console.log(`DELETE ${URI_PREFIX}/{toDoId} - delete a to do with ID`);
  })
  .listen(3000);
