function build_items() {
  var
    subitems = document.getElementById("subitems"),
    count_all_ratings = document.getElementById("count_ratings").value,
    calculation = document.getElementById("calculation");

  subitems.innerHTML = "";
  calculation.style.visibility = "hidden";
  if (!count_all_ratings || count_all_ratings <=0) {
    return;
  }

  calculation.style.visibility = "visible";

  var ol = document.createElement("ol");

  for(var i =0; i < count_all_ratings; i++) {
    var li = document.createElement("li");
    li.setAttribute("name", "subitem[]");
    subitems.appendChild(ol);
    ol.appendChild(li);

    var label = _createElementWithAttributes(
      "label",
      [
        {name: "for", value: "rating-value["+i+"]"},
      ]
    );
    li.appendChild(label);
    label.appendChild(document.createTextNode("оценка:"));
    label.appendChild(_createElementWithAttributes(
      "input",
      [
        {name: "type", value: "number"},
        {name: "id", value: "rating-value["+i+"]"},
        {name: "min", value: 0},
        {name: "max", value: 5},
        {name: "step", value: 1},
        {name: "value", value: 4},
        {name: "class", value: "rating-width"},
      ]
    ));

    _appendChildForLI(li, "rate["+i+"]", "disrespectfully", "Неуважительно");
    _appendChildForLI(li, "rate["+i+"]", "respectfully", "Уважительно");
    _appendChildForLI(li, "rate["+i+"]", "rating", "Оценка");
  }
}

function _appendChildForLI(li, input_name, input_value, label_title) {
  var label = document.createElement("label");

  li.appendChild(label);
  label.appendChild(_createElementWithAttributes(
    "input",
    [
      {name: "type", value: "radio"},
      {name: "name", value: input_name},
      {name: "value", value: input_value},
      {name: "checked", value: "true"},
    ]
  ));
  label.appendChild(document.createTextNode(label_title));
}

function _createElementWithAttributes(element, attributes) {
  var result = document.createElement(element);

  for(var j =0; j < attributes.length; j++) {
    result.setAttribute(attributes[j].name, attributes[j].value);
  }

  return result;
}

function send_on_server() {
  document.forms.form.submit();
}

var app = angular.module('angApp', []);
app.controller('angController', function($scope) {
  $scope.title_subject = "subject_title";
  $scope.count_ratings = 3;
  $scope.incomplete = true;
  $scope.middle_mark = 0.0;

  $scope.checkfields = function () {
    var
      subitems = document.getElementById("subitems"),
      count_all_ratings = document.getElementById("count_ratings").value,
      is_valid = true,
      calculation = document.getElementById("calculation");

    var inputs = document.getElementsByTagName('input');
    for (var i = 0; i < inputs.length; i++) {
      var value = inputs[i].value ;
      if (inputs[i].type === 'number' && inputs[i].id !== 'count_ratings') {
        if (value == '' || value == 0) {
          is_valid = false;
        }
      }
    }
    $scope.incomplete = !is_valid || !count_all_ratings || count_all_ratings <=0;

    if (!$scope.incomplete) {
      $scope.do_calc_parts();
      document.getElementById("credit_accepted").innerHTML = $scope.is_accept() ? 'зачет принят' : 'зачет не принят';
    }
  };

  $scope.is_accept = function () {
    const
      middle_mark = $scope.calc_middle_mark,
      proportion_missed_disrespectful = $scope.calc_disrespectfully;

    return ((middle_mark >= 4.0) && (proportion_missed_disrespectful < 10.0));
  };

  $scope.do_calc_parts = function() {
    var
      count_ratings = document.getElementById("count_ratings").value,
      count_rates = 0,
      sum_rates = 0,
      count_respectfully = 0,
      count_disrespectfully = 0,
      inputs = document.getElementsByTagName('input');

    for (var i = 0; i < inputs.length; i++) {
      var value = inputs[i].value ;
      if (value && inputs[i].type === 'number' && inputs[i].id !== 'count_ratings') {
        count_rates++;
        sum_rates = sum_rates + parseInt(value);
      }
      if (inputs[i].type === 'radio' && inputs[i].checked) {
        if (value === 'respectfully') {
          count_respectfully++;
        } else if (value === 'disrespectfully') {
          count_disrespectfully++;
        }
      }
    }

    var count_all_ratings = document.getElementById("count_ratings").value;
    if (count_all_ratings !== 0) {
      var calc_middle_respectfully = count_respectfully * 100 / count_all_ratings;
      document.getElementById("calc_respectfully").innerHTML = calc_middle_respectfully.toFixed(2.2);

      var calc_middle_disrespectfully = count_disrespectfully * 100 / count_all_ratings;
      document.getElementById("calc_disrespectfully").innerHTML = calc_middle_disrespectfully.toFixed(2.2);
      $scope.calc_disrespectfully = calc_middle_disrespectfully;

      var calc_middle_mark = sum_rates / count_rates;
      document.getElementById("middle_mark").innerHTML = calc_middle_mark.toFixed(2.2);
      $scope.calc_middle_mark = calc_middle_mark;
    }
  };
});
