$(document).foundation();

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

$.ajax({
    url: 'http://namegame.willowtreemobile.com:2000',
    success: function(people) {
        shuffle(people); //shuffle the cards (don't want it to be easy now!)
        var totalCards = 4; //set how many cards you want drawn...minus one because computers are weird
        var peepID = 0; //create a unique ID for each card
        var eGroup = []; //create a new array with all built cards
        var numFlips = 0; // sets card flips to zero
        var cardA = null; //creates a card for comparing
        var cardB = null; //diddo!
        var timmerClock = 3000; //Set the delay for cards flipping back over
        var totalMatches = 0; //create a counter for tracking matches

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

        // when user clicks on a card, flip it over then compaire it with another flipped card (if present).
        $('.willow-card').click(function() {

            cardA = $(this).attr("id");
            numFlips++;
            if (numFlips <= 2) {
                $(this).addClass('flipped');
            }
            if($(this).attr('class') === 'match') {
                numFlips--;
            } else if(cardA === cardB) {
                $('.flipped').addClass('match');
                $('.willow-card').delay(timmerClock).removeClass('flipped');
                //alert('it is a match!');
                totalMatches++;
                numFlips = 0;
            } else {
                cardB = cardA;
            }
            // a necessary evil to combat cards flipping too soon
            setTimeout(function(){
                if (numFlips >= 2) {
                    //alert('sorry, not a match');
                    numFlips = 0;
                    $('.willow-card').delay(timmerClock).removeClass('flipped');
                    cardB = null;
                }
            }, timmerClock);
            if(totalMatches > totalCards) {
              $('#youWon-modal').foundation('reveal','open');
              totalMatches = 0;
            }
        });

    }
});

$('#instructions-button').click(function() {
  $('.game-instructions').toggleClass('view-me');
});
$('#reload-game').click(function(){
  location.reload();
});
