sys.actions._stats = function(envelope) {

    const os = sys.pkg.os;

    sysCPU = os.loadavg(5);
    sysMemoryPercentage = Math.round((os.freemem() * 100) / os.totalmem());
    sysPlatform = os.platform();
    sysUptime = os.sysUptime();
    sysMemoryTotal = os.totalmem();

    wDataReturn = {};

    wDataReturn.way = "out";
    wDataReturn.status = "sucess";
    wDataReturn.msg = "loaded stats node";
    wDataReturn.uid = sys._config.uid;

    if (envelope != undefined) {
        wDataReturn.sid = (envelope.sid != undefined) ? envelope.sid : sys._config.uid;
    }

    wDataReturn.body = {};
    wDataReturn.body.cpu = sysCPU;
    wDataReturn.body.memoryFreePercentage = sysMemoryPercentage; // Number(sysMemoryPercentage).toFixed(2);
    wDataReturn.body.memoryAllocatedPercentage = 100-sysMemoryPercentage;
    wDataReturn.body.memoryTotal = sysMemoryTotal;
    wDataReturn.body.platform = sysPlatform;
    wDataReturn.body.uptime = sys.helpers.secondsToHour(sysUptime);

    return wDataReturn;

}