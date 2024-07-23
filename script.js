$(document).ready(function() {
    let isGameActive = false;
    let intervalID;
    let timeRemaining = 60;
    const GAME_MINUTES = 3;
    let countdown_interval;
    let game1;
    let clock1 = new Analog_clock(document.getElementById('analog_clock_canvas'));

    $('#timeremaining').hide();
    $('#instructions').hide();

    function startGame() {
        const gameDiv = document.getElementById('game');
        const gameOverDiv = document.getElementById('gameOver');
        const timeremainingvalue = document.getElementById('timeremainingvalue');
        
        if (isGameActive) {
            clearInterval(intervalID);
            clearInterval(countdown_interval);
            timeremainingvalue.textContent = '60'; 
            gameOverDiv.style.display = 'none';
            $("#play_again").text('Play Again');
            isGameActive = false;
            $("#check_answer").prop("disabled", true);
            $('#game').hide(); 
            $('#timeremaining').hide(); 
            $('#how_to_play').show(); 
            $('#instructions').hide(); 
        } else {
            $('#game').show(); 
            $('#timeremaining').show(); 
            $('#instructions').hide(); 
            $('#how_to_play').hide(); 
            timeRemaining = 60;
            intervalID = setInterval(updateTimer, 1000); 
            $("#play_again").text('Reset Game');
            isGameActive = true;
            $("#check_answer").prop("disabled", false);
            game1 = new Clock_game(clock1, $("#student_name").val());
            game1.start_round(); 
            $("#level").text("Level " + game1.curr_level);
            $("#correct_answers").text("Correct answers: " + game1.total_correct);
            $("#grade").text("");
            startCountdown(GAME_MINUTES);
            generateOptions();
        }
    }

    function updateTimer() {
        timeRemaining--;
        document.getElementById('timeremainingvalue').textContent = timeRemaining;
        
        if (timeRemaining <= 0) {
            clearInterval(intervalID);
            document.getElementById('gameOver').style.display = 'block';
            document.getElementById('score').textContent = game1.total_correct;
            isGameActive = false;
            $("#play_again").text('Play Again');
            clearInterval(countdown_interval);

            // Play game over sound
            const gameOverSound = document.getElementById("game_over_sound");
            gameOverSound.play();

            // Disable placeholder
            $("#student_name").prop("disabled", true);

            // Redirect to start page after 3 seconds
            setTimeout(function() {
                location.reload();
            }, 3000);
        }
    }

    function startCountdown(minutes) {
        let countdown = minutes * 60;
   
        $("#timeremainingvalue").text(countdown);
        countdown_interval = setInterval(function() {
            countdown--;
           
            $("#timeremainingvalue").text(countdown);
            if (countdown <= 0) {
                clearInterval(countdown_interval);
                $("#play_again").click();
            }
        }, 1000);
    }

    function generateOptions() {
        const optionsContainer = $("#options-container");
        optionsContainer.empty();
    
        const correctTime = game1.clock.time.toLocaleTimeString().substr(0, 8);
        let times = [correctTime];
    
        while (times.length < 4) {
            let randomTime = new Date(game1.clock.time.getTime() + Math.floor(Math.random() * 3600000)).toLocaleTimeString().substr(0, 8);
            if (!times.includes(randomTime)) {
                times.push(randomTime);
            }
        }
    
        times = times.sort(() => Math.random() - 0.5);
    
        let row = $('<div class="option-row"></div>');
        times.forEach((time, index) => {
            let option = $('<div class="option-item"><input type="radio" name="time_option" value="' + time + '"> ' + time + '</div>');
            row.append(option);
            if ((index + 1) % 2 === 0) {
                optionsContainer.append(row);
                row = $('<div class="option-row"></div>');
            }
        });
        optionsContainer.append(row); // Append the last row if it has items
    }
    

    function updateInfo() {
        const selectedTime = $("input[name='time_option']:checked").val();
        const correctSound = document.getElementById("correct_sound");
        const incorrectSound = document.getElementById("incorrect_sound");

        if (!selectedTime) {
            $("#grade").html("❌ Please select an option.");
            $("#grade").css("color", "red");
            return;
        }
        let correct = game1.process_answer(selectedTime);

        $("#correct_answers").text("Correct answers: " + game1.total_correct);

        if (correct == 1) {
            correctSound.play();
            $("#grade").html("✅ Correct!");
            $("#grade").css("color", "green");
            setTimeout(function() {
                game1.start_round();
                generateOptions();
                $("#grade").html("");
            }, 1000);
        } else if (correct == 0) {
            incorrectSound.play();
            $("#grade").html("❌ Incorrect");
            $("#grade").css("color", "red");
        } else if (correct == 2) {
            correctSound.play();
            $("#grade").css("color", "green");
            $("#grade").html("✅ You finished the game! Well done!");
            setTimeout(function() {
                $("#play_again").click();
            }, 1500);
            return;
        } else {
            incorrectSound.play();
            $("#grade").html("❌ Incorrect");
            $("<p>The time is " + game1.clock.time.toLocaleTimeString().substr(0, 8) + "<br>Click the clock to continue</p>")
                .hide().insertAfter($("#grade")).toggle(1000);
            $("#check_answer").prop("disabled", true);
            $("#analog_clock_canvas").click(function() {
                game1.start_round();
                generateOptions();
                $("#check_answer").prop("disabled", false);
                $("#grade + p").remove();
                $("#analog_clock_canvas").off("click");
            });
        }

        $("#grade").animate({fontSize: '1.2em'}, 200, function() {
            $("#grade").animate({fontSize: '2em'}, 200)
        });
        $("#level").text("Level " + game1.curr_level);
    }

    $(window).keypress(function(e) {
        let key = e.keyCode || e.which;
        if (key == 13) {
            updateInfo();
        }
    });

    $("#check_answer").click(function() {
        updateInfo();
    });

    $("#play_again").click(function() {
        startGame();
    });

    $("#how_to_play").click(function() {
        $('#instructions').show(); 
        $('#how_to_play').hide(); 
    });
});
