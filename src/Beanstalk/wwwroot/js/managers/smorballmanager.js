/// <reference path="../../typings/smorball/smorball.d.ts" />
var SmorballManager = (function () {
    function SmorballManager(config) {
        this.config = config;
        this.config.debug = location.hostname == "localhost";
    }
    SmorballManager.prototype.init = function () {
        var _this = this;
        console.log("starting up Smorball");
        // Create the main stage
        this.stage = new createjs.Stage("mainCanvas");
        this.stage.stage.canvas.width = this.config.width;
        this.stage.stage.canvas.height = this.config.height;
        this.stage.enableMouseOver(10);
        for (var i = 0; i < this.stage.numChildren; i++) {
            var obj = this.stage.getChildAt(i);
            console.log(obj.name, obj.x, obj.y);
        }
        // Setup the ticker which handles the main game update loop
        //createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener("tick", function (e) { return _this.update(e); });
        // Create Managers
        this.resources = new ResourcesManager();
        this.audio = new AudioManager();
        this.splashScreens = new SplashScreensManager();
        this.loadingScreen = new LoadingScreen();
        this.screens = new ScreensManager();
        this.difficulty = new DifficultyManager();
        this.persistance = new PersistanceManager();
        this.game = new GameManager();
        this.spawning = new SpawningManager();
        this.captchas = new CaptchasManager();
        this.user = new UserManager();
        this.upgrades = new UpgradesManager();
        this.powerups = new PowerupsManager();
        this.timeTrial = new TimeTrailManager();
        // Start off things invisible
        this.loadingScreen.visible = false;
        // Load the last session (if there is one)
        this.persistance.depersist();
        // Add managers that are containers
        this.stage.addChild(this.splashScreens);
        this.stage.addChild(this.loadingScreen);
        this.stage.addChild(this.screens);
        this.stage.addChild(this.game);
        // Handle resizing so we can centre the canvas
        window.onresize = function () { return _this.onResize(); };
        this.onResize();
        // Start the game
        this.start();
    };
    SmorballManager.prototype.start = function () {
        var _this = this;
        this.resources.loadInitialResources(function () {
            console.log("initial resources loaded, showing loading screen and loading main game resources");
            // Now the initial resources have been loaded we can init the loading screen's bits and show it			
            _this.audio.init();
            _this.loadingScreen.init();
            _this.loadingScreen.visible = true;
            _this.resources.loadMainGameResources(function () {
                console.log("main game resources loaded, showing splash screens.");
                // Now the main resources have been loaded we can init a few things		
                _this.upgrades.init();
                _this.game.init();
                _this.screens.init();
                _this.captchas.init();
                _this.powerups.init();
                _this.timeTrial.init();
                // Dont need the loading screen any more
                _this.loadingScreen.visible = false;
                // If we are using a skipIntro debug flag then skip it now
                if (Utils.deparam(location.href).skipIntro == "true") {
                    _this.screens.open(_this.screens.main);
                }
                else {
                    _this.splashScreens.showSplashScreens(function () {
                        console.log("spash screens done, showing main menu.");
                        _this.screens.open(_this.screens.main);
                    });
                }
            });
        });
    };
    SmorballManager.prototype.onResize = function () {
        // Scale so its always on screen
        var ratioH = window.innerHeight / this.config.height;
        var ratioW = window.innerWidth / this.config.width;
        var ratio = Math.min(ratioH, ratioW);
        this.stage.scaleX = this.stage.scaleY = ratio;
        this.stage.canvas.width = ratio * this.config.width;
        this.stage.canvas.height = ratio * this.config.height;
        $("#smorballContainer").innerWidth(this.stage.canvas.width);
        $("#smorballContainer").innerHeight(this.stage.canvas.height);
        this.stage.update();
    };
    SmorballManager.prototype.update = function (e) {
        // Always update the audio
        this.audio.update(delta);
        // Dont update if paused!
        if (createjs.Ticker.getPaused())
            return;
        // Get the delta (in seconds) as this is all we need to pass to the children
        var delta = e.delta / 1000;
        // Update all the bits
        this.loadingScreen.update(delta);
        this.screens.update(delta);
        this.game.update(delta);
        this.spawning.update(delta);
        this.captchas.update(delta);
        this.powerups.update(delta);
        this.timeTrial.update(delta);
        // Finally render
        this.stage.update(e);
    };
    return SmorballManager;
})();
