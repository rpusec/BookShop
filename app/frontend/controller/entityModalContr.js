/**
 * This controller is used in combination with a bootstrap modal window configured with AngularJS. 
 * 
 * The resolve parameter (from the modal window), in combination with 
 * the entityModalContr controller, has to include the following parameters: 
 * 
 *  * entityInfo    - A function which returns brief information concerned with editing an entity object. 
 *  * entityService - A reference of the appropriate service instance. 
 *  * functNames    - Additional function names that make the entityModalContr generic. 
 *                     * editingEntityData - Name of the object that contains all of the values of an entity that's being edited. 
 *                     * entityInfo        - General information regarding an entity that's being edited. 
 *                                           It is composed of the following parameters: 
 *                                            - heading  - Represents the text that's displayed as the title on the modal window
 *                                            - entityID - The ID value of the entity. NOTE: the parameter name has to match 'entityIDLabel'. 
 *                     * addEntity         - Function name for adding an entity. 
 *                     * editEntity        - Function name for editing an entity. 
 *                     * entityIDLabel     - The name of the ID column in the database of the entity. 
 *
 * The reason why these parameters are included is to make this controller as reusable as possible - so that other modal windows, 
 * which offer similar functionality, can use this controller. 
 * 
 * @author Roman Pusec
 * @see documentation for AngularJS and Bootstrap modal window. 
 */
app.controller('entityModalContr', function($scope, entityInfo, entityService, functNames, authService){
	$scope[functNames.editingEntityData] = {};
	$scope[functNames.entityInfo] = entityInfo;

	/**
	 * Adds a new entity. 
	 */
	$scope[functNames.addEntity] = function(){
		entityService[functNames.addEntity](
			$scope[functNames.editingEntityData],
			addEditResp);
	}

	/**
	 * Edits an entity. 
	 */
	$scope[functNames.editEntity] = function(){			
		$scope[functNames.editingEntityData][functNames.entityIDLabel] = entityInfo[functNames.entityIDLabel];
		entityService[functNames.editEntity](
			$scope[functNames.editingEntityData],
			addEditResp);
	}

	/**
	 * Offers the same response for adding and editing entities. 
	 * @param {Object} response The response fetched from the server. 
	 */
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