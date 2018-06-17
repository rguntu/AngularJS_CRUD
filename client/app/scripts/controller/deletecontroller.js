
    debugger;
    angular.module('clientApp').controller('deletecontroller', deletecontroller);

    function deletecontroller(selectedRows,$scope, $q,qaservice, $uibModalInstance, data) {
        var vm = this;
        vm.batchDelete = batchDelete;
        function batchDelete() {
            var promises = [];
            angular.forEach(selectedRows, function(value) {
            console.log(value);
              var deferred = $q.defer();
              promises.push(deferred.promise);
              qaservice
                .deleteQ(value)
                //qaservice.postQA(vm.q)
                .then(
                  function(response) {
                    vm.qStatus = "Success";
                    deferred.resolve();
                  },
                  function(error) {
                    vm.qStatus = "Error";
                    deferred.resolve();
                  }
                );
            });
            $q.all(promises).then(function() {
              $scope.gridOptions.data = [];
              $scope.$parent.vm.getNames();
            });

            $uibModalInstance.close();
        }
    }