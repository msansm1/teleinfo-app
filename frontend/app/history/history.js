angular.module('teleinfo.history', [])

    .controller('HistoryCtrl', function HistoryController($scope, $rootScope, $http, $interval) {

        $scope.lastdayHC = undefined;
        $scope.lastdayHP = undefined;
        $scope.pMaxHour = undefined;
        $scope.lasthourHC = undefined;
        $scope.lasthourHP = undefined;
        $scope.dateDay = new Date();
        $scope.dateHour = 12;
        $scope.maxDate = $scope.maxDate ? null : new Date();
        $scope.minDate = new Date(2015, 12, 15);
        $scope.format = "yyyy-MM-dd";
        
        $scope.dateOptions = {
		    formatYear: 'yy',
		    startingDay: 1
		  };
        
        $interval.cancel($rootScope.liveTask);
        $rootScope.liveTask = undefined;

        $http.get('/rest/conso/derniereheure?debut='+$scope.dateDay.getFullYear()+'-'+($scope.dateDay.getMonth()+1)+'-'+$scope.dateDay.getDate()+'T'+$scope.dateHour+'&fin='+$scope.dateDay.getFullYear()+'-'+($scope.dateDay.getMonth()+1)+'-'+$scope.dateDay.getDate()+'T'+($scope.dateHour+1))
            .success(function (data) {
                $scope.lasthourHC = data.last[0].indexcptHC - data.first[0].indexcptHC;
                $scope.lasthourHP = data.last[0].indexcptHP - data.first[0].indexcptHP;
            });

        $scope.unit = "kW";
        $scope.precision = 2;
        
        $scope.status = {
		    opened: false
		  };
        
      $scope.today = function() {
        $scope.dateDay = new Date();
      };
      $scope.today();

      $scope.clear = function () {
        $scope.dateDay = null;
      };

      $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
      };
      $scope.toggleMin();

      $scope.open = function($event) {
        $scope.status.opened = true;
      };

});
