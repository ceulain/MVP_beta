angular.module('mvp', ['firebase', 'ui.router'])
    .constant('FIREBASE_URI', 'https://boos.firebaseio.com/')

    .config(function config($stateProvider){
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
	
    })


    .controller('StatPlayerCtrl', function(MatchService){
	var stat_player = this;
	
	stat_player.players = MatchService.getPlayers();

	stat_player.schema = MatchService.getSchema();
	console.log(stat_player.schema);

	stat_player.totalStat = function(stat){
	    
	    var total = 0;
	    for( var i = 0 , x = stat_player.players.length; i < x; i++ ){
		total += stat_player.players[i][stat];
	    }
	    
	    return total;
	}
	
    })




    .controller('StatCtrl', function(MatchService){
	var stat = this;
	
	stat.schemaMatch = [];
	stat.schema = [];
	
	stat.players = MatchService.getPlayers();

	
	//add player to stat.schema
	//use in file stat.html
	// <a ng-repeat="player in stat.players"  class="btn btn-default" ng-click="stat.statCount(player)">{{player.first_name+ " " + player.name}}</a> 
	stat.statCount = function(player) {

	    stat.schema.push(player);
	    console.log(stat.schema);
	    	    
	};
	
	stat.setCurrentStat = function (statistic) {
	    
	    //add stat(but, tir cadre, tir non cadre, geste defensif, ballon perdu)
	    // to state schema
	    // use in file stat.html
	    //
	    stat.schema.push(statistic);
	    
	    var lengthSchema = stat.schema.length;
	    


	    //if size of schema > 4, count passeur decisive and avant passeur decisive
	    //increase of 1
	    //stat.schema contains is an array of player
	    if( statistic === 'but' && lengthSchema >= 4 ){
	
		
		stat.schema[lengthSchema-3].passe_decisive++;
		stat.schema[lengthSchema-4].avant_passe_decisive++;
		MatchService.updatePlayer(stat.schema[lengthSchema-3]);
		MatchService.updatePlayer(stat.schema[lengthSchema-4]);
	    }
	    
	    if( statistic === 'but' && lengthSchema === 3 ){
		console.log('3');
		stat.schema[lengthSchema-3].passe_decisive++;
		MatchService.updatePlayer(stat.schema[lengthSchema-3]);
	    }


	    console.log(stat.schema[lengthSchema-1]);
	    //augmente la stat du joueur qu'il a effectué 
	    stat.schema[lengthSchema-2][statistic]++;
	    
	    MatchService.updatePlayer(stat.schema[lengthSchema-2]);
	    
	    stat.schemaMatch.push(stat.schema);
	    //console.log(stat.schemaMatch);
	    stat.schema = [];
	};

	stat.addSchema = function(schema){
	    console.log(schema);
	    MatchService.addSchemaMatch(schema);
	};



	
    })
    .controller('PlayersCtrl', function(MatchService){
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
    .controller('InfoMatchCtrl', function ( MatchService ){

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
	    
	    // console.log($firebaseArray(ref));
	    if( $firebaseArray(ref)[0] !== 'undefined')
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

