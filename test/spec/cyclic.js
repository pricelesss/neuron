describe("Cyclic Dependencies: reference", function(){
  it("should not run factory more than once", function(done){

    var count_a = 1;
    define('cyclic@1.1.0/a.js', ['cyclic@1.1.0/index.js'], function(require, exports, module, __filename, __dirname){
      if (count_a ++ > 1) {
        throw 'Booooooooom, cyclic@1.1.0/a.js runs more than once';
      }

      var main = require('./');
      module.exports = main;
      module.exports.a = true;
    }, {
      map: {
        './': 'cyclic@1.1.0/index.js'
      }
    });

    var count_index = 1;
    define('cyclic@1.1.0/index.js', ['cyclic@1.1.0/a.js'], function(require, exports, module, __filename, __dirname){
      if (count_index ++ > 1) {
        throw 'Booooooooom, cyclic@1.1.0/index.js runs more than once';
      }

      exports.one = 1;
      var a = require('./a');
      module.exports = {
        a: a
      };

    }, {
      main: true,
      map: {
        './a': 'cyclic@1.1.0/a.js'
      }
    });

    _use('cyclic@1.1.0', function (mod) {
      expect(mod.a).to.deep.equal({
        one: 1,
        a: true
      });
      expect('one' in mod).to.equal(false);
      done();
    });
  });
});