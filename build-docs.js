const toc = require('markdown-toc');
const jsdoc2md = require('jsdoc-to-markdown');
const fs = require('fs');

const seperator = '<!-- AUTO_GENERATED_API_SECTION -->';

const updateAPISection = (apiMarkdown) => {
  const readme = fs.readFileSync('README.md', 'utf8');
  const split = readme.split(seperator);
  fs.writeFileSync('README.md', [
    split[0],
    seperator,
    '\n',
    apiMarkdown,
    '\n',
    seperator,
    split[2],
  ].join(''),
  );
};

const updateTOC = () => {
  const readme = fs.readFileSync('README.md', 'utf8');
  const readmeWithTOC = toc.insert(readme, {
    slugify: str => str
        .replace('<code>', '')
        .replace('</code>', '')
        .replace(/[^\w\s]*/g, '')
        .replace(/\s/g, '-')
        .toLowerCase(),
  });
  fs.writeFileSync('README.md', readmeWithTOC);
};

jsdoc2md.render({
  files: 'src/*.js',
  configure: './jsdoc-conf.json',
  'heading-depth': 3,
  'module-index-format': 'none',
  'global-index-format': 'none',
  separators: true,
}).then((apiMarkdown) => {
  updateAPISection(apiMarkdown);
  updateTOC();
});
