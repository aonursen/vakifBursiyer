(function() {
  "use strict";
  angular.module("gursoyVakfi").service("globs", [
    "$http",
    "$timeout",
    "appSettings",
    function($http, $timeout, appSettings) {
      var Cities = {};
      var TownsFirst = {};
      var TownsSecond = {};
      var Universities = {};
      var Faculties = {};
      var Departments = {};
      var Banks = {};
      var modalHeaderMsg = "";
      var modalBodyMsg = "";

      function refreshSelectPicker() {
        $(function() {
          $(".selectpicker").selectpicker("refresh");
        });
      }

      function setModalHeader(headerMsg) {
        modalHeaderMsg = headerMsg;
      }

      function setModalBody(bodyMsg) {
        modalBodyMsg = bodyMsg;
      }

      this.refreshSelectPicker = function() {
        refreshSelectPicker();
      };

      this.getModalHeader = function () {
        return modalHeaderMsg;
      };

      this.getModalBody = function () {
        return modalBodyMsg;
      };

      this.setCities = function() {
        $http.get(appSettings.serverUrl + "cities/city").then(
          function(response) {
            if (response.status == 200) {
              Cities = response.data;
              refreshSelectPicker();
            }
          },
          function(response) {
            if (response.status == 400) {
              // error handler yazılacak
            }
          }
        );
      };

      this.getCities = function() {
        return Cities;
      };

      this.setTowns = function(city, type) {
        if (city) {
          $http.get(appSettings.serverUrl + "cities/town/?CityId=" + city).then(
            function(response) {
              if (response.status == 200) {
                if (type) {
                  type === "first"
                    ? (TownsFirst = response.data)
                    : (TownsSecond = response.data);
                  $timeout(function() {
                    refreshSelectPicker();
                  }, 1000);
                }
              }
            },
            function(response) {
              if (response.status == 400) {
                // error handler yazılacak
              }
            }
          );
        } else refreshSelectPicker();
      };

      this.getTownsFirst = function() {
        return TownsFirst;
      };

      this.getTownsSecond = function() {
        return TownsSecond;
      };

      this.setUniversities = function() {
        $http.get(appSettings.serverUrl + "universities/university").then(
          function(response) {
            if (response.status == 200) {
              Universities = response.data;
              refreshSelectPicker();
            }
          },
          function(response) {
            if (response.status == 400) {
              // error handler yazılacak
            }
          }
        );
      };

      this.getUniversities = function() {
        return Universities;
      };

      this.setFaculties = function(universityId) {
        if (universityId) {
          $http
            .get(
              appSettings.serverUrl +
                "universities/universityfaculty/?universityId=" +
                universityId
            )
            .then(
              function(response) {
                Faculties = response.data;
                refreshSelectPicker();
              },
              function(response) {
                //error handler yazılacak
              }
            );
        } else {Faculties = {}; refreshSelectPicker();}
      };

      this.getFaculties = function() {
        return Faculties;
      };

      this.setDepartments = function(facultyId) {
        if (facultyId) {
          $http
            .get(
              appSettings.serverUrl +
                "universities/universitydepartment/?facultyId=" +
                facultyId
            )
            .then(
              function(response) {
                Departments = response.data;
                refreshSelectPicker();
              },
              function(response) {
                // error handler yazılacak
              }
            );
        } else {Departments = {}; refreshSelectPicker();}
      };

      this.getDepartments = function() {
        return Departments;
      };

      this.setBanks = function () {
        $http.get(appSettings.serverUrl + "bank").then(
            function (response) {
              Banks = response.data;
              refreshSelectPicker();
            },
            function (response) {
               // error handler yazılacak
            }
        );
      };

      this.getBanks = function () {
        return Banks;
      };
    }
  ]);
})();
