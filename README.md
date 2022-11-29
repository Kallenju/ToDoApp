# To Do

This is my pet project.

Here I have implemented a 'To Do' application.

The feature of this application is that it is possible to switch todos storage: `localStorage`, `indexedDB`, or 'some server database'.

Moreover, the settings are saved after closing the page.
So, after reopening the page, todos from the last selected storage will be loaded.

The code required for work is loaded dynamically - as needed.

I've promisified `localStorage` to work the same as `indexedDB`, which I've promisified as well.

## Start

To run the example run the following command:

```shell
npm start
```
