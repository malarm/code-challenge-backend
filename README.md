# Wineandbarrels backend boilerplate

Node.js backend boilerplate for wineandbarrels code challenge.

## Getting started

1. Fork repository
2. Add a `.env` file in root of repository with retrieved secret values.
3. Run `npm install`
4. Execute `npm run dev`

## Pevino API

Pevino uses a SOAP api as documented [here](https://help.hostedshop.dk/integration-via-api/)
We have implemented the beginnings of a pevino library function [here](./lib/pevino), which handles authentication.

## Local database

Note that we are using an in-memory database ([tyrdb](https://github.com/Alex-Werner/TyrDB)), and as such it will be cleared on application restart. Feel free to replace this with a database of your choosing.