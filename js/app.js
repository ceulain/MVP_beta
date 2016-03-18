'use strict'

angular.module('mvp', ['ui.router', 'mvp.controllers', 'mvp.service'])
    .constant('FIREBASE_URI', 'https://boos.firebaseio.com/')

    .config(function config($stateProvider){
	
	// $stateProvider.state('welcome', {
	//     url: "",
	//     controller: "UserController as user",
	//     templateUrl: "welcome.html"
	// })

	
	$stateProvider.state('info_match', {
	    url: "",
	    controller: "InfoMatchCtrl as team",
	    templateUrl: 'info_match.html'
	})

	$stateProvider.state('players', {
	    url: "/players",
	    controller: "PlayersCtrl as players",
	    templateUrl : 'players.html'
	})
	$stateProvider.state('stat',{
	    url: "/stat",
	    controller: "StatCtrl as stat",
	    templateUrl: 'stat.html'

	})


	$stateProvider.state('stat_players',{
	    url: "/stat_player",
	    controller: "StatPlayerCtrl as stat_player",
	    templateUrl: 'stats_player.html'

	})
	
    });


