define('range@0.0.0', [], function(require, exports, module){


module.exports = {
    init: function(callback) {
        // the wrong number
        callback(1);
    },
    resolve: function(callback){
        callback(require.resolve("./range.js"));
    },
    resolve_nohash: function(callback){
        callback(require.resolve("./range_nohash.js"));
    }
}


});