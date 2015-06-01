/// <reference path="../typings/beanstalk/beanstalk.d.ts" />

var beanstalk: BeanstalkManager;

$(() => {
    $.getJSON("data/beanstalk config.json",(config: BeanstalkConfig) => {

        // If debug defined in the config then we are debug, else look at the URL of the page
        config.debug = config.debug ? true : Utils.deparam(location.href).debug == "true";

		beanstalk = new BeanstalkManager(config);
		beanstalk.init();
	});
});