interface SmorballPersistanceData {
	musicVolume?: number;
	soundVolume?: number;
}

class PersistanceManager {

	persist() {
		var obj = <SmorballPersistanceData>{
			musicVolume: beanstalk.audio.musicVolume,
			soundVolume: beanstalk.audio.soundVolume,			
		};

		localStorage.setItem("beanstalk", JSON.stringify(obj));
	}

	depersist() {

		// Grab the persisted data, if there is none then dont go any further
		var s = localStorage.getItem("beanstalk");
		if (s == undefined) return;

		// Convert it to our data object
		var obj = <SmorballPersistanceData>JSON.parse(s);

		// Depersist the bits
		if (obj.musicVolume != undefined) beanstalk.audio.musicVolume = obj.musicVolume;
		if (obj.soundVolume != undefined) beanstalk.audio.soundVolume = obj.soundVolume;		
	}


}