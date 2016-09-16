// Karma configuration for unit tests

module.exports = function (config) {
    config.set({

        preprocessors: {
            'app/component_templates/*.html': ['ng-html2js']
        },

        // base path, that will be used to resolve files and exclude
        basePath: '',


        // frameworks to use
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            'app/lib/jquery/jquery-1.11.1.min.js',
            'app/lib/perfect-scrollbar/perfect-scrollbar.min.js',
            'app/lib/angular/angular.min.js',
            'app/lib/angular-ui-layout/ui-layout.js',
            'app/lib/angular-perfect-scrollbar/angular-perfect-scrollbar.js',
            'app/lib/angular-mocks/angular-mocks.js',
            'app/component_templates/*.html',
            'app/scripts/app.js',
            'app/scripts/directives/status-bar.js',
            'app/scripts/**/*.js',
			'test/unit/**/*.js'
        ],


        // list of files to exclude
        exclude: [

        ],


        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['Chrome','Firefox','IE'],


        plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-ie-launcher',
            'karma-jasmine',
            'karma-ng-html2js-preprocessor'
        ],

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,


        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: true,

        ngHtml2JsPreprocessor: {
            stripPrefix: 'app/',
            moduleName: 'my.templates'
        },
    });
};
