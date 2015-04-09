/// <reference path="../typings/beanstalk/beanstalk.d.ts" />

var beanstalk: BeanstalkManager;

$(() => {
	$.getJSON("data/beanstalk config.json",(config: BeanstalkConfig) => {
		beanstalk = new BeanstalkManager(config);
		beanstalk.init();
	});
});