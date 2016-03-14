'use strict'

angular.module('mvp.service', ['firebase'])
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
			  temps_jeu: '', temps_banc: '', temps_terrain: ''
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
