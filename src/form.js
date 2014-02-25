angular.module('angularPayments')

.directive('paymentForm', ['$window', '$parse', 'Common', function($window, $parse, Common) {
    
  _getDataToSend = function(data){
           
    var possibleKeys = ['number', 'expMonth', 'expYear', 
                    'cvc', 'name','addressLine1', 
                    'addressLine2', 'addressCity',
                    'addressState', 'addressZip',
                    'addressCountry']
    
    var camelToSnake = function(str){
      return str.replace(/([A-Z])/g, function(m){
        return "_"+m.toLowerCase();
      });
    }

    var ret = {};

    for(i in possibleKeys){
        if(possibleKeys.hasOwnProperty(i)){
            ret[camelToSnake(possibleKeys[i])] = angular.copy(data[possibleKeys[i]]);
        }
    }

    ret['number'] = (ret['number'] || '').replace(/ /g,'');

    return ret;
  }

  return {
    restrict: 'A',
    link: function(scope, elem, attr) {

      var form = angular.element(elem);

      form.bind('submit', function() {

        expMonthUsed = scope.expMonth ? true : false;
        expYearUsed = scope.expYear ? true : false;

        if(!(expMonthUsed && expYearUsed)){
          exp = Common.parseExpiry(scope.expiry)
          scope.expMonth = exp.month
          scope.expYear = exp.year
        }

        var button = form.find('button');
        button.prop('disabled', true);
        var enableButton = function () { button.prop('disabled', false); }

        if(form.hasClass('ng-valid')) {
          scope.$apply(function() {
            scope[attr.paymentForm].apply(scope, [_getDataToSend(scope), enableButton]);
          });

        } else {
          scope.$apply(function() {
            scope[attr.paymentForm].apply(scope, [{error: 'Invalid form submitted.', status: 400}, enableButton]);
          });
          button.prop('disabled', false);
        }

        scope.expMonth = null;
        scope.expYear  = null;

      });
    }
  }
}])
