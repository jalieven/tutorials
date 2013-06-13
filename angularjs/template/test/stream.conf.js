// Karma configuration
// Generated on Thu Jun 13 2013 12:13:30 GMT+0200 (CEST)


// base path, that will be used to resolve files and exclude
basePath = '../static';


// list of files / patterns to load in the browser
files = [
    JASMINE,
    JASMINE_ADAPTER,
    'js/vendor/jquery.min.js',
    'js/vendor/bootstrap.min.js',
    'js/vendor/bootstrap-datetimepicker.min.js',
    'js/vendor/moment.min.js',
    'js/vendor/angular.min.js',
    'js/stream.js',
    '../test/js/vendor/angular-mocks.js',
    '../test/js/*.unit.js',
    'partial/datetimepicker.html'
];

preprocessors = {
    'partial/datetimepicker.html': 'html2js'
}


// list of files to exclude
exclude = [

];


// test results reporter to use
// possible values: 'dots', 'progress', 'junit'
reporters = ['junit'];


// web server port
port = 9876;


// cli runner port
runnerPort = 9100;


// enable / disable colors in the output (reporters and logs)
colors = true;


// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_DEBUG;


// enable / disable watching file and executing tests whenever any file changes
autoWatch = true;


// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = [
    'Firefox'
//    'Chrome'
];


// If browser does not capture in given timeout [ms], kill it
captureTimeout = 60000;


// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;
