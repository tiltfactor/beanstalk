/// <reference path="../tsd.d.ts" />

interface BeanstalkConfig {
	width: number;
	height: number;
	debug: boolean;
	plant: PlantConfig;
}

interface PlantConfig {
	stalks: PlantStalksConfig;
}

interface PlantStalksConfig extends _.Dictionary<PlantStalkConfig> {
	bright: PlantStalkConfig;
	dark: PlantStalkConfig;
	bottom: PlantStalkConfig;
}

interface PlantStalkConfig {
	id: string;
	regX: number;
	regY: number;
	scale: number;
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