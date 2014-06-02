var db = require('../config/db'),
    Entity = require('../schema/Entity'),
    options = require('../config/options');

exports.update = function (collection, callback) {
  // Establish connection to db
  db.open(function (err, db) {
    if (err) {
      return callback(err);
    }

    // Authenticate
    db.authenticate(options.db.adminName, options.db.adminPwd, function (err, result) {
      if (result) {
        // Fetch the collection
        db.collection(collection, function (err, col) {
          if (err) {
            // Close db connection
            db.close();
            return callback(err);
          }

          // Count the collection
          col.count(function (err, count) {
            if (err) {
              // Close db connection
              db.close();
              return callback(err);
            }
            // Fetch one document
            col.find({}, {limit: 1}).toArray(function (err, docs) {
              var doc = docs[0],
                  entity = {
                    EntityName: collection,
                    ProjectName: 'CSV_Project',
                    Source: collection + '.csv',
                    Table: collection,
                    Cache: 'daily',
                    Env: 'prod',
                    Properties: {},
                    Status: 'completed',
                    RowCount: count
                  };
              Object.keys(doc).forEach(function (key) {

              });
            });
          });
        });
      } else {
      }
    });
  });
}
