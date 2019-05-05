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

Used [Express generator](https://expressjs.com/en/starter/generator.html) to setup a basic express app with pug templating engine
