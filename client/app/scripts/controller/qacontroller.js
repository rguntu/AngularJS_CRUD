debugger;
angular.module("clientApp").controller("qacontroller", [
  "$q",
  "$interval",
  "$scope",
  "$uibModal",
  "qaservice",
  function($q, $interval, $scope, $uibModal, qaservice) {
    var vm = this;
    vm.submitForm = submitForm;
    vm.names = new Array();
    getNames();
    //vm.addQ=addQ();
    //vm.editRow = RowEditor.editRow;
    vm.qdata = null;
    vm.getNames = getNames;
    vm.addQModal = addQModal;
    vm.editRow = editRow;
    vm.selectedRows = [];
    vm.checkDelete = checkDelete;
    vm.batchDelete = batchDelete;

    function batchDelete() {
      $uibModal.open({
        templateUrl: "views/deleteModal.html",
        controller: [
          "selectedRows",
          "$scope",
          "$q",
          "qaservice",
          "$uibModalInstance",
          deletecontroller
        ],
        controllerAs: "del",
        scope: $scope,
        resolve: {
          selectedRows: function () { return vm.selectedRows }
        }
      });
    }

    function checkDelete(row) {
      var v = row.entity.isDel;
      var t = row.entity.text;
      vm.selectedRows.push(row.entity.i);
    }
    function editRow(grid, row) {
      $uibModal.open({
        templateUrl: "views/editModal.html",
        controller: [
          "qaservice",
          "$uibModalInstance",
          "grid",
          "row",
          editcontroller
        ],
        controllerAs: "vm",
        scope: $scope,
        resolve: {
          grid: function() {
            return grid;
          },
          row: function() {
            return row;
          }
        }
      });
    }

    function addQModal() {
      $uibModal.open({
        templateUrl: "views/addModal.html",
        controller: ["$uibModalInstance", "qaservice", "$scope", addcontroller],
        controllerAs: "ac",
        scope: $scope,
        resolve: {
          //		names : vm.getNames
        }
      });
    }
    // for resize grid's height dynamically based on pageSize
    $scope.tableHeight = "height: 600px";

    function getTableHeight(totalPage, currentPage, pageSize, dataLen) {
      var rowHeight = 35; // row height
      var headerHeight = 1; // header height
      var footerHeight = 5; // bottom scroll bar height
      var totalH = 0;
      if (totalPage > 1) {
        if (currentPage < totalPage) {
          totalH = pageSize * rowHeight + headerHeight + footerHeight;
        } else {
          var lastPageSize = dataLen % pageSize;
          if (lastPageSize === 0) {
            totalH = pageSize * rowHeight + headerHeight + footerHeight;
          } else {
            totalH = lastPageSize * rowHeight + headerHeight + footerHeight;
          }
        }
        console.log(totalH);
      } else {
        totalH = dataLen * rowHeight + headerHeight + footerHeight;
      }

      console.log("height: " + totalH + "px");
      return "height: " + totalH + "px";
    }
    $interval(function() {
      $scope.tableHeight = getTableHeight(
        $scope.totalPage,
        $scope.currentPage,
        $scope.pageSize,
        $scope.gridOptions.data.length
      );
      console.log($scope.tableHeight);
      $scope.gridApi.grid.handleWindowResize();
      $scope.gridApi.core.refresh();
    }, 200);

    var paginationOptions = {
      pageNumber: 1,
      pageSize: 4
    };
    $scope.currentPage = 1;
    $scope.pageSize = paginationOptions.pageSize;
    $scope.gridOptions = {
      expandableRowTemplate: "views/expandableRowTemplate.html",
      expandableRowHeight: 75,
      rowTemplate:
        '<div ng-dblclick="grid.appScope.vm.editRow(grid, row)" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }" ui-grid-cell></div>',
      showGridFooter: true,
      paginationPageSizes: [
        $scope.pageSize,
        $scope.pageSize * 2,
        $scope.pageSize * 3
      ],
      paginationPageSize: paginationOptions.pageSize,
      //subGridVariable will be available in subGrid scope
      expandableRowScope: {
        subGridVariable: "subGridScopeVariable"
      }
    };

    $scope.gridOptions.columnDefs = [
      { name: "text" },
      {
        name: "isDel",
        displayName: "Delete",
        width: "10%",
        type: "boolean",
        cellTemplate:
          '<input name="del" ng-model="del" type="checkbox" ng-click="grid.appScope.vm.checkDelete(row)">'
      }
    ];

    function getNames() {
      qaservice.getAll().then(
        function(response) {
          response.data.forEach(function(item) {
            var name = {
              i: item._id,
              text: item.text,
              a: item.answers
              // value: item
            };
            vm.names.push(name);
            var a1 = item.answers[0];
            name.subGridOptions = {
              columnDefs: [
                {
                  name: "Answer",
                  field: "text"
                }
              ],
              data: item.answers
            };
          });
          // vm.names=response.data;
          $scope.gridOptions.data = vm.names;
          vm.names = new Array();
        },
        function(error) {
          this.status = "no Luck";
        }
      );
    }

    $scope.gridOptions.onRegisterApi = function(gridApi) {
      $scope.gridApi = gridApi;
    };

    $scope.expandAllRows = function() {
      $scope.gridApi.expandable.expandAllRows();
    };

    $scope.collapseAllRows = function() {
      $scope.gridApi.expandable.collapseAllRows();
    };

    function submitForm(isValid) {
      if (isValid) {
        var qs = {
          text: vm.q
        };
        qaservice
          .postQA(qs)
          //qaservice.postQA(vm.q)
          .then(
            function(response) {
              vm.qStatus = "Success";
              vm.getNames();
            },
            function(error) {
              vm.qStatus = "Error";
            }
          );
      }
    }
  }
]);
