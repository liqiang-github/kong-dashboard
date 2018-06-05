angular.module('app').controller("ServiceController", ["$scope", "Kong", "$location", "$routeParams", "Alert", "$route","service","env", function ($scope, Kong, $location, $routeParams, Alert, $route, service, env) {

    $scope.schema = env.schemas.service;
    $scope.errors = {};

    onInit();
    
    function onInit() {
        if ($routeParams.id != null) {
            $scope.service = service
            $scope.title = "Edit Service";
            $scope.action = "Save";
            $scope.location = $location;
        } else {
            $scope.service = {};
            $scope.title = "Add a Service";
            $scope.action = "Create";
        }
    }

    $scope.isEdit = function () {
        return $routeParams.id != null;
    }

    $scope.save = function () {
        if ( $scope.isEdit() ) { 
            Kong.patch('/services/'+$scope.service.id, $scope.service).then(function () {
                Alert.success('Service updated');
                $scope.error = {};
            }, function (response) {
                $scope.error = response.data;
            });    
        } else {
            Kong.post('/services', $scope.service).then(function () {
                Alert.success('Service created');
                // clearing inputs.
                $scope.service = {};
            
                // clearing errors.
                $scope.error = {};
            }, function (response) {
                $scope.error = response.data;
            });
        }
    };
}]);
