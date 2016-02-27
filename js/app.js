angular.module('mvp', ['firebase', 'ui.router'])
    .constant('FIREBASE_URI', 'https://boos.firebaseio.com/')

    .config(function config($stateProvider){
	$stateProvider.state('index', {
	    url: "",
	    controller: "TeamCtrl as team",
	    templateUrl: 'match.html'
	})

	$stateProvider.state('match', {
	    url: "/match",
	    controller: "MainCtrl as main",
	    templateUrl : 'players.html'
	})
	$stateProvider.state('stat',{
	    url: "/stat",
	    controller: "MainCtrl as second",
	    templateUrl: 'stat.html'

	})
	$stateProvider.state('stat_players',{
	    url: "/stat_player",
	    controller: "ThirdCtrl as third",
	    templateUrl: 'stats_player.html'

	})
	
    })


    .controller('ThirdCtrl', function(MatchService){
	var third = this;
	
	third.players = MatchService.getPlayers();
    })
    .controller('SecondCtrl', function(MatchService){
	var second = this;
	
	second.schemaMatch = [];
	second.schema = [];
	
	second.players = MatchService.getPlayers();

	second.statCount = function(player) {
	    second.schema.push(player.nom + " " + player.prenom + " "+player.numero);
	    console.log(second.schema);
	    
	    
	};
	
	second.setCurrentStat = function(stat){
	    second.schema.push(stat);
	    second.schemaMatch.push(second.schema);
	    console.log(second.schemaMatch);
	    second.schema = [];
	};

	second.addSchema = function(schema){
	    MatchService.addSchemaMatch(schema);
	};
    })
    .controller('MainCtrl', function(MatchService){
	var main = this;
	main.players = MatchService.getPlayers();
	console.log(main.players);
	main.addPlayer = function(numero,nom,prenom){
	    MatchService.addPlayer(numero,nom,prenom);
	    //main.players = MatchService.getPlayers();
	};
	
	main.removePlayer = function(player){
	    console.log('remove');
	    MatchService.removePlayer(player);
	};

	
    })
    .controller('TeamCtrl', function (MatchService){

	var team = this;
	
	team.createClub = function(club, name_team, coach){
	    console.log('ok');
	    MatchService.createClub(club, name_team, coach);
	};
	
	
    })
    .service('MatchService', function($firebaseArray, FIREBASE_URI){
	var service = this;
	service.name_team = null;	
	service.club = null;
	service.players = null;
	service.refPlayers = null;
	service.refMatchs = null;
	service.match = null;
	console.log('hello');
	
	service.createClub = function(club, name_team, coach){
	    service.name_team = name_team;	
	    service.club = club
	    service.refPlayers = new Firebase(FIREBASE_URI+'/boostalent/'+service.club+'/'+service.name_team+'/players/');
	    service.refMatchs = new Firebase(FIREBASE_URI+'/boostalent/'+service.club+'/'+service.name_team+'/matchs/');
	    service.match = $firebaseArray(service.refMatchs);
	    service.players =  $firebaseArray(service.refPlayers);
	    var ref = new Firebase(FIREBASE_URI+'/boostalent/'+club+'/'+name_team);
	    $firebaseArray(ref).$add({name_coach: coach});
	    return ref;
	};

	service.addPlayer = function(numero,nom,prenom){
	    // var ref = new Firebase(FIREBASE_URI+'/boostalent/'+service.club+'/'+service.name_team+'/players/');
	    $firebaseArray(service.refPlayers).$add({numero: numero, nom: nom, prenom: prenom});
	    console.log(service.players);
	};

	service.removePlayer = function(player){
	    
	    service.players.$remove(player);
	};
	service.getPlayers = function(){
	    return service.players;
	};
	
	service.getMatch = function(){
	    return service.match;
	};

	service.addSchemaMatch = function(schema){
	    service.match.$add(schema);
	}
	
	service.getSchema = function(){
	    service.match;
	}
	
    });

