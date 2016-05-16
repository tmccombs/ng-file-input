(function(global) {
    var map = {
        'app': 'app',
        'rxjs': 'node_modules/rxjs',
        '@angular': 'node_modules/@angular',
        'ng-file-input': 'node_modules/ng-file-input'
    };

    var packages = {
        'app': {main: 'App.js'},
        'rxjs': {defaultExtension: 'js'},
        'ng-file-input': {main: 'components.js', defaultExtension: 'js'}
    };

    var packageNames = [
        "@angular/common",
        "@angular/core",
        "@angular/compiler",
        "@angular/platform-browser",
        "@angular/platform-browser-dynamic",
    ];

    packageNames.forEach(function(name) {
        packages[name] = {main: 'index.js', defaultExtension: 'js'};
    });

    var config = {
        map: map,
        packages: packages
    };

    System.config(config);
})(this);
