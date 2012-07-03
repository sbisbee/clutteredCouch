/*
 * Generates a Buffer of a doc with one field in it.
 *
 * opts = {
 *   size: <byte including JSON markup>,
 *   id: <optional, the doc's _id>,
 *   fieldName: <optional, string for the field name>
 * }
 *
 * size defaults to 10k
 * id defaults to null, causing couchdb to generate an _id
 * fieldName defaults to "bwah"
 */
exports.single = function(opts) {
  var doc;
  var offset = 0;

  if(!opts.size) {
    throw new Error('No size provided');
  }

  doc = new Buffer(opts.size);

  offset += doc.write('{', 'utf8');

  if(!opts.fieldName) {
    opts.fieldName = 'bwah';
  }
  else if(typeof opts.fieldName !== 'string') {
    throw new Error('Invalid field name type (must be a string).');
  }

  if(opts.id) {
    if(typeof opts.id !== 'string') {
      throw new Error('Invalid id type (must be a string).');
    }

    offset += doc.write('"_id":"' + opts.id + '",', 'utf8', offset);
  }

  offset += doc.write('"' + opts.fieldName + '":"', 'utf8', offset);

  doc.fill('h', offset);
  doc.write('"}', 'utf8', opts.size - 2);

  return doc;
};

exports.many = function(num, opts) {
  var docs = [];

  if(!num) {
    num = 10;
  }

  if(!opts) {
    opts = { size: 1000 };
  }

  while(docs.length < num) {
    docs.push(this.single(opts));
  }

  return docs;
};
