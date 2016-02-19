angular.module('mvp', ['firebase', 'ui.router'])
    .constant('FIREBASE_URI', 'https://boos.firebaseio.com/')

    .config(function config($stateProvider){
	$stateProvider.state('index', {
	    url: "",
	    controller: "MainCtrl as main",
	    templateUrl : 'players.html'
	})
	$stateProvider.state('stat',{
	    url: "/stat",
	    controller: "MainCtrl as main",
	    templateUrl: 'stat.html'

	})
	$stateProvider.state('stat_players',{
	    url: "/stat_player",
	    controller: "SecondCtrl as snd",
	    templateUrl: 'stats_player.html'

	})
	
    })


    .controller('SecondCtrl', function (PlayerService){
	
	var snd = this;
	
	snd.players = PlayerService.getPlayers();
	snd.stat = PlayerService.getCurrentStat();
	snd.selectStat = function (currentPlayer) {
	    console.log(snd.stat, currentPlayer);
	    if( PlayerService.getCurrentStat() === "but"){
		currentPlayer.but = parseInt(currentPlayer.but, 10) + 1;
	    }else if( PlayerService.getCurrentStat() === "passD"){
		currentPlayer.passD = parseInt(currentPlayer.passD, 10) + 1;
	    }else if( PlayerService.getCurrentStat() === "tirC"){
		currentPlayer.tirC = parseInt(currentPlayer.tirC, 10) + 1;
	    }else if( PlayerService.getCurrentStat() === "ballP"){
		currentPlayer.ballP = parseInt(currentPlayer.ballP, 10) + 1;
		
	    }else{
		alert('No current stat');
	    }
	    PlayerService.updatePlayer(currentPlayer);
	};
	
    })

    .controller('MainCtrl', function (PlayerService){
	
	var main = this;
	main.newPlayer = { firstName: '', lastName: '', position: '', but: 0, passD: 0, tirC: 0, ballP: 0};
	main.currentPlayer = null; 
	main.players = PlayerService.getPlayers();
	

	main.setCurrentStat = function(stat){
	    PlayerService.setCurrentStat(stat);
	    console.log(PlayerService.getCurrentStat());

	};
	
	
	main.selectStat = function (currentPlayer) {
	    PlayerService.selectStat(currentPlayer)
	};

	main.addPlayer = function() {
	    PlayerService.addPlayer(angular.copy(main.newPlayer));
	    console.log(main.players);
	    main.newPlayer = { firstName: '', lastName: '', position: '', but: 0, passD: 0, tirC: 0, ballP: 0};
	};

	main.removePlayer = function(player) {
	    PlayerService.removePlayer(player);
	};

	main.updatePlayer = function (player) {
	    PlayerService.updatePlayer(player);
	};
    })



    .service('PlayerService', function($firebaseArray, FIREBASE_URI){
	var service = this;
	var currentStat = {stat : ''};
	var ref = new Firebase(FIREBASE_URI);
	var players = $firebaseArray(ref);

	service.setCurrentStat = function(stat){
	    currentStat = stat;
	    console.log(currentStat);
	};
	
	service.getCurrentStat = function(){ 
	    return currentStat; 
	};
	
	
	
	service.getPlayers = function () {
	    return players;
	};

	service.addPlayer = function (player) {
	    players.$add(player);
	};

	service.removePlayer = function (player) {
	    players.$remove(player);
	};

	service.updatePlayer = function (player) {
	    players.$save(player);
	};
    });
