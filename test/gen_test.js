var couchdbDocGen = require('../src/clutteredCouch.js');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports['single'] = {
  'single doc, basic': function(test) {
    var size = 1000;
    var doc = couchdbDocGen.single({ size: size });

    test.expect(2);

    test.ok(Buffer.isBuffer(doc), 'got a buffer');
    test.strictEqual(Buffer.byteLength(doc.toString()), size, 'byte size');

    test.done();
  },
  'single doc, with id': function(test) {
    var size = 1000;
    var id = 'hi there';

    var doc = JSON.parse(couchdbDocGen.single({
      size: size,
      id: id
    }).toString());

    test.expect(2);

    test.strictEqual(typeof doc, 'object', 'got an object');
    test.strictEqual(doc._id, id, 'correct _id');

    test.done();
  },
  'single doc, with field name': function(test) {
    var size = 1000;
    var field = 'howdy';

    var doc = JSON.parse(couchdbDocGen.single({
      size: size,
      fieldName: field
    }));

    test.expect(1);

    test.ok(doc[field], 'field exists');

    test.done();
  }
};

exports['many'] = {
  'generate with defaults': function(test) {
    test.expect(1);

    test.strictEqual(couchdbDocGen.many().length, 10, 'array size');

    test.done();
  },
  'generate 100': function(test) {
    var num = 100;

    test.expect(1);

    test.strictEqual(couchdbDocGen.many(num).length, num, 'array size');

    test.done();
  },
  'generate 20 with id set': function(test) {
    var opts = { size: 100, id: 'hi there' };
    var docs = couchdbDocGen.many(20, opts);
    var i;

    test.expect(21);

    test.strictEqual(docs.length, 20, 'got 20');

    for(i in docs) {
      if(docs.hasOwnProperty(i)) {
        test.strictEqual(JSON.parse(docs[i])._id, opts.id, 'got a doc with the right _id');
      }
    }

    test.done();
  }
};
