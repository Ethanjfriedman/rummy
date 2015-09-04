console.log('app.js loaded');

var app = angular.module("RummyApp", []);

app.controller("RummyController", ['$scope',function($scope) {
	var game = new Game();

	this.startGame = function() {
	  console.log('starting game');
	  game.makePlayers();
	  $('#newPlayerForm-container').addClass('hidden');
		$('#game-table').removeClass('hidden')
	}

	this.nextRow = function() {
		console.log("let's make the next row");
		game.addRow();
	}

	this.rematch = function() {
		console.log('rematch!');
		game.rematch();
	}

	this.reset = function() {
		console.log("ok let's reset the game");
		game.resetGame();
	}

}]);
