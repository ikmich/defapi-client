# defapi-client

Client server for viewing [defapi](https://github.com/ikmich/defapi) api definitions.

## Prerequisites

#### [defapi](https://github.com/ikmich/defapi)

Core library for defining your api endpoints to be viewed by `defapi-client`. Install `defapi` in your api project. See
the [README](https://github.com/ikmich/defapi#readme) for usage info.

```shell
$ npm install defapi
```

# CLI

You can use the `defapi-client` cli during local development to view the api definitions of your service project.

### Install

```shell
$ npm install defapi-client
```

### Usage

```shell
$ defapi-client serve

# Options
# --baseUri - The base uri of your service.
# --port - The preferred port on which to serve your api definitions
```

# Self Hosted Usage

1. Clone the repo
2. Run: `$ defapi-client init`. This creates a `defapi.sources.js` file (see `sample-defapi.sources.js` for sample
   contents).
3. Edit the `defapi.sources.js` file for each of your api sources that you want to be captured by `defapi-client`. You
   might consider using environment variables to determine what urls will be configured for each source based on the
   target environment (e.g. development, staging or production).
4. Make other desired changes to the project (names, docker setups, other configuration).
5. Host your `defapi-client` project.

# Change Logs

### 0.1.0-beta

- `$ defapi-client init` command to create the sources file.
- `defapi.sources.js` - Specify `baseUri` of the source instead of `manifestUrl`. `manifestUrl` is now **discarded**
  from `defapi.sources.js`.
- `$ defapi-client serve` - Allow user to specify preferred port by passing `--port` option.
- Client: Link to refresh api manifest
