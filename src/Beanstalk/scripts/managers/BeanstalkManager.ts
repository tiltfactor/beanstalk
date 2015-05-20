/// <reference path="../../typings/beanstalk/beanstalk.d.ts" />

class BeanstalkManager {

	config: BeanstalkConfig;
	stage: createjs.Stage;
	resources: ResourcesManager;
	splashScreens: SplashScreensManager;
	loadingScreen: LoadingScreen;
	screens: ScreensManager;
	audio: AudioManager;
	persistance: PersistanceManager;
	backend: BackendManager;
	user: UserManager;
	captchas: CaptchaManager;
	game: GameManager;
    ambience: GameAmbienceManager;
    sprites: SpriteSheetManager;
    social: SocialManager;

	constructor(config: BeanstalkConfig) {
		this.config = config;
		this.config.debug = location.hostname == "localhost";
	}

	init() {
		console.log("starting up Beanstalk");

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
        createjs.Ticker.addEventListener("tick",(e: createjs.TickerEvent) => this.update(e));

		// Create Managers
		this.resources = new ResourcesManager();
		this.audio = new AudioManager();
		this.splashScreens = new SplashScreensManager();
		this.loadingScreen = new LoadingScreen();
		this.screens = new ScreensManager();
		this.persistance = new PersistanceManager();
		this.backend = new BackendManager();
		this.user = new UserManager();
		this.captchas = new CaptchaManager();
		this.game = new GameManager();
        this.ambience = new GameAmbienceManager();
        this.sprites = new SpriteSheetManager();
        this.social = new SocialManager();

		// Start off things invisible
		this.loadingScreen.visible = false;

		// Load the last session (if there is one)
		this.persistance.depersist();

		// Add managers that are containers
		this.stage.addChild(this.splashScreens);
		this.stage.addChild(this.loadingScreen);
		this.stage.addChild(this.screens);

		// Handle resizing so we can centre the canvas
		window.onresize = () => this.onResize();
		this.onResize();

		// Start the game
		this.start();
	}

	start()	{

		this.resources.loadInitialResources(() => {
			console.log("initial resources loaded, showing loading screen and loading main game resources");

			// Now the initial resources have been loaded we can init the loading screen's bits and show it			
			this.backend.init();
			this.user.init();
            this.audio.init();
            this.social.init();
			this.loadingScreen.init();			
			this.loadingScreen.visible = true;

            this.resources.loadMainGameResources(() => {

				console.log("main game resources loaded, showing splash screens.");

				// Now the main resources have been loaded we can init a few things		
				this.screens.init();
				this.captchas.init();				
				this.game.init();

				// Dont need the loading screen any more
				this.loadingScreen.visible = false;

				// If we are using a skipIntro debug flag then skip it now
				if (Utils.deparam(location.href).skipIntro == "true") {
					this.screens.open(this.screens.login);
				}
				else {
					this.splashScreens.showSplashScreens(() => {
						console.log("spash screens done, showing main menu.");
						this.screens.open(this.screens.login);
					});
				}		
			});
		});
	}

	onResize() {
		// Scale so its always on screen
		var ratioH = window.innerHeight / this.config.height;
		var ratioW = window.innerWidth / this.config.width;
		var ratio = Math.min(ratioH, ratioW);
		this.stage.scaleX = this.stage.scaleY = ratio;
		this.stage.canvas.width = ratio * this.config.width;
		this.stage.canvas.height = ratio * this.config.height;

		$("#beanstalkContainer").innerWidth(this.stage.canvas.width);
		$("#beanstalkContainer").innerHeight(this.stage.canvas.height);

		this.stage.update();
	}
	
	update(e: createjs.TickerEvent) {

		// Always update the audio
		this.audio.update(delta);

		// Dont update if paused!
		if (createjs.Ticker.getPaused()) return;

		// Get the delta (in seconds) as this is all we need to pass to the children
		var delta = e.delta / 1000;
					
		// Update all the bits
		this.loadingScreen.update(delta);
		this.screens.update(delta);
		this.ambience.update(delta);

		// Finally render
		this.stage.update(e);
	}
}