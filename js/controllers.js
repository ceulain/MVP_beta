'use strict'


angular.module('mvp.controllers', [])

    .controller('UserController', function(UserService){
    	var userCtrl = this;
	
    	userCtrl.user  = { email: '', password: '', category: '', name: ''};
    	userCtrl.signUp = function(){
    	    UserService.signUp(userCtrl.user)
    		.success(function(data){
    		    console.log(data);
    		})
    		.error(function(){
    		    console.log(data);
    		})
    	};
	
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

    .controller('StatCtrl', function(MatchService, $interval){
	var stat = this;

	stat.schemaMatch = [];
	stat.schema = [];
	stat.flag = 0;
	var counter;
	stat.minutes = 0;
	stat.seconds = 0;
	stat.textSeconds = null; 
	stat.textMinutes = null;
	stat.fullTime = null;
	stat.background = null;
	stat.players = MatchService.getPlayers();


	// stat.setTimePlayer = function(){
	//     for ( player of stat.players){
	// 	console.log(player)
	// 	player.temps_jeu = $('#timer').text();
	// 	MatchService.updatePlayer(player);
	//     }
	// };

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
	    if(angular.isDefined(counter)){
		console.log('counter is defined stop')
	 	$interval.cancel(counter);
		counter = undefined;
	    }
	};

	stat.startTimer = function(){
	    if(angular.isDefined(counter)){
		console.log('counter is defined')
		return;

	    }
	    counter = $interval(stat.time, 1000);
	};

	stat.addSchema = function(schema){

	    stat.setTimePlayer();
	    console.log("stat players: "+JSON.stringify(stat.players));
	    console.log(schema[0]);
	    MatchService.addSchemaMatch(schema);
	    
 	};

	stat.droppable = function(){
	    console.log('drop');
	    $('#div-rem').droppable({
		drop: function(){
		    console.log('drop it ');
		}
	    });
	};
	
	stat.playerDrag = function(){
	    console.log('draggable');
	    // stat.background = 'background-blue';
	    $('[id=player_button]').draggable();
	    
	    stat.flag = 0;
	};
	
	stat.droppable();
	//add player to stat.schema
	//use in file stat.html
	// <a ng-repeat="player in stat.players"  class="btn btn-default" ng-click="stat.statCount(player)">{{player.first_name+ " " + player.name}}</a> 
	stat.statCount = function(player) {
	    stat.background = '';
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
    .controller('InfoMatchCtrl', function ( MatchService, $location){

	var team = this;
	//create a new club with her name club, categorie of team and name coach 
	team.createClub = function (club, category_team, coach){
	    MatchService.createClub(club, category_team, coach);
	    $location.path('/players');
	};		
    })
