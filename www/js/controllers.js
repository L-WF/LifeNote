angular.module('starter.controllers', [])

.controller('tabsCtrl', function($scope) {
})

.controller('homeCtrl', function($scope, $state, $ionicLoading, $rootScope, $http, $ionicPopup, $timeout, $ionicSlideBoxDelegate) {

  $scope.Para = {};
  $scope.Para.budgetData = false;
  $scope.Para.recordData = false;
  $scope.Para.showWeather = false;
  $scope.Para.cityAndTemp = '';
  $scope.Para.dayUrl = '';
  $scope.Para.nightUrl = '';

  $scope.go = function(url) {
    $state.go(url);
  }

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

  $scope.getWeatherData = function() {
    $http.get('http://api.map.baidu.com/telematics/v3/weather?location='+$rootScope.city+'&output=json&ak=9ffc8LPKQ8PcfjDPAcu3D8WL&t='+(new Date()).getTime())
    .success(function(data){
      if (data.status == "success")
      {
        $scope.Para.city = $rootScope.city;
        $scope.Para.dayUrl = data.results[0].weather_data[0].dayPictureUrl;
        $scope.Para.nightUrl = data.results[0].weather_data[0].nightPictureUrl;
        $scope.Para.temp = data.results[0].weather_data[0].date.substr(10);
        if (Boolean($scope.Para.temp) == false)
          $scope.Para.temp = data.results[0].weather_data[0].temperature;
        $scope.Para.showWeather = true;
      }
    });
  }

  //在进入的时候加载数据
  $scope.$on('$ionicView.enter', function() {
    if ($rootScope.city == '')
    {
      $http.get('http://api.map.baidu.com/location/ip?ak=9ffc8LPKQ8PcfjDPAcu3D8WL&t='+(new Date()).getTime())
      .success(function(data){
        if (data.status == 0)
        {
          $rootScope.city = data.content.address_detail.city;
          $scope.getWeatherData();
        }
      });
    }
    else
    {
      $scope.getWeatherData();
    }

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
          $scope.showAlert("错误","请求失败！");
        }
        else if (data == "empty")
        {
          $ionicLoading.hide();
          $scope.showAlert("提醒","暂无数据！");
        }
        else
        {
          $scope.items = data;
          $ionicLoading.hide();
        }
      })
      .error(function() {
        $ionicLoading.hide();
        $scope.showAlert("错误","请求失败！");
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
          $scope.showAlert("错误","请求失败！");
        }
        else
        {
          $scope.getData();
        }
      })
      .error(function() {
        $ionicLoading.hide();
        $scope.showAlert("错误","请求失败！");
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
        title: '<strong>警告</strong>',
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
    var budgetRegex = /^\d+(\.\d{1,2})?$/;
    var myPopup = $ionicPopup.show({
      template: '<input type="tel"  maxlength="12" ng-model="currentBudget.amount" >',
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
        $rootScope.city = '';
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
        $rootScope.city = '';
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
        title: '<strong>注销</strong>',
        template: '确定要退出登录吗？',
        okText: '是',
        cancelText: '否'
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
        title: '<strong>退出</strong>',
        template: '确定要退出程序吗？',
        okText: '是',
        cancelText: '否'
      });

      confirmPopup.then(function (res) {
        if (res) {
          window.close();
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
          $scope.showAlert("错误","请求失败！");
        }
        else if (data == "empty")
        {
          $ionicLoading.hide();
          $scope.showAlert("提醒","暂无数据！");
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
        $scope.showAlert("错误","请求失败！");
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
          $scope.showAlert("错误","请求失败！");
        }
        else
        {
          $scope.Para.amount = "";
          $scope.Para.selectedID = "";
          $ionicLoading.hide();
          $scope.showAlert("完成","操作成功 !");
          
        }
      })
      .error(function() {
        $ionicLoading.hide();
        $scope.showAlert("错误","请求失败！");
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
    $scope.request('http://lwf1993.sinaapp.com/records/addRecord.php?amount='+$scope.Para.amount+'&typeID='+$scope.Para.selectedID+'&userID='+$rootScope.userID+'&isPay='+$scope.Para.isPay);
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
        title: '<strong>警告</strong>',
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

  $scope.Para.showSecondContainer = true;


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

  $scope.getChartsData = function() {
    $scope.Para.showSpinner = true;
    $scope.Para.income_pie = [];
    $scope.Para.pay_pie = [];
    $scope.Para.income_line = [];
    $scope.Para.pay_line = [];
    $scope.Para.columnChildren = [];
    $scope.Para.columns = [{"name":"支出","y":$scope.Para.payCount,"drilldown":"支出"},{"name":"收入","y":$scope.Para.incomeCount,"drilldown":"收入"}];

    var payChildren = {"name":"支出","id":"支出"};
    var incomeChildren = {"name":"收入","id":"收入"};
    payChildren.data = new Array();
    incomeChildren.data = new Array();

    var payDrillCount = 0, incomeDrillCount = 0;
    for (var i in $scope.countItems)
    {
      var item = {};
      item.name = $scope.countItems[i].typeName;
      item.y = parseFloat($scope.countItems[i].count);
      if ($scope.countItems[i].isPay == 0)
      {
        $scope.Para.income_pie.push(item);

        incomeChildren.data[incomeDrillCount] = new Array();
        incomeChildren.data[incomeDrillCount][0] = item.name;
        incomeChildren.data[incomeDrillCount][1] = item.y;
        incomeDrillCount++;
      }
      else
      {
        $scope.Para.pay_pie.push(item);

        payChildren.data[payDrillCount] = new Array();
        payChildren.data[payDrillCount][0] = item.name;
        payChildren.data[payDrillCount][1] = item.y;
        payDrillCount++;
      }
    }
    if ($scope.Para.income_pie.length == 0) 
      $scope.Para.income_pie = [{"name":"empty","y":100}];
    if ($scope.Para.pay_pie.length == 0) 
      $scope.Para.pay_pie = [{"name":"empty","y":100}];

    $scope.Para.columnChildren.push(payChildren);
    $scope.Para.columnChildren.push(incomeChildren);

    $http.get('http://lwf1993.sinaapp.com/count/countForLine.php?userID='+$rootScope.userID+"&startTime="+$scope.Para.startTime+"&endTime="+$scope.Para.endTime+"&incomeSelected="+$scope.Para.incomeSelected.id+"&paySelected="+$scope.Para.paySelected.id)
      .success(function(data) {
        if (data != "error" && data != "empty")
        {
          var incomeSum = 0.00;
          var paySum = 0.00;
          for (var i in data)
          {
            incomeSum += parseFloat(data[i].income);
            paySum += parseFloat(data[i].pay);
            $scope.Para.income_line.push(incomeSum);
            $scope.Para.pay_line.push(paySum);
          }
        }
      })
      .then(function() {
        if ($scope.Para.income_line == []) 
          $scope.Para.income_line = [0];
        if ($scope.Para.pay_line == []) 
          $scope.Para.pay_line = [0];

        $scope.Para.showSpinner = false;
        $scope.showPie(false);
      });

  }

  $scope.showPie = function(secondPieLoaded) {
    $('#container').highcharts({
            credits: {
              enabled: false
            },
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: $scope.Para.startTime+ '   ' +'支出占比图'+ '   ' + $scope.Para.endTime 
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            series: [{
                type: 'pie',
                name: 'pay',
                data: $scope.Para.pay_pie
            }]
        });

    $scope.Para.showSecondContainer = true;
    if (secondPieLoaded == true) 
      return;
    
    $('#container_2').highcharts({
            credits: {
              enabled: false
            },
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: $scope.Para.startTime+ '   ' +'收入占比图'+ '   ' + $scope.Para.endTime 
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            series: [{
                type: 'pie',
                name: 'income',
                data: $scope.Para.income_pie
            }]
        });
  }

  $scope.showLine = function() {
    $scope.Para.showSecondContainer = false;

    $('#container').highcharts({
        chart: {
            type: 'areaspline'
        },
        title: {
            text: $scope.Para.startTime+ '   ' +'支出 & 收入'+ '   ' + $scope.Para.endTime 
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'top',
            x: 150,
            y: 100,
            floating: true,
            borderWidth: 1,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        },
        xAxis: {
            labels: {
                enabled: false
            }
              
        },
        yAxis: {
            title: {
                text: ''
            }
        },
        tooltip: {
            shared: true,
            valueSuffix: ' 元'
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            areaspline: {
                fillOpacity: 0.5
            }
        },
        series: [{
            name: '收入',
            data: $scope.Para.income_line
        }, {
            name: '支出',
            data: $scope.Para.pay_line
        }]
    });
  }

  $scope.showColumn = function() {
    $scope.Para.showSecondContainer = false;

    $('#container').highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: $scope.Para.startTime+ '   ' +'支出 & 收入'+ '   ' + $scope.Para.endTime 
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    type: 'category'
                },
                yAxis: {
                    title: {
                        text: ''
                    }
                },
                legend: {
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                plotOptions: {
                    series: {
                        borderWidth: 0,
                        dataLabels: {
                            enabled: true,
                            format: '{point.y:.2f}'
                        }
                    }
                },

                tooltip: {
                    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                    pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}</b><br/>'
                },

                series: [{
                    name: '支出 & 收入',
                    colorByPoint: true,
                    data: $scope.Para.columns
                }],
                drilldown: {
                    series: $scope.Para.columnChildren
                }
            });
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
      })
      .then(function() {
        $scope.getChartsData();
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

.controller('monthCountCtrl', function($scope, $state, $ionicLoading, $rootScope, $http, $ionicPopup, $timeout) {
  $scope.Para = {};

  $scope.getData = function() {
    var url = 'http://lwf1993.sinaapp.com/count/monthCount.php?userID='+$rootScope.userID;

    $http.get(url)
      .success(function(data) {
        if (data == "error")
        {
        }
        else if (data == "empty")
        {
          $scope.countItems = [];
        }
        else
        {
          $scope.incomeData = [];
          $scope.payData = [];
          $scope.chartX = [];

          for (var i in data)
          {
            $scope.incomeData.push(parseFloat(data[i].income));
            $scope.payData.push(parseFloat(data[i].pay));
            $scope.chartX.push(data[i].date);
          }

          $scope.countItems = data.reverse();
        }
      })
      .then(function() {
        $scope.showColumn();
        $ionicLoading.hide();
      });
  }

  $scope.showColumn = function() {
    $('#container').highcharts({
        credits: {
          enabled: false
        },
        chart: {
            type: 'column'
        },
        title: {
            text: '按月统计收支柱状图'
        },
        xAxis: {
            categories: $scope.chartX
        },
        yAxis: {
            allowDecimals: false,
            min: 0,
            title: {
                text: ''
            }
        },
        tooltip: {
            formatter: function () {
                return '<b>' + this.x + '</b><br/>' +
                    this.series.name + ': ' + this.y + '<br/>'
            }
        },

        plotOptions: {
            column: {
                stacking: 'normal'
            }
        },

        series: [{
            name: '收入',
            data: $scope.incomeData,
            stack: '收入'
        },  {
            name: '支出',
            data: $scope.payData,
            stack: '支出'
        }]
    });
  }

  $scope.showLine = function() {
    $('#container').highcharts({
      credits: {
        enabled: false
      },
      chart: {
          type: 'area'
      },
      title: {
          text: '按月统计收支曲线图'
      },
      subtitle: {
          text: ''
      },
      xAxis: {
          categories: $scope.chartX,
          tickmarkPlacement: 'on',
          title: {
              enabled: true
          }
      },
      yAxis: {
          title: {
              text: ''
          }
      },
      tooltip: {
          shared: true,
          valueSuffix: ''
      },
      plotOptions: {
          area: {
              stacking: 'normal',
              lineColor: '#666666',
              lineWidth: 1,
              marker: {
                  lineWidth: 1,
                  lineColor: '#666666'
              }
          }
      },
      series: [{
          name: '收入',
          data: $scope.incomeData
      }, {
          name: '支出',
          data: $scope.payData
      }]
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

.controller('newsCtrl', function($scope, $state, $ionicLoading, $rootScope, $http) {
  var regex_title = /blank">([\s\S]*?)<\/a>/gi;
  var regex_href = /href="([\s\S]*?)" target/gi;
  var regex_home = /<span>([\s\S]*?)<\/span>/gi;

  var sportURL = 'http://news.baidu.com/n?cmd=1&class=sportnews&pn=1&tn=newsbrofcu';
  var interURL = 'http://news.baidu.com/n?cmd=1&class=internews&pn=1&tn=newsbrofcu';
  var sociaURL = 'http://news.baidu.com/n?cmd=1&class=socianews&pn=1&tn=newsbrofcu';

  $scope.interNews = [];
  $scope.sociaNews = [];
  $scope.sportNews = [];
  $scope.currentNews = [];

  $scope.icon = '';

  $scope.getNewsData = function(type) {
    if (type == 'interNews') var url = interURL;
    else if (type == 'sociaNews') var url = sociaURL;
    else if (type == 'sportNews') var url = sportURL;

    $http.get(url)
      .success(function(data)
      {
        var titles = data.match(regex_title);
        var hrefs = data.match(regex_href);
        var homes = data.match(regex_home);
        for (var i=0 ; i<homes.length ; i++)
        {
          var item = {};
          item.home = unescape((homes[i]+'').replace('<span>','').replace('</span>','').replace('&nbsp','  ').replace(/&#x/g,'%u').replace(/;/g,''));
          item.title = unescape((titles[i]+'').replace('blank">','').replace('</a>','').replace(/&#x/g,'%u').replace(/;/g,''));
          item.href = unescape((hrefs[i+2]+'').replace('href="','').replace('" target','').replace(/&#x/g,'%u').replace(/;/g,''));

          if (type == 'interNews') $scope.interNews.push(item);
          else if (type == 'sociaNews') $scope.sociaNews.push(item);
          else if (type == 'sportNews') $scope.sportNews.push(item);
        }

        if (type == 'interNews') 
        {
          $scope.currentNews = $scope.interNews;
          $scope.icon = 'ion-planet';
          $ionicLoading.hide();
        }
      });
  }

  $scope.changeNews = function(type) {
    if (type == 'interNews') 
    {
      $scope.currentNews = $scope.interNews;
      $scope.icon = 'ion-planet';
    }
    else if (type == 'sociaNews')
    {
      $scope.currentNews = $scope.sociaNews;
      $scope.icon = 'ion-ios-people';
    }
    else if (type == 'sportNews') 
    {
      $scope.currentNews = $scope.sportNews;
      $scope.icon = 'ion-ios-football';
    }
  }

  $scope.openUrl = function(url) {
    var ref = window.open(url, '_blank', 'location=yes');
    /*ref.addEventListener('loadstart', function(event) {
      $ionicLoading.show({
        template: '<ion-spinner icon="android"></ion-spinner>'
      });
    });  
    ref.addEventListener('loadstop', function(event) {
      $ionicLoading.hide();
      ref.show();
    });  */
  };

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

      $scope.getNewsData('interNews');
      $scope.getNewsData('sociaNews');
      $scope.getNewsData('sportNews');
    }
  });
})

.controller('weatherCtrl', function($scope, $state, $ionicLoading, $rootScope, $http) {
  $scope.dataLoaded = false;

  $scope.getWeatherData = function() {
    $http.get('http://api.map.baidu.com/telematics/v3/weather?location='+$rootScope.city+'&output=json&ak=9ffc8LPKQ8PcfjDPAcu3D8WL&t='+(new Date()).getTime())
    .success(function(data){
      if (data.status == "success")
      {
        $scope.city = data.results[0].currentCity;
        $scope.pm = data.results[0].pm25;
        $scope.index = data.results[0].index;
        $scope.today = data.results[0].weather_data[0];
        $scope.today.temp = data.results[0].weather_data[0].date.substr(10);
        if (Boolean($scope.today.temp) == false)
          $scope.today.temp = data.results[0].weather_data[0].temperature;

        $scope.weather_data = data.results[0].weather_data;
        $scope.weather_data.shift();


        $scope.dataLoaded = true;
        $ionicLoading.hide();
      }
      else
      {
        $ionicLoading.hide();
        $state.go('app.homePage');
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

      if ($rootScope.city == '')
      {
        $http.get('http://api.map.baidu.com/location/ip?ak=9ffc8LPKQ8PcfjDPAcu3D8WL&t='+(new Date()).getTime())
        .success(function(data){
          if (data.status == 0)
          {
            $rootScope.city = data.content.address_detail.city;
            $scope.getWeatherData();
          }
        });
      }
      else
      {
        $scope.getWeatherData();
      }

      if (Boolean($scope.city) == false)
      {
        $ionicLoading.hide();
        $state.go('app.homePage');
      }
    }
  });
})
;
