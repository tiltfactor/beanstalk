/// <reference path="../../typings/beanstalk/beanstalk.d.ts" />

interface ManifestEntry {
	src: string;
	id: string;
}

interface Manifest {
	manifest: ManifestEntry[];
}

class ResourcesManager
{
	fgQueue: createjs.LoadQueue;
	bgQueue: createjs.LoadQueue;

	constructor() {
		this.fgQueue = new createjs.LoadQueue(true, "", true);		
		this.bgQueue = new createjs.LoadQueue(false, "", false);		
	}

	loadInitialResources(completeCallback: () => void) {
		this.loadManifest("data/initial manifest.json", completeCallback);
	}

	loadMainGameResources(completeCallback: () => void) {
		this.loadManifest("data/main game resources manifest.json", completeCallback);
	}

	loadCaptchas() {

	}
	
	loadManifest(manifest: string, completeCallback: () => void) {
		this.fgQueue.on("complete", completeCallback, this, true);
		this.fgQueue.loadManifest(manifest, true);
	}

	getResource(resourceId: string) : any {
		return this.fgQueue.getResult(resourceId);
	}

	load(item: createjs.LoadItem, forground: boolean, callback?: (resource: any) => void) {
		var queue = forground ? this.fgQueue : this.bgQueue;
		queue.loadFile(item, true);
		queue.on("complete",(data) => {
			if (callback != null)
				callback(queue.getItem(item.id));
		}, this, true);
	}

}
