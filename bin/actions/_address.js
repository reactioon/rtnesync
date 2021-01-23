sys.actions._address = function() {

    wDataReturn = {};

    wDataReturn.way = "out";
    wDataReturn.status = "sucess";
    wDataReturn.msg = "loaded address node";

    wDataReturn.address_local = sys._config.ipAddressPublic;
    wDataReturn.address_public = sys._config.ipAddressPrivate;

    return wDataReturn;

}
