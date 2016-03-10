'use strict'

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
	};


	stat_player.avgRelance = function(relance){
	    var x = stat_player.players.length;
	    var total = 0;
	    for(var i = 0; i < x; i++){
		total += stat_player.players[i][relance];
	    } 

	    return Math.round((total/x)*100)/100;
	};

	
	// var passTo = function(passer, receiver){
	//     var selection = "tr#"+passer+ " td#"+receiver;
	//     var passe = $(selection).text();
	//     passe++;   
	//     $(selection).text(''+passe);
	
	// };

	
	// var calculateColumn = function(index){
	//     var total = 0;
	//     $('table#table_pass tbody tr').each(function(){
	
	// 	var value = parseInt($('td', this).eq(index).text(), 10);

	// 	if (!isNaN(value)){
	// 	    total += value;
	// 	}
	//     });

	//     $('table#table_pass tfoot td').eq(index).text(total);
	// };

	// stat_player.totalPass = function(){
	//     var tr = $('#table_pass tfoot tr');
	//     var nbrTd = tr.children().size();
	//     console.log('nbrTd : '+nbrTd);
	//     var total = 0
	//     for(var i = 1; i < nbrTd-1; i++){
	// 	var value = parseInt(tr.children().eq(i).text(), 10);
	// 	console.log(tr.children().eq(i).text());
	// 	total += value;
	//     }
	
	//     return total;
	
	// };

	// stat_player.totalBall = function(){
	
	//     var numberTh = $('#table_pass thead th').size();
	//     console.log('numberTh : '+numberTh);
	//     for(var i = 1; i < numberTh-1; i++){
	// 	calculateColumn(i);
	//     }
	// };
	
	// stat_player.countBallReceive = function(player){

	//     var selectionTr = 'tr#'+player.name+'_'+player.first_name;
	//     var nbChild = $(selectionTr).children().size();
	//     var total = 0;
	
	//     for(var i = 1; i < nbChild-1; i++){
	
	// 	var valTd = $(selectionTr).children().eq(i).text();
	// 	var valTdInt = parseInt(valTd, 10);
	
	// 	if(!isNaN(valTdInt)){
	// 	    total += valTdInt;
	// 	}
	
	//     }
	//     $(selectionTr).children().eq(nbChild-1).text(total);

	// };

	// stat_player.countPass = function(){

	//     for(var i = 0, x = stat_player.schema.length; i < x; i++){
	// 	var schema = stat_player.schema[i];
	// 	console.log(schema);

	// 	for(var j = 0, y = schema.length; j < y; j++){
	// 	    console.log(schema[j].length);
	// 	    var path = schema[j];

	// 	    for(var k= 0, z = path.length-2; k < z; k++){
	// 		passTo(path[k].name+'_'+path[k].first_name, path[k+1].name+'_'+path[k+1].first_name);
	// 		console.log( path[k].name+''+path[k].first_name+ ' a fait un passs à '+ path[k+1].name+' '+path[k+1].first_name );

	// 	    }

	// 	}
	
	//     }

	// };

	// CALCUL LE POURCENTAGE DE BALLON RELANCES
	stat_player.percent = function(player){
	    var pourc_relance = player.ballon_recup * 100 / (player.ballon_recup + player.geste_defensif);
	    if(isNaN(pourc_relance)){
		pourc_relance = 0;
	    }

	    player.pourc_relance = pourc_relance;
	    MatchService.updatePlayer(player);
	    return Math.round(pourc_relance*100)/100;
	};

	// CALCUL DU POURCENTAGE DE PASSE
	stat_player.percent_pass = function(player){
	    var pourc_pass = 100 - (player.ballon_perdu * 100 / player.ballon_joues);

	    if(isNaN(pourc_pass)){
		pourc_pass = 0;
	    }
	    player.percent_pass = pourc_pass;
	    MatchService.updatePlayer(player);
	    return Math.round(pourc_pass*100)/100;
	};

	//CALCUL DE TIRS TOTALISES
	stat_player.tirs = function(player){
	    var tirs = player.tir_non_cadre + player.tir_cadre;
	    

	    player.tirs = tirs;
	    MatchService.updatePlayer(player);
	    return tirs;
	};


	
    })

    .controller('StatCtrl', function(MatchService, $compile){
	var stat = this;

	stat.schemaMatch = [];
	stat.schema = [];
	stat.flag = 0;
	stat.counter;
	stat.minutes = 0;
	stat.seconds = 0;
	stat.textSeconds = null; 
	stat.textMinutes = null;
	stat.fullTime = null;
	stat.players = MatchService.getPlayers();


	stat.time = function(){
	    stat.seconds++;
	    
	    if(stat.seconds > 59){
		stat.seconds = 0;
		stat.minutes++;	
	    }
	    
	    
	    stat.textMinutes = stat.minutes < 10 ? '0' + stat.minutes : stat.minutes;
	    stat.textSeconds = stat.seconds < 10 ? '0' + stat.seconds : stat.seconds;
	    stat.fullTime = stat.textMinutes+':'+stat.textSeconds;
	    
	    $('#timer').text(stat.textMinutes + ' : '+stat.textSeconds);
	};


	stat.stopTimer = function(){
	    console.log('OK');
	    return clearInterval(stat.counter);
	};

	stat.startTimer = function(){
	    stat.counter = setInterval(stat.time, 1000);
	};

	stat.addSchema = function(schema){

	    console.log("stat players: "+JSON.stringify(stat.players));
	    console.log(schema[0]);
	    MatchService.addSchemaMatch(schema);
	    
 	};
	
	stat.playerDrag = function(){
	    $('[id=player_button]').draggable();
	    stat.flag = 0;
	};
	

	//add player to stat.schema
	//use in file stat.html
	// <a ng-repeat="player in stat.players"  class="btn btn-default" ng-click="stat.statCount(player)">{{player.first_name+ " " + player.name}}</a> 
	stat.statCount = function(player) {
	    
	    console.log(stat.flag);
	    if(stat.flag === 0){
		console.log('click');
		player.ballon_joues++;
		MatchService.updatePlayer(player);
		stat.schema.push(player);
		console.log(stat.schema);
		
	    }

	};

	
	stat.setCurrentStat = function (statistic, player) {

	    //add stat(but, tir cadre, tir non cadre, geste defensif, ballon perdu)
	    // to state schema
	    // use in file stat.html
	    //
	    stat.schema.push(statistic);
	    stat.schema.push(stat.fullTime);
	    console.log(stat.schema);
	    
	    var lengthSchema = stat.schema.length;

	    //if size of schema > 4, count passeur decisive and avant passeur decisive
	    //increase of 1
	    //stat.schema contains is an array of player
	    if( statistic === 'but' && lengthSchema >= 5 ){


		stat.schema[lengthSchema-4].passe_decisive++;
		stat.schema[lengthSchema-5].avant_passe_decisive++;
		MatchService.updatePlayer(stat.schema[lengthSchema-4]);
		MatchService.updatePlayer(stat.schema[lengthSchema-5]);
	    }
	    
	    if( statistic === 'but' && lengthSchema === 4 ){
		console.log('3');
		stat.schema[lengthSchema-4].passe_decisive++;
		MatchService.updatePlayer(stat.schema[lengthSchema-4]);
	    }

	    stat.schema[0].ballon_recup++;
	    MatchService.updatePlayer(stat.schema[0]);


	    console.log(stat.schema[lengthSchema-1]);
	    //augmente la stat du joueur qu'il a effectué 
	    stat.schema[lengthSchema-3][statistic]++;
	    
	    MatchService.updatePlayer(stat.schema[lengthSchema-3]);
	    
	    stat.schemaMatch.push(stat.schema);
	    //console.log(stat.schemaMatch);
	    stat.schema = [];


	};

    })


    .controller('PlayersCtrl', function(MatchService){
	var main = this;
	main.players = MatchService.getPlayers();
	console.log(main.players);

	// add player
	main.addPlayer = function(numero,nom,prenom, position){

	    MatchService.addPlayer(numero,nom,prenom, position);
	    main.number = "";
	    main.first_name = "";
	    main.name = "";
	    main.position = "";
	    
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
	
	
	
	service.addPlayer = function(number,name,first_name, position){

	    var player = {number: number, name: name, position: position, 
			  first_name: first_name, but: 0, tir_cadre: 0,
			  tir_non_cadre: 0, geste_defensif: 0,
			  ballon_perdu: 0, passe_decisive: 0,
			  avant_passe_decisive: 0, ballon_joues: 0, ballon_recup: 0,
			  pourc_relance: 0, 
			  pourc_pass: 0, tirs: 0, percent_pass: 0, 
			 };

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

