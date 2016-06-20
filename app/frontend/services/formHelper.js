app.service('formHelper', function(){
	this.validateInput = function(text, isValid, addLabel){
		if(typeof addLabel !== 'boolean')
			addLabel = false;

		if(text === '' || typeof text === 'undefined')
			return addLabel ? '' : false;

		if(isValid)
			return addLabel ? 'has-success' : true;
		return addLabel ? 'has-error' : false;
	}
});