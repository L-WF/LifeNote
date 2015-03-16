angular.module('starter.controllers', [])


.controller('tabsCtrl', function($scope, $ionicTabsDelegate) {
  /*$ionicTabsDelegate.$getByHandle('tabs').select(0)
  ionic.onGesture('dragleft', function(e) {
    $ionicTabsDelegate.$getByHandle('tabs').select(0)
  },document.querySelector('ion-tabs'));
  ionic.onGesture('dragright', function(e) {
    $ionicTabsDelegate.$getByHandle('tabs').select(1)
  },document.querySelector('ion-tabs'));*/
})

.controller('loginCtrl', function($scope, $state, $ionicLoading, $http, $timeout, $rootScope) {
  $scope.loginUser = { username: '', password: "" };
  $scope.errorShow = false;
  $scope.failShow = false;

  $scope.login = function() {
    $ionicLoading.show({
      template: '<ion-spinner icon="android"></ion-spinner>'
    });
    
    $http.get('http://lwf1993.sinaapp.com/loginOrRegist/login.php?name='+$scope.loginUser.username+'&password='+$scope.loginUser.password)
    .success(function(data) {
      if (data == "error")
      {
        $scope.errorShow = true;
        $timeout(function() {
        $scope.errorShow = false;
        }, 2000);
      }
      else if (data == "false")
      {
        $scope.failShow = true;
        $timeout(function() {
        $scope.failShow = false;
        }, 2000);
      }
      else
      {
        $rootScope.userID = data[0].id;
        $rootScope.username = data[0].username;
        $state.go('app.playlists');
      }
    })
    .error(function() {
        $scope.errorShow = true;
        $timeout(function() {
        $scope.errorShow = false;
        }, 2000);
    })
    .then(function() {
      $ionicLoading.hide();
    });
  };
})


.controller('registCtrl', function($scope, $state, $http, $ionicPopup, $timeout, $ionicLoading, $rootScope) {
  //$ionicTabsDelegate.$getByHandle('tabs').select(0)
  var usernameRegex = /^[A-Za-z0-9]+$/;

  //控制”用户名重复“和”服务器问题“的显示与否
  $scope.errorShow = false;
  $scope.duplicateShow = false;

  $scope.nameUnique = false;
  $scope.registUser = { username: "", password: "", conPassword: "" };

  $scope.$watch('registUser.username', function(newValue, oldValue, scope){
    $scope.nameUnique = false;

    if (Boolean(newValue) && usernameRegex.test(newValue))
    {
      $http.get('http://lwf1993.sinaapp.com/loginOrRegist/checkUnique.php?name='+newValue)
      .success(function(data) {
        if (data[0].count == "0")
        {
          $scope.duplicateShow = false;
          $scope.nameUnique = true;
        }
        else if (data[0].count == "1")
        {
          $scope.duplicateShow = true;
        }
        else
        {
          $scope.errorShow = true;
          $timeout(function() {
          $scope.errorShow = false;
          }, 2000);
        }
      })
      .error(function() {
          $scope.errorShow = true;
          $timeout(function() {
          $scope.errorShow = false;
          }, 2000);
      });
    }
  })
  $scope.regist = function() {
    $ionicLoading.show({
      template: '<ion-spinner icon="android"></ion-spinner>'
    });
    
    $http.get('http://lwf1993.sinaapp.com/loginOrRegist/regist.php?name='+$scope.registUser.username+'&password='+$scope.registUser.password)
    .success(function(data) {
      if (data != "error")
      {
        $rootScope.userID = data[0].id;
        $rootScope.username = data[0].username;
        $state.go('app.playlists');
      }
      else
      {
        $scope.errorShow = true;
        $timeout(function() {
        $scope.errorShow = false;
        }, 2000);
      }
    })
    .error(function() {
        $scope.errorShow = true;
        $timeout(function() {
        $scope.errorShow = false;
        }, 2000);
    })
    .then(function() {
      $ionicLoading.hide();
    });
  };
})

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $rootScope, $ionicPopup) {
  /*// Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };*/
  $scope.exit = function() {
    var confirmPopup = $ionicPopup.confirm({
        title: '<strong>EXIT</strong>',
        template: 'Are you sure to exit?',
        okText: 'yes',
        cancelText: 'no'
      });

      confirmPopup.then(function (res) {
        if (res) {
            ionic.Platform.exitApp();
        } 
      });
  }
})

.controller('PlaylistsCtrl', function($scope, $rootScope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('backdropCtrl', function($scope, $ionicBackdrop, $timeout, $ionicLoading, $ionicModal, $ionicPopover, $state) {

  $scope.items = [1,2,3];
  $scope.refreshing = false;
  $scope.editItem = { name: 'lwf' , password: '123'};

  //在进入的时候进行的操作，例如加载数据
  $scope.$on('$ionicView.enter', function() {
    $ionicLoading.show({
      template: '<ion-spinner icon="android"></ion-spinner>'
    });
    $timeout(function() {
      $ionicLoading.hide();
    }, 1000);
  });

  $scope.goIndex = function() {
    $state.go('tabs.login');
  }

	$scope.action = function() {
    $ionicBackdrop.retain();
    $timeout(function() {
      $ionicBackdrop.release();
    }, 1000);
  };

    $scope.show = function() {
    $ionicLoading.show({
      template: '<ion-spinner icon="android"></ion-spinner>'
    });
    $timeout(function() {
      $ionicLoading.hide();
    }, 3000);
  };

  $scope.doRefresh = function() {
    if ($scope.refreshing == false)
    {
      $scope.refreshing = true;
      $timeout(function() {
        $scope.items.push(1);
        $scope.$broadcast('scroll.refreshComplete');
        $scope.refreshing = false;
      }, 2000);
    }
  };

  $ionicModal.fromTemplateUrl('my-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    modal.focusFirstInput = true;
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });





  // .fromTemplateUrl() method
  $ionicPopover.fromTemplateUrl('my-popover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });


  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };
  $scope.closePopover = function() {
    $scope.popover.hide();
  };
  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.popover.remove();
  });
  // Execute action on hide popover
  $scope.$on('popover.hidden', function() {
    // Execute action
  });
  // Execute action on remove popover
  $scope.$on('popover.removed', function() {
    // Execute action
  });
})



.controller('infiniteCtrl', function($scope, $timeout) {
  $scope.items = [1,2,3];
  $scope.loadMore = function() {
    $timeout(function() {
      $scope.items.push($scope.items.length + 1);
    $scope.$broadcast('scroll.infiniteScrollComplete');
    }, 2000);
  };

  $scope.$on('$stateChangeSuccess', function() {
    $scope.loadMore();
  });
})

;
