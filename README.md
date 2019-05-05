# What this is

The goal is to parse a `csv` file, that contains information on employees and shifts they work, and calculate their monthly wage (with consideration of evening working wage and overtime)

## How to get up and running

Clone repo, `cd` into it and:
```
  npm install && npm start
```
Webapp will be accessible on `http://localhost:3000`.

### To run tests:

```
  npm run watch-test
```

## Developer's notes

Used [Express generator](https://expressjs.com/en/starter/generator.html) to setup a basic express app

[Jest](https://jestjs.io/en/) (together with [ts-node](https://github.com/TypeStrong/ts-node)) was chose for unit tests

Used [pug](https://pugjs.org/api/getting-started.html) for the first time, as setting up React or something felt like overkill for this task

