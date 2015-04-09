var CaptchasManager = (function () {
    function CaptchasManager() {
        this.localChunks = [];
        this.remoteChunks = [];
    }
    CaptchasManager.prototype.init = function () {
        var _this = this;
        // Catch text entry
        $("#gameScreen .entry .pass-btn").click(function () { return _this.pass(); });
        $("#gameScreen .entry .submit-btn").click(function () { return _this.testTextEntry(); });
        $("#gameScreen .entry input").on("keydown", function (event) {
            if (event.which == 13)
                _this.testTextEntry();
        });
    };
    CaptchasManager.prototype.startNewLevel = function (level) {
        this.captchasSucceeded = 0;
        this.updatePassButton();
        this.confusedTimeMuliplier = 1;
        this.attemptsNotSent = [];
        // First refresh our local chunks list
        this.localChunks = this.getLocalChunks();
        // If this isnt the first level then shuffle up the entries a little
        //if (level.index != 0)
        //this.entries = <CaptchaEntry[]>_.shuffle(this.entries);
        // Make the new ones
        this.constructCaptchas(level);
    };
    CaptchasManager.prototype.getLocalChunks = function () {
        // Grab the local page and make a copy
        var inData = smorball.resources.getResource("local_ocr_page_data");
        // Construct the spritesheet if we havent already
        if (inData.spritesheet == null) {
            var ssData = smorball.resources.getResource("captchas_json");
            ssData.images = [smorball.resources.getResource("captchas_jpg")];
            inData.spritesheet = new createjs.SpriteSheet(ssData);
            // Set the parent in each chunk (for easy reference later);
            _.each(inData.differences, function (d) { return d.page = inData; });
        }
        return inData.differences.slice().reverse();
    };
    CaptchasManager.prototype.constructCaptchas = function (level) {
        var _this = this;
        this.captchas = [];
        // Making a captcha for each lane needed
        _.each(level.lanes, function (lane) {
            var captcha = new Captcha(lane);
            _this.captchas.push(captcha);
            smorball.screens.game.captchas.addChild(captcha);
        });
    };
    CaptchasManager.prototype.showCaptchas = function () {
        _.each(this.captchas, function (c) { return c.visible = true; });
    };
    CaptchasManager.prototype.hideCaptchas = function () {
        _.each(this.captchas, function (c) { return c.visible = false; });
    };
    CaptchasManager.prototype.refreshCaptcha = function (lane) {
        var captcha = _.find(this.captchas, function (c) { return c.lane == lane; });
        for (var i = 0; i < 100; i++) {
            captcha.setChunk(this.getNextChunk());
            var width = captcha.getWidth();
            console.log("Captcha width", width, "Max width", smorball.config.maxCaptchaSize);
            if (width < smorball.config.maxCaptchaSize)
                break;
        }
    };
    CaptchasManager.prototype.getNextChunk = function () {
        // If its a tutorial level then we need to use a speacially prepared list
        if (smorball.game.levelIndex == 0)
            return this.localChunks.pop();
        else {
            // If there arent any chunks remaining then just chunk our local store in there 
            if (this.remoteChunks.length == 0)
                return Utils.randomOne(this.localChunks);
            // Else lets return back one
            return Utils.randomOne(this.remoteChunks);
        }
    };
    CaptchasManager.prototype.update = function (delta) {
        if (this.isLocked) {
            this.lockedTimer += delta;
            if (this.lockedTimer >= smorball.config.penaltyTime * this.confusedTimeMuliplier)
                this.unlock();
        }
    };
    CaptchasManager.prototype.pass = function () {
        var _this = this;
        // Decrement the number of passes remaining
        smorball.game.passesRemaining--;
        // Set new entries for the visible captcahs
        _.chain(this.captchas).filter(function (c) { return c.chunk != null; }).each(function (c) { return c.setChunk(_this.getNextChunk()); });
        this.updatePassButton();
    };
    CaptchasManager.prototype.updatePassButton = function () {
        if (smorball.game.passesRemaining == 0) {
            $("#gameScreen .entry .pass-btn").prop("disabled", true).text("PASS");
        }
        else {
            $("#gameScreen .entry .pass-btn").text("PASS (" + smorball.game.passesRemaining + ")");
        }
    };
    CaptchasManager.prototype.testTextEntry = function () {
        // Cant test if the game is not running
        if (smorball.game.state != 2 /* Playing */)
            return;
        // Grab the text and reset it ready for the next one
        var text = $("#gameScreen .entry input").val();
        $("#gameScreen .entry input").val("");
        // Check for cheats first
        if (this.checkForCheats(text))
            return;
        // Get the visible captchas on screen 
        var visibleCapatchas = _.filter(this.captchas, function (c) { return c.chunk != null; });
        // If there are no visible then lets just jump out until they are
        if (visibleCapatchas.length == 0)
            return;
        // Log
        console.log("Comparing text", text, _.map(this.captchas, function (c) { return c.chunk; }));
        // Convert them into a form that the closestWord algo needs
        var differences = _.map(visibleCapatchas, function (c) { return c.chunk; });
        // Slam it through the library
        var output = new closestWord(text, differences);
        output.text = text;
        console.log("Comparing inputted text against captchas", text, output);
        // Increment and send if neccessary
        if (!output.closestOcr.page.isLocal) {
            this.attemptsNotSent.push(output);
            if (this.attemptsNotSent.length > 4)
                this.sendInputsToServer();
        }
        // Handle success
        if (output.match) {
            // Which was the selected one?
            var captcha = _.find(visibleCapatchas, function (c) { return c.chunk == output.closestOcr; });
            this.onCaptchaEnteredSuccessfully(text, captcha);
        }
        else
            this.onCaptchaEnterError();
    };
    CaptchasManager.prototype.onCaptchaEnteredSuccessfully = function (text, captcha) {
        var _this = this;
        // Hide the current captcha
        captcha.clear();
        // Show the indicator
        smorball.screens.game.indicator.showCorrect();
        // This is needed as the Breakfast Club powerup is dependant on the length of the captcha
        var damageMultiplier = 1;
        if (text.length > 8 && smorball.upgrades.isOwned("breakfast"))
            damageMultiplier = smorball.upgrades.getUpgrade("breakfast").multiplier;
        // If we have the bullhorn powerup selected then send all athletes running
        var powerup = smorball.screens.game.selectedPowerup;
        if (powerup != null) {
            // Play a sound
            smorball.audio.playSound("word_typed_correctly_sound");
            // If its a bullhorn then send every athlete in the 
            if (powerup.type == "bullhorn") {
                _.chain(smorball.game.athletes).filter(function (a) { return a.state == 1 /* ReadyToRun */; }).each(function (a) { return _this.sendAthleteInLane(a.lane, damageMultiplier); });
            }
            else
                this.sendAthleteInLane(captcha.lane, damageMultiplier);
            // Decrement the powerup
            smorball.powerups.powerups[powerup.type].quantity--;
            if (smorball.powerups.powerups[powerup.type].quantity == 0)
                smorball.screens.game.selectPowerup(null);
        }
        else {
            // Play a sound
            smorball.audio.playSound("word_typed_correctly_with_powerup_sound");
            this.sendAthleteInLane(captcha.lane, damageMultiplier);
        }
    };
    CaptchasManager.prototype.onCaptchaEnterError = function () {
        var _this = this;
        this.lock();
        // Play a sound
        smorball.audio.playSound("word_typed_incorrectly_sound");
        // Show the indicator
        smorball.screens.game.indicator.showIncorrect();
        var visibleCapatchas = _.filter(this.captchas, function (c) { return c.chunk != null; });
        // So long as we arent running the first level then lets refresh all the captchas
        if (smorball.game.levelIndex != 0) {
            _.each(visibleCapatchas, function (c) { return _this.refreshCaptcha(c.lane); });
        }
    };
    CaptchasManager.prototype.sendAthleteInLane = function (lane, damageMultiplier) {
        // Start the athlete running
        var athelete = _.find(smorball.game.athletes, function (a) { return a.lane == lane && a.state == 1 /* ReadyToRun */; });
        athelete.damageMultiplier = damageMultiplier;
        athelete.run();
        // Spawn another in the same lane
        smorball.spawning.spawnAthlete(lane);
    };
    CaptchasManager.prototype.checkForCheats = function (text) {
        if (text.toLowerCase() == "win level") {
            smorball.game.enemiesKilled = smorball.spawning.enemySpawnsThisLevel;
            smorball.game.enemyTouchdowns = Math.round(Math.random() * (smorball.config.enemyTouchdowns - 1));
            smorball.game.gameOver(true);
            return true;
        }
        else if (text.toLowerCase() == "loose level") {
            smorball.game.enemiesKilled = Math.round(Math.random() * smorball.spawning.enemySpawnsThisLevel);
            smorball.game.enemyTouchdowns = smorball.config.enemyTouchdowns;
            smorball.game.gameOver(false);
            return true;
        }
        else if (text.toLowerCase() == "win all levels") {
            smorball.game.enemiesKilled = Math.round(Math.random() * smorball.spawning.enemySpawnsThisLevel);
            smorball.game.enemyTouchdowns = smorball.config.enemyTouchdowns;
            smorball.user.cash += 99999;
            for (var i = 0; i < smorball.game.levels.length; i++)
                smorball.user.levelWon(i);
            smorball.game.gameOver(true);
            return true;
        }
        else if (text.toLowerCase() == "increase cleats") {
            smorball.powerups.powerups.cleats.quantity++;
            return true;
        }
        else if (text.toLowerCase() == "increase helmets") {
            smorball.powerups.powerups.helmet.quantity++;
            return true;
        }
        else if (text.toLowerCase() == "increase bullhorns") {
            smorball.powerups.powerups.bullhorn.quantity++;
            return true;
        }
        else if (text.toLowerCase() == "spawn powerup") {
            smorball.powerups.spawnPowerup(Utils.randomOne(_.keys(smorball.powerups.types)), Utils.randomOne(smorball.game.level.lanes));
            return true;
        }
        return false;
    };
    CaptchasManager.prototype.lock = function () {
        // Disable all the inputs
        $("#gameScreen .entry .submit-btn").prop("disabled", true);
        $("#gameScreen .entry input").prop("disabled", true);
        $("#gameScreen .entry .pass-btn").prop("disabled", true);
        // Shake them
        Utils.shake($("#gameScreen .entry input"));
        // Make the athletes play their confused animations
        _.each(smorball.game.athletes, function (a) {
            if (a.state == 1 /* ReadyToRun */)
                a.sprite.gotoAndPlay("confused");
        });
        // After some time enable them again
        this.lockedTimer = 0;
        this.isLocked = true;
    };
    CaptchasManager.prototype.unlock = function () {
        $("#gameScreen .entry .submit-btn").prop("disabled", false);
        $("#gameScreen .entry input").prop("disabled", false);
        if (smorball.game.passesRemaining > 0)
            $("#gameScreen .entry .pass-btn").prop("disabled", false);
        // Focus the input again
        $("#gameScreen .entry input").focus();
        // Make the athletes return to normal
        _.each(smorball.game.athletes, function (a) {
            if (a.state == 1 /* ReadyToRun */)
                a.sprite.gotoAndPlay("idle");
        });
        // Not locked any more
        this.isLocked = false;
    };
    CaptchasManager.prototype.sendInputsToServer = function () {
        var _this = this;
        // Convert it into the format needed by the server
        var data = {
            differences: _.map(this.attemptsNotSent, function (a) {
                return { _id: a.closestOcr._id, text: a.text };
            })
        };
        // Make a copy of the attempts not sent and reset the list ready for the next send
        var attempts = this.attemptsNotSent.slice();
        this.attemptsNotSent = [];
        $.ajax({
            type: 'PUT',
            dataType: 'json',
            processData: false,
            contentType: 'application/json',
            crossDomain: true,
            url: smorball.config.DifferenceAPIUrl,
            data: JSON.stringify(data),
            timeout: 10000,
            success: function (data) {
                console.log("data sent to DifferenceAPI success!", data);
            },
            error: function (err) {
                console.log("difference API error:", err);
                // If we get an error, add these attempts back into the list
                _this.attemptsNotSent = _this.attemptsNotSent.concat(attempts);
            },
            headers: { "x-access-token": smorball.config.PageAPIAccessToken }
        });
    };
    CaptchasManager.prototype.loadPageFromServer = function () {
        var _this = this;
        $.ajax({
            url: smorball.config.PageAPIUrl,
            success: function (data) { return _this.parsePageAPIData(data); },
            headers: { "x-access-token": smorball.config.PageAPIAccessToken },
            timeout: smorball.config.PageAPITimeout
        });
    };
    CaptchasManager.prototype.parsePageAPIData = function (data) {
        var _this = this;
        console.log("OCRPage loaded, loading image..", data);
        // This seems to be the only way I can get the CORS image to work
        var image = new Image();
        image.src = data.url;
        image.onload = function () {
            console.log("IMAGE LOADED!", image);
            var ssData = {
                frames: [],
                images: []
            };
            _.each(data.differences, function (d) {
                var x = d.coords[3].x - 1;
                var y = d.coords[3].y - 1;
                var w = d.coords[1].x - d.coords[3].x + 2;
                var h = d.coords[1].y - d.coords[3].y + 2;
                d.frame = ssData.frames.length;
                d.page = data;
                ssData.frames.push([x, y, w, h]);
                _this.remoteChunks.push(d);
            });
            ssData.images = [image];
            data.spritesheet = new createjs.SpriteSheet(ssData);
        };
    };
    return CaptchasManager;
})();
