console.log("rummy.js loaded");

var $entryForm = $('#entry-row-form');

//////////////////////////////
////CONSTRUCTOR FOR PLAYER////
//////////////////////////////
var Player = function (name) {
  this.name = name;
  this.score = 0;
  //TODO: eventually, we'll store past games, link players up to a database so they can log in, etc.
}

//////////////////////////////
/////CONSTRUCTOR FOR GAME/////
//////////////////////////////
var Game = function() {
  console.log('new game created');
  var winThreshold = 500; // so that, in future, can allow for games played to other scores ...

  this.players = [];
  this.turn = 0;
  this.turnscores = []; //an array of all the scores by turns, i.e. [ [15, 25, 50, 0],[10,50, -20, -5], etc.]
  this.playerTotals = [];
  this.winners = [];
  this.winningScores = [];

  //updates the totals//
  this.addLatestScores = function(scores) {
    this.turnscores.push(scores);  //pushes an array of the latest scores as submitted to the turnscores array
    for (var p = 0; p < this.players.length; p++) {
      this.playerTotals[p] += parseInt(this.turnscores[this.turnscores.length - 1][p]); //increments the total score for each player
    }
  }

  //self-explanatory//
  this.incrementTurn = function() {
    this.turn += 1;
    console.log('current turn is now', this.turn);
  }

  //grabs the player names from the form//
  this.makePlayers = function() {
    // this gets run when the form is submitted....
    //creates a new player for each submitted name
    //(the actual new player creation happens in the makeTitleRow function)
    var playerNames = $('#new-player-form')[0];
    var numPlayers = playerNames.length - 1;
    this.makeTitleRow(numPlayers, playerNames); //generate the header row
    this.incrementTurn(); //increment the turn
    this.makeEntryForm(numPlayers); //generate the entry form for the next row
  }

  //makes the header row with the names of players//
  this.makeTitleRow = function(numPlayers, playerNames) {

    $titlesRow = $('#titles-row');
    $turn = $('<div>').addClass('row-title row1 col1 turn')
                        .text('Turn');
    $titlesRow.append($turn);
    for (var p = 0; p < numPlayers; p++) {
      var pName = playerNames[p].value;
      if (pName !== "") {
        var player = new Player(pName);
        this.players.push(player);
        this.playerTotals.push(parseInt(player.score));
        var col = 'col' + (p + 1);
        var $player = $('<div>').addClass('row-title row1')
                                .addClass(col)
                                .text(player.name);
        $titlesRow.append($player);
      }
    }
  }

  //generates the entry form for the next turn's scores
  this.makeEntryForm = function(numPlayers) {
    this.clearEntryForm();

    $turnDiv = $('<div>').addClass('entry-row col1 valign left')
                         .text('Enter scores');
    $entryForm.append($turnDiv);

    for (var p = 0; p < numPlayers; p++) {
      var pNum = 'p' + (p + 1);
      var col = 'col' + (p + 2);
      var max = winThreshold.toString();
      var min = '-' + max;
      $input = $('<input>').attr('type', 'number')
                           .prop('step', '5')
                           .prop('max', max)
                           .prop('min', min)
                           .addClass('entry-row entry-input validate')
                           .addClass(pNum)
                           .prop('value','0')
                           .addClass(col)
                           .prop('required', true);
      $entryForm.append($input);
    }
    $submit = $('<input>').attr('type', 'submit')
                          .addClass("col s2")
                          .text('Enter scores')
    $entryForm.append($submit);
  }

  //grabs the entered scores from the entry form and creates a new row
  //with those scores
  this.addRow = function() {

    var row = 'row' + this.turn;
    var $newRow = $('<div>').addClass('turn-row').addClass(row);
    var $turnDiv = $('<div>').addClass(row)
                             .addClass('col1')
                             .text(this.turn);
    $newRow.append($turnDiv);
    var $newScores = $('#entry-row-form')[0];
    var numScores = $newScores.length;

    for (var s = 0; s < numScores - 1; s++) {
      var currentScore = parseInt($newScores[s].value, 10);
      var pNum = 'p' + (s + 1);
      var col = 'col' + (s + 2);
      $score = $('<div>').addClass(pNum)
                         .addClass(row)
                         .addClass(col)
                         .text(currentScore);
      $newRow.append($score);
      this.turnscores.push(currentScore);
      this.playerTotals[s] += parseInt(currentScore, 10);
    }

    $('#table-body').append($newRow);
    this.makeTotalsRow(this.playerTotals);
    if (this.totalsCheck(this.playerTotals)) {
      console.log('we have winner(s)!');
      this.endGame();
    } else {
      console.log('no winner yet');
      this.incrementTurn();
      this.clearEntryForm();
    }
  }

  this.clearEntryForm = function() {
    $('#turn-div').text('foo');
    $entryInput = $('.entry-input');
    for (var e = e; e < $entryInput.length; e++) {
      $entryInput[e].value = "";
    }
  }

  //clears out and redraws the totals row
  this.makeTotalsRow = function(totals) {
    $('#totals-div').empty();
    $totalsRow = $('<div>').attr('id', 'totals-row');
    $totalsRow.remove();
    $totalsRow.append($('<div>').addClass('totals-row col1').text('Total'));
    for (var t = 0; t < totals.length; t++) {
      var col = 'col' + (t + 1);
      $total = $('<div>').addClass('totals-row')
                         .addClass(col)
                         .text(totals[t]);
      $totalsRow.append($total);
    }
    $('#totals-div').append($totalsRow);
  }

  //when someone's score >= 500 (as per totalsCheck()), this will end the game
  this.endGame = function() {
    console.log('determining winner');
    $winnerDiv = $('<div>').addClass('row');
    var winnerHead = $('<p>').addClass('winner')
    if (this.winners.length == 1) {
      winnerHead.text("We have a winner!");
    } else {
      winnerHead.text("We have " + this.winners.length + " winners! Whoa!");
    }
    $winnerDiv.append(winnerHead);
    for (var w = 0; w < this.winners.length; w++) {
      var $p = $('<p>').addClass('winner');
      var winnerText = this.winners[w].name + ": " + this.winningScores[w];
      if( w == this.winners.length - 1) {
        $p.text(winnerText);
        $winnerDiv.append($p);
      } else {
        winnerText += ", "
        $p.text(winnerText);
        $winnerDiv.append($p);
      }
    }
    $rematchForm = $('<form>').attr('id','rematch-form')
                               .attr('ng-submit','rummy.rematch()');

    $again = $('<input>').attr('type','submit')
                         .attr('value','play again')
                         .attr('ng-click','rummy.rematch()')
                         .text('Rematch with same players');
    $rematchForm.append($again);
    $winnerDiv.append($rematchForm);


    $reset = $('<button>').prop('value','reset')
                          .attr('ng-click','rummy.reset()')
                          .text('Reset');
    $winnerDiv.append($reset);
    $('#totals-div').append($winnerDiv);

  }

  this.rematch = function() {
    $p = $('<p>').text('rematch time!');
    $('footer').append($p);
  }

  this.resetGame = function() {
    console.log('need to code stuff to reset the game');
  }

  //////////////////////////////
  ///ERROR-CHECKING FUNCTIONS///
  //////////////////////////////
  //FIXME may be able to eliminate these since I now have form-level validation instead....
  //makes sure number of scores entered is equal to number of players...
  //if not, returns false
  this.numCheck = function(num) {
      if (num !== this.players.length) {
        return false;
      } else {
        return true;
      }
    }

  //makes sure that score is divisble by 5: if not, returns false
  this.scoresCheck = function(scores) {
    for (var s = 0; s < scores.length; s++)
      if (scores[s] % 5 !== 0) {
        return false;
      }
      return true;
    }

  //returns true if anyone's score has exceed the winning threshold
  this.totalsCheck = function(totals) {
    var topScore = winThreshold
    for (var t = 0; t < totals.length; t++) {
      if (parseInt(totals[t], 10) >= topScore) {
        topScore = parseInt(totals[t], 10);
        this.winners.push(this.players[t]);
        this.winningScores.push(topScore);
      }
    }
    if (this.winners.length > 0) {
      return true;
    } else {
      return false;
    }
  }
}
