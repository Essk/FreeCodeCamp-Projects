var minutes = 10;
var seconds = '00';
var counter= minutes * 60;
var timer = {
    state:'stopped'
};

function increment(){
    counter++;
    seconds = counter%60;
    if (seconds === 0){
        minutes++;
    }
    $(".main-timer").html(minutes + ':' + seconds);
}

function decrement(){

    counter--;
    seconds = counter%60;
    if (seconds === 59){
        minutes--;
    }
    if (seconds<10){
        seconds = '0' + seconds;
    }
    $(".main-timer").html(minutes + ':' + seconds);

}

function startStop(timer) {
    if (timer.state === 'stopped') {
        timer.ID = window.setInterval(decrement, 1000);
        timer.state = 'started';
    } else {
        clearInterval(timer.ID);
        timer.state = 'stopped';
    }
}



$(document).ready(function() {
        $(".main-timer").html(minutes + ':' + seconds);

        $(".main-timer").click(function () {
            startStop(timer);
        });
    }
    );


