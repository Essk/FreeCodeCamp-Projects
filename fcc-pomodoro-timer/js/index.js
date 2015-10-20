var Session = function(length, type){
    this.length=length;
    this.remaining = length;
    this.type = type;
};


Session.prototype.increaseLength = function(amount, update){
    this.length += amount;
    update.html(this.length);
};

Session.prototype.decreaseLength = function(amount, update){
    if((this.remaining - amount) > 0) {
        this.remaining = this.remaining - amount;
        //console.log(this.length);
        update.html(this.remaining);

    }
};

Session.prototype.reset = function(){
    this.remaining = this.length;
};


var workSession = new Session(0.5, "work");
var breakSession = new Session(5, "break");



var minutes = workSession.length;
var seconds = '00';
var counter= minutes * 60;
var timer = {
    state:'stopped'
};

function switchTo(session){
    var minutes = session.length;
    var seconds = '00';
    counter= minutes * 60;
    $(".main-timer").html(minutes + ':' + seconds);
}

Session.prototype.decrement = function (){

    counter--;
    seconds = counter%60;
    if (seconds === 59){
        minutes--;
    }
    if (seconds<10){
        seconds = '0' + seconds;
    }

    if (this.remaining === 0) {
        this.reset();
        console.log("resetting");
        this.type == 'work'? switchTo(breakSession):switchTo(workSession);
    }

    $(".main-timer").html(minutes + ':' + seconds);

};

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


