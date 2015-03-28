angular.module('starter.controllers', [])


.controller('tabsCtrl', function($scope, $ionicTabsDelegate) {
})

.controller('homeCtrl', function($scope, $state, $ionicLoading, $rootScope, $http, $ionicPopup, $timeout, $ionicSlideBoxDelegate) {

  $scope.Para = {};
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
          $scope.recordItems = [{"typeName":"暂无数据","amount":"0.00","isPay":0,"time":"1111-11-11 11:11:11"}];
          $scope.Para.recordData = true;
          if ($scope.Para.budgetData == true)
          {
            $ionicLoading.hide();
          }
        }
        else if (data == "empty")
        {
          $scope.recordItems = [{"typeName":"暂无数据","amount":"0.00","isPay":0,"time":"1111-11-11 11:11:11"}];
          $scope.Para.recordData = true;
          if ($scope.Para.budgetData == true)
          {
            $ionicLoading.hide();
          }
        }
        else
        {
          $scope.recordItems = data;

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
  
  $scope.logout = function() {
    var confirmPopup = $ionicPopup.confirm({
        title: '<strong>EXIT</strong>',
        template: 'Are you sure to logout?',
        okText: 'yes',
        cancelText: 'no'
      });

      confirmPopup.then(function (res) {
        if (res) {
          $rootScope.userID = "";
          $rootScope.username = ""

          $state.go("tabs.login");
        } 
      });
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

.controller('recordsCtrl', function($scope, $state, $ionicLoading, $rootScope, $http, $ionicPopup, $timeout) {
  $scope.Para = {};
  $scope.Para.startTime = "";
  $scope.Para.endTime = "";
  $scope.Para.lastID = 0;
  $scope.Para.canLoadMore = false;
  $scope.Para.newData = 0;
  $scope.Para.url = '';

  $scope.incomeTypes = [{"id":"All","typeName":"全部","isPay":"0"},{"id":"None","typeName":"不显示","isPay":"0"}];
  $scope.payTypes = [{"id":"All","typeName":"全部","isPay":"1"},{"id":"None","typeName":"不显示","isPay":"1"}];
  $scope.Para.incomeSelected = $scope.incomeTypes[0];
  $scope.Para.paySelected = $scope.payTypes[0];

  $scope.deleteRecord = function(id) {
    var confirmPopup = $ionicPopup.confirm({
        title: '<strong>warning</strong>',
        template: '确定要删除这一记录吗？',
        okText: '是',
        cancelText: '否'
      });
      confirmPopup.then(function (res) {
        if (res) {
          $http.get('http://lwf1993.sinaapp.com/records/deleteRecord.php?recordID='+id)
            .success(function(data) {
              if (data == "success")
                $scope.getRecordData();
            })
        } 
      });
  }

  $scope.selectDate = function($event,isEnd) {
    var options = {
        date: new Date(),
        mode: 'date'
    };
    datePicker.show(options, function(date){
        if(date != 'Invalid Date') {
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var selected = '' + year +'-';
            selected += month > 9 ? month+'-' : '0'+month+'-';
            selected += day > 9 ? day : '0'+day;
            if (isEnd == 1)
            {
              $scope.Para.endTime = selected;
              if ($scope.Para.startTime > selected)
                $scope.Para.startTime = '';
            }
            else
            {
              $scope.Para.startTime = selected;
              if ($scope.Para.endTime < selected)
                $scope.Para.endTime = '';
            }
        }
    });
    $event.stopPropagation(); 
  }


  $scope.getTypeData = function() {
    $http.get('http://lwf1993.sinaapp.com/type_budget/typeAndBudget.php?typeOnly=1&userID='+$rootScope.userID)
      .success(function(data) {
        if (data == "error")
        {
        }
        else if (data == "empty")
        {
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
  
        }
      })
  }

  $scope.getRecordData = function() {
    $ionicLoading.show({
      template: '<ion-spinner icon="android"></ion-spinner>'
    });
    $scope.Para.canLoadMore = false;

    var url = 'http://lwf1993.sinaapp.com/records/records.php?userID='+$rootScope.userID;
    if ($scope.Para.startTime != "" && $scope.Para.endTime != "")
    {
      url += "&startTime="+$scope.Para.startTime+"&endTime="+$scope.Para.endTime;
    }
    url += "&incomeSelected="+$scope.Para.incomeSelected.id+"&paySelected="+$scope.Para.paySelected.id;

    $scope.Para.url = url;
    
    if ($scope.Para.incomeSelected.id == 'None' && $scope.Para.paySelected.id == 'None')
    {
      $scope.recordItems = [];
      $ionicLoading.hide();
      return;
    }

    var count = 0; //用来统计返回记录的条数，等于10，则说明可能还有数据可以获取
    $http.get(url)
      .success(function(data) {
        if (data == "error")
        {
          $ionicLoading.hide();
        }
        else if (data == "empty")
        {
          $scope.recordItems = [];
          $ionicLoading.hide();
        }
        else
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
          $ionicLoading.hide();
        }
      })
      .error(function() {
        $ionicLoading.hide();
      })
      .then(function(){
        $timeout(function(){
          if (count == 10)
          {
            $scope.Para.canLoadMore = true;
            $scope.Para.newData = 1;
          }
        },0);
      });
  }

  $scope.loadMore = function() {
    if ($scope.Para.newData == 1)
    {
      $scope.Para.newData = 0;
      $scope.$broadcast('scroll.infiniteScrollComplete');
      return;
    }
    
    var url = $scope.Para.url + '&lastID='+$scope.Para.lastID;

    $http.get(url)
      .success(function(data) {
        if (data == "error")
        {
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }
        else if (data == "empty")
        {
          $scope.Para.canLoadMore = false;
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }
        else
        {
          var count = 0;
          for (var i in data)
          {
            if (data[i])
            {
              $scope.Para.lastID = data[i].id;
              count++;
              $scope.recordItems.push(data[i]);
            }
          }
          if (count != 10)
            $scope.Para.canLoadMore = false;
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }
      })
      .error(function() {
        $scope.$broadcast('scroll.infiniteScrollComplete');
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
      $scope.getTypeData(); 
      $scope.getRecordData();
    }
  });
})

.controller('countCtrl', function($scope, $state, $ionicLoading, $rootScope, $http, $ionicPopup, $timeout) {
  $scope.Para = {};
  $scope.Para.startTime = "";
  $scope.Para.endTime = "";
  $scope.Para.url = '';

  $scope.incomeTypes = [{"id":"All","typeName":"全部","isPay":"0"},{"id":"None","typeName":"不显示","isPay":"0"}];
  $scope.payTypes = [{"id":"All","typeName":"全部","isPay":"1"},{"id":"None","typeName":"不显示","isPay":"1"}];
  $scope.Para.incomeSelected = $scope.incomeTypes[0];
  $scope.Para.paySelected = $scope.payTypes[0];

  $scope.Para.incomeCount = 0.00;
  $scope.Para.payCount = 0.00;


  $scope.selectDate = function($event,isEnd) {
    var options = {
        date: new Date(),
        mode: 'date'
    };
    datePicker.show(options, function(date){
        if(date != 'Invalid Date') {
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var selected = '' + year +'-';
            selected += month > 9 ? month+'-' : '0'+month+'-';
            selected += day > 9 ? day : '0'+day;
            if (isEnd == 1)
            {
              $scope.Para.endTime = selected;
              if ($scope.Para.startTime > selected)
                $scope.Para.startTime = '';
            }
            else
            {
              $scope.Para.startTime = selected;
              if ($scope.Para.endTime < selected)
                $scope.Para.endTime = '';
            }
        }
    });
    $event.stopPropagation(); 
  }


  $scope.getTypeData = function() {
    $http.get('http://lwf1993.sinaapp.com/type_budget/typeAndBudget.php?typeOnly=1&userID='+$rootScope.userID)
      .success(function(data) {
        if (data == "error")
        {
        }
        else if (data == "empty")
        {
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
  
        }
      })
  }

  $scope.getData = function() {
    $ionicLoading.show({
      template: '<ion-spinner icon="android"></ion-spinner>'
    });

    var url = 'http://lwf1993.sinaapp.com/count/count.php?userID='+$rootScope.userID;
    if ($scope.Para.startTime != "" && $scope.Para.endTime != "")
    {
      url += "&startTime="+$scope.Para.startTime+"&endTime="+$scope.Para.endTime;
    }
    url += "&incomeSelected="+$scope.Para.incomeSelected.id+"&paySelected="+$scope.Para.paySelected.id;

    $scope.Para.url = url;
    
    if ($scope.Para.incomeSelected.id == 'None' && $scope.Para.paySelected.id == 'None')
    {
      $scope.countItems = [];
      $scope.Para.incomeCount = 0.00;
      $scope.Para.payCount = 0.00;

      $ionicLoading.hide();
      return;
    }

    $http.get(url)
      .success(function(data) {
        if (data == "error")
        {
          $ionicLoading.hide();
        }
        else if (data == "empty")
        {
          $scope.countItems = [];
          $scope.Para.incomeCount = 0.00;
          $scope.Para.payCount = 0.00;

          $ionicLoading.hide();
        }
        else
        {
          $scope.Para.incomeCount = 0.00;
          $scope.Para.payCount = 0.00;
          
          for (var i in data)
          {
            if (data[i].isPay == 0)
              $scope.Para.incomeCount += parseFloat(data[i].count);
            else
              $scope.Para.payCount += parseFloat(data[i].count);
          }
          $scope.countItems = data;

          $ionicLoading.hide();
        }
      })
      .error(function() {
        $ionicLoading.hide();
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
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      var selected = '' + year +'-';
      selected += month > 9 ? month+'-' : '0'+month+'-';
      $scope.Para.startTime = selected + "01";
      $scope.Para.endTime = selected +  (day > 9 ? day : '0'+day);

      $scope.getTypeData(); 
      $scope.getData();
    }
  });
})


;
