// The logic to load the javascript file of a package
// NOTICE that this is NOT part of neuron core

// server: 'http://localhost/abc',
// -> http://localhost/abc/<relative>
// @param {string} relative relative module url
function absolutizeURL (pathname) {
    var base = NEURON_CONF.path;
    if ( !base ) {
        throw new Error('neuron: config.path must be specified');
    }

    base = base.replace('{n}', pathname.length % 3 + 1 );

    return pathResolve(base, pathname);
}


// Generate absolute url of a certain id
// @param {string} id, standard identifier, such as '<name>@<version>'
function generateModuleURL (mod) {
    var combine = NEURON_CONF.combo;
    var pathname = combine
            // get combined pathname
            ? combine( getAllUnloadedSyncDeps(mod) )

            // otherwise, load the modules one by one
            : './' + (
                mod.main 
                    // if is a main module, we will load the source file by package
                    
                    // 1.
                    // on use: 'a@1.0.0' (async or sync)
                    // -> 'a/1.0.0/a.js'

                    // 2.
                    // on use: 'a@1.0.0/relative' (sync)
                    // -> not an async module, so the module is already packaged inside:
                    // -> 'a/1.0.0/a.js'
                    ? mod.pkg + '/' + mod.name

                    // if is an async module, we will load the source file by module id
                    : mod.id 

            ).replace('@', '/') + (NEURON_CONF.ext || '.js');

    return absolutizeURL(pathname);
}


// This function should be defined with neuron.config({combo: fn})
// neuron.conf.combo = 
// function generateComboURL (ids) {
//     return '../concat/' + ids.map(function (id) {
//         return id.replace(/\/|@/, '~') + '.js';
//     }).join(',');
// }


// Load the script file of a module into the current document
// @param {string} id module identifier
function loadByModule (mod) {
    var loaded = NEURON_CONF.loaded;
    // The whole package is not loaded
    if(! ~ loaded.indexOf(mod.pkg) ){
        loaded.push(mod.pkg);

    // If the main entrance of the package is already loaded 
    // and the current module is not an async module, skip loading.
    // see: declaration of `require.async`
    } else if ( !mod.async ) {
        return;
    }

    loadJS( generateModuleURL(mod) );
}


neuron.on('use', function(e) {
    !e.defined && loadByModule(e.mod);
});
