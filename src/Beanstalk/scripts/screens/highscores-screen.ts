/// <reference path="../../typings/beanstalk/beanstalk.d.ts" />

class HighscoresScreen extends ScreenBase {

	allTimeRows: JQuery;
	weeklyRows: JQuery;

	constructor() {
		super("highscoresScreen", "highscores_screen_html");
	}

	init() {
		super.init();	

		this.allTimeRows = $("#highscoresScreen .alltime .row");
		this.weeklyRows = $("#highscoresScreen .weekly .row");
		
		// Listen for clicks
		$("#highscoresScreen button.back").click(() => beanstalk.screens.open(beanstalk.screens.main));
        $("#highscoresScreen button.share").click(() => this.share());
    }

    share() {
        beanstalk.social.shareProgressToFB();
    }

	show() {
		super.show();

		// Start off by updating the view
		this.setRowsToLoading(this.allTimeRows);
		this.setRowsToLoading(this.weeklyRows);

		var allTimeScoresPromise = beanstalk.backend.loadHighscores(3, new Date(0), new Date());
		var weeklyTimeScoresPromise = beanstalk.backend.loadHighscores(3, moment().subtract(1, "week").toDate(), new Date());

		// HACK! This is because the TSD for parse is a bit crap
		var parse: any = Parse;
		if (beanstalk.user.backendBeanstalk == null) {

			parse.Promise.when(allTimeScoresPromise, weeklyTimeScoresPromise)
				.then((allTime: Parse.Object[], weekly: Parse.Object[]) => {

				this.setRowsFromBeanstalks(this.allTimeRows.slice(0, 3), allTime);
				this.setRowsFromBeanstalks(this.weeklyRows.slice(0, 3), weekly);

				this.setRow(this.allTimeRows.get(3), "..", "..", "..");
				this.setRow(this.weeklyRows.get(3), "..", "..", "..");
			});


		}
		else {

			var allTimeRankPromise = beanstalk.backend.loadBeanstalkRank(beanstalk.user.backendBeanstalk, new Date(0), new Date());
			var weeklyRankPromise = beanstalk.backend.loadBeanstalkRank(beanstalk.user.backendBeanstalk, moment().subtract(1, "week").toDate(), new Date());

			parse.Promise.when(allTimeScoresPromise, weeklyTimeScoresPromise, allTimeRankPromise, weeklyRankPromise)
				.then((allTime: Parse.Object[], weekly: Parse.Object[], alltimeRank: number, weeklyRank: number) => {

				this.setRowsFromBeanstalks(this.allTimeRows.slice(0, 3), allTime);
				this.setRowsFromBeanstalks(this.weeklyRows.slice(0, 3), weekly);
				this.setPlayerRow(this.allTimeRows.get(3), beanstalk.user.backendBeanstalk, alltimeRank + 1);
				this.setPlayerRow(this.weeklyRows.get(3), beanstalk.user.backendBeanstalk, weeklyRank + 1);

			});
		}
	}

	private setRowsToLoading(rows: JQuery) {
		rows.each((i, e) => {
			$(e).find(".position").text("");
			$(e).find(".name").text("loading..");
			$(e).find(".height").text("");
		});		
	}

	private setRowsFromBeanstalks(rows: JQuery, beanstalks: Parse.Object[]) {
		rows.each((i, e) => {

            if (i < beanstalks.length) {


                var name = Utils.getNameFromEmail(beanstalks[i].get("user").getUsername());
                name = Utils.truncate(name, 13);

				$(e).find(".position").text(Utils.getGetOrdinal(i + 1));
                $(e).find(".name").text(name);
				$(e).find(".height").text("" + beanstalks[i].get("height"));
			}
			else {
				$(e).find(".position").text("..");
				$(e).find(".name").text("..");
				$(e).find(".height").text("..");
			}
			
		});
	}

    private setPlayerRow(row: HTMLElement, obj: Parse.Object, rank: number) {
       
        var name = Utils.getNameFromEmail(beanstalk.backend.user.getUsername());
        name = Utils.truncate(name, 13);

		$(row).find(".position").text(Utils.getGetOrdinal(rank));
        $(row).find(".name").text(name);
		$(row).find(".height").text(obj.get("height"));
	}

    private setRow(row: HTMLElement, position: string, name: string, height: string) {

        name = Utils.truncate(name, 13);

		$(row).find(".position").text(position);
		$(row).find(".name").text(name);
		$(row).find(".height").text(height);
	}

}