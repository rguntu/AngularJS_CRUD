
   // debugger;
    angular.module('clientApp').controller('editcontroller', editcontroller);

    function editcontroller(qaservice, $uibModalInstance, grid, row) {
        var vm = this;
        vm.entity = angular.copy(row.entity);
        vm.putQC = putQC;
        vm.deleteQC = deleteQC;
        function putQC() {
            qaservice.putQS(vm.entity)
                .then(function(response) {
                    row.entity = angular.extend(row.entity, vm.entity);
                        vm.qStatus = "Success";
                       // $route.reload();
                    },
                    function(error) {
                        vm.qStatus = "Error";
                    });

            $uibModalInstance.close(row.entity);
        }
        function deleteQC() {
            qaservice.deleteQ(vm.entity.i)
                .then(function(response) {
                        vm.qStatus = "Success";
                       // $route.reload();
                    },
                    function(error) {
                        vm.qStatus = "Error";
                    });

            $uibModalInstance.close(row.entity);
        }
    }