import * as cheerio from 'cheerio';
import path from 'path';

const resoursesObj = {
  img: 'src',
  link: 'href',
  script: 'src',
};

const prettifyFileName = (filePath) => filePath
  .replace(/\/$/, '')
  .replace(/\.html$/, '')
  .replace(/[^a-zA-Z\d]/gi, '-');

const mapping = {
  page: (pathName) => `${prettifyFileName(pathName)}.html`,
  file: (pathName) => {
    const { dir, ext, name } = path.parse(pathName);
    const fileWithoutExt = path.join(dir, name);
    return `${prettifyFileName(fileWithoutExt)}${ext || '.html'}`;
  },
  dir: (pathName) => `${prettifyFileName(pathName)}_files`,
};

export const getRootPath = (rootPath, nameResourse) => path.join(rootPath, nameResourse);

export const getPathName = (url, type) => {
  const { hostname, pathname } = new URL(url);
  const pathName = path.join(hostname, pathname);
  return mapping[type](pathName);
};

export default (data, url) => {
  const originUrl = new URL(url);
  const $ = cheerio.load(data, { decodeEntities: false });

  const normalize = (link) => new URL(link, url);

  const links = Object.entries(resoursesObj)
    .reduce((acc, [tag, attr]) => {
      $(tag).each((i, el) => {
        const link = $(el).attr(attr);
        if (link !== undefined) {
          const linkResourse = normalize(link);
          if (originUrl.origin === linkResourse.origin) {
            const fileName = getPathName(linkResourse, 'file');
            const outputDir = getPathName(originUrl, 'dir');
            const rootPathResourse = getRootPath(outputDir, fileName);
            $(el).attr(attr, rootPathResourse);
            acc.push(linkResourse);
          }
        }
      });
      return acc;
    }, []);

  const html = $.html();

  return { links, html };
};
