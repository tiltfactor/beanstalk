/// <reference path="../typings/beanstalk/beanstalk.d.ts" />
var beanstalk;
$(function () {
    $.getJSON("data/beanstalk config.json", function (config) {
        beanstalk = new BeanstalkManager(config);
        beanstalk.init();
    });
});
