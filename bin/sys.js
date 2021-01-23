sys = {
    returnEnvelope: function(ws, envelopeReturn) {
        ws.send(envelopeReturn);
    },
    returnJSON : function(json) {
        return JSON.stringify(json);
    },
    clearJSON : function(strKeyFile) {
        var replaceData = strKeyFile.replace(/\\/g, "");
        var clearData = replaceData.substring(1).slice(0,-1);
        return clearData.toString();
    },
    parseJSON: function(json) {
        return JSON.parse(json);
    },
    throwSuccess : function(res, data) {
        res.end(data);
    },
    throwError : function(res, error) {
        werror = (error == false) ? http.STATUS_CODES[405] : error;
        res.end("{\"error\": \"" + werror + "\"}");
    },
    isJSON: function(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    },
    isNode: function(envelope) {
        if (envelope.uid == sys._config.uid) {
            return true;
        }
        return false;
    }
};

sys.logs = {
    type: function(type) {
        sys.logs._type = (type != undefined) ? type : "log";
    },
    register: function(log) {
        type = (sys.logs._type != undefined) ? sys.logs._type : "log";
        switch(type) {
            case "log":
                console.log(log);
            break;
        }
    },
    normal: function(msg) {
        console.log(msg);
    },
    error: function(msg) {
        console.log(sys.pkg.chalk.red(msg));
    },
    success: function(msg) {
        console.log(sys.pkg.chalk.green(msg));
    },
    warning: function(msg) {
        console.log(sys.pkg.chalk.yellow(msg));
    },
    color: function(color, msg) {
        fcolor = chalk.keyword(color);
        console.log(fcolor(msg));
    }
};

sys.network = {
    getExternalIp: async function() {
        const externalIpAddress = await sys.pkg.extIP.get();
        return externalIpAddress;
    }
}

sys.timer = {
    set: function(topic, callback, seconds) {

        if (sys.timer.interval == undefined) {
            sys.timer.interval = [];
        }

        if (sys.timer.interval[topic] == undefined) {
            sys.timer.interval[topic] = "";
        }

        tseconds = seconds*1000;
        sys.timer.interval[topic] = setInterval(callback, tseconds);

    },
    unset: function(topic) {
        clearInterval(sys.timer.interval[topic]);
    }
}

sys.load = {
    _load: function(f,m) {
        pathLoad = "./" + f + "/" + m + ".js";
        require(pathLoad);
    },
    init: function() {

        return new Promise(async function(resolve, reject){

            // get ipaddress
            const ipAddressPublic = await sys.network.getExternalIp();

            const initExists = sys.pkg.fs.existsSync(sys._initFile);
            if (!initExists) {

                sys._config.uid = sys.pkg.uuid.v1();
                sys._config.auth = false;

                sys.logs.register("config file don't exists.");

            } else {

                var contentsFileConfig = sys.pkg.fs.readFileSync(sys._initFile);
                var strConfFile = contentsFileConfig.toString();
                sys._config = (sys.isJSON(strConfFile)) ? sys.parseJSON(strConfFile) : false;

                sys.logs.register("loaded config file.");

            }

            sys.logs.register("uid: " + sys._config.uid);

            sys._config.ipAddressPublic = sys.pkg.ip.address();
            sys._config.ipAddressPrivate = ipAddressPublic;
            sys._config.memTotal = sys.pkg.os.totalmem();
            sys._config.platform = sys.pkg.os.platform();

            sys.timer.set('checkIpAddressChange', function(){
                if (sys._config.ipAddressPrivate != sys.pkg.ip.address()) {
                    sys._config._updateAddressPrivate=true;
                }
            }, 10*60);

            resolve(sys._config);

        });

    },
    module: function(m) {

        sys.logs.register("loading module '" + m + "' ...");

        if (sys.modules == undefined) {
            sys.modules = {};
        }

        this._load('modules', m);

    },
    helpers: function(h) {

        sys.logs.register("loading helpers...");
        require("./helpers.js");

    },
    actions: function() {

        if (sys.actions == undefined) {

            sys.logs.register("loading actions...");

            sys.actions = {};

            directoryPathActions = "./bin/actions";
            sys.pkg.fs.readdir(directoryPathActions, function (err, files) {
                if (err) {
                    return console.log('Unable to scan directory: ' + err);
                }
                files.forEach(function (file) {
                    require("./actions/" + file);
                });
            });

        }

    }
};
