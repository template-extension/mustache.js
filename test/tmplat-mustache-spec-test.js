require('./helper');

var fs = require('fs');
var path = require('path');
var specsDir = path.join(__dirname, 'spec/specs');
var yaml = require('js-yaml');

var skipTests = {
  comments: [
    'Standalone Without Newline'
  ],
  delimiters: [
    'Standalone Without Newline'
  ],
  inverted: [
    'Standalone Without Newline'
  ],
  partials: [
    'Standalone Without Previous Line',
    'Standalone Without Newline',
    'Standalone Indentation'
  ],
  sections: [
    'Standalone Without Newline'
  ]
};

// You can run the skiped tests by setting the NOSKIP environment variable to
// true (e.g. NOSKIP=true mocha test/tmplat-mustache-spec-test.js)
var noSkip = process.env.NOSKIP;

// You can put the name of a specific test file to run in the TEST environment
// variable (e.g. TEST=interpolation mocha test/tmplat-mustache-spec-test.js)
var fileToRun = process.env.TEST;

// Mustache should work on node 0.6 that doesn't have fs.existsSync
function existsDir(path) {
  try {
    return fs.statSync(path).isDirectory();
  } catch (x) {
    return false;
  }
}

var specFiles;
if (fileToRun) {
  specFiles = [fileToRun];
} else if (existsDir(specsDir)) {
  specFiles = fs.readdirSync(specsDir).filter(function (file) {
    return (/\.yml$/).test(file);
  }).map(function (file) {
    return path.basename(file).replace(/\.yml$/, '');
  }).sort();
} else {
  specFiles = [];
}

function getSpecs(specArea) {
  return yaml.safeLoad(fs.readFileSync(path.join(specsDir, specArea + '.yml'), 'utf8'));
}

describe('Mustache spec compliance', function() {
  beforeEach(function () {
    Mustache.clearCache();
  });

  specFiles.forEach(function(specArea) {
    describe('- ' + specArea + ':', function() {
      var specs = getSpecs(specArea);
      specs.tests.forEach(function(test) {
        var it_ = (!noSkip && skipTests[specArea] && skipTests[specArea].indexOf(test.name) >= 0) ? it.skip : it;
        it_(test.name + ' - ' + test.desc, function() {
          var output = Mustache.render(test.template, test.data, test.partials);
          assert.equal(output, test.expected);
        });
      });
    });
  });
});
