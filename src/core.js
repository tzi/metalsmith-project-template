const path = require('path');
const looper = require('metalsmith-looper');

const projectUrl = 'https://example.com/';
const projectName = 'My Example';
const projectDescription = 'It will be so nice one day';

function toPath(file) {
  return looper.removeExtension(path.basename(file.$name));
}

module.exports = looper(function ({ createIndex, loopOnType, loopContent }) {
  createIndex('feed');

  loopOnType('page', function (file, { addIndex }) {
    file.fullSlug = file.slugName || `${toPath(file)}/`;
    if (file.layout === 'home.njk') {
      file.fullSlug = '';
    }
    if (path.extname(file.fullSlug) === '') {
      addIndex('feed', 'all');
    }
  });

  loopOnType('redirection', function (file, { required }) {
    required('title');
    required('from');
    required('to');
    file.from = file.from[0] === '/' ? file.from.slice(1) : file.from;
    file.fullSlug = file.from;
    file.redirectionURL = new URL(file.to, projectUrl).href;
  });

  loopContent(function (file, { move }) {
    file.url = projectUrl + file.fullSlug;
    file.projectUrl = projectUrl;
    file.projectName = projectName;
    file.projectDescription = projectDescription;
    move(file.fullSlug);
  });
});
