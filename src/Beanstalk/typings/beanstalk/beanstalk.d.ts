/// <reference path="../tsd.d.ts" />

interface SimplePoint {
	x: number;
	y: number;
}

interface AnimationsData {
    animations: { types: AnimationType[]; instances: AnimationInstance[] };
    tinytown: { types: TinyTownAnimationType[]; instances: TinyTownAnimationInstance[] };
}

interface AnimationType {
    id: string;
    regX: number;
    regY: number;
    framerate: number;    
    loopDelayMin: number;
    loopDelayMax: number;
}

interface TinyTownAnimationType extends AnimationType {
}

interface AnimationInstance {
    type: string;
    x: number;
    y: number;
    scale: number;
}

interface TinyTownAnimationInstance extends AnimationInstance {
}

interface BeanstalkConfig {
	width: number;
	height: number;
	debug: boolean;
	plant: PlantConfig;
	maxPlantHeightPixels: number;
	stalksBeforeLock: number;
	maxSeedVel: number;
	seedLandY: number;
	maxCaptchaSize: number;
	minCaptchaPixelSize: number;
	captchaScaleLimitConstantN: number;
	PageAPIUrl: string;
	PageAPIAccessToken: string;
	PageAPITimeout: number;
	DifferenceAPIUrl: string;
	entriesBeforeServerSubmission: number;
	penaltyTime: number;
	metersPerStalk: number;
    backgroundSections: BackgroundSectionsConfig;
    fbAppId: string;
}

interface BackgroundSectionsConfig extends _.Dictionary<BackgroundSection> {
	garden: BackgroundSection;
	park: BackgroundSection;
	town: BackgroundSection;
	mountains: BackgroundSection;
	space: BackgroundSection;
}

interface BackgroundSection {
	height: number;
	ambience: string;
}

interface PlantConfig {
	stalks: PlantStalksConfig;
}

interface PlantStalksConfig extends _.Dictionary<PlantStalkConfig> {
	bright: PlantStalkConfig;
	dark: PlantStalkConfig;
	bottom: PlantStalkConfig;
	top: PlantStalkConfig;
}

interface PlantStalkConfig {
	id: string;
	regX: number;
	regY: number;
	scale: number;
	flowers: SimplePoint[];
	seed: SimplePoint;
}

interface JQuery {
    selectmenu(options: any);
    leanSlider(options: any);
	mCustomScrollbar(options?: any);
	slider(options?: any): JQuery;
	slider(property:string, value:any): JQuery;
}

interface UserBeanstalkData {
	user: Parse.User;
	height: number;
}

interface OCRChunk {
	_id?: string;
	id: string;
	__v?: number;
	tags?: PageAPIDifferenceTag[];
	texts: string[];
	coords?: { x: number; y: number }[];
	page?: OCRPage;
	frame: number;
}

interface PageAPIDifferenceTag {
	text: string;
	weight: number
}

interface OCRPage {
	_id?: string;
	url?: string;
	id?: string;
	__v?: number;
	differences: OCRChunk[];
	isLocal: boolean;
	spritesheet?: createjs.SpriteSheet;
}

declare class closestWord {
    match: any;
    closestOcr: OCRChunk;
	text: string;
    constructor(intput: any, differences: OCRChunk[]);
}

interface Instruction {
	image: string;
	description: string;
}