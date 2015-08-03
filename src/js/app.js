var angApp = angular.module('angApp', ['ngRoute']);

angApp.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'pages/home.html',
      controller: 'angController'
    })

    .when('/items', {
      templateUrl: 'pages/items.html',
      controller: 'itemsController'
    });
});

angApp.controller('itemsController', function($scope) {
  $scope.init = function () {
    $scope.title_subject = "subject_title";
    $scope.incomplete = true;
    $scope.ratesCount = 4;
  };

  $scope.change_rate = function(index_item_rate) {
    $scope.items_rate[index_item_rate].value_type = 'rating';
    $scope.checkfields();
  };

  $scope.build_items = function () {
    var count_all_ratings = $scope.ratesCount;

    $scope.items_rate = [];
    if (!count_all_ratings || count_all_ratings <= 0) {
      return;
    }

    $scope.items_rate = $scope._createRateItems(count_all_ratings);
  };

  $scope._createRateItems = function(count_all) {
    var result = [];

    var i = count_all;
    var j = 0;
    while (i--) {
      result.push( {index : j++, value: 4} )
    }

    return result;
  };

  $scope.build_items();

  $scope.checkfields = function () {
    $scope.incomplete = !$scope.is_valid_fields() || !$scope.ratesCount;
    if (!$scope.incomplete) {
      $scope.do_calc_parts();
      $scope.is_accepted_credit = $scope.is_accept();
    }
  };

  $scope.is_valid_fields = function () {
    var is_valid = true;

    for (var i = 0; i < $scope.items_rate.length; i++) {
      var type = $scope.items_rate[i].value_type;
      var value = $scope.items_rate[i].value;
      if (type === 'rating') {
        if (!value || value <= 0)
          is_valid = false;
      } else {
        if (type === 'undefined') {
          is_valid = false;
        }
      }
    }

    return is_valid;
  }


  $scope.is_accept = function () {
    return (($scope.calc_middle_mark >= 4.0) && ($scope.calc_disrespectfully < 10.0));
  };

  $scope.do_calc_parts = function () {
    var
      count_rates = 0,
      sum_rates = 0,
      count_respectfully = 0,
      count_disrespectfully = 0;

    for (var i = 0; i < $scope.items_rate.length; i++) {
      var type = $scope.items_rate[i].value_type;
      var value = $scope.items_rate[i].value;
      if (value && type === 'rating') {
        count_rates++;
        sum_rates = sum_rates + parseInt(value);
      } else {
        if (type === 'respectfully') {
          count_respectfully++;
        } else if (type === 'disrespectfully') {
          count_disrespectfully++;
        }
      }
    }

    var count_all_ratings = $scope.ratesCount;
    if (count_all_ratings !== 0) {
      $scope.calc_respectfully = count_respectfully * 100 / count_all_ratings;
      $scope.calc_disrespectfully = count_disrespectfully * 100 / count_all_ratings;
      $scope.calc_middle_mark = count_rates ? sum_rates / count_rates : 0;
    }
  };

  $scope.form_submit = function() {
    console.log(
      angular.toJson([
        { name : 'title_subject', value : $scope.title_subject },
        { name : 'ratesCount', value : $scope.ratesCount },
        { name : 'respectfully', value : $scope.calc_respectfully.toFixed(2.2) },
        { name : 'disrespectfully', value : $scope.calc_disrespectfully.toFixed(2.2)},
        { name : 'middle_mark', value : $scope.calc_middle_mark.toFixed(2.2)},
        { name : 'is_accepted_credit', value : $scope.is_accepted_credit}
      ])
    );

    var request = $http({
      method  : 'POST',
      url     : '/toUrl',
      data    : (angular.toJson([
        { name : 'title_subject', value : $scope.title_subject },
        { name : 'ratesCount', value : $scope.ratesCount },
        { name : 'respectfully', value : $scope.calc_respectfully.toFixed(2.2) },
        { name : 'disrespectfully', value : $scope.calc_disrespectfully.toFixed(2.2)},
        { name : 'middle_mark', value : $scope.calc_middle_mark.toFixed(2.2)},
        { name : 'is_accepted_credit', value : $scope.is_accepted_credit}
      ])),
       headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    request.success(
      function(data) {
        if (!data.success) {
          $scope.errorName = data.errors.name;
        } else {
          $scope.message = data.message;
        }
    });
  };
});

angApp.controller('angController', function($scope) {
  // for templateUrl: 'pages/home.html',
  $scope.init = function () {
    $scope.title_subject = "NoName";
    $scope.ratesCount = 4;
  };
});
