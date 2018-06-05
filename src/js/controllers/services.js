angular.module('app').controller("ServicesController", ["$scope", "Kong", function ($scope, Kong) {
  $scope.services = [];
  $scope.total = null;
  $scope.offset = null;
  $scope.searchResults = {};
  $scope.searching = false;

  var loaded_pages = [];

  $scope.loadMore = function() {
    var page = '/services?';
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
      $scope.services.push.apply($scope.services, collection.data);
      $scope.total += collection.data.length;
      $scope.offset = collection.offset ? collection.offset : null;
    });
  };
  $scope.loadMore();

  $scope.showDeleteModal = function (id, name) {
    $scope.current = {id: id, name: name};
    $('#deleteService').modal('open');
  };

  $scope.abortDelete = function () {
    $('#deleteService').modal('close');
  };

  $scope.performDelete = function () {
    $('#deleteService').modal('close');
    Kong.delete('/services/' + $scope.current.id).then(function (response) {
      $scope.total -= 1;
      $scope.services.forEach(function(element, index) {
        if (element.id === $scope.current.id) {
          $scope.services.splice(index, 1);
        }
      });
    });
  };

  $scope.searchServices = function() {
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

    Kong.get('/services/' + input).then(populateResults);
  };
}]);
