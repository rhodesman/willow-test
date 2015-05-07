$(document).foundation();
$(document).ready(shuffleCards);
var totalCards = 4; //set how many cards you want drawn...minus one because computers are weird
var eGroup = []; //create a new array with all built cards
var numFlips = 0; // sets card flips to zero
var cardA = null; //creates a card for comparing
var cardB = null; //diddo!
var timerClock = 3000; //Set the delay for cards flipping back over
var totalMatches = 0; //create a counter for tracking matches
var totalScore = 0;
var totalClicks = 0;
var gameNumber = 1;

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex ;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
    }

    return array;
}
function shuffleCards() {
    $.ajax({
        url: 'http://namegame.willowtreemobile.com:2000',
        success: function(people) {
            var peepID = 0; //create a unique ID for each card

            shuffle(people); //shuffle the cards (don't want it to be easy now!)
            $('.game-number').text(gameNumber);
            $('#eGame').html('');
            //build the cards
            $.each(people, function(getPeeps, people) {
                var employee = '<li class="card"><div id="' + peepID + '" class="willow-card"><div class="back face center"><span class="willow-logo"></span></div><div class="front face"><img src="' + people.url + '"</img><h2>' + people.name + '</h2></div></div></li>';
                eGroup.push(employee);
                $('#eGame').append(employee); // add newly created card to HTML
                peepID++;
                return getPeeps < totalCards ;
            });
            shuffle(eGroup); // shuffle built cards
            $('#eGame').append(eGroup); // add the newly shuffled cards to the HTML
            eGroup = [];
            $('.willow-card').click(cardVerify);
        }
    });
}

// when user clicks on a card, flip it over then compaire it with another flipped card (if present).
function cardVerify() {
    var alreadyMatched = $(this).closest('div.match');
    cardA = $(this).attr("id");
    numFlips++;
    totalClicks++;
    if (numFlips <= 2) {
        $(this).addClass('flipped');
    }
    if(alreadyMatched.length) {
        numFlips--;
        totalClicks--;
    } else if(cardA === cardB) {
        $('.flipped').addClass('match');
        $('.willow-card').delay(timerClock).removeClass('flipped');
        totalMatches++;
        totalScore = totalScore + 100;
        numFlips = 0;
    } else {
        cardB = cardA;
        setTimeout(resetFlip, timerClock);
    }
    $('.total-clicks').text(totalClicks);
    // a necessary evil to combat cards flipping too soon
    function resetFlip() {
        if (numFlips >= 2) {
            $('.willow-card').delay(timerClock).removeClass('flipped');
            cardB = null;
            numFlips = 0;
            if (totalScore !== 0) {
              totalScore = totalScore - 20;
            }
        }
    }
    $('.total-score').text(totalScore);

    if(totalMatches > totalCards) {
      setTimeout(function(){
        $('#youWon-modal').foundation('reveal','open');
      }, 1500);
      totalMatches = 0;
    }
}

$('#instructions-button').click(function() {
  $('.game-instructions').toggleClass('view-me');
  if ($('.game-instructions').hasClass('view-me')) {
    $(this).text('Hide Instructions');
  } else {
    $(this).text('View Instructions');
  }
});
$('#reload-game').on('click', cleanDeck);

function cleanDeck() {
    shuffleCards();
    $('#youWon-modal').foundation('reveal','close');
    gameNumber++;
    numFlips = 0;
}
