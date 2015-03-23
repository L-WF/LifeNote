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

.controller('homeCtrl', function($scope, $state, $ionicLoading, $rootScope, $http, $ionicPopup, $timeout, $ionicSlideBoxDelegate) {
  $scope.Para = {};
/*  $scope.Para.budgetLoading = "card";
  $scope.Para.budgetEmpty = "card ng-hide";
  $scope.Para.recordLoading = "card";
  $scope.Para.recordEmpty = "card ng-hide";
  $scope.Para.canInfinite = true;
  $scope.Para.lastID = 0;*/
  $scope.Para.budgetData = false;
  $scope.Para.recordData = false;


  $scope.selectIndex = function(index) {
    if ( index == $ionicSlideBoxDelegate.slidesCount()-1 )
    {
      $timeout(function() {
        if ($ionicSlideBoxDelegate.currentIndex() == $ionicSlideBoxDelegate.slidesCount()-1)
          $ionicSlideBoxDelegate.slide(0);
      },2000)
    }
  }
  $scope.showAlert = function(title,text) {
     var alertPopup = $ionicPopup.alert({
       title: title,
       template: text
     });
   };

  $scope.getBudgetData = function() {
    $http.get('http://lwf1993.sinaapp.com/type_budget/usedBudget.php?userID='+$rootScope.userID)
      .success(function(data) {
        if (data == "error")
        {
          //$scope.Para.budgetLoading = "card ng-hide";
          //$scope.Para.budgetEmpty = "card";
          $scope.budgetItems = [{"typeName":"暂无数据","used":0,"budget":0,"proportion":1}];
          $ionicSlideBoxDelegate.update();
          $scope.Para.budgetData = true;
          if ($scope.Para.recordData == true)
          {
            $ionicLoading.hide();
          }
        }
        else if (data == "empty")
        {
          //$scope.Para.budgetLoading = "card ng-hide";
          //$scope.Para.budgetEmpty = "card";
          $scope.budgetItems = [{"typeName":"暂无数据","used":0,"budget":0,"proportion":1}];
          $ionicSlideBoxDelegate.update();
          $scope.Para.budgetData = true;
          if ($scope.Para.recordData == true)
          {
            $ionicLoading.hide();
          }
        }
        else
        {
          //$scope.Para.budgetLoading = "card ng-hide";
          //$scope.Para.budgetEmpty = "card ng-hide";
          $scope.budgetItems = data;
          $ionicSlideBoxDelegate.update();
          $scope.Para.budgetData = true;
          if ($scope.Para.recordData == true)
          {
            $ionicLoading.hide();
          }
        }
      })
      .error(function() {
        //$scope.Para.budgetLoading = "card ng-hide";
        //$scope.Para.budgetEmpty = "card";
        $scope.budgetItems = [{"typeName":"暂无数据","used":0,"budget":0,"proportion":1}];
        $ionicSlideBoxDelegate.update();
        $scope.Para.budgetData = true;
        if ($scope.Para.recordData == true)
        {
          $ionicLoading.hide();
        }
      });
  }
  $scope.getRecordData = function() {
    var url = 'http://lwf1993.sinaapp.com/records/recentRecords.php?userID='+$rootScope.userID;
    $http.get(url)
      .success(function(data) {
        if (data == "error")
        {
          //$scope.Para.recordLoading = "card ng-hide";
          //$scope.Para.recordEmpty = "card";
          $scope.recordItems = [{"typeName":"暂无数据","amount":"0.00","isPay":0,"time":"1111-11-11 11:11:11"}];
          $scope.Para.recordData = true;
          if ($scope.Para.budgetData == true)
          {
            $ionicLoading.hide();
          }
        }
        else if (data == "empty")
        {
          //$scope.Para.recordLoading = "card ng-hide";
          //$scope.Para.recordEmpty = "card";
          $scope.recordItems = [{"typeName":"暂无数据","amount":"0.00","isPay":0,"time":"1111-11-11 11:11:11"}];
          $scope.Para.recordData = true;
          if ($scope.Para.budgetData == true)
          {
            $ionicLoading.hide();
          }
        }
        else
        {
          //$scope.Para.recordLoading = "card ng-hide";
          //$scope.Para.recordEmpty = "card ng-hide";
          $scope.recordItems = data;

          /*var count = 0;
          for (var i in data)
          {
            if (data[i])
            {
              $scope.Para.lastID = data[i].id;
              count++;
            }
          }
          if (count == 5)
            $scope.Para.canInfinite = true;*/
          $scope.Para.recordData = true;
          if ($scope.Para.budgetData == true)
          {
            $ionicLoading.hide();
          }
        }
      })
      .error(function() {
        //$scope.Para.recordLoading = "card ng-hide";
        //$scope.Para.recordEmpty = "card";
        $scope.recordItems = [{"typeName":"暂无数据","amount":"0.00","isPay":0,"time":"1111-11-11 11:11:11"}];
        $scope.Para.recordData = true;
        if ($scope.Para.budgetData == true)
        {
          $ionicLoading.hide();
        }
      });
  }

  //在进入的时候加载数据
  $scope.$on('$ionicView.enter', function() {

    if (Boolean($rootScope.userID) == false) //判断用户是否已登陆 
    {
      $state.go('tabs.login');
    }
    else
    {
      $ionicLoading.show({
        template: '<ion-spinner icon="android"></ion-spinner>'
      });
      $scope.getRecordData();
      $scope.getBudgetData();
    }
  });

/*  $scope.loadMore = function() {

    $scope.Para.canInfinite = false;
    console.log("in");
    var url = 'http://lwf1993.sinaapp.com/records/recentRecords.php?userID='+$rootScope.userID;
    if ($scope.Para.lastID != 0)
      url += '&lastID='+$scope.Para.lastID;
    $http.get(url)
      .success(function(data) {
        console.log(data);
        if (data == "error")
        {
          $scope.Para.canInfinite = true;
        }
        else if (data == "empty")
        {
        }
        else
        {
          var count = 0;

          if ($scope.Para.lastID == 0)  
          {
            $scope.recordItems = data;
            for (var i in data)
            {
              if (data[i])
              {
                $scope.Para.lastID = data[i].id;
                count++;
              }
            }
          }            
          else
          {
            for (var i in data)
            {
              if (data[i])
              {
                $scope.Para.lastID = data[i].id;
                count++;

              if ($scope.Para.lastID != 0)  $scope.recordItems.push(data[i]);
              }
            }
          }
          if (count == 5){
            $scope.Para.canInfinite = true;
          }
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      })
      .error(function() {
        $scope.Para.canInfinite = true;
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
  };

  $scope.$on('$stateChangeSuccess', function() {
  });

  $scope.canInfinite = function() {
    return $scope.Para.canInfinite;
  }*/

})

.controller('BudgetCtrl', function($scope, $state, $ionicLoading, $rootScope, $http, $ionicPopup) {

  $scope.showAlert = function(title,text) {
     var alertPopup = $ionicPopup.alert({
       title: title,
       template: text
     });
   };

  $scope.getData = function() {
    $http.get('http://lwf1993.sinaapp.com/type_budget/typeAndBudget.php?userID='+$rootScope.userID)
      .success(function(data) {
        if (data == "error")
        {
          $ionicLoading.hide();
          $scope.showAlert("error","Request fail !");
        }
        else if (data == "empty")
        {
          $ionicLoading.hide();
          $scope.showAlert("warning","Empty data !");
        }
        else
        {
          $scope.items = data;
          $ionicLoading.hide();
        }
      })
      .error(function() {
        $ionicLoading.hide();
        $scope.showAlert("error","Request fail !");
      });
  }

  $scope.request = function(url) {
    $ionicLoading.show({
      template: '<ion-spinner icon="android"></ion-spinner>'
    });
    $http.get(url)
      .success(function(data) {
        if (data == "error")
        {
          $ionicLoading.hide();
          $scope.showAlert("error","Request fail !");
        }
        else
        {
          $scope.getData();
        }
      })
      .error(function() {
        $ionicLoading.hide();
        $scope.showAlert("error","Request fail !");
      });
  }

  $scope.addType = function(isPay) {
    $scope.newType = {};
    var nameRegex = /[&#'";!！@$]/;
    var myPopup = $ionicPopup.show({
      template: '<input type="text"  maxlength="12" ng-model="newType.name" >',
      title: '新增类型',
      subTitle: '不支持特殊符号',
      scope: $scope,
      buttons: [
        { text: '取消' },
        {
          text: '<b>提交</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (Boolean($scope.newType.name) == false || nameRegex.test($scope.newType.name)) {
              //don't allow the user to close unless he enters wifi password
              e.preventDefault();
            } 
            else {
              $scope.request('http://lwf1993.sinaapp.com/type_budget/addType.php?typeName='+$scope.newType.name+'&isPay='+isPay+'&userID='+$rootScope.userID);
            }
          }
        }
      ]
    });
  }

  $scope.deleteType = function(id, name) {
    var confirmPopup = $ionicPopup.confirm({
        title: '<strong>warning</strong>',
        template: '确定要删除 '+name+ ' 吗？',
        okText: '是',
        cancelText: '否'
      });
      confirmPopup.then(function (res) {
        if (res) {
          $scope.request('http://lwf1993.sinaapp.com/type_budget/deleteType.php?typeID='+id);
        } 
      });
  }

  $scope.editBudget = function(id, amount, name) {
    $scope.currentBudget = {};
    $scope.currentBudget.amount = amount;
    var budgetRegex = /^\d+(\.\d{2})?$/;
    var myPopup = $ionicPopup.show({
      template: '<input type="number"  maxlength="12" ng-model="currentBudget.amount" >',
      title: '本月预算:'+name,
      subTitle: '支持小数点后两位的精度',
      scope: $scope,
      buttons: [
        { text: '取消' },
        {
          text: '<b>提交</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!(Boolean($scope.currentBudget.amount) && budgetRegex.test($scope.currentBudget.amount))) {
              //don't allow the user to close unless he enters wifi password
              e.preventDefault();
            } 
            else {
              $scope.request('http://lwf1993.sinaapp.com/type_budget/editBudget.php?typeID='+id+'&amount='+$scope.currentBudget.amount+'&userID='+$rootScope.userID);
            }
          }
        }
      ]
    });
  }

  //在进入的时候加载数据
  $scope.$on('$ionicView.enter', function() {

    if (Boolean($rootScope.userID) == false) //判断用户是否已登陆 
    {
      $state.go('tabs.login');
    }
    else
    {
      $ionicLoading.show({
        template: '<ion-spinner icon="android"></ion-spinner>'
      });
      $scope.getData();
    }
  });
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
        $state.go('app.homePage');
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
          $scope.nameUnique = false;
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
        $state.go('app.homePage');
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

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $rootScope, $ionicPopup, $state) {
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
  $scope.logout = function() {
    $rootScope.userID = "";
    $rootScope.username = ""

    $state.go("tabs.login");
  }

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

.controller('addRecordCtrl', function($scope, $state, $ionicLoading, $rootScope, $http, $ionicPopup, $timeout) {
  $scope.Para = {};
  $scope.Para.incomeClass = "";
  $scope.Para.payClass = "button-outline";
  $scope.Para.isPay = 0;
  $scope.Para.amount = "";
  $scope.Para.selectedID = "";
  $scope.incomeTypes = [];
  $scope.payTypes = [];

  $scope.showAlert = function(title,text) {
     var alertPopup = $ionicPopup.alert({
       title: title,
       template: text
     });
   };

  $scope.getData = function() {
    $http.get('http://lwf1993.sinaapp.com/type_budget/typeAndBudget.php?typeOnly=1&userID='+$rootScope.userID)
      .success(function(data) {
        if (data == "error")
        {
          $ionicLoading.hide();
          $scope.showAlert("error","Request fail !");
        }
        else if (data == "empty")
        {
          $ionicLoading.hide();
          $scope.showAlert("warning","Empty data !");
        }
        else
        {
          for (var i in data)
          {
            if (data[i].isPay == 0)
              $scope.incomeTypes.push(data[i]);
            else
              $scope.payTypes.push(data[i]);
          }
          $scope.items = $scope.incomeTypes;
          $ionicLoading.hide();
        }
      })
      .error(function() {
        $ionicLoading.hide();
        $scope.showAlert("error","Request fail !");
      });
  }

  $scope.request = function(url) {
    $ionicLoading.show({
      template: '<ion-spinner icon="android"></ion-spinner>'
    });
    $http.get(url)
      .success(function(data) {
        if (data == "error")
        {
          $ionicLoading.hide();
          $scope.showAlert("error","Request fail !");
        }
        else
        {
          $scope.Para.amount = "";
          $scope.Para.selectedID = "";
          $ionicLoading.hide();
          $scope.showAlert("success","操作成功 !");
          
        }
      })
      .error(function() {
        $ionicLoading.hide();
        $scope.showAlert("error","Request fail !");
      });
  }


  //在进入的时候加载数据
  $scope.$on('$ionicView.enter', function() {

    if (Boolean($rootScope.userID) == false) //判断用户是否已登陆 
    {
      $state.go('tabs.login');
    }
    else
    {
      $ionicLoading.show({
        template: '<ion-spinner icon="android"></ion-spinner>'
      });
      $scope.getData();
    }
  });

  $scope.changeType = function(isPay) {
    if ($scope.Para.isPay == isPay)
      return;
    $ionicLoading.show({
      template: '<ion-spinner icon="android"></ion-spinner>'
    });
    $scope.Para.selectedID = "";
    $scope.Para.isPay = isPay;
    $scope.Para.incomeClass = isPay == 0 ? "" : "button-outline";
    $scope.Para.payClass = isPay == 1 ? "" : "button-outline";
    $scope.items = isPay == 0 ? $scope.incomeTypes : $scope.payTypes;
    $timeout(function() {
      $ionicLoading.hide();
    }, 0);
  }

  $scope.submit = function() {
    $scope.request('http://lwf1993.sinaapp.com/records/addRecord.php?amount='+$scope.Para.amount+'&typeID='+$scope.Para.selectedID+'&userID='+$rootScope.userID);
  }
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
