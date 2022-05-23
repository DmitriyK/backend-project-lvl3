
<div align="center">

[![Node CI](https://github.com/DmitriyK/page-loader/actions/workflows/nodejs.yml/badge.svg?branch=main)](https://github.com/DmitriyK/page-loader/actions/workflows/nodejs.yml)
[![Maintainability](https://api.codeclimate.com/v1/badges/7220ab3e507859c6232a/maintainability)](https://codeclimate.com/github/DmitriyK/backend-project-lvl3/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/7220ab3e507859c6232a/test_coverage)](https://codeclimate.com/github/DmitriyK/backend-project-lvl3/test_coverage)

</div>

## About Page Loader

This is a command line utility that downloads pages from the Internet and saves them to your computer. Together with the page, it downloads all assets (images, styles and js) making it possible to open the page without the Internet. The same principle is used to save pages in the browser.

## Requirements

- Node (v.16+)

## Install

```sh
git clone https://github.com/DmitriyK/page-loader.git
cd page-loader/
make install
make link
```

## Run tests

```sh
make test
make test-coverage
```

## Usage

```sh
Usage: page-loader [options] <url>

Downloads a page from the network and puts it in the specified directory

Options:
  -V, --version       output the version number
  -o, --output [dir]  output dir (default: "/home/user/current-dir")
  -h, --help          display help for command
```

## Examples

### Installing

### Workflow

### Debug
