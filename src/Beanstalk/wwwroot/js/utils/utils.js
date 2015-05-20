var Utils = (function () {
    function Utils() {
    }
    Utils.deparam = function (qs) {
        // remove any preceding url and split
        var parts = qs.substring(qs.indexOf('?') + 1).split('&');
        var params = {}, pair, d = decodeURIComponent, i;
        for (i = parts.length; i > 0;) {
            pair = parts[--i].split('=');
            params[d(pair[0])] = d(pair[1]);
        }
        return params;
    };
    Utils.format = function (format) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return format.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
    Utils.zeroPad = function (num, places) {
        var zero = places - num.toString().length + 1;
        return Array(+(zero > 0 && zero)).join("0") + num;
    };
    Utils.randomOne = function (array) {
        return array[Math.floor(Math.random() * array.length)];
    };
    ///
    // Borrowed from: http://erlycoder.com/105/javascript-weighted-random-value-from-array
    ///
    Utils.weightedRandomOne = function (array, weights) {
        var normalisedWeights = new Array();
        var sum = 0;
        for (var i = 0; i < array.length; i++) {
            sum += weights[i];
            normalisedWeights[i] = sum;
        }
        for (var i = 0; i < array.length; i++) {
            normalisedWeights[i] = normalisedWeights[i] / sum;
        }
        var needle = Math.random();
        var high = normalisedWeights.length - 1;
        var low = 0;
        while (low < high) {
            var probe = Math.ceil((high + low) / 2);
            if (normalisedWeights[probe] < needle)
                low = probe + 1;
            else if (normalisedWeights[probe] > needle)
                high = probe - 1;
            else
                return array[probe];
        }
        // Return corner cases
        if (low != high)
            return array[(normalisedWeights[low] >= needle) ? low : probe];
        else
            return array[(normalisedWeights[low] >= needle) ? low : low + 1];
    };
    Utils.popRandomOne = function (array) {
        if (array.length == 0)
            return null;
        var indx = Math.floor(Math.random() * array.length);
        return array.splice(indx, 1)[0];
    };
    Utils.centre = function (obj, horizontally, vertically) {
        if (horizontally === void 0) { horizontally = true; }
        if (vertically === void 0) { vertically = true; }
        if (horizontally)
            obj.x = beanstalk.config.width / 2 - obj.getBounds().width / 2;
        if (vertically)
            obj.y = beanstalk.config.height / 2 - obj.getBounds().height / 2;
    };
    Utils.shake = function (jq) {
        var l = 20;
        for (var i = 0; i < 10; i++)
            jq.animate({ 'margin-left': "+=" + (l = -l) + 'px' }, 50);
    };
    Utils.formatTime = function (seconds) {
        seconds = Math.floor(seconds);
        var minutes = Math.floor(seconds / 60);
        seconds -= minutes * 60;
        return this.zeroPad(minutes, 2) + ":" + this.zeroPad(seconds, 2);
    };
    Utils.getGetOrdinal = function (n) {
        var s = ["th", "st", "nd", "rd"], v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };
    Utils.getNameFromEmail = function (email) {
        return email.split("@")[0];
    };
    Utils.limitChange = function (val, target, change) {
        if (val < target)
            val = Math.min(val + change, target);
        else if (val > target)
            val = Math.max(val - change, target);
        return val;
    };
    Utils.randomRange = function (min, max) {
        return min + Math.random() * (max - min);
    };
    Utils.truncate = function (val, len) {
        if (val.length > len - 3)
            return val.substr(0, len - 3) + "..";
        return val;
    };
    return Utils;
})();
