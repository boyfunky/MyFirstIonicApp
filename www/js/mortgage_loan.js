'use strict';

/**	
 * @ngdoc function
 * @name loanstreetIpadAppApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the loanstreetIpadAppApp
 */

angular.module('loanstreetIpadAppApp')
	.controller('Mortgage_LoanCtrl', function ($location, $scope, $rootScope, $http, $modal, $sce, updateTable, postResults) {

  	var loans, loandatarray, loandata, params, passParams, ids;
  	
  	
  	$scope.update_result = function() {
  		$scope.paramsData();
  		$scope.homeloandata();
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
        sort_by: $scope.getActiveColumn('table.packages'),
        sort_direction: $scope.getSortDirection('table.packages'),
        lock_in: (!!filter.lock_period.value? filter.lock_period.value : 'Show all')
      };
      	return params;
  	};
  	
  	$scope.getActiveColumn = function(tablePath) {
  		return $(tablePath).find('th .active').data('column');
  	};
  	
  	$scope.getSortDirection = function(tablePath) {
  		var $column;
  		$column = $(tablePath).find('th .active');
  		if ($column.hasClass('up')) {
    			return 'asc';
  		} else {
    		return 'desc';
  		}
		};
  	  	
  	
  	$scope.homeloandata = function(showall) {	
  		
  		if($scope.shownAll === 'Show Less')
  			{
  				$scope.shownAll = '';
  				passParams = params;
  				showall = 'nil';
  				$scope.homeloandata(showall);
  			}
  		$scope.shownAll = 'Show All';
  		$scope.paramsData();
  		passParams = params;
  		passParams = JSON.stringify(passParams).replace(/:/g,'=').replace(/"/g,'').replace(/,/g,'&').replace(/{/g,'').replace(/}/g,'').replace(/ /g,'+');
    	if(showall === 'all') {
    		$scope.shownAll = 'Show Less';
  			passParams = passParams + '&showAll=all';	
  		}
    	updateTable.myService(passParams).then(function(data){
    		loans = data;
    		$scope.getLoanData(loans);
    	 });
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
  				monthly: $scope.getMonthly(loans.result_list[key], params)
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

  	$scope.submit_application = function(size) {
  		var checkboxes = $('#ls-shop-rel-list input[type=checkbox]'); 
    	ids = checkboxes.filter(':checked').map(function(){
      	return this.id;
    	}).get().join(',');

    	if (ids) {
    		var modalInstance = $modal.open({
      		templateUrl: 'views/mortgage_loan/home_loan_submit.html',
        	controller: 'ModalInstanceCtrl',
      		size: size
    		});
    	} else {
      	$('.product-noselected-message').html('Please select any products below to apply');
    	}
  	};
  		
  	$scope.submit_info = function(size) {	
  		$scope.cancel();
  		var checkboxes = $('#ls-shop-rel-list input[type=checkbox]'); 
    	ids = checkboxes.filter(':checked').map(function(){
      	return this.id;
    	}).get().join(',');
  		$scope.paramsData();
  	
  		passParams = JSON.stringify(params).replace(/:/g,'=').replace(/"/g,'').replace(/,/g,'&').replace(/{/g,'').replace(/}/g,'').replace(/ /g,'+');
  
  		var parseData = JSON.stringify($scope.info).replace(/:/g,'=').replace(/"/g,'').replace(/,/g,'&').replace(/{/g,'').replace(/}/g,'');
			
			parseData = parseData + '&mortgage_loan_id='+ids;
			
			postResults.saveApplication(passParams, parseData).then(function(data){
				console.log('rootscope: '+data);
				$rootScope.applicantID = data;
				var modalInstance = $modal.open({
      		templateUrl: 'views/mortgage_loan/home_loan_thank_you.html',
        	controller: 'ModalInstanceCtrl',
      		size: size		
    		});	   	
      });  
    };	
  });
  
  
angular.module('loanstreetIpadAppApp')
	.controller('ModalInstanceCtrl', function ($location, $scope, $modalInstance) {
		
			$scope.cancel = function() {
  		$modalInstance.dismiss('cancel');
  	};
		
	});
