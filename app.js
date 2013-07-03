angular.module("TwitterSearch", ["ngResource", "ngCookies"]);

function TwitterSearchController($scope, $resource, $cookieStore) {

    $scope.initSearchService = function () {
//        var queryParams = {};
//        queryParams.callback = "JSON_CALLBACK";
//
//        var actions = {};
//        actions.get = {method: "JSONP"};
//
//        return $resource("https://api.twitter.com/1.1/search/tweets.json",
//            queryParams,
//            actions);

        return $resource("data/tweets.json", {}, {});
    };

    $scope.search = function (searchText) {
        if (!searchText) {
            searchText = $scope.searchText;
        }

        $scope.activeSearchTerm = searchText;

        if ($scope.searchTerms.indexOf(searchText) == -1) {
            $scope.searchTerms.push(searchText);
        }

        $scope.searchResult = $scope.searchService.get({q: searchText});
        $scope.searchText = "";

        saveSearchTermInCookie(searchText);
    };

    $scope.getSearchTermClass = function (searchTerm) {
        return ($scope.activeSearchTerm === searchTerm) ? "active" : "";
    };

    $scope.hasActiveSearch = function (activeSearchTerm) {
        return (activeSearchTerm !== "");
    };

    $scope.removeSearchTerm = function (searchTerm) {
        var index = $scope.searchTerms.indexOf(searchTerm);
        $scope.searchTerms.splice(index, 1);
        removeSearchTermFromCookie(searchTerm);

        if (searchTerm === $scope.activeSearchTerm) {
            $scope.activeSearchTerm = "";
        }
    };

    $scope.onSearchTermMouseOver = function (index) {
        $scope.rolloverSearchTermIndex = index;
    };

    $scope.onSearchTermMouseOut = function () {
        $scope.rolloverSearchTermIndex = -1;
    };

    function restoreSearchTermsFromCookie() {
        var searchTermsInCookie = $cookieStore.get("searchTerms");
        if (searchTermsInCookie) {
            for (var i = 0; i < searchTermsInCookie.length; i++) {
                $scope.searchTerms[i] = searchTermsInCookie[i];
            }
        }
    }

    function saveSearchTermInCookie(searchTerm) {
        var searchTermsInCookie = $cookieStore.get("searchTerms");

        if (!searchTermsInCookie) {
            searchTermsInCookie = [];
        }

        if (searchTermsInCookie.indexOf(searchTerm) == -1) {
            searchTermsInCookie.push(searchTerm);
        }

        $cookieStore.put("searchTerms", searchTermsInCookie);
    }

    function removeSearchTermFromCookie(searchTerm) {
        var searchTermsInCookie = $cookieStore.get("searchTerms");

        if (searchTermsInCookie) {
            var index = searchTermsInCookie.indexOf(searchTerm);
            searchTermsInCookie.splice(index, 1);
            $cookieStore.put("searchTerms", searchTermsInCookie);
        }
    }

    $scope.activeSearchTerm = "";
    $scope.searchTerms = [];
    $scope.searchService = $scope.initSearchService();
    $scope.rolloverSearchTermIndex = -1;

    restoreSearchTermsFromCookie();
}