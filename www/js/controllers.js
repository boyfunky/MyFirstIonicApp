angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('MortgageLoanCtrl', function($scope, updateTable, $sce) {

	console.log("in mortgageloanctrl")

	var passParams, loans, loandatarray, loandata;
	$scope.homeloandata = function() {		
		//$scope.paramsData();
		//passParams = params;
		//passParams = JSON.stringify(passParams).replace(/:/g,'=').replace(/"/g,'').replace(/,/g,'&').replace(/{/g,'').replace(/}/g,'').replace(/ /g,'+');
  	passParams = 'land_type=Residential&property=500000&finance_margin=90&tenure=20&rate_type=Floating+and+fixed+interest&flexi=Full+flexi+and+non-full+flexi+loan&islamic=Islamic+and+Conventional&sort_by=interest_rate&sort_direction=asc&step1_trigger=%5Bdata-step1-trigger%5D&step1_loading=%5Bdata-step1-loading%5D&lock_in=Show+all';
  	updateTable.myService(passParams).then(function(data){
  		loans = data;
  		$scope.getLoanData(loans);
  	 });
	};

  $scope.paramsData = function() {
		params = {
			land_type: (!!filter.loan_type.value? filter.loan_type.value : 'Residential'),
      property: (!!filter.property_value.value? filter.property_value.value : 500000),
      finance_margin: (!!filter.margin_finance.value? filter.margin_finance.value : 90),
      tenure: (!!filter.tenure.value? filter.tenure.value : 20),
      rate_type: (!!filter.rate_type.value? filter.rate_type.value : 'Floating and fixed interest'),
      flexi: (!!filter.full_non_flexi.value? filter.full_non_flexi.value : 'Full flexi and non full flexi loan'),
      islamic: (!!filter.conventional_islamic.value? filter.conventional_islamic.value : 'Islamic and Conventional'),
      //sort_by: $scope.getActiveColumn('table.packages'),
      //sort_direction: $scope.getSortDirection('table.packages'),
      lock_in: (!!filter.lock_period.value? filter.lock_period.value : 'Show all')
    };
    	return params;
	};

	$scope.getLoanData = function(loans) {
		loandatarray = [];
		var key = 0;
		while (key < loans.result_list.length) {
			
			loandata = {
				bank_image: loans.result_list[key].bank_image,
				bank_name: loans.result_list[key].bank_name,
				effective_rate: loans.result_list[key].effective_rate,
				id: loans.result_list[key].id,
				is_featured: loans.result_list[key].is_featured,
				is_flexi: loans.result_list[key].is_flexi,
				lock_in_period: (loans.result_list[key].lock_in_period === 0? '-' :loans.result_list[key].lock_in_period+'yrs'),
				maximum_finance: loans.result_list[key].maximum_finance,
				maximum_tenure: loans.result_list[key].maximum_tenure,
				name: loans.result_list[key].name,
				notes: $sce.trustAsHtml(loans.result_list[key].notes),
				penalty: loans.result_list[key].penalty,
				rate_text: loans.result_list[key].rate_text,
				//monthly: $scope.getMonthly(loans.result_list[key], params)
			};
			
		loandatarray[key++] = loandata;
		}
		$scope.loans = loandatarray;
	};
	
	$scope.getMonthly = function(money, params) {	
    var interest, loan_amount, monthly, tenure;
    tenure = params.tenure * 12;
    interest = money.effective_rate / 12 / 100;
    loan_amount = params.property * params.finance_margin / 100;
    monthly = loan_amount * interest / (1 - Math.pow(1 + interest, -tenure));
    monthly = Math.round(monthly * 100) / 100;
    if (isNaN(monthly)) {
      return 'N/A';
    } else {
      return monthly;
    }
  };	

});
