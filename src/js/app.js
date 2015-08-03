function send_on_server() {
  document.forms.form.submit(); //@fixme
}

var angApp = angular.module('angApp', ['ngRoute']);

angApp.config(function($routeProvider) {
  $routeProvider

    .when('/', {
      templateUrl: 'pages/home.html',
      controller: 'mainController'
    })

    //.when('/about', {
    //  templateUrl: 'pages/about.html',
    //  controller: 'aboutController'
    //})
    //
    //.when('/contact', {
    //  templateUrl: 'pages/contact.html',
    //  controller: 'contactController'
    //})

    .when('/items', {
      templateUrl: 'pages/items.html',
      controller: 'itemsController'
    });
});

angApp.controller('mainController', function ($scope) {
  console.log("mainController");
});

angApp.controller('aboutController', function ($scope) {
  console.log("aboutController");
});

angApp.controller('contactController', function ($scope) {
  console.log("contactController");
});

angApp.controller('itemsController', function ($scope) {
  console.log("itemsController");
  //$scope.incomplete = true;

  $scope.build_items = function () {
    console.log("build_items = function() {");
    //@fixme validate

    var count_all_ratings = $scope.model.ratesCount;

    $scope.model.items_rate = [];
    if (!count_all_ratings || count_all_ratings <= 0) {
      return;
    }

    $scope.model.items_rate = $scope._createRateItems(count_all_ratings);
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
    $scope.incomplete = !$scope.is_valid_fields() || !$scope.model.ratesCount;
    if (!$scope.incomplete) {
      $scope.do_calc_parts();
      $scope.is_accepted_credit = $scope.is_accept();
    }
  };

  $scope.is_valid_fields = function () {
    var is_valid = true;

    for (var i = 0; i < $scope.model.items_rate.length; i++) {
      var type = $scope.model.items_rate[i].value_type;
      var value = $scope.model.items_rate[i].value;
      if (type === 'rating') {
        if (!value || value <= 0)
        is_valid = false;
      } else {
        if (type === 'undefined') {
          is_valid = false;
        }
      }
    }
    console.log("is_valid." + is_valid);
    return is_valid;
  }


  $scope.is_accept = function () {
    return (($scope.calc_middle_mark >= 4.0) && ($scope.calc_disrespectfully < 10.0));
  };

  $scope.do_calc_parts = function () {
    console.log("do_calc_parts() ...");

    var
      count_rates = 0,
      sum_rates = 0,
      count_respectfully = 0,
      count_disrespectfully = 0;

    for (var i = 0; i < $scope.model.items_rate.length; i++) {
      var type = $scope.model.items_rate[i].value_type;
      var value = $scope.model.items_rate[i].value;
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

    var count_all_ratings = $scope.model.ratesCount;
    if (count_all_ratings !== 0) {
      $scope.calc_respectfully = count_respectfully * 100 / count_all_ratings;
      $scope.calc_disrespectfully = count_disrespectfully * 100 / count_all_ratings;
      $scope.calc_middle_mark = count_rates ? sum_rates / count_rates : 0;
    }
  };

});

angApp.controller('angController', function ($scope) {
  $scope.init = function () {
    conslole.log('init()');
    $scope.title_subject = "subject_title";
    $scope.count_ratings = 3;
    $scope.incomplete = true;
    $scope.middle_mark = 0.0;
    $scope.ratesCount = 4;
  };
});
