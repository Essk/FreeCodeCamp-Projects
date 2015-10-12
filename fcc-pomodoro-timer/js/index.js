var minutes = 10;
var seconds = '00';
var counter= minutes * 60;

function increment(){
    counter++;
    seconds = counter%60;
    if (seconds === 0){
        minutes++
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

$(document).ready(function(){

    var timerID = window.setInterval(decrement, 1000);
    $(".main-timer").html(minutes + ':' + seconds);
});