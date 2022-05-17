import os from 'os';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import path from 'path';
import nock from 'nock';
import prettier from 'prettier';
import pageLoader from '../src/index.js';

const link = 'https://ru.hexlet.io/';
const scope = nock(link);

const filePath = fileURLToPath(import.meta.url);
const getFixturesFilesPath = (name) => path.join(path.dirname(filePath), '..', '__fixtures__', name);
const getRootPath = (dirpath, filename) => path.join(dirpath, 'ru-hexlet-io-courses_files', filename);
const getPathName = (dirpath, filename) => path.join(dirpath, filename);

let beforeHtml;
let expectedValues;

beforeAll(async () => {
  beforeHtml = await fs.readFile(getFixturesFilesPath('before.html'), 'utf-8');
  expectedValues = {
    html: await fs.readFile(getFixturesFilesPath('after.html'), 'utf-8'),
    png: await fs.readFile(getFixturesFilesPath('/assets/nodejs.png')),
    css: await fs.readFile(getFixturesFilesPath('/assets/application.css')),
    js: await fs.readFile(getFixturesFilesPath('/assets/runtime.js')),
    canonical: await fs.readFile(getFixturesFilesPath('/assets/canonical.html'), 'utf-8'),
  };
});

let tmpDir;

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
});

test('page loader', async () => {
  scope
    .get('/courses')
    .reply(200, beforeHtml)
    .get('/assets/professions/nodejs.png')
    .reply(200, expectedValues.png)
    .get('/assets/application.css')
    .reply(200, expectedValues.css)
    .get('/courses')
    .reply(200, expectedValues.canonical)
    .get('/packs/js/runtime.js')
    .reply(200, expectedValues.js);

  await pageLoader('https://ru.hexlet.io/courses', tmpDir);

  const html = await fs.readFile(getPathName(tmpDir, 'ru-hexlet-io-courses.html'), 'utf-8');
  const png = await fs.readFile(getRootPath(tmpDir, 'ru-hexlet-io-assets-professions-nodejs.png'));
  const css = await fs.readFile(getRootPath(tmpDir, 'ru-hexlet-io-assets-application.css'));
  const js = await fs.readFile(getRootPath(tmpDir, 'ru-hexlet-io-packs-js-runtime.js'));
  const canonical = await fs.readFile(getRootPath(tmpDir, 'ru-hexlet-io-courses.html'), 'utf-8');

  expect(html).toEqual(prettier.format(expectedValues.html, { parser: 'html' }));
  expect(png).toEqual(expectedValues.png);
  expect(css).toEqual(expectedValues.css);
  expect(js).toEqual(expectedValues.js);
  expect(canonical).toEqual(expectedValues.canonical);

  scope.done();
});

describe('Should trow errors', () => {
  test('Reguest errors', async () => {
    scope
      .get('/no-response')
      .replyWithError('Wrong url!')
      .get('/404')
      .reply(404)
      .get('/500')
      .reply(500);

    await expect(pageLoader('https://ru.hexlet.io/no-response', tmpDir)).rejects.toThrow('The request was made at https://ru.hexlet.io/no-response but no response was received');
    await expect(pageLoader('https://ru.hexlet.io/404', tmpDir)).rejects.toThrow('\'https://ru.hexlet.io/404\' request failed with status code 404');
    await expect(pageLoader('https://ru.hexlet.io/500', tmpDir)).rejects.toThrow('\'https://ru.hexlet.io/500\' request failed with status code 500');

    scope.done();
  });

  test('File operations errors', async () => {
    scope
      .get('/')
      .twice()
      .reply(200);

    await expect(pageLoader('https://ru.hexlet.io', '/private')).rejects.toThrow('EACCES: permission denied, mkdir \'/private/ru-hexlet-io_files\'');
    await expect(pageLoader('https://ru.hexlet.io', '/notExistingFolder')).rejects.toThrow('ENOENT: no such file or directory, mkdir \'/notExistingFolder/ru-hexlet-io_files\'');

    scope.done();
  });
});
