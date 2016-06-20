app.directive('inputLength', function(){
	return {
		require: 'ngModel',
		link: function(scope, element, attr, mCtrl){
			mCtrl.$parsers.push(function(value){
				var opts = attr.inputLength.split(';');
				var minVal = parseInt(opts[0].trim());
				var maxVal = parseInt(opts[1].trim());
				var validity = true;

				if(value !== '')
					validity = (value.length >= minVal && value.length <= maxVal);

				mCtrl.$setValidity('inputLengthError', validity);
				return value;
			});
		}
	};
});

app.directive('inputSize', function(){
	return {
		require: 'ngModel',
		link: function(scope, element, attr, mCtrl){
			mCtrl.$parsers.push(function(value){
				var opts = attr.inputSize.split(';');
				var minVal = parseInt(opts[0].trim());
				var maxVal = parseInt(opts[1].trim());
				var validity = true;

				if(value !== '')
					validity = (new RegExp(/^\d+$/)).test(value) ? (parseInt(value) >= minVal && parseInt(value) <= maxVal) : false;


				mCtrl.$setValidity('inputSizeError', validity);
				return value;
			});
		}
	};
});