var CaptchaManager = (function () {
    function CaptchaManager() {
        this.localChunks = [];
        this.remoteChunks = [];
        this.attemptsNotSent = [];
        this.captchasSucceeded = 0;
    }
    CaptchaManager.prototype.init = function () {
        var _this = this;
        $("#gameScreen button.submit").click(function () { return _this.testTextEntry(); });
        $("#gameScreen button.pass-btn").click(function () { return _this.pass(); });
        // Only if we are debugging do we allow the auto-grow-cheat
        if (beanstalk.config.debug)
            $("#gameScreen .hud .height").click(function () { return _this.onCaptchaEnteredSuccessfully(); });
        this.input = $("#gameScreen .hud .bottom-hud input");
        this.input.on("keydown", function (event) { return _this.onKeyDown(event); });
        window.onkeydown = function (event) {
            if (beanstalk.game.state == 1 /* Playing */)
                _this.input.focus();
        };
        this.attemptsNotSent = [];
        window.onbeforeunload = function () { return _this.sendInputsToServer(); };
        this.localChunks = this.getLocalChunks();
        this.captcha = new Captcha(Utils.randomOne(this.localChunks));
        beanstalk.screens.game.captchaContainer.addChild(this.captcha);
        this.captcha.visible = true;
        this.refreshCaptcha();
        // Load some remote chunks now
        this.loadPageFromServer();
    };
    CaptchaManager.prototype.onKeyDown = function (event) {
        if (event.which == 13)
            this.testTextEntry();
        else if (event.which == 8)
            beanstalk.audio.playSound("text_entry_backspace_sound");
        else if (event.which == 32)
            beanstalk.audio.playSound("type_spacebar_simple_02_sound");
        else
            beanstalk.audio.playSound("type_letter_simple_02_sound");
    };
    CaptchaManager.prototype.pass = function () {
        this.refreshCaptcha();
        //this.onCaptchaEnteredSuccessfully();
    };
    CaptchaManager.prototype.newGameStarted = function () {
        this.captchasSucceeded = 0;
        this.attemptsNotSent = [];
        this.input.val("");
        this.captcha.visible = true;
        this.localChunks = this.getLocalChunks();
        this.refreshCaptcha();
    };
    CaptchaManager.prototype.getLocalChunks = function () {
        // Grab the local page and make a copy
        var inData = beanstalk.resources.getResource("local_ocr_page_data");
        // Construct the spritesheet if we havent already
        if (inData.spritesheet == null) {
            var ssData = beanstalk.resources.getResource("captchas_json");
            ssData.images = [beanstalk.resources.getResource("captchas_jpg")];
            inData.spritesheet = new createjs.SpriteSheet(ssData);
            // Set the parent in each chunk (for easy reference later);
            _.each(inData.differences, function (d) { return d.page = inData; });
        }
        return inData.differences.slice().reverse();
    };
    CaptchaManager.prototype.refreshCaptcha = function () {
        for (var i = 0; i < 100; i++) {
            // Grab the next chunk from the stack
            var nextChunk = this.getNextChunk();
            console.log("Next captcha pulled from stack, isLocal:", nextChunk.page.isLocal, nextChunk);
            // Ensure that the chunk isnt too wide
            this.captcha.scaleX = this.captcha.scaleY = 1;
            this.captcha.setChunk(nextChunk);
            // If the new size of the captch is too small in either dimension then lets discard it
            if (this.captcha.getBounds().width < beanstalk.config.minCaptchaPixelSize || this.captcha.getBounds().height < beanstalk.config.minCaptchaPixelSize) {
                console.log("Cannot use captcha, width or height is less than minimum Captcha pixel size", this.captcha.getBounds(), beanstalk.config.minCaptchaPixelSize);
                continue;
            }
            // Lets check the pre-scaled size of the captcha to anything too big
            var width = this.captcha.getWidth();
            if (width > beanstalk.config.maxCaptchaSize) {
                // If the chunk is too wide then lets see if we should scale it down or not
                var L = this.getAverageTextLength(nextChunk);
                var result = Math.min(width, beanstalk.config.maxCaptchaSize) / L;
                // If the result is less than a specific constant value then throw out this word and try another
                if (result < beanstalk.config.captchaScaleLimitConstantN) {
                    console.log("Cannot use captcha, its too wide compared to contant! result:", result);
                    continue;
                }
                // Else lets scale the captcha down some
                var scale = beanstalk.config.maxCaptchaSize / width;
                console.log("Scaling captcha down to:", scale);
                this.captcha.scaleX = this.captcha.scaleY = scale;
                // If the new size of the captch is too small in either dimension then lets discard it
                if (this.captcha.getBounds().width < beanstalk.config.minCaptchaPixelSize || this.captcha.getBounds().height < beanstalk.config.minCaptchaPixelSize) {
                    console.log("Cannot use captcha, width or height is less than minimum Captcha pixel size", this.captcha.getBounds(), beanstalk.config.minCaptchaPixelSize);
                    continue;
                }
            }
            // If we get here then we are done
            this.captcha.animateIn();
            break;
        }
    };
    CaptchaManager.prototype.getAverageTextLength = function (chunk) {
        var len = 0;
        _.each(chunk.texts, function (t) { return len += t.length; });
        return len / chunk.texts.length;
    };
    CaptchaManager.prototype.getNextChunk = function () {
        // If there arent any chunks remaining then just chunk our local store in there 
        if (this.remoteChunks.length == 0)
            return Utils.randomOne(this.localChunks);
        // Else lets return back one
        var chunk = Utils.popRandomOne(this.remoteChunks);
        // If there is nothing left in there lets grab another page
        if (this.remoteChunks.length == 0)
            this.loadPageFromServer();
        // Return the chunk popped
        return chunk;
    };
    CaptchaManager.prototype.update = function (delta) {
    };
    CaptchaManager.prototype.testTextEntry = function () {
        // Cant test if the game is not running
        //if (smorball.game.state != GameState.Playing) return;
        // Grab the text and reset it ready for the next one
        var text = this.input.val();
        if (text == null || text == "")
            return; // skip if no text entered
        this.input.val("");
        // Check for cheats first
        if (this.checkForCheats(text))
            return;
        // If there are no visible then lets just jump out until they are
        if (!this.captcha.visible)
            return;
        // Log
        console.log("Comparing text", text, this.captcha.chunk);
        // Slam it through the library
        var output = new closestWord(text, [this.captcha.chunk]);
        output.text = text;
        console.log("Comparing inputted text against captchas", text, output);
        // Increment and send if neccessary
        if (!output.closestOcr.page.isLocal) {
            this.attemptsNotSent.push(output);
            if (this.attemptsNotSent.length > beanstalk.config.entriesBeforeServerSubmission)
                this.sendInputsToServer();
        }
        // Handle success or error
        if (output.match)
            this.onCaptchaEnteredSuccessfully();
        else
            this.onCaptchaEnterError();
    };
    CaptchaManager.prototype.onCaptchaEnteredSuccessfully = function () {
        this.refreshCaptcha();
        var plant = beanstalk.screens.game.plant;
        if (plant.isSeeding)
            return;
        else if (plant.isAtMaxHeight()) {
            plant.growTop();
            beanstalk.user.height += beanstalk.config.metersPerStalk;
        }
        else if (plant.isReadyToLock()) {
            plant.lockStalks();
            plant.growStalk(true);
            beanstalk.user.height += beanstalk.config.metersPerStalk;
        }
        else {
            plant.growStalk();
            beanstalk.user.height += beanstalk.config.metersPerStalk;
        }
    };
    CaptchaManager.prototype.onCaptchaEnterError = function () {
        var plant = beanstalk.screens.game.plant;
        beanstalk.user.height -= plant.witherUnlocked() * beanstalk.config.metersPerStalk;
        this.refreshCaptcha();
        Utils.shake(this.input);
        this.input.focus();
    };
    CaptchaManager.prototype.checkForCheats = function (text) {
        if (text.toLowerCase() == "win level") {
            return true;
        }
        return false;
    };
    CaptchaManager.prototype.sendInputsToServer = function () {
        var _this = this;
        // Dont send anything if there arent enoughv to send!
        if (this.attemptsNotSent.length == 0)
            return;
        console.log("sending difference inputs to sever..");
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
            url: beanstalk.config.DifferenceAPIUrl,
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
            headers: { "x-access-token": beanstalk.config.PageAPIAccessToken }
        });
    };
    CaptchaManager.prototype.loadPageFromServer = function () {
        var _this = this;
        $.ajax({
            url: beanstalk.config.PageAPIUrl,
            success: function (data) { return _this.parsePageAPIData(data); },
            headers: { "x-access-token": beanstalk.config.PageAPIAccessToken },
            timeout: beanstalk.config.PageAPITimeout
        });
    };
    CaptchaManager.prototype.parsePageAPIData = function (data) {
        var _this = this;
        console.log("OCRPage loaded, loading image..", data);
        localStorage["last_page"] = JSON.stringify(data);
        data.isLocal = false;
        // This seems to be the only way I can get the CORS image to work
        var image = new Image();
        image.src = data.url;
        image.onload = function () {
            console.log("OCRPage image loaded..", image);
            var ssData = {
                frames: [],
                images: []
            };
            _.each(data.differences, function (d) {
                var x = d.coords[3].x;
                var y = d.coords[3].y;
                var w = d.coords[1].x - d.coords[3].x;
                var h = d.coords[1].y - d.coords[3].y;
                // A few error catches here
                if (x < 0)
                    console.error("X LESS THAN ZERO!! ", d);
                if (y < 0)
                    console.error("Y LESS THAN ZERO!! ", d);
                if (w <= 0)
                    console.error("WIDTH LESS THAN OR EQUAL TO ZERO!! ", d);
                if (h <= 0)
                    console.error("HEIGHT LESS THAN OR EQUAL TO ZERO!! ", d);
                if (x + w > image.width)
                    console.error("WIDTH GREATER THAN IMAGE!! ", d);
                if (y + h > image.height)
                    console.error("WIDTH GREATER THAN IMAGE!! ", d);
                d.frame = ssData.frames.length;
                d.page = data;
                ssData.frames.push([x, y, w, h]);
                _this.remoteChunks.push(d);
            });
            ssData.images = [image];
            data.spritesheet = new createjs.SpriteSheet(ssData);
        };
    };
    return CaptchaManager;
})();
