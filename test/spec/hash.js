describe("_use()", function() {

  it("load a package", function(done){
    facade({
      entry: 'range',
      data: function(n){
        expect(n).to.equal(1);
        done();
      }
    });
  });

  it("resolve a path", function(done){
    _use('range', function(range){
      range.resolve(function(resolved){
        expect(resolved).to.equal("mod/range/0.0.0/range_bea6bd50.js");
        done();
      });
    });
  });

  it("resolve a path without hash", function(done){
    _use('range', function(range){
      range.resolve_nohash(function(resolved){
        expect(resolved).to.equal("mod/range/0.0.0/range_nohash.js");
        done();
      });
    });
  });
});