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

	third.schema = MatchService.getSchema();
	console.log(third.schema);

	third.totalStat = function(stat){
	    
	    var total = 0;
	    for( var i = 0 , x = third.players.length; i < x; i++ ){
		total += third.players[i][stat];
	    }
	    
	    return total;
	}
	
    })




    .controller('SecondCtrl', function(MatchService){
	var second = this;
	
	second.schemaMatch = [];
	second.schema = [];
	
	second.players = MatchService.getPlayers();

	second.statCount = function(player) {
	    second.schema.push(player);
	    console.log(second.schema);
	    
	    
	};
	
	second.setCurrentStat = function( stat ){


	    second.schema.push(stat);
	    var lengthSchema = second.schema.length;

	    if( stat === 'but' && lengthSchema >= 4 ){
		
		second.schema[lengthSchema-3].passe_decisive++;
		second.schema[lengthSchema-4].avant_passe_decisive++;
		MatchService.updatePlayer(second.schema[lengthSchema-3]);
		MatchService.updatePlayer(second.schema[lengthSchema-4]);
	    }
	    
	    if( stat === 'but' && lengthSchema === 3 ){
		console.log('3');
		second.schema[lengthSchema-3].passe_decisive++;
		MatchService.updatePlayer(second.schema[lengthSchema-3]);
	    }


	    console.log(second.schema[lengthSchema-1]);
	    second.schema[lengthSchema-2][stat]++;
	    MatchService.updatePlayer(second.schema[lengthSchema-2]);
	    second.schemaMatch.push(second.schema);
	    console.log(second.schemaMatch);
	    second.schema = [];
	};

	second.addSchema = function(schema){
	    console.log(schema);
	    MatchService.addSchemaMatch(schema);
	};



	
    })
    .controller('MainCtrl', function(MatchService){
	var main = this;
	main.players = MatchService.getPlayers();
	console.log(main.players);
	main.addPlayer = function(numero,nom,prenom){
	    MatchService.addPlayer(numero,nom,prenom);
	    main.numero = "";
	    main.prenom = "";
	    main.nom = "";
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
	service.refSchema = null;
	service.match = null;
	service.schema = null;
	console.log('hello');
	
	service.createClub = function(club, name_team, coach){
	    service.name_team = name_team;	
	    service.club = club
	    service.refPlayers = new Firebase(FIREBASE_URI+'/boostalent/'+service.club+'/'+service.name_team+'/players/');
	    service.refMatchs = new Firebase(FIREBASE_URI+'/boostalent/'+service.club+'/'+service.name_team+'/matchs/');
	    service.refSchema = service.refMatchs.child('schema');
	    service.schema = $firebaseArray(service.refSchema);
	    service.match = $firebaseArray(service.refMatchs);
	    service.players =  $firebaseArray(service.refPlayers);
	    var ref = new Firebase(FIREBASE_URI+'/boostalent/'+club+'/'+name_team);
	    $firebaseArray(ref).$add({name_coach: coach});
	    return ref;
	};

	service.addPlayer = function(numero,nom,prenom){

	    var player = {numero: numero, nom: nom, 
			  prenom: prenom, but: 0, tir_cadre: 0,
			  tir_non_cadre: 0, geste_defensif: 0,
			  ballon_perdu: 0, passe_decisive: 0,
			  avant_passe_decisive: 0};

	    $firebaseArray(service.refPlayers).$add(player);
	    console.log(service.players);
	};

	service.removePlayer = function(player){
	    
	    service.players.$remove(player);
	};
	service.getPlayers = function(){
	    return service.players;
	};
	
	service.updatePlayer = function(player){
	    service.players.$save(player);
	}
	service.getMatch = function(){
	    return service.match;
	};

	service.addSchemaMatch = function(schema){
	    service.schema.$add(schema);
	}
	
	service.getSchema = function(){
	    return service.schema;
	}
	
    });

