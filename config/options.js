var path = require('path'),
    dirname = path.dirname(__dirname);

module.exports = {
  tmpDir: dirname + '/tmp',
  publicDir: dirname + '/public',
  uploadDir: dirname + '/public/files',
  uploadUrl: '/files/',
  maxPostSize: 11000000000, // 11 GB
  minFileSize: 1,
  maxFileSize: 10000000000, // 10 GB
  acceptFileTypes: /.+/i,
  // Files not matched by this regular expression force a download dialog,
  // to prevent executing any scripts in the context of the service domain:
  inlineFileTypes: /\.(gif|jpe?g|png)$/i,
  imageTypes: /\.(gif|jpe?g|png)$/i,
  imageVersions: {
      'thumbnail': {
          width: 80,
          height: 80
      }
  },
  accessControl: {
      allowOrigin: '*',
      allowMethods: 'OPTIONS, HEAD, GET, POST, PUT, DELETE',
      allowHeaders: 'Content-Type, Content-Range, Content-Disposition'
  },
  /* Uncomment and edit this section to provide the service via HTTPS:
  ssl: {
      key: fs.readFileSync('/Applications/XAMPP/etc/ssl.key/server.key'),
      cert: fs.readFileSync('/Applications/XAMPP/etc/ssl.crt/server.crt')
  },
  */
  nodeStatic: {
      cache: 3600 // seconds to cache served files
  },
  db: {
    name: 'odata',
    host: '127.0.0.1',
    port: '27017'
  }
}
