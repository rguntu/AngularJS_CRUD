
   // debugger;
    angular.module('clientApp').controller('addcontroller', addcontroller);

  

    function addcontroller($uibModalInstance, qaservice,$scope) {
        var vm = this;
        vm.addQ = addQ;
        
        
        function addQ() {
            qaservice.postQA(vm.qdata)
                //qaservice.postQA(vm.q)
                .then(function(response) {
                        vm.qStatus = "Success";
                        $scope.$parent.vm.getNames();
                    },
                    function(error) {
                        vm.qStatus = "Error";
                    });
            
            $uibModalInstance.close();
        }
    }