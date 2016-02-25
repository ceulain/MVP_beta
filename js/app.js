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

		if( PlayerService.getCurrentStat() === "But"){
			currentPlayer.But = parseInt(currentPlayer.But, 10) + 1;

		}else if( PlayerService.getCurrentStat() === "TC"){
			currentPlayer.TC = parseInt(currentPlayer.TC, 10) + 1;

		}else if( PlayerService.getCurrentStat() === "TNC"){
			currentPlayer.TNC = parseInt(currentPlayer.TNC, 10) + 1;

		}else if( PlayerService.getCurrentStat() === "To"){
			currentPlayer.To = parseInt(currentPlayer.To, 10) + 1;

		}else if( PlayerService.getCurrentStat() === "PB"){
			currentPlayer.To = parseInt(currentPlayer.To, 10) + 1;

		}else if( PlayerService.getCurrentStat() === "GD"){
			currentPlayer.GD = parseInt(currentPlayer.GD, 10) + 1;

		}else{
			alert('No current stat');
		}
		PlayerService.updatePlayer(currentPlayer);
	};
	
})

.controller('MainCtrl', function (PlayerService){
	
	var main = this;
	main.newPlayer = { firstName: '', lastName: '', maillot: '', But: 0, TC: 0, TNC: 0, To: 0, GD: 0, PB: 0};
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
		main.newPlayer = { firstName: '', lastName: '', maillot: '', But: 0, TC: 0, TNC: 0, To: 0, GD: 0, PB: 0};
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
	// creation table club
	var refClub = ref.child("club");
	refClub.push({name :"real madrid"});
	refClub.push({name :"psg"});
	// creation noeud team dans club
	var refTeam = refClub.child('U17A');
	// creation noeud entraineur dans equipe
	var refTrainer = refTeam.child('trainer').push({ name : 'Zizou'});
	// creation noeud joueurs dans equipe
	var refPlayers = refTeam.child('players').push({ firstName : 'Ceulain', lastName : 'Bansimba', maillot : '1', });
	// creation noeud match dans equipe
	var refMatch = refTeam.child('match').push({ stat : '[statDuMatch]', adversaire : 'Neuilly', date : '24 fevrier 2016'});
	


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
