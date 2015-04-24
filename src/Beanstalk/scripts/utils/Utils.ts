class Utils {

	static deparam(qs: string): any {

		// remove any preceding url and split
		var parts = qs.substring(qs.indexOf('?') + 1).split('&');
		var params = {}, pair, d = decodeURIComponent, i;

		// march and parse
		for (i = parts.length; i > 0;) {
			pair = parts[--i].split('=');
			params[d(pair[0])] = d(pair[1]);
		}

		return params;
	}

	static format(format: string, ...args: any[]): string {		
		return format.replace(/{(\d+)}/g, function (match, number) {
			return typeof args[number] != 'undefined'
				? args[number]
				: match
				;
		});
	}

	static zeroPad(num: number, places: number) {
		var zero = places - num.toString().length + 1;
		return Array(+(zero > 0 && zero)).join("0") + num;
	}

	static randomOne<T>(array: T[]) : T
	{
		return array[Math.floor(Math.random() * array.length)];
	}

	static centre(obj: createjs.DisplayObject, horizontally: boolean = true, vertically: boolean = true) {

		if (horizontally)
			obj.x = beanstalk.config.width / 2 - obj.getBounds().width / 2;

		if (vertically)
			obj.y = beanstalk.config.height / 2 - obj.getBounds().height / 2;

	}

	static shake(jq: JQuery) {
		var l = 20;
		for (var i = 0; i < 10; i++)
			jq.animate({ 'margin-left': "+=" + (l = -l) + 'px' }, 50);
	}

	static formatTime(seconds: number) {
		seconds = Math.floor(seconds);
		var minutes = Math.floor(seconds / 60);
		seconds -= minutes * 60;
		return this.zeroPad(minutes, 2) + ":" + this.zeroPad(seconds, 2);
	}

	static getGetOrdinal(n: number) : string {
		var s = ["th", "st", "nd", "rd"],
			v = n % 100;
		return n + (s[(v - 20) % 10] || s[v] || s[0]);
	}

	static getNameFromEmail(email: string) {
		return email.split("@")[0];
	}

	static limitChange(val: number, target: number, change: number) : number {
		if (val < target) val = Math.min(val + change, target);
		else if (val > target) val = Math.max(val - change, target);
		return val;
	}

}