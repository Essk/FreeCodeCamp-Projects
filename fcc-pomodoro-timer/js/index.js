var Session = function(length){
    this.length=length;
};


Session.prototype.increaseLength = function(amount, update){
    this.length += amount;
    update.html(this.length);
};

Session.prototype.decreaseLength = function(amount, update){
    if((this.length - amount) > 0){
        this.length = this.length - amount;
        console.log(this.length);
        update.html(this.length);
    }
};

var workSession = new Session(25);
var breakSession = new Session(5);



var minutes = workSession.length;
var seconds = '00';
var counter= minutes * 60;
var timer = {
    state:'stopped'
};

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
        $(".current-break").html(breakSession.length);
        $(".current-work").html(workSession.length);

        $(".main-timer-background").click(function () {
            startStop(timer);
        });

        $(".change-break  .add").click(function(){
            breakSession.increaseLength(1, $(this).siblings().last());
        });

        $(".change-work .add").click(function(){
            workSession.increaseLength(5, $(this).siblings().last());
        });

        $(".change-break  .minus").click(function(){
            breakSession.decreaseLength(1, $(this).siblings().last());
        });

        $(".change-work  .minus").click(function(){
            workSession.decreaseLength(5, $(this).siblings().last());
        });
    }
    );


