"use strict";

angular
  .module("gursoyVakfi", [
    "angular-jwt",
    "ngRoute",
    "ui.router",
    "gursoyVakfi.main",
    "gursoyVakfi.bursBasvuru",
    "gursoyVakfi.version",
    "ngMask",
    "ngFileUpload",
    "oitozero.ngSweetAlert"
  ])
  .constant("appSettings", {
    serverUrl: "https://gursoyvakfi2.azurewebsites.net/api/"
  })
  .config([
    "$locationProvider",
    "$stateProvider",
    "$routeProvider",
    function($locationProvider, $stateProvider, $routeProvider) {
      $stateProvider
        .state("main", {
          url: "/",
          templateUrl: "main/main.html",
          controller: "MainCtrl"
        })
        .state("hakkimizda", {
          url: "/hakkimizda",
          templateUrl: "main/hakkimizda.html",
          controller: "HakkimizdaCtrl"
        })
        .state("sikcaSorulanSorular", {
          url: "/sss",
          templateUrl: "main/sss.html",
          controller: "SSSCtrl"
        })
        .state("kisiselVerilerinKorunmasi", {
          url: "/kisisel-verilerin-korunmasi",
          templateUrl: "main/kisisel.html",
          controller: "KisiselCtrl"
        })
        .state("iletisim", {
          url: "/iletisim",
          templateUrl: "main/iletisim.html",
          controller: "IletisimCtrl"
        })
        .state("profil", {
          url: "/profil",
          templateUrl: "main/profil.html",
          controller: "ProfilCtrl"
        })
        .state("bursBasvuruKisisel", {
          url: "/burs-basvuru-kisisel",
          templateUrl: "bursBasvuru/kisisel.html",
          controller: "BursBasvuruKisiselCtrl"
        })
        .state("bursBasvuruEgitim", {
          url: "/burs-basvuru-egitim",
          templateUrl: "bursBasvuru/egitim.html",
          controller: "BursBasvuruEgitimCtrl"
        })
        .state("bursBasvuruAile", {
          url: "/burs-basvuru-aile",
          templateUrl: "bursBasvuru/aile.html",
          controller: "BursBasvuruAileCtrl"
        })
        .state("bursBasvuruMali", {
          url: "/burs-basvuru-mali",
          templateUrl: "bursBasvuru/mali.html",
          controller: "BursBasvuruMaliCtrl"
        })
        .state("bursBasvuruBelgeler", {
          url: "/burs-basvuru-belgeler",
          templateUrl: "bursBasvuru/belgeler.html",
          controller: "BursBasvuruBelgelerCtrl"
        })
        .state("bursBasvuruSonuc", {
          url: "/burs-basvuru-sonuc",
          templateUrl: "bursBasvuru/sonuc.html",
          controller: "BursBasvuruSonucCtrl"
        })
        .state("emailOnay", {
          url: "/email-onay",
          templateUrl: "main/email_onay.html",
          controller: "EmailOnayCtrl"
        });
      $routeProvider.otherwise({ redirectTo: "/" });
    }
  ])
  .controller("IndexCtrl", [
    "appSettings",
    "$http",
    "$scope",
    "$timeout",
    "$window",
    "userProfile",
    function(appSettings, $http, $scope, $timeout, $window, userProfile) {
      $scope.isLoggedIn = false;
      $scope.loginFormData = {};
      $scope.loginFormError = null;
      $scope.registerFormData = {};
      $scope.registerFormError = {};
      $scope.forgotPasswordData = {};
      $scope.forgotPasswordError = null;
      $scope.isForgotPasswordSuccess = false;
      $scope.isRegistered = false;
      $scope.siteStatus = false;
      $scope.userStatus = false;
      $scope.isLogged = function() {
        $scope.isLoggedIn = userProfile.isLoggedIn();
      };
      $scope.isLogged();
      $scope.login = function() {
        if (this.loginForm.$valid) {
          $scope.loginFormError = null;
          $http
            .post(appSettings.serverUrl + "Auth/login", $scope.loginFormData)
            .then(
              function(response) {
                if (response.status == 200) {
                  userProfile.setProfile(
                    JSON.stringify({
                      timestamp: new Date(),
                      accessToken: response.data
                    })
                  );
                  angular.element("#loginModal2").modal("hide");
                  $timeout(function() {
                    $window.location.reload();
                  }, 500);
                }
              },
              function(response) {
                if (response.status == 401) {
                  $scope.loginFormError = "Kullanıcı adı veya şifre hatalı";
                } else if (response.status == 400) {
                  $scope.loginFormError = "İstek sırasında bir sorun oluştu";
                }
              }
            );
        }
      };

      $scope.register = function() {
        if (this.registerForm.$valid) {
          $scope.registerFormError = {};
          $http
            .post(
              appSettings.serverUrl + "Auth/register",
              $scope.registerFormData
            )
            .then(
              function(response) {
                if (response.status == 201) {
                  $scope.isRegistered = true;
                }
              },
              function(response) {
                if (response.status == 400) {
                  $scope.registerFormError = response.data;
                }
              }
            );
        }
      };

      $scope.forgotPassword = function() {
        if (this.forgotPasswordForm.$valid) {
          $scope.forgotPasswordError = null;
          $http
            .post(appSettings.serverUrl + "Auth/forget", $scope.forgotPasswordData)
            .then(
              function(response) {
                if (response.status == 200) {
                  $scope.isForgotPasswordSuccess = true;
                }
              },
              function(response) {
                if (response.status == 400) $scope.forgotPasswordError = response.data;
              }
            );
        }
      };

      $scope.logout = function() {
        if ($scope.isLogged) {
          userProfile.logout();
          $scope.isLogged();
        }
      };

      if ($scope.isLoggedIn) {
        $http
          .get(appSettings.serverUrl + "personal/getSystem", {
            headers: userProfile.getAuthHeaders()
          })
          .then(
            function(response) {
              if (response.status == 200) {
                $scope.siteStatus = response.data.Durum;
              }
            },
            function(response) {
              // error handler yazılacak
            }
          );
        $http
          .get(appSettings.serverUrl + "users/status", {
            headers: userProfile.getAuthHeaders()
          })
          .then(
            function(response) {
              $scope.userStatus = response.data;
            },
            function(response) {
              // error handler yazılacak
            }
          );
      }
    }
  ]);
