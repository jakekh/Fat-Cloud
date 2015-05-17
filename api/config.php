<?php
define('USINGSSL','http');            // If using HTTPS set to https otherwise leave as http.
define('LOGFILE','log.txt');

// Database configuration
define('DB_NAME', 'fatcloud');
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', 'root');

// jakekh creds:
// define('DB_NAME', 'fatcloud');
// define('DB_HOST', 'fatcloud.db.7784045.hostedresource.com');
// define('DB_USER', 'fatcloud');
// define('DB_PASS', 'Password1!');

ini_set("log_errors", 1);
ini_set("error_log", "logs/php-error.log");