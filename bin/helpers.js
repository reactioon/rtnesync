sys.helpers = {

    secondsToHour : function(d) {

        d = Number(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);

        var hd = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
        var md = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
        var sd = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";

        return hd + md + sd;

    },
    hashFormat: function(hash) {
        var wHash = hash;
        prefix = wHash.substr(0,6);
        sufix = wHash.substr(wHash.length-6,wHash.length);
        return prefix + "..." + sufix;
    }

}
