(function () {
    'use strict';

    angular.module('NarrowItDownApp', [])
        .controller('NarrowItDownController', NarrowItDownController)
        .service('MenuSearchService', MenuSearchService)
        .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
        .directive('foundItems', foundItems);

    function foundItems() {
        return {
            templateUrl: 'foundItems.html',
            scope: {
                found: '<',
                onRemove: '&'
            }
        };
    }

    NarrowItDownController.$inject = ['$scope', 'MenuSearchService'];
    function NarrowItDownController($scope, MenuSearchService) {
        let menu = this;
        menu.service =  MenuSearchService;
        menu.found = [];
        $scope.searchTerm = "";
        menu.hideAlert = true;

        menu.narrowIt = function () {
            if ($scope.searchTerm === ""){
                menu.hideAlert = false;
            }else {
                let promise = menu.service.getMatchedMenuItems();
                promise.then(function (response) {
                    let tmp = response.data.menu_items;
                    for (let i = tmp.length - 1; i >= 0; i--) {
                        if (tmp[i].description.indexOf($scope.searchTerm.toLowerCase()) === -1) {
                            tmp.splice(i, 1);
                        }
                    }
                    if (tmp.length !== 0){
                        menu.hideAlert = true;
                    }else{
                        menu.hideAlert = false;
                    }
                    menu.found = tmp;
                })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        };

        menu.removeItem = function (itemIndex) {
            console.log("removed");
            menu.found.splice(itemIndex,1);
        };
    }

    MenuSearchService.$inject = ['$http', 'ApiBasePath'];
    function MenuSearchService($http, ApiBasePath){
        let service = this;

        service.getMatchedMenuItems = function () {
            let response = $http({
                method: "GET",
                url: (ApiBasePath + "/menu_items.json"),
            });

            return response;
        };


    }

})();
