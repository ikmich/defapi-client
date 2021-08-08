# defapi-client

Client server for viewing [defapi](https://github.com/ikmich/defapi) api definitions.

## Dependencies

- [defapi](https://github.com/ikmich/defapi) defapi-client is a html client server particularly for projects in
  which [defapi](https://github.com/ikmich/defapi) is configured.

## CLI

You can use the `defapi-client` cli during local development to view the api definitions of your service project.

### Install

```shell
npm install -g defapi-client
```

### Usage

```shell
defapi-client serve

# Options
# --baseUri - The base uri of your service.
```

## Self Hosted Usage

1. Clone the repo
2. Create a `defapi.sources.js` file (see sample contents in `sample-defapi.sources.js`)
3. Fill the appropriate values for each of your api sources that you want to be captured by `defapi-client`
4. Make desired changes
5. Host the project any way you prefer.
