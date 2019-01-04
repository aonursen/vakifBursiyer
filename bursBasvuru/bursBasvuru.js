"use strict";

angular
  .module("gursoyVakfi.bursBasvuru", ["ngRoute", "ngFileUpload"])

  .config([
    "$routeProvider",
    function($routeProvider) {
      $routeProvider
        .when("/burs-basvuru-kisisel", {
          templateUrl: "bursBasvuru/kisisel.html",
          controller: "BursBasvuruKisiselCtrl"
        })
        .when("/burs-basvuru-egitim", {
          templateUrl: "bursBasvuru/egitim.html",
          controller: "BursBasvuruEgitimCtrl"
        })
        .when("/burs-basvuru-aile", {
          templateUrl: "bursBasvuru/aile.html",
          controller: "BursBasvuruAileCtrl"
        })
        .when("/burs-basvuru-mali", {
          templateUrl: "bursBasvuru/mali.html",
          controller: "BursBasvuruMaliCtrl"
        })
        .when("/burs-basvuru-belgeler", {
          templateUrl: "bursBasvuru/belgeler.html",
          controller: "BursBasvuruBelgelerCtrl"
        })
        .when("/burs-basvuru-sonuc", {
          templateUrl: "bursBasvuru/sonuc.html",
          controller: "BursBasvuruSonucCtrl"
        });
    }
  ])
  // .run(function($rootScope, Idle, userProfile, $state) {
  //   Idle.watch();
  //   $rootScope.$on("IdleTimeout", function() {
  //     userProfile.logout();
  //     $state.go("main");
  //   });
  // })
  .controller("BursBasvuruKisiselCtrl", [
    "$scope",
    "$http",
    "$window",
    "$state",
    "$timeout",
    "globs",
    "userProfile",
    "appSettings",
    "SweetAlert",
    function(
      $scope,
      $http,
      $window,
      $state,
      $timeout,
      globs,
      userProfile,
      appSettings,
      SweetAlert
    ) {
      $scope.globs = globs;
      $scope.isLoggedIn = userProfile.isLoggedIn();
      $scope.kisiselFormData = {};
      $scope.kisiselFormError = {};
      $scope.kisiselErrModal = {};
      $scope.selectedCity = {};
      $scope.currentStep = 1;
      $scope.recordIsExist = false;

      $scope.isAuthenticated = function() {
        if (!$scope.isLoggedIn) $state.go("main");
      };
      $scope.isAuthenticated();

      if (Object.keys(globs.getCities()).length === 0) globs.setCities();

      $scope.getKisisel = function() {
        $http
          .post(appSettings.serverUrl + "personal/get", null, {
            headers: userProfile.getAuthHeaders()
          })
          .then(
            function(response) {
              if (
                response.status == 200 &&
                Object.keys(response.data).length > 0
              ) {
                $scope.recordIsExist = true;
                $scope.kisiselFormData = response.data;
                globs.setTowns(response.data.IdentityCity, "first");
                globs.setTowns(response.data.StdAddressCity, "second");
                SweetAlert.swal(
                  {
                    title: "Verilerinizi güncellemek ister misiniz ?",
                    text:
                      "Daha önce girmiş olduğunuz verileri güncellemek ister misiniz ?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#30c13f",
                    confirmButtonText: "Evet",
                    cancelButtonText: "Hayır",
                    closeOnConfirm: true,
                    closeOnCancel: true
                  },
                  function(isConfirm) {
                    if (!isConfirm) {
                      $state.go("bursBasvuruEgitim");
                    }
                  }
                );
              }
            },
            function(response) {
              if (response.status == 400)
                SweetAlert.swal("Bir Sorun Oluştu!", response.data, "error");
            }
          );
      };
      $scope.getKisisel();

      $scope.kisiselSbmt = function(e) {
        if (!$scope.recordIsExist) {
          $http
            .post(
              appSettings.serverUrl + "personal/save",
              $scope.kisiselFormData,
              { headers: userProfile.getAuthHeaders() }
            )
            .then(
              function(response) {
                if (response.status == 201) {
                  $http
                    .post(appSettings.serverUrl + "users/stateupdate", null, {
                      headers: userProfile.getAuthHeaders()
                    })
                    .then(
                      function(response) {
                        if (response.status == 200)
                          $state.go("bursBasvuruEgitim");
                      },
                      function(response) {
                        if (response.status == 400)
                          SweetAlert.swal(
                            "Bir Sorun Oluştu!",
                            response.data,
                            "error"
                          );
                      }
                    );
                }
              },
              function(response) {
                if (response.status == 400) {
                  $scope.kisiselFormError = response.data;
                }
              }
            );
        } else {
          $http
            .post(
              appSettings.serverUrl + "personal/update",
              $scope.kisiselFormData,
              { headers: userProfile.getAuthHeaders() }
            )
            .then(
              function(response) {
                if (response.status == 201) {
                  $http
                    .post(appSettings.serverUrl + "users/stateupdate", null, {
                      headers: userProfile.getAuthHeaders()
                    })
                    .then(
                      function(response) {
                        if (response.status == 200)
                          $state.go("bursBasvuruEgitim");
                      },
                      function(response) {
                        if (response.status == 400)
                          SweetAlert.swal(
                            "Bir Sorun Oluştu!",
                            response.data,
                            "error"
                          );
                      }
                    );
                }
              },
              function(response) {
                if (response.status == 400) {
                  $scope.kisiselFormError = response.data;
                }
              }
            );
        }
        e.preventDefault();
      };
    }
  ])
  .controller("BursBasvuruEgitimCtrl", [
    "$scope",
    "$http",
    "$state",
    "$window",
    "globs",
    "userProfile",
    "appSettings",
    "SweetAlert",
    function(
      $scope,
      $http,
      $state,
      $window,
      globs,
      userProfile,
      appSettings,
      SweetAlert
    ) {
      $scope.globs = globs;
      $scope.isLoggedIn = userProfile.isLoggedIn();
      $scope.egitimFormData = {};
      $scope.egitimFormError = {};
      $scope.egitimErrModal = {};
      $scope.currentStep = 2;
      $scope.recordIsExist = false;

      $scope.isAuthenticated = function() {
        if (!$scope.isLoggedIn) $state.go("main");
      };
      $scope.isAuthenticated();

      if (Object.keys(globs.getUniversities()).length === 0)
        globs.setUniversities();
      if (Object.keys(globs.getCities()).length === 0) globs.setCities();

      $scope.getEgitim = function() {
        $http
          .post(appSettings.serverUrl + "education/get", null, {
            headers: userProfile.getAuthHeaders()
          })
          .then(
            function(response) {
              if (
                response.status == 200 &&
                Object.keys(response.data).length > 0
              ) {
                $scope.recordIsExist = true;
                $scope.egitimFormData = response.data;
                globs.setFaculties(response.data.UniversityId);
                globs.setDepartments(response.data.UniversityFaculty);
                globs.setTowns(response.data.UniversityCity, "first");
                globs.refreshSelectPicker();
                SweetAlert.swal(
                  {
                    title: "Verilerinizi güncellemek ister misiniz ?",
                    text:
                      "Daha önce girmiş olduğunuz verileri güncellemek ister misiniz ?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#30c13f",
                    confirmButtonText: "Evet",
                    cancelButtonText: "Hayır",
                    closeOnConfirm: true,
                    closeOnCancel: true
                  },
                  function(isConfirm) {
                    if (!isConfirm) {
                      $state.go("bursBasvuruAile");
                    }
                  }
                );
              }
            },
            function(response) {
              if (response.status == 400)
                SweetAlert.swal("Bir Sorun Oluştu!", response.data, "error");
            }
          );
      };
      $scope.getEgitim();

      $scope.egitimSbmt = function(e) {
        if (!$scope.recordIsExist) {
          $http
            .post(
              appSettings.serverUrl + "education/save",
              $scope.egitimFormData,
              { headers: userProfile.getAuthHeaders() }
            )
            .then(
              function(response) {
                if (response.status == 201) {
                  $http
                    .post(appSettings.serverUrl + "users/stateupdate", null, {
                      headers: userProfile.getAuthHeaders()
                    })
                    .then(
                      function(response) {
                        if (response.status == 200)
                          $state.go("bursBasvuruAile");
                      },
                      function(response) {
                        if (response.status == 400)
                          SweetAlert.swal(
                            "Bir Sorun Oluştu!",
                            response.data,
                            "error"
                          );
                      }
                    );
                }
              },
              function(response) {
                if (response.status == 400) {
                  $scope.egitimFormError = response.data;
                }
              }
            );
        } else {
          $http
            .post(
              appSettings.serverUrl + "education/update",
              $scope.egitimFormData,
              { headers: userProfile.getAuthHeaders() }
            )
            .then(
              function(response) {
                if (response.status == 201) {
                  $http
                    .post(appSettings.serverUrl + "users/stateupdate", null, {
                      headers: userProfile.getAuthHeaders()
                    })
                    .then(
                      function(response) {
                        if (response.status == 200)
                          $state.go("bursBasvuruAile");
                      },
                      function(response) {
                        if (response.status == 400)
                          SweetAlert.swal(
                            "Bir Sorun Oluştu!",
                            response.data,
                            "error"
                          );
                      }
                    );
                }
              },
              function(response) {
                if (response.status == 400) {
                  $scope.egitimFormError = response.data;
                }
              }
            );
        }
        e.preventDefault();
      };
    }
  ])
  .controller("BursBasvuruAileCtrl", [
    "$scope",
    "$http",
    "$state",
    "$window",
    "globs",
    "userProfile",
    "appSettings",
    "SweetAlert",
    function(
      $scope,
      $http,
      $state,
      $window,
      globs,
      userProfile,
      appSettings,
      SweetAlert
    ) {
      $scope.globs = globs;
      $scope.isLoggedIn = userProfile.isLoggedIn();
      $scope.aileFormData = {};
      $scope.aileFormError = {};
      $scope.currentStep = 3;
      $scope.recordIsExist = false;

      $scope.isAuthenticated = function() {
        if (!$scope.isLoggedIn) $state.go("main");
      };
      $scope.isAuthenticated();

      if (Object.keys(globs.getCities()).length === 0) globs.setCities();

      $scope.aileSbmt = function(e) {
        if (!$scope.recordIsExist) {
          $http
            .post(appSettings.serverUrl + "family/save", $scope.aileFormData, {
              headers: userProfile.getAuthHeaders()
            })
            .then(
              function(response) {
                if (response.status == 201) {
                  $http
                    .post(appSettings.serverUrl + "users/stateupdate", null, {
                      headers: userProfile.getAuthHeaders()
                    })
                    .then(
                      function(response) {
                        if (response.status == 200)
                          $state.go("bursBasvuruMali");
                      },
                      function(response) {
                        if (response.status == 400)
                          SweetAlert.swal(
                            "Bir Sorun Oluştu!",
                            response.data,
                            "error"
                          );
                      }
                    );
                }
              },
              function(response) {
                if (response.status == 400) {
                  $scope.aileFormError = response.data;
                }
              }
            );
        } else {
          $http
            .post(
              appSettings.serverUrl + "family/update",
              $scope.aileFormData,
              {
                headers: userProfile.getAuthHeaders()
              }
            )
            .then(
              function(response) {
                if (response.status == 201) {
                  $http
                    .post(appSettings.serverUrl + "users/stateupdate", null, {
                      headers: userProfile.getAuthHeaders()
                    })
                    .then(
                      function(response) {
                        if (response.status == 200)
                          $state.go("bursBasvuruMali");
                      },
                      function(response) {
                        if (response.status == 400)
                          SweetAlert.swal(
                            "Bir Sorun Oluştu!",
                            response.data,
                            "error"
                          );
                      }
                    );
                }
              },
              function(response) {
                if (response.status == 400) {
                  $scope.aileFormError = response.data;
                }
              }
            );
        }
        e.preventDefault();
      };

      $scope.getAile = function() {
        $http
          .post(appSettings.serverUrl + "family/get", null, {
            headers: userProfile.getAuthHeaders()
          })
          .then(
            function(response) {
              if (
                response.status == 200 &&
                Object.keys(response.data).length > 0
              ) {
                $scope.aileFormData = response.data;
                $scope.recordIsExist = true;
                globs.setTowns(response.data.ParentAddressCity, "first");
                globs.refreshSelectPicker();
                SweetAlert.swal(
                  {
                    title: "Verilerinizi güncellemek ister misiniz ?",
                    text:
                      "Daha önce girmiş olduğunuz verileri güncellemek ister misiniz ?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#30c13f",
                    confirmButtonText: "Evet",
                    cancelButtonText: "Hayır",
                    closeOnConfirm: true,
                    closeOnCancel: true
                  },
                  function(isConfirm) {
                    if (!isConfirm) {
                      $state.go("bursBasvuruMali");
                    }
                  }
                );
              }
            },
            function(response) {
              if (response.status == 400)
                SweetAlert.swal("Bir Sorun Oluştu!", response.data, "error");
            }
          );
      };
      $scope.getAile();
    }
  ])
  .controller("BursBasvuruMaliCtrl", [
    "$scope",
    "$http",
    "$state",
    "$window",
    "globs",
    "userProfile",
    "appSettings",
    "SweetAlert",
    function(
      $scope,
      $http,
      $state,
      $window,
      globs,
      userProfile,
      appSettings,
      SweetAlert
    ) {
      $scope.globs = globs;
      $scope.isLoggedIn = userProfile.isLoggedIn();
      $scope.maliFormData = {};
      $scope.maliFormError = {};
      $scope.currentStep = 4;
      $scope.recordIsExist = false;

      $scope.isAuthenticated = function() {
        if (!$scope.isLoggedIn) $state.go("main");
      };
      $scope.isAuthenticated();

      globs.setBanks();

      $scope.maliSbmt = function(e) {
        if (!$scope.recordIsExist) {
          $http
            .post(
              appSettings.serverUrl + "financial/save",
              $scope.maliFormData,
              {
                headers: userProfile.getAuthHeaders()
              }
            )
            .then(
              function(response) {
                if (response.status == 201) {
                  $http
                    .post(appSettings.serverUrl + "users/stateupdate", null, {
                      headers: userProfile.getAuthHeaders()
                    })
                    .then(
                      function(response) {
                        if (response.status == 200)
                          $state.go("bursBasvuruBelgeler");
                      },
                      function(response) {
                        if (response.status == 400)
                          SweetAlert.swal(
                            "Bir Sorun Oluştu!",
                            response.data,
                            "error"
                          );
                      }
                    );
                }
              },
              function(response) {
                if (response.status == 400) {
                  $scope.maliFormError = response.data;
                }
              }
            );
        } else {
          $http
            .post(
              appSettings.serverUrl + "financial/update",
              $scope.maliFormData,
              {
                headers: userProfile.getAuthHeaders()
              }
            )
            .then(
              function(response) {
                if (response.status == 201) {
                  $http
                    .post(appSettings.serverUrl + "users/stateupdate", null, {
                      headers: userProfile.getAuthHeaders()
                    })
                    .then(
                      function(response) {
                        if (response.status == 200)
                          $state.go("bursBasvuruBelgeler");
                      },
                      function(response) {
                        if (response.status == 400)
                          SweetAlert.swal(
                            "Bir Sorun Oluştu!",
                            response.data,
                            "error"
                          );
                      }
                    );
                }
              },
              function(response) {
                if (response.status == 400) {
                  $scope.maliFormError = response.data;
                }
              }
            );
        }
        e.preventDefault();
      };

      $scope.getMali = function() {
        $http
          .post(appSettings.serverUrl + "financial/get", null, {
            headers: userProfile.getAuthHeaders()
          })
          .then(
            function(response) {
              if (
                response.status == 200 &&
                Object.keys(response.data).length > 0
              ) {
                $scope.maliFormData = response.data;
                $scope.recordIsExist = true;
                globs.refreshSelectPicker();
                SweetAlert.swal(
                  {
                    title: "Verilerinizi güncellemek ister misiniz ?",
                    text:
                      "Daha önce girmiş olduğunuz verileri güncellemek ister misiniz ?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#30c13f",
                    confirmButtonText: "Evet",
                    cancelButtonText: "Hayır",
                    closeOnConfirm: true,
                    closeOnCancel: true
                  },
                  function(isConfirm) {
                    if (!isConfirm) {
                      $state.go("bursBasvuruBelgeler");
                    }
                  }
                );
              }
            },
            function(response) {
              if (response.status == 400)
                SweetAlert.swal("Bir Sorun Oluştu!", response.data, "error");
            }
          );
      };
      $scope.getMali();
    }
  ])
  .controller("BursBasvuruBelgelerCtrl", [
    "$scope",
    "$http",
    "$sce",
    "$timeout",
    "$state",
    "$window",
    "Upload",
    "globs",
    "userProfile",
    "appSettings",
    "SweetAlert",
    function(
      $scope,
      $http,
      $sce,
      $timeout,
      $state,
      $window,
      Upload,
      globs,
      userProfile,
      appSettings,
      SweetAlert
    ) {
      $scope.globs = globs;
      $scope.isLoggedIn = userProfile.isLoggedIn();
      $scope.belgeFormData = {};
      $scope.belgeFormError = {};
      $scope.currentStep = 5;
      $scope.recordIsExist = false;
      $scope.userCanUpload = false;
      $scope.userHasData = false;
      $scope.uploadedDocBase64 = {};
      $scope.uploadDocProgress = {
        UserAvatar: 0,
        StdStatusDoc: 0,
        IdentityCardDoc: 0,
        LYSResultDoc: 0,
        VukuatliNufusKayit: 0,
        StdTranscript: 0,
        DisciplineStatusDoc: 0
      };

      $scope.triggerLoading = function(canStart, id = null) {
        if (canStart) {
          if (id) {
            $(function() {
              $("#id_" + id + "View").html(
                '<i class="fa fa-spinner fa-pulse fa-fw"></i>'
              );
            });
          } else {
            $(function() {
              $(".viewBtn").html(
                '<i class="fa fa-spinner fa-pulse fa-fw"></i>'
              );
            });
          }
        } else {
          if (id) {
            $(function() {
              $("#id_" + id + "View").html("Görüntüle");
            });
          } else {
            $(function() {
              $(".viewBtn").html("Görüntüle");
            });
          }
        }
      };

      $scope.isAuthenticated = function() {
        if (!$scope.isLoggedIn) $state.go("main");
      };
      $scope.isAuthenticated();

      $scope.belgeSbmt = function(e) {
        e.preventDefault();
        $http
          .post(appSettings.serverUrl + "doc/check", $scope.belgeFormData, {
            headers: userProfile.getAuthHeaders()
          })
          .then(
            function(response) {
              if (response.status == 200) {
                if ($scope.userHasData) {
                  SweetAlert.swal(
                    {
                      title: "Verileriniz güncellendi!",
                      text:
                        "Kişisel verileriniz güncellendi. Diğer bilgilerininizi güncellemek ister misiniz ?",
                      type: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#30c13f",
                      confirmButtonText: "Evet",
                      cancelButtonText: "Hayır",
                      closeOnConfirm: true,
                      closeOnCancel: true
                    },
                    function() {
                      $http
                        .post(
                          appSettings.serverUrl + "users/stateupdate",
                          null,
                          {
                            headers: userProfile.getAuthHeaders()
                          }
                        )
                        .then(
                          function(response) {
                            if (response.status == 200)
                              $state.go("bursBasvuruSonuc");
                          },
                          function(response) {
                            if (response.status == 400)
                              SweetAlert.swal(
                                "Bir Sorun Oluştu!",
                                response.data,
                                "error"
                              );
                          }
                        );
                    }
                  );
                } else $state.go("bursBasvuruSonuc");
              }
            },
            function(response) {
              if (response.status == 400)
                SweetAlert.swal("Bir Sorun Oluştu!", response.data, "error");
            }
          );
      };

      $scope.getBelgeler = function() {
        $scope.triggerLoading(true);
        $http
          .get(appSettings.serverUrl + "doc/getcount", {
            headers: userProfile.getAuthHeaders()
          })
          .then(
            function(response) {
              if (response.status == 200) {
                $scope.userHasData = true;
                SweetAlert.swal(
                  {
                    title: "Verilerinizi güncellemek ister misiniz ?",
                    text:
                      "Daha önce girmiş olduğunuz verileri güncellemek ister misiniz ?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#30c13f",
                    confirmButtonText: "Evet",
                    cancelButtonText: "Hayır",
                    closeOnConfirm: true,
                    closeOnCancel: true
                  },
                  function(isConfirm) {
                    if (!isConfirm) {
                      $state.go("bursBasvuruSonuc");
                    }
                  }
                );
                $scope.userCanUpload = true;
                $scope.triggerLoading(false);
              } else if (response.status == 204) {
                $scope.userHasData = false;
                $scope.userCanUpload = true;
                $scope.triggerLoading(false);
              }
            },
            function(response) {
              if (response.status == 400) {
                $scope.userHasData = false;
                $scope.userCanUpload = true;
                $scope.triggerLoading(false);
              }
            }
          );
      };
      $scope.getBelgeler();

      $scope.viewUploadedDoc = function(docName) {
        $scope.triggerLoading(true, docName);
        $http
          .get(appSettings.serverUrl + "doc/get" + docName, {
            headers: userProfile.getAuthHeaders()
          })
          .then(
            function(response) {
              if (response.status == 200) {
                $scope.triggerLoading(false, docName);
                if (response.data[0].Belge) {
                  var file =
                    "data:" +
                    response.data[0].Type +
                    ";base64," +
                    response.data[0].Belge;
                  angular
                    .element("#uploadedDocModalBody")
                    .html("")
                    .append(
                      '<iframe src="' +
                        file +
                        '" height="720" width="100%"></iframe>'
                    );
                  angular.element("#uploadedDocModal").modal("show");
                } else {
                  SweetAlert.swal(
                    "Bir Sorun Oluştu!",
                    "Herhangi bir kayıt bulunamadı.",
                    "error"
                  );
                }
              }
            },
            function(response) {
              if (response.status == 400)
                SweetAlert.swal("Bir Sorun Oluştu!", response.data, "error");
            }
          );
      };

      $scope.upload = function(file, docName, e) {
        if (file.size < 512000) {
          $scope.uploadDocProgress[docName] = 0;
          angular.element("#" + docName + "_Inp").hide();
          angular.element("#" + docName + "_Prog").show();
          Upload.upload({
            url: appSettings.serverUrl + "doc/upload/" + docName + "",
            data: { file: file, format: file.type },
            headers: userProfile.getAuthHeaders()
          }).then(
            function(response) {
              if (response.status == 200) {
                $http
                  .post(appSettings.serverUrl + "users/stateupdate", null, {
                    headers: userProfile.getAuthHeaders()
                  })
                  .then(
                    function(response) {
                      if (response.status == 200)
                        SweetAlert.swal(
                          "Dosyanız Yüklendi!",
                          "Dosya başarılı bir şekilde yüklendi.",
                          "success"
                        );
                    },
                    function(response) {
                      if (response.status == 400)
                        SweetAlert.swal(
                          "Bir Sorun Oluştu!",
                          response.data,
                          "error"
                        );
                    }
                  );
                $scope.belgeFormData[docName] = null;
                $scope.uploadedDocBase64[docName] = response.data;
                angular.element("#" + docName + "_Prog").hide();
                angular.element("#" + docName + "_Inp").show();
              }
            },
            function(response) {
              if (response.status == 400) {
                angular
                  .element("#uploadedDocModalBody")
                  .html("")
                  .append("<h6 class='text-center'>" + response.data + "</h6>");
                angular.element("#uploadedDocModal").modal("show");
                angular.element("#" + docName + "_Prog").hide();
                angular.element("#" + docName + "_Inp").show();
              }
            },
            function(evt) {
              var progressPercentage = parseInt(
                (100.0 * evt.loaded) / evt.total
              );
              $scope.uploadDocProgress[docName] = progressPercentage;
            }
          );
        } else {
          SweetAlert.swal(
            "Bir Sorun Oluştu!",
            "Girilen Dosya Boyutu 500KB'dan büyük olamaz.",
            "error"
          );
        }
      };
    }
  ])
  .controller("BursBasvuruSonucCtrl", [
    "$scope",
    "$http",
    "$sce",
    "$timeout",
    "$state",
    "$window",
    "Upload",
    "globs",
    "userProfile",
    "appSettings",
    function(
      $scope,
      $http,
      $sce,
      $timeout,
      $state,
      $window,
      Upload,
      globs,
      userProfile,
      appSettings
    ) {
      $scope.globs = globs;
      $scope.isLoggedIn = userProfile.isLoggedIn();
      $scope.belgeFormData = {};
      $scope.belgeFormError = {};
      $scope.currentStep = 5;
      $scope.recordIsExist = false;
      $scope.userCanUpload = false;
      $scope.uploadedDocBase64 = {};
      $scope.uploadDocProgress = {
        UserAvatar: 0,
        StdStatusDoc: 0,
        IdentityCardDoc: 0,
        LYSResultDoc: 0,
        VukuatliNufusKayit: 0,
        StdTranscript: 0,
        DisciplineStatusDoc: 0
      };

      $scope.isAuthenticated = function() {
        if (!$scope.isLoggedIn) $state.go("main");
      };
      $scope.isAuthenticated();
    }
  ]);
