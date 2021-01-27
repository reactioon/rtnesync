
/**
 * Reactioon Exchange Sync
 * @author José Wilker <josewilker@reactioon.com>
 * @version 0.0.1
 */

const _settings = require('./_settings.json');
var initFile = "./apps/_license.json";
var updateFile = ".trigger.update";
let _config = {};

const fs = require('fs');
const uuid = require('uuid');
const ip = require("ip");
const WebSocket = require('ws');
const os = require('os-utils');
const extIP = require("ext-ip")();
const childProcess = require("child_process");
const chalk = require('chalk');

// sys core
require("../bin/sys.js");

// global packages
sys.pkg = {};
sys.pkg.fs = fs;
sys.pkg.uuid = uuid;
sys.pkg.ip = ip;
sys.pkg.os = os;
sys.pkg.websocket = WebSocket;
sys.pkg.extIP = extIP;
sys.pkg.childProcess = childProcess;
sys.pkg.chalk = chalk;

// global vars
sys._settings = _settings;
sys._initFile = initFile;
sys._updateFile = updateFile;
sys._config = _config;

// global preferences
sys._minutesToSendStats = 5;
sys._httpdPort = 3001;

sys.logs.type("log");

sys.load.init().then(function(){
    start();
});

/**
 * Loader
 */
async function start() {

    sys.load.helpers();

    sys.load.module('httpd');
    sys.load.module('websocket');

    server = sys.modules.httpd.load();
    websocket = sys.modules.websocket.load();

}
