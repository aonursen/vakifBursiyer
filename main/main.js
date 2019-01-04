"use strict";

angular
  .module("gursoyVakfi.main", ["ngRoute"])
  .directive("fileread", [
    function() {
      return {
        scope: {
          fileread: "="
        },
        link: function(scope, element, attributes) {
          element.bind("change", function(changeEvent) {
            scope.$apply(function() {
              scope.fileread = changeEvent.target.files[0];
            });
          });
        }
      };
    }
  ])
  .config([
    "$routeProvider",
    function($routeProvider) {
      $routeProvider
        .when("/", {
          templateUrl: "main/main.html",
          controller: "MainCtrl"
        })
        .when("/hakkimizda", {
          templateUrl: "main/hakkimizda.html",
          controller: "HakkimizdaCtrl"
        })
        .when("/sss", {
          templateUrl: "main/sss.html",
          controller: "SSSCtrl"
        })
        .when("/kisisel-verilerin-korunmasi", {
          templateUrl: "main/kisisel.html",
          controller: "KisiselCtrl"
        })
        .when("/iletisim", {
          templateUrl: "main/iletisim.html",
          controller: "IletisimCtrl"
        })
        .when("/email-onay", {
          templateUrl: "main/email_onay.html",
          controller: "EmailOnayCtrl"
        })
        .when("/profil", {
          templateUrl: "main/profil.html",
          controller: "ProfilCtrl"
        });
    }
  ])
  .controller("MainCtrl", ["$http", "$scope", function($http, $scope) {}])
  .controller("HakkimizdaCtrl", ["$http", "$scope", function($http, $scope) {}])
  .controller("SSSCtrl", ["$http", "$scope", function($http, $scope) {}])
  .controller("KisiselCtrl", ["$http", "$scope", function($http, $scope) {}])
  .controller("IletisimCtrl", ["$http", "$scope", function($http, $scope) {}])
  .controller("ProfilCtrl", [
    "$http",
    "$scope",
    "$state",
    "$window",
    "$timeout",
    "appSettings",
    "userProfile",
    "SweetAlert",
    function(
      $http,
      $scope,
      $state,
      $window,
      $timeout,
      appSettings,
      userProfile,
      SweetAlert
    ) {
      $scope.profilFormData = {};
      $scope.profilFormError = {};
      $scope.sifreFormData = {};
      $scope.sifreFormError = {};
      $scope.isLoggedIn = userProfile.isLoggedIn();
      if (!$scope.isLoggedIn) $state.go("main");

      $http
        .get(appSettings.serverUrl + "users/user", {
          headers: userProfile.getAuthHeaders()
        })
        .then(
          function(response) {
            if (response.status == 200) $scope.profilFormData = response.data;
          },
          function(response) {
            if (response.status == 400)
              SweetAlert.swal("Bir Sorun Oluştu!", response.data, "error");
          }
        );

      $scope.profilSbmt = function(e) {
        e.preventDefault();
        $http
          .post(appSettings.serverUrl + "users/update", $scope.profilFormData, {
            headers: userProfile.getAuthHeaders()
          })
          .then(
            function(response) {
              if (response.status == 200) {
                SweetAlert.swal(
                  {
                    title: "Başarılı",
                    text: response.data,
                    type: "success",
                    showCancelButton: false,
                    confirmButtonColor: "#30c13f",
                    confirmButtonText: "Tamam",
                    closeOnConfirm: false
                  },
                  function() {
                    $window.location.reload();
                  }
                );
              }
            },
            function(response) {
              if (response.status == 400)
                $scope.profilFormError = response.data;
            }
          );
      };

      $scope.passwordSbmt = function(e) {
        e.preventDefault();
        $http
          .post(
            appSettings.serverUrl + "users/changepassword",
            $scope.sifreFormData,
            {
              headers: userProfile.getAuthHeaders()
            }
          )
          .then(
            function(response) {
              if (response.status == 200) {
                SweetAlert.swal(
                  {
                    title: "Başarılı",
                    text: response.data,
                    type: "success",
                    showCancelButton: false,
                    confirmButtonColor: "#30c13f",
                    confirmButtonText: "Tamam",
                    closeOnConfirm: false
                  },
                  function() {
                    $window.location.reload();
                  }
                );
              }
            },
            function(response) {
              if (response.status == 400) $scope.sifreFormError = response.data;
            }
          );
      };
    }
  ])
  .controller("EmailOnayCtrl", [
    "$http",
    "$scope",
    "$routeParams",
    function($http, $scope, $routeParams) {
      $scope.result = $routeParams.result;
      $scope.msg = $routeParams.msg;
    }
  ]);
