/// <reference path="../tsd.d.ts" />

interface BeanstalkConfig {
	width: number;
	height: number;
	debug: boolean;
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