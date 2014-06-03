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
        db.collection(collection + 's', function (err, col) {
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
              // Close the db connection
              db.close();
              var doc = docs[0],
                  properties = {
                  };
              Object.keys(doc).forEach(function (key) {
                if (key === '_id') {
                } else {
                  properties[key] = {'type': 'string', 'nullable': false};
                }
              });
              console.dir(properties);
              // Save the entity
              var newEntity = new Entity(collection, 'CSV_Project', collection + '.csv',
                  collection, 'daily', 'prod', properties, 'completed', count);
              newEntity.save(function (err) {
                console.log(err);
              });
            });
          });
        });
      } else {
      }
    });
  });
}
