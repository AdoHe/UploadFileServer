var options = require('../config/options'),
    path = require('path'),
    fs = require('fs'),
    _existsSync = fs.existsSync || path.existsSync,
    nameCountRegexp = /(?:(?: \(([\d]+)\))?(\.[^.]+))?$/,
    nameCountFunc = function (s, index, ext) {
      return ' (' + ((parseInt(index, 10) || 0) + 1) + ')' + (ext || '');
    };

function FileInfo (file) {
  this.name = file.name;
  this.size = file.size;
  this.type = file.type;
  this.deleteType = 'DELETE';
}

// Export FileInfo
module.exports = FileInfo;

/**
 * Validate file size&type
 *
 *
 */
FileInfo.prototype.validate = function () {
  if (options.minFileSize && options.minFileSize > this.size) {
    this.error = 'File is too small';
  } else if (options.maxFileSize && this.size > options.maxFileSize) {
    this.error = 'File is too large';
  } else if (!options.acceptFileTypes.test(this.type)) {
    this.error = 'File type not acceptable';
  }

  return !this.error;
}

/**
 * Ensure the file name safety
 *
 *
 */
FileInfo.prototype.safeName = function () {
  // Prevent directory traversal and creating hidden system files
  this.name = path.basename(this.name).replace(/^\.+/, '');
  // Prevent overwriting existing files
  while (_existsSync(options.uploadDir + '/' + this.name)) {
    this.name = this.name.replace(nameCountRegexp, nameCountFunc);
  }
}

FileInfo.prototype.initUrls = function (req) {
  if (!this.error) {
    var that = this,
      baseUrl = (options.ssl ? 'https:' : 'http:') +
        '//' + req.headers.host + options.uploadUrl;
    this.url = this.deleteUrl = baseUrl + encodeURIComponent(this.name);
    Object.keys(options.imageVersions).forEach(function (version) {
      if(_existsSync(
          options.uploadDir + '/' + version + '/' + that.name
      )) {
        that[version + 'Url'] = baseUrl + version + '/' + encodeURIComponent(that.name);
      }
    });
  }
}
