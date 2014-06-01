var fs = require('fs'),
    path = require('path'),
    options = require('../config/options'),
    FileInfo = require('./_file_info'),
    formidable = require('formidable'),
    imageMagick = require('imagemagick'),
    cp = require('child_process');

function UploadHandler (req, res, callback) {
  this.req = req;
  this.res = res;
  this.callback = callback;
}

// Export upload handler
module.exports = UploadHandler;

/**
 * Handle file download
 *
 *
 */
UploadHandler.prototype.get = function () {
  var handler = this,
      files = [];
  fs.readdir(options.uploadDir, function (err, list) {
    list.forEach(function (name, index) {
      var stats = fs.statSync(options.uploadDir + '/' + name),
          fileInfo;
      if (stats.isFile() && name[0] !== '.') {
        fileInfo = new FileInfo({
          name: name,
          size: stats.size
        });
        fileInfo.initUrls(handler.req);
        files.push(fileInfo);
      }
    });
    handler.callback({files: files});
  });
}

/**
 * Handle file upload
 *
 *
 */
UploadHandler.prototype.post = function () {
  var handler = this,
      form = new formidable.IncomingForm(),
      tmpFiles = [],
      files = [],
      map = {},
      counter = 1,
      redirect,
      finish = function () {
        counter -= 1;
        if (!counter) {
          files.forEach(function (fileInfo) {
            fileInfo.initUrls(handler.req);
          });
          handler.callback({files: files}, redirect);
        }
      };
  form.uploadDir = options.tmpDir;
  form.on('fileBegin', function (name, file) {
    tmpFiles.push(file.path);
    var fileInfo = new FileInfo(file, handler.req, true);
    fileInfo.safeName();
    map[path.basename(file.path)] = fileInfo;
    files.push(fileInfo);
  }).on('field', function (name, value) {
    if (name === 'redirect') {
      redirect = true;
    }
  }).on('file', function (name, file) {
    var fileInfo = map[path.basename(file.path)];
    fileInfo.size = file.size;
    if (!fileInfo.validate()) {
      fs.unlink(file.path);
      return;
    }
    fs.renameSync(file.path, options.uploadDir + '/' + fileInfo.name);
    finish();
  }).on('aborted', function () {
    tmpFiles.forEach(function (file) {
      fs.unlink(file);
    });
  }).on('error', function (e) {
    console.log(e);
  }).on('progress', function (bytesReceived) {
    if (bytesReceived > options.maxPostSize) {
      handler.req.socket.destory();
    }
  }).on('end', function () {
    finish();
    var name = files[0].name;
    // Start a file worker to import data
    // into mongodb, in order to control
    // the child process number, the multiple
    // upload files should less than five
    cp.fork('./lib/_file_worker.js').send(name);
  }).parse(handler.req);
}

/**
 *
 *
 *
 */
UploadHandler.prototype.destory = function () {
}
