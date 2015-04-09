var WavesBuilder = (function () {
    function WavesBuilder() {
        var _this = this;
        this.waveTemplate = '<li><label>Wave {0}:</label> - <a class="wave-delete-btn" data-wave-id="{1}">delete</a><ul>{2}</ul></li>';
        this.actionTemplate = '<li>{0} - <a data-wave-id="{1}" data-action-id="{2}" class="action-delete-btn">delete</a></li>';
        this.waves = [];
        this.updateOutput();
        $("#addBtn").click(function () { return _this.addAction(); });
        $("#newWaveBtn").click(function () { return _this.addWave(); });
        $("#type").change(function () { return _this.onTypeChange(); });
        this.onTypeChange();
    }
    WavesBuilder.prototype.onTypeChange = function () {
        var type = $("#type").val();
        _.each(["time", "lane", "sameLane", "powerup", "enemy", "commentry", "noSkip", "quantity"], function (s) {
            $("#" + s).parent().hide();
        });
        if (type == "delay") {
            _.each(["time", "noSkip"], function (s) { return $("#" + s).parent().show(); });
        }
        else if (type == "spawn") {
            _.each(["lane", "powerup", "enemy", "sameLane", "quantity"], function (s) { return $("#" + s).parent().show(); });
        }
        else if (type == "commentate") {
            _.each(["commentry"], function (s) { return $("#" + s).parent().show(); });
        }
    };
    WavesBuilder.prototype.addAction = function () {
        if (this.waves.length == 0)
            this.waves.push({ actions: [] });
        var wave = this.waves[this.waves.length - 1];
        var type = $("#type").val();
        var action = { type: type };
        if (type == "delay") {
            if ($("#time").val() != '')
                action.time = parseFloat($("#time").val());
            if ($("#noSkip").is(':checked'))
                action.noSkip = true;
        }
        else if (type == "spawn") {
            if ($("#lane").val() != '')
                action.lane = parseInt($("#lane").val());
            if ($("#quantity").val() != '')
                action.quantity = parseInt($("#lane").val());
            if ($("#sameLane").is(':checked'))
                action.sameLane = true;
            if ($("#powerup").val() != '')
                action.powerup = $("#powerup").val();
            if ($("#enemy").val() != '')
                action.enemy = $("#enemy").val();
        }
        else if (type == "commentate") {
            if ($("#commentry").val() != '')
                action.commentry = $("#commentry").val();
        }
        wave.actions.push(action);
        this.updateOutput();
    };
    WavesBuilder.prototype.addWave = function () {
        this.waves.push({ actions: [] });
        this.updateOutput();
    };
    WavesBuilder.prototype.updateOutput = function () {
        var _this = this;
        $("#output").text(JSON.stringify(this.waves, null, 4));
        $("#wavesLst").empty();
        _.each(this.waves, function (w) {
            var actionsStr = "";
            _.each(w.actions, function (a) {
                actionsStr += Utils.format(_this.actionTemplate, JSON.stringify(a), _this.waves.indexOf(w), w.actions.indexOf(a));
            });
            var waveStr = Utils.format(_this.waveTemplate, _this.waves.indexOf(w), _this.waves.indexOf(w), actionsStr);
            $("#wavesLst").append(waveStr);
        });
        $(".action-delete-btn").click(function (e) { return _this.deleteAction(e); });
        $(".wave-delete-btn").click(function (e) { return _this.deleteWave(e); });
    };
    WavesBuilder.prototype.deleteAction = function (e) {
        var el = e.target;
        var actionId = parseInt(el.dataset["actionId"]);
        var waveId = parseInt(el.dataset["waveId"]);
        var wave = this.waves[this.waves.length - 1];
        wave.actions.splice(actionId, 1);
        this.updateOutput();
    };
    WavesBuilder.prototype.deleteWave = function (e) {
        var el = e.target;
        var waveId = parseInt(el.dataset["waveId"]);
        this.waves.splice(waveId, 1);
        this.updateOutput();
    };
    return WavesBuilder;
})();
$(function () { return new WavesBuilder(); });
