import axios from 'axios';
import prettier from 'prettier';
import { writeFile, mkdir } from 'fs/promises';
import debug from 'debug';
import axiosDebug from 'axios-debug-log';
import Listr from 'listr';
import parseData, { getPathName, getRootPath } from './utils/parser.js';

const isDebugEnv = process.env.DEBUG;

const log = debug('page-loader');

axiosDebug({
  request(httpDebug, config) {
    httpDebug(`Request ${config.url}`);
  },
  response(httpDebug, response) {
    httpDebug(
      `Response with ${response.headers['content-type']}`,
      `from ${response.config.url}`,
    );
  },
});

const handleError = (error) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      throw new Error(`'${error.config.url}' request failed with status code ${error.response.status}`);
    } else {
      throw new Error(`The request was made at ${error.config.url} but no response was received`);
    }
  }
  throw error;
};

const loadResources = (links, rootPath) => {
  const tasks = new Listr(
    links.map((link) => {
      const fileName = getPathName(link, 'file');
      const outputPath = getRootPath(rootPath, fileName);
      const task = axios({
        method: 'get',
        url: link.href,
        responseType: 'arraybuffer',
      }).then((response) => {
        log(`Saving file ${fileName}`);
        writeFile(outputPath, response.data);
      }).catch(handleError);
      return { title: link.href, task: () => task };
    }),
    {
      concurrent: true,
      renderer: isDebugEnv && 'silent',
      exitOnError: false,
    },
  );
  return tasks.run();
};

export default (url, path) => {
  let data;
  let resultHtml;
  let linksResources;

  const resourcesDirName = getPathName(url, 'dir');
  const resourcesRootPath = getRootPath(path, resourcesDirName);

  const namePage = getPathName(url, 'page');
  const outputPath = getRootPath(path, namePage);

  log(`Getting request ${url}`);
  return axios.get(url)
    .then((response) => {
      data = response.data;
      log(`Making folder '${resourcesDirName}'`);
      return mkdir(resourcesRootPath);
    })
    .then(() => {
      log('Extracting and replace local urls');
      const { links, html } = parseData(data, url);
      linksResources = links;
      resultHtml = html;
    })
    .then(() => {
      log(`Downloading resources into ${resourcesRootPath}`);
      return loadResources(linksResources, resourcesRootPath);
    })
    .then(() => {
      log(`Saving resulted html '${namePage}'`);
      const prettifiedHtml = prettier.format(resultHtml, { parser: 'html' });
      return writeFile(outputPath, prettifiedHtml);
    })
    .then(() => {
      log('Successfully');
    })
    .catch(handleError);
};
