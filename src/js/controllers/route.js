angular.module('app').controller("RouteController", ["$scope", "Kong", "$location", "$routeParams", "Alert", "$route","route","env", function ($scope, Kong, $location, $routeParams, Alert, $route, route, env) {

    $scope.schema = env.schemas.route;
    $scope.errors = {};

    onInit();
    
    function onInit() {
        if ($routeParams.id != null) {
            $scope.route = route
            $scope.title = "Edit Route";
            $scope.action = "Save";
            $scope.location = $location;
        } else {
            $scope.route = {};
            $scope.title = "Add a Route";
            $scope.action = "Create";
        }
    }

    $scope.isEdit = function () {
        return $routeParams.id != null;
    }

    $scope.save = function () {
        if ( $scope.isEdit() ) { 
            Kong.patch('/routes/'+$scope.route.id, $scope.route).then(function () {
                Alert.success('Route updated');
                $scope.error = {};
            }, function (response) {
                $scope.error = response.data;
            });    
        } else {
            Kong.post('/routes', $scope.route).then(function () {
                Alert.success('Route created');
                // clearing inputs.
                $scope.route = {};
                // clearing errors.
                $scope.error = {};
            }, function (response) {
                $scope.error = response.data;
            });
        }
    };
}]);
