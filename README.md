<div align="center">
  <img alt="page-loader" title="page-loader" src="https://cdn-icons-png.flaticon.com/512/7044/7044013.png" width="150">
</div>

<div align="center">

[![Node CI](https://github.com/DmitriyK/page-loader/actions/workflows/nodejs.yml/badge.svg?branch=main)](https://github.com/DmitriyK/page-loader/actions/workflows/nodejs.yml)
[![Maintainability](https://api.codeclimate.com/v1/badges/7220ab3e507859c6232a/maintainability)](https://codeclimate.com/github/DmitriyK/backend-project-lvl3/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/7220ab3e507859c6232a/test_coverage)](https://codeclimate.com/github/DmitriyK/backend-project-lvl3/test_coverage)

</div>

## About Page Loader

This is a command line utility that downloads pages from the Internet and saves them to your computer. Together with the page, it downloads all assets (images, styles and js) making it possible to open the page without the Internet. The same principle is used to save pages in the browser.

## About project

This pet-project was created as part of the [Hexlet](https://ru.hexlet.io/programs/backend/projects/4) curriculum.

## Requirements

- Node (v.16+)

## Getting started

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

### Workflow

[![asciicast](https://asciinema.org/a/496822.svg)](https://asciinema.org/a/496822)

### Debug

[![asciicast](https://asciinema.org/a/496824.svg)](https://asciinema.org/a/496824)
