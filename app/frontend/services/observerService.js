app.service('observerService', function(){
	var observers = {};

	this.createObserver = function(observerLabel){
		var newObserver = {};
		newObserver.functionRefs = [];
		observers[observerLabel] = newObserver;
	}

	this.subscribe = function(observerLabel, notifyFunction){
		var targetObserver = observers[observerLabel];
		console.log(observers);
		if(typeof notifyFunction === 'function')
			targetObserver.functionRefs.push(notifyFunction);
	}

	this.notifyAll = function(observerLabel){
		var targetObserver = observers[observerLabel];
		angular.forEach(targetObserver.functionRefs, function(obsFunct){
			obsFunct();
		});
	}
});