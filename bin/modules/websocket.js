var isConnected = false;

sys.modules.websocket = {
    connect: function() {

        const WebSocket = sys.pkg.websocket;
        const ws = new WebSocket("ws://" + sys._settings.socket_host + ":" + sys._settings.socket_port);

        return ws;

    },
    waitConnection: function() {
        var intervalConnection = setInterval(function(){
            if (!isConnected) {
                sys.logs.register("Trying connect on host...");
                sys.modules.websocket.load();
                clearInterval(intervalConnection);
                clearInterval(intervalStats);
            }
        }, 10000);
    },
    sendStats: function(ws) {

        minutesWait = sys._minutesToSendStats*60000;

        if (intervalStats == undefined) {

            var intervalStats = setInterval(function(){

                if (sys._config.auth) {

                    statsData = sys.actions._stats();
                    statsData.topic = "nodeStatsSave";
                    statsData.way = "in";

                    stringDocument = sys.returnJSON(statsData);
                    sys.returnEnvelope(ws, stringDocument);

                    dateNow = new Date();
                    sys.logs.success("[OUT-STATS] [...] Sending stats... " + dateNow);

                }

            }, minutesWait);

        }

        sys.logs.register("Enabled stats to send with '" + minutesWait + "' miliseconds.");

    },
    syncFileSend: function(ws, file, head, body, hash, strAction) {

        envelopeReturn = {};
        envelopeReturn.type = "unique";
        envelopeReturn.way = "in";
        envelopeReturn.topic = "esyncSend";
        envelopeReturn.uid = sys._config.uid;;
        envelopeReturn.tnode = 1;
        envelopeReturn.body = body;
        envelopeReturn.head = head;
        envelopeReturn.hash = hash;

        sys.returnEnvelope(ws, sys.returnJSON(envelopeReturn));

        sys.logs.success("[OUT-SYNC] [" + sys.helpers.hashFormat(hash) + "] " + head.exchange + " " + head.currency + " " + head.action);

        if (file) {
            sys.pkg.fs.unlinkSync(file);
        }

    },
    syncFileProcess: function(ws, path_file_saved, hash, strAction) {

        // basic info
        arrayInfoSync = strAction.split("|");

        action = arrayInfoSync[2];

        wHead = {};
        wHead.exchange = arrayInfoSync[0];
        wHead.currency = arrayInfoSync[1];
        wHead.action = action;
        wHead.date = arrayInfoSync[3];

        if (path_file_saved) {

            var strFileData = sys.pkg.fs.readFileSync(path_file_saved).toString();
            arrayDataToSend = (sys.isJSON(strFileData)) ? sys.parseJSON(strFileData) : false;

            strSend = "";

            totalSend = arrayDataToSend.length;

            if (!arrayDataToSend || totalSend == 0 || totalSend == undefined) { return false; }

            switch(action) {
                case "symbols":

                    y=0
                    arrayDataToSend.forEach(function(element, index){

                        if (index >= 1) {
                            strSend += "&";
                        }

                        wExchange = arrayInfoSync[0];

                        wSymbol = element.symbol;
                        wTickSize = element.tickSize;
                        wPair = wHead.currency;
                        wCurrency = element.currency;

                        strSend += "exchange[" + y + "]=" + wExchange + "&symbol[" + y + "]=" + wSymbol + "&ticksize[" + y + "]=" + wTickSize;
                        strSend += "&pair[" + y + "]=" + wPair + "&currency[" + y + "]=" + wCurrency;

                        if (element.quantityIncrement != undefined) {
                            strSend += "&quantityIncrement[" + y + "]=" + element.quantityIncrement;
                        }

                        if (element.quantityMinimal != undefined) {
                            strSend += "&quantityMinimal[" + y + "]=" + element.quantityMinimal;
                        }

                        y++;

                    });

                break;
                case "tickers":

                    y=0
                    arrayDataToSend.forEach(function(element, index){

                        if (index >= 1) {
                            strSend += "&";
                        }

                        wExchange = arrayInfoSync[0];
                        wSymbol = element.symbol;
                        wAsk = element.ask;
                        wBid = element.bid;
                        wLow = element.low;
                        wHigh = element.high;
                        wLast = element.last;
                        wVolume = element.volume;

                        strSend += "exchange[" + y + "]=" + wExchange + "&symbol[" + y + "]=" + wSymbol;
                        strSend += "&ask[" + y + "]=" + wAsk + "&bid[" + y + "]=" + wBid + "&low[" + y + "]=" + wLow;
                        strSend += "&high[" + y + "]=" + wHigh + "&last[" + y + "]=" + wLast + "&volume[" + y + "]=" + wVolume;

                        y++;

                    });

                break;
                case "candlesLast":

                    y=0;
                    arrayDataToSend.forEach(function(element, index){

                        if (index >= 1) {
                            strSend += "&";
                        }

                        wExchange = arrayInfoSync[0];
                        wSymbol = arrayInfoSync[1];

                        wOpen = element.open;
                        wHigh = element.high;
                        wLow = element.low;
                        wClose = element.close;
                        wVolume = element.volume;
                        wDateStart = element.date_start;
                        wDateEnd = element.date_end;

                        strSend += "exchange[" + y + "]=" + wExchange + "&symbol[" + y + "]=" + wSymbol;
                        strSend += "&open[" + y + "]=" + wOpen + "&high[" + y + "]=" + wHigh + "&low[" + y + "]=" + wLow + "&close[" + y + "]=" + wClose;
                        strSend += "&volume[" + y + "]=" + wVolume;
                        strSend += "&date_start[" + y + "]=" + wDateStart + "&date_end[" + y + "]=" + wDateEnd;

                        y++;

                    });

                break;
                case "candlesday":
                case "candlesmonth":

                    y=0
                    arrayDataToSend.forEach(function(element, index){

                        if (index >= 1) {
                            strSend += "&";
                        }

                        wExchange = arrayInfoSync[0];
                        wSymbol = element.symbol.symbol;
                        wPriceStart = element.prices.start;
                        wPriceEnd = element.prices.end;
                        wWay = element.prices.way;
                        wType = element.type;
                        wDateStart = element.prices.dateStart;
                        wDateEnd = element.prices.dateEnd;
                        wPercentage = element.prices.percentage;

                        strSend += "exchange[" + y + "]=" + wExchange + "&symbol[" + y + "]=" + wSymbol;
                        strSend += "&price_start[" + y + "]=" + wPriceStart + "&price_end[" + y + "]=" + wPriceEnd + "&way[" + y + "]=" + wWay;
                        strSend += "&type[" + y + "]=" + wType + "&date_start[" + y + "]=" + wDateStart + "&date_end[" + y + "]=" + wDateEnd + "&percentage[" + y+ "]=" + wPercentage;

                        y++;

                    });

                break;

            }

            sys.modules.websocket.syncFileSend(ws, path_file_saved, wHead, strSend, hash, strAction);

        } else {

            sys.modules.websocket.syncFileSend(ws, path_file_saved, wHead, false, hash, strAction);

        }

    },
    load: function() {

        fs = sys.pkg.fs;

        ws = this.connect();

        ws.on('error', function error(){});

        ws.on('open', function open() {

            isConnected = true;

            sys.logs.register("Requesting identify...");

            envelope = {};
            envelope.topic = "identify";
            envelope.way = "in";
            envelope.uid = sys._config.uid;
            envelope.tnode = 1;
            envelope.body = sys.returnJSON(sys._config);
            jsonEnvelope = sys.returnJSON(envelope);

            ws.send(jsonEnvelope);

        });

        ws.on('close', function close() {

            ws.terminate();
            sys._config.auth = false;

            isConnected = false;
            sys.modules.websocket.waitConnection();

            sys.logs.register("the host is offline.");

        });

        ws.on('message', function incoming(envelope) {

            if (sys.isJSON(envelope)) {

                objEnvelope = sys.parseJSON(envelope);

                if (sys.isNode(objEnvelope)) {

                    objReturnAction = {};

                    requestType = objEnvelope.type;

                    switch(requestType) {

                        case "unique":

                            topic = objEnvelope.topic;

                            switch(topic) {

                                case "stars":

                                    sys.logs.register("STAAAAARSSS!!!");

                                break;
                                case "stats":

                                    documentStats = sys.actions._stats(objEnvelope);
                                    stringDocument = sys.returnJSON(documentStats);
                                    sys.returnEnvelope(ws, stringDocument);

                                break;
                                case "identify":
                                case "identifyRefresh":

                                    sys._config.auth = objEnvelope.auth;

                                    if (objEnvelope.auth) {

                                        if (!fs.existsSync(sys._initFile)) {
                                            fs.writeFileSync(sys._initFile, sys.returnJSON(sys._config), 'utf8');
                                        }

                                        sys.logs.register("authenticated.");

                                        sys.modules.websocket.sendStats(ws);

                                    } else {

                                        sys.logs.register("can't authenticate. uid:" + sys._config.uid);

                                    }

                                    if (objEnvelope.msg) {
                                        sys.logs.register(objEnvelope.msg);
                                    }

                                    if (topic == "identifyRefresh" && fs.existsSync(sys._initFile)) {

                                        objEnvelope.way = "out";
                                        objEnvelope.status = "sucess";
                                        objEnvelope.msg = "license added and node authenticated.";

                                        sys.returnEnvelope(ws, sys.returnJSON(objEnvelope));

                                    }

                                break;
                                case "esync":

                                    if (sys._config.auth) {

                                        envelopeReturn = objEnvelope;
                                        bodyEnvelope = sys.parseJSON(objEnvelope.body);

                                        if (bodyEnvelope.exchange && bodyEnvelope.currency && bodyEnvelope.action) {

                                            hash = envelopeReturn.hash;

                                            // execute command
                                            we = bodyEnvelope.exchange;
                                            wc = bodyEnvelope.currency;
                                            wa = bodyEnvelope.action;
                                            wexp = bodyEnvelope.expire;

                                            pathDEMON = sys._settings.path_demon;
                                            execCommand = "cd " + pathDEMON + "; php run.php resync/all 0 'currency=" + wc + "&exchange=" + we + "&action=" + wa + "&hash=" + hash + "&expire=" + wexp + "&returnFormat=json'";

                                            sys.logs.warning("[ IN-SYNC] [" + sys.helpers.hashFormat(hash) + "] " + we + " " + wc + " " +  wa);

                                            sys.pkg.childProcess.exec(execCommand, function(error, stdout, stderr){

                                                // if (error) {
                                                //     console.log(error);
                                                // }

                                                // if (stderr) {
                                                //     console.log(stderr);
                                                // }

                                                // console.log(stdout);
                                                // console.log(sys.isJSON(stdout));

                                                if (sys.isJSON(stdout)) {

                                                    jsonReturnData = sys.parseJSON(stdout);

                                                    if (jsonReturnData.file_saved == undefined) {
                                                        jsonReturnData.file_saved = false;
                                                    }

                                                    sys.modules.websocket.syncFileProcess(ws, jsonReturnData.file_saved, jsonReturnData.hash, jsonReturnData.action);

                                                }

                                            });

                                        }

                                    }

                                break;

                            }

                        break;
                    }

                } else {

                    error = objEnvelope.uid + ":0:1";
                    sys.returnEnvelope(ws, error);

                }

            }

        });

    }

}
