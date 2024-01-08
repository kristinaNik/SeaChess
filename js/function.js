$(window).on('load', appGame);

var game = ['', '', '', '', '', '', '', '', '']; 
var turn = 0;
var winner = false;
var pointsX = 0;
var pointsY = 0;
var playerX = $('#player1');
var playerY = $('#player2');

/**
  * Стартиране на играта
  */
function appGame() {
	var inputs = $('.input-field').focus();
	var addPlayerForm = $('#player-form');
		
	addPlayerForm.on("submit", function(event){
	  event.preventDefault();
	  addPlayers();
	});
		

	var replayButton = $('.replay-btn');
	replayButton.on('click', function(event) {
		event.preventDefault();
		resetBoard();
	});
 }

/**
  * Добавяне на играчи
  */
function addPlayers(event) {
 
  if (this.player1.value === '' || this.player2.value === '') {
    alert('Трябва да се въведат имената');
    return;
  }
  var playerFormContainer = $('.enter-players');
  var boardMain = $('.board__main');
  playerFormContainer.addClass('hide-container');
  boardMain.removeClass('hide-container');
  playerX.name = this.player1.value;
  playerY.name = this.player2.value;
  buildBoard();
}

/**
  * Връщане на текущ играч
  */
function currentPlayer() {

  return turn % 2 == 0 ? '\u2764' : '\u2BC1';
}


window.addEventListener("resize", onResize);
function onResize() {
  var allCells = $('.board__cell');
  var cellHeight = allCells[0].offsetWidth;
  
  allCells.each(function(index, cell) {
    $(cell).css({"height": cellHeight + 'px'});
  });
}

// Изграждане на таблата
function buildBoard() {
  var resetContainer = $('.reset');
  resetContainer.removeClass('reset--hidden');

  onResize();
  addCellClickListener();
  changeBoardHeaderNames();
}

/**
  * Смяна на имената на играчите при всеки ход
  */
function changeBoardHeaderNames() {
  if (!winner) {
    var currentPlayerText = $('.board___player-turn');
       if (currentPlayer() == '\u2764') {
      currentPlayerText.html(`
        <span class="name--style">${playerX.name}</span>, ти си на ход! '\u2764'
        <div class="u-r-winner"></div>
      `);
    }  else {
      currentPlayerText.html (`
        <span class="name--style">${playerY.name}</span>, ти си на ход.'\u2BC1'
        <div class="u-r-winner"></div>
      `);
    }
  }
}

/**
  * Изчистване на таблата
  */
function resetBoard() {
  
  game = ['', '', '', '', '', '', '', '', '']; 
  
  var cellToAddToken = $('.letter');

  cellToAddToken.each(function(index,square) {
    $(square).text('');  
    $(square).parent().removeClass('board__cell--winner');
  });

  turn = 0;
  winner = false;

  var currentPlayerText = $('.board___player-turn');
  currentPlayerText.html( `
    <span class="name--style">${playerX.name}</span>, Ти си на ход!
    <div class="u-r-winner"></div>
  `);

  addCellClickListener();
}

/**
  * Ходовете на играчите
  */
function makeMove(event) {
  
  var currentCell = parseInt(event.currentTarget.firstElementChild.dataset.id);
  var cellToAddToken = $(`[data-id='${currentCell}']`);
  
  if (cellToAddToken.html() !== '') {
    console.log('This cell is already taken.');
    return;
  } else {
    if (currentPlayer() == '\u2764') {
      cellToAddToken.text(currentPlayer());
      game[currentCell] = '\u2764';
    } else {
      cellToAddToken.text( currentPlayer());
      game[currentCell] = '\u2BC1';
    }
  }
    
 isWinner();
   
  turn ++;

 changeBoardHeaderNames();
}

/**
  * Проверка при равенство
  */
function checkIfTie() {
  if (turn > 7) {
    alert('Играта завърши с равенство')
  }
}

/**
  * Проверка за печеливш играч
  */
function isWinner() {
  var winningSequences = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
 
  $.each(winningSequences,function(index,winningCombos){
	
  	var cell1 = winningCombos[0];
    var cell2 = winningCombos[1];
    var cell3 = winningCombos[2];

  	if (
      game[cell1] == currentPlayer() &&
      game[cell2] == currentPlayer() &&
      game[cell3] == currentPlayer()
    ) {

       
      var cells = $('.board__cell');

      var letterId1 = $(`[data-id='${cell1}']`);
      var letterId2 = $(`[data-id='${cell2}']`);
      var letterId3 = $(`[data-id='${cell3}']`);
     
      cells.each(function(index,cell) {
     
        var cellId = index;
        
        if (cellId == cell1 || cellId == cell2 || cellId == cell3 ) {
          
          $(cell).addClass('board__cell--winner');
        }

      });

      var currentPlayerText = $('.board___player-turn');
      if (currentPlayer() == '\u2764') {
      	pointsX++;
        currentPlayerText.html( `
          <div class="congratulations">Поздравления ${playerX.name}</div>
          <div class="u-r-winner">Ти печелиш!Имаш общо ${pointsX} точки</div>
        `);
        winner = true;
        removeCellClickListener();
        return true;
      } else {
   		pointsY++;
        currentPlayerText.html( `
          <div class="congratulations">Поздравления ${playerY.name}</div>
          <div class="u-r-winner">Ти печелиш! Имаш общо ${pointsY} точки</div>

        `);
        winner = true;
        removeCellClickListener();
        return true;
      }
    }
  

  });

  if (!winner) {
    checkIfTie();
  }
  
  return false;
}

/**
  * Listner за кликане на клетка в таблата
  */
function addCellClickListener() {
  const cells = $('.board__cell');
  cells.each(function(index, cell) {
  	$(cell).on("click", function(event){
  		event.preventDefault();
  		makeMove(event);
  	});
    
  });
}

/**
  * Listner за изчистване на кликнати клетки в таблата 
  */
function removeCellClickListener() {

  var allCells = $('.board__cell');
  allCells.each( function(index,cell) {
  $(cell).unbind("click", function(event){
  		event.preventDefault();
  		makeMove(event);
  	});
  });
}