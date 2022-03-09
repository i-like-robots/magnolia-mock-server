# Magnolia Mock Server

This app allows you to quickly provide a copy of your CMS website content via a Magnolia-like API.

---

- [About](#about)
- [Getting started](#getting-started)
- [Troubleshooting](#troubleshooting)

---

## About

Running Magnolia can be painful for front-end developers. It requires setting up infrastructure and tools we are not always familiar with so when they go wrong - which they do - that can leave people stuck and frustrated. And things are not always easy even when the CMS is up and running because Magnolia consumes a very large amount of resources which are vastly disproportionate to the requirements that front-end developers have; fetching a few hundred kilobytes of data.

For this reason many devs will configure their apps to fetch data from a remote instance of Magnolia instead of a local one but this can also lead to problems because - as a CMS - the content is always changing!

This small Express application allows you to quickly serve a static copy of your JCR website content via a Magnolia-like API so you don't need to run Magnolia or depend upon a moving target.

## Getting started

### Requirements

To get started on working with the app, you'll need to make sure you have the following software tools installed.

- Git
- Node.js (version 14 or higher is required)
- npm

Please note that this project has only been tested in Mac and Linux environments. If you are on a Mac you may find it easiest to install the [Command Line Tools](https://developer.apple.com/download/more/) package which includes Git.

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

Yes, like the Magnolia delivery endpoint configuration you can filter my node type and tree depth.
