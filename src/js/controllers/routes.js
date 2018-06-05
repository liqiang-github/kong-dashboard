angular.module('app').controller("RoutesController", ["$scope", "Kong", function ($scope, Kong) {
  $scope.routes = [];
  $scope.total = null;
  $scope.offset = null;
  $scope.searchResults = {};
  $scope.searching = false;

  var loaded_pages = [];

  $scope.loadMore = function() {
    var page = '/routes?';
    if ($scope.offset) {
      page += 'offset=' + $scope.offset + '&';
    }
    if (loaded_pages.indexOf(page) !== -1) {
      return;
    }
    loaded_pages.push(page);

    Kong.get(page).then(function(collection) {
      if ($scope.total === null) {
        $scope.total = 0;
      }
      $scope.routes.push.apply($scope.routes, collection.data);
      $scope.total += collection.data.length;
      $scope.offset = collection.offset ? collection.offset : null;
    });
  };
  $scope.loadMore();

  $scope.showDeleteModal = function (id, name) {
    $scope.current = {id: id, name: name};
    $('#deleteRoute').modal('open');
  };

  $scope.abortDelete = function () {
    $('#deleteRoute').modal('close');
  };

  $scope.performDelete = function () {
    $('#deleteRoute').modal('close');
    Kong.delete('/route/' + $scope.current.id).then(function (response) {
      $scope.total -= 1;
      $scope.routes.forEach(function(element, index) {
        if (element.id === $scope.current.id) {
          $scope.routes.splice(index, 1);
        }
      });
    });
  };

  $scope.searchRoute = function() {
    $scope.searchResults = {};
    var input = $scope.searchInput;
    if (!input) {
      $scope.searching = false;
      return;
    }

    $scope.searching = true;

    var populateResults = function(response) {
      angular.forEach(response.data, function(value) {
        $scope.searchResults[value.id] = value.name;
      });
    };

    Kong.get('/routes/' + input).then(populateResults);
  };
}]);
