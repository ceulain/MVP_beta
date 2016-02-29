angular.module('mvp', ['firebase', 'ui.router'])
    .constant('FIREBASE_URI', 'https://boos.firebaseio.com/')

    .config(function config($stateProvider){
	$stateProvider.state('info_match', {
	    url: "",
	    controller: "TeamCtrl as team",
	    templateUrl: 'info_match.html'
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

	// add player
	main.addPlayer = function(numero,nom,prenom){

	    MatchService.addPlayer(numero,nom,prenom);
	    main.number = "";
	    main.first_name = "";
	    main.name = "";
	};
	
	//remove player
	main.removePlayer = function(player){
	    
	    MatchService.removePlayer(player);

	};

	
    })
    .controller('TeamCtrl', function ( MatchService ){

	var team = this;
	
	//create a new club with her name club, categorie of team and name coach 
	team.createClub = function (club, category_team, coach){

	    MatchService.createClub(club, category_team, coach);
	};
	
	
    })
    .service('MatchService', function($firebaseArray, FIREBASE_URI){

	var service = this;
	service.category_team = null;	
	service.club = null;
	service.players = null;
	service.refPlayers = null;
	service.refMatchs = null;
	service.refSchema = null;
	service.match = null;
	service.schema = null;

	
	service.createClub = function (club, category_team, coach) {

	    //create reference with club and category_team
	    var ref = new Firebase(FIREBASE_URI+'/boostalent/'+club+'/'+category_team);
	    
	    service.category_team = category_team;	
	    
	    service.club = club
	    
	    //reference to players of team 
	    service.refPlayers = new Firebase(FIREBASE_URI+'/boostalent/'+service.club+'/'+service.category_team+'/players/');
	    
	    //reference to matchs of team 
	    service.refMatchs = new Firebase(FIREBASE_URI+'/boostalent/'+service.club+'/'+service.category_team+'/matchs/');
	    
	    //create reference to schema of match
	    service.refSchema = service.refMatchs.child('schema');
	    
	    //return array of schemas
	    service.schema = $firebaseArray(service.refSchema);
	    
	    //return array of matchs
	    service.match = $firebaseArray(service.refMatchs);
	    
	    //return array of players
	    service.players =  $firebaseArray(service.refPlayers);
	    
	    
	    if( $firebaseArray(ref).length === 0)
		$firebaseArray(ref).$add({name_coach: coach});
	    
	    return ref;
	};
	
	
	
	service.addPlayer = function(number,name,first_name){

	    var player = {number: number, name: name, 
			  first_name: first_name, but: 0, tir_cadre: 0,
			  tir_non_cadre: 0, geste_defensif: 0,
			  ballon_perdu: 0, passe_decisive: 0,
			  avant_passe_decisive: 0};
	    
	    //add to player to reference player
	    service.players.$add(player);

	};
	
	// remove player
	service.removePlayer = function(player){
	    
	    service.players.$remove(player);

	};

	// return array of player
	service.getPlayers = function(){

	    return service.players;

	};
	
	// update player
	service.updatePlayer = function(player){

	    service.players.$save(player);

	};

	// return array of match
	service.getMatch = function(){
	    
	    return service.match;

	};

	// add schema to reference schema
	service.addSchemaMatch = function(schema){

	    service.schema.$add(schema);

	};
	
	// return array of schema
	service.getSchema = function(){
	    
	    return service.schema;

	};
	
    });

