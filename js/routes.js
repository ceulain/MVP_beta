angular.module('mvp').
    config(function($routeProvider){
	$routeProvider
	    .when('/stat.html', {
		controller: 'MainCtrl'
	    })

	    .when('/stats_player.html', {
		controller: 'SecondeCtrl'
	    })
    });
