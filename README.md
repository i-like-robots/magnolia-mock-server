# Magnolia Mock Server

This CLI tool allows you to quickly provide a copy of your CMS content via a Magnolia-like API.

```bash
npx magnolia-mock-server ./content
# Server running at http://localhost:5000
```

---

- [About](#about)
- [Installation](#installation)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)

---

## About

Running Magnolia can be painful for front-end developers. It requires setting up infrastructure and tools we are not always familiar with so when they go wrong - which they do, a lot - that can leave people stuck and frustrated. And things are not always easy even when the CMS is up and running because Magnolia consumes a very large amount of resources which are vastly disproportionate to the requirements that front-end developers have; fetching a small amounts of data!

For this reason many devs will configure their apps to fetch data from a remote instance of Magnolia instead of a local one but this can also lead to problems because - as a CMS - the content is always changing!

This small tool allows you to quickly serve a static copy of your JCR website content via a Magnolia-like API so you no longer need to run Magnolia or depend on a moving target.

## Installation

This is a [Node.js] module available through the [npm] registry. Node 14 or above is required.

Installation is done using the [npm install] command:

```sh
$ npm install -D magnolia-mock-server
```

[node.js]: https://nodejs.org/
[npm]: http://npmjs.com/
[npm install]: https://docs.npmjs.com/getting-started/installing-npm-packages-locally

## Usage

### Command line

You can use the tool to serve a directory of YAML files containing your content using `npx` (which is a tool installed by default with npm):

```bash
npx magnolia-mock-server --port 5000 ./content
```

Once [configured](#options) and running you can access the API via one of its [endpoints](#endpoints).

### Node.js

You can also use the tool programmatically by importing it into your JavaScript code:

```js
const bootstrap = require("magnolia-mock-server");

try {
  await bootstrap(options);
} catch (err) {
  console.error(err);
}
```

### Options

When using this tool via the CLI or in your Node.js modules it can be configured with a number of options. Most of the available options are analogous to Magnolia's [delivery API configuration](https://docs.magnolia-cms.com/product-docs/6.2/Developing/API/Delivery-API.html#_properties).

| Option         | Type     | Description                                                      |
|----------------|----------|------------------------------------------------------------------|
| port           | number   | Port number to run the mock server on. (default: 5000)           |
| sourceDir      | string   | Path to the directory containing your YAML files.                |
| rootPath       | string   | The root path of this endpoint. (default: "pages")               |
| depth          | number   | Specifies how deep the node tree will be traversed. (default: 0) |
| nodeTypes      | string[] | A comma-separated list of allowed node types for depth-0 nodes.  |
| childNodeTypes | string[] | A comma-separated list of allowed node types for child nodes.    |

If using the CLI use `npx magnolia-mock-server --help` to view more usage information.

### Endpoints

- Query nodes: http://localhost:5000/.rest/delivery/pages/ (not implemented)
- Read node: http://localhost:5000/.rest/delivery/pages/{path}
- Get children: http://localhost:5000/.rest/delivery/pages/{path}/@nodes

### Project setup

1. Clone the Git repository and change to the new directory that has been created:

   ```bash
   git clone git@github.com:i-like-robots/magnolia-mock-server
   cd magnolia-mock-server
   ```

2. Install all of the project dependencies using npm:

   ```bash
   npm install
   ```

3. Copy your website data files (usually named `website.{namespace}.yaml`) into the `content/` folder:

   ```bash
   cp ../magnolia-cms/website.example-site.yaml content/
   ```

4. You can now start and visit the running application:

   ```bash
   npm start
   ```

   Then open http://localhost:5000/.rest/delivery/pages/ in your browser.

## Troubleshooting

### Why can't I access the query endpoint?

This is not currently implemented, you can only fetch nodes and children of nodes.

### Does this app support JCR data saved as XML?

No, the app only supports JCR data saved in YAML format.

### Can I configure the node depth and node types to return?

Yes, like the Magnolia delivery endpoint configuration you can filter by node type, child node type, and tree depth.
