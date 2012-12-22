var fs     = require('fs');
var path   = require('path');
var crypto = require('crypto');


/**
 * @param {String} file File to bust.
 * @param {Object} config Optional
 *    - outdir:   Directory to write new file to. Default is same as file.
 *    - prefix:   Prefix for new filename. Default is basename of file.
 *    - noprefix: Do not use a filename prefix.
 *    - encoding: Used by hasher. Defaults to utf8
 * @params {Function} callback(err, obj) where obj is a literal with info on the fingerprinted file.
 * @returns {undefined}
 * @api public
 */
module.exports = function busta(file, config, callback) {
  if (arguments.length < 3) {
    callback = arguments.length === 2
      ? arguments[1]
      : function(){};
    config = {};
  }
  config.file = file;

  processConfig(config);

  fs.readFile(config.file, function(err, contents) {
    if (err) return callback(err);

    var hash = hasher(contents.toString(config.encoding));
    var newfilename = createNewFilename(config, hash);

    fs.writeFile(newfilename, contents, function(err) {
      if (err) return callback(err);
      var absolute = path.resolve(newfilename);
      callback(err, {
        name: path.basename(absolute)
      , absolute: absolute
      , dir: path.dirname(absolute)
      , fingerprint: hash
      });
    });
  });

};


/**
 * @param {Object} config
 * @returns {undefined}
 * @api private
 */
function processConfig(config) {
  config.outdir   = config.outdir || path.dirname(config.file);
  config.ext      = path.extname(config.file);
  config.prefix   = config.prefix || path.basename(config.file, config.ext);
  config.noprefix = !!config.noprefix;
  config.encoding = config.encoding || 'utf8';
};


/**
 * @param {String} str
 * @returns {String} 32 char md5 hash
 * @api private
 */
function hasher(str) {
  return crypto
    .createHash('md5')
    .update(str)
    .digest('hex');
};


/**
 * @param {Object} config
 * @param {String} hash
 * @returns {String}
 * @api private
 */
function createNewFilename(config, hash) {
  var newfilename = hash + config.ext;
  if (!config.noprefix) newfilename = config.prefix + '-' + newfilename;
  return path.join(config.outdir, newfilename);
};
