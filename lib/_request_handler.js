var options = require('../config/options'),
    UploadHandler = require('./_upload_handler');

module.exports = function (req, res) {
  // Set headers
  res.setHeader(
      'Access-Control-Allow-Origin',
      options.accessControl.allowOrigin
  );

  res.setHeader(
      'Access-Control-Allow-Methods',
      options.accessControl.allowMethods
  );

  res.setHeader(
      'Access-Control-Allow-Headers',
      options.accessControl.allowHeaders
  );

  var handleResult = function (result, redirect) {
    if(redirect) {
    } else {
      res.writeHead(200, {
        'Content-Type': req.headers.accept
            .indexOf('application/json') !== -1 ?
                      'application/json' : 'text/plain'
      });
      res.end(JSON.stringify(result));
    }
  },
  setNoCacheHeaders = function () {
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Content-Disposition', 'inline; filename="files.json"');
  },
  handler = new UploadHandler(req, res, handleResult);

  switch (req.method) {
    case 'OPTIONS':
      res.end();
      break;
    case 'HEAD':
    case 'GET':
      if(req.url === '/') {
      } else {
      }
      break;
    case 'POST':
      setNoCacheHeaders();
      handler.post();
      break;
    case 'DELETE':
      handler.destory();
      break;
    default:
      res.statusCode = 405;
      res.end();
  }
}
