app.controller('entityModalContr', function($scope, editingEntity, entityService, functNames, authService){
	$scope[functNames.editingEntityData] = {};
	$scope[functNames.editingEntity] = editingEntity;

	$scope[functNames.addEntity] = function(){
		entityService[functNames.addEntity](
			$scope[functNames.editingEntityData],
			addEditResp);
	}

	$scope[functNames.editEntity] = function(){	
		$scope[functNames.editingEntityData][functNames.entityIDLabel] = editingEntity[functNames.entityIDLabel];
		entityService[functNames.editEntity](
			$scope[functNames.editingEntityData],
			addEditResp);
	}

	function addEditResp(response){
		if(response.data.authenticated)
		{
			if(!response.data.hasErrors)
			{
				$.notify(response.data.message, {className:'success', position: 'top center'});	
				$scope.$close();
			}
			else
			{
				angular.forEach(response.data.errors, function(errorMessage, errorKey){
					$scope[functNames.editingEntityData][errorKey + '_error'] = true;
					$.notify(errorMessage, {className: 'error', position: 'top center'});
				});
			}
		}
		else
		{
			$scope.$close();
			authService.logout({
				message: response.data.message,
				messageType: 'error'
			});
		}
	}
});