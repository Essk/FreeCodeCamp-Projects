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
        update.html(this.remaining);
    }
};

Session.prototype.reset = function(){
    this.remaining = this.length;
};


var workSession = new Session(1, "work");
var breakSession = new Session(5, "break");

var Timer = function(session){
    this.session = session;
    this.state = 'stopped';
    this.minutes = this.session.length;
    this.originLength = this.session.length;
    this.seconds = '00';
    this.counter = this.minutes*60;
};
var timer = new Timer(workSession);

Timer.prototype.updateHTML = function(element){
    this.test('test updateHTML');
    element.html(this.minutes + ':' + this.seconds);
};

Timer.prototype.test = function(message){
    console.log(message);
};

Timer.prototype.checkSessionLength = function(){
    if (this.session.length != this.originLength){
        var diff =  this.session.length - this.originLength;
        this.originLength = this.session.length;
        console.log('adding' + diff*60 );
        this.counter = this.counter + (diff*60);
        console.log(this.counter);
    }

};



Timer.prototype.decrement = function (){
    this.counter--;
    this.checkSessionLength();
    this.seconds = this.counter%60;
    this.minutes = (this.counter-this.counter%60)/60;
    if (this.seconds === 59){
        this.minutes--;
    }
    if (this.seconds<10){
        this.seconds = '0' + this.seconds;
    }

    if (this.counter === 0) {
        this.reset();
        console.log("resetting");
    }

    this.updateHTML($(".main-timer"));
};



Timer.prototype.reset = function(){
    this.playSound();
    this.startStop();
    if(this.session.type === "work"){
        this.switchTo(breakSession);
    } else if (this.session.type === "break") {
        this.switchTo(breakSession);
    }


};

Timer.prototype.startStop = function(){

    //bind funkiness. needed because I think window.setInterval messes with "this" and so
    // timer methods then fall outside the scope
   var boundDecrement =  this.decrement.bind(this);
    if (this.state === 'stopped') {
        this.ID = window.setInterval(boundDecrement, 1000);
        this.state = 'started';
    } else {
        clearInterval(this.ID);
        this.state = 'stopped';
    }
};

Timer.prototype.playSound = function (){
    console.log('BINGBONG!!');
};





Timer.prototype.switchTo = function(session){
    this.session = session;
    this.startStop();
};






$(document).ready(function() {


        $(".main-timer").html(timer.minutes + ':' + timer.seconds);
        $(".current-break").html(breakSession.length);
        $(".current-work").html(workSession.length);

        $(".main-timer-background").click(function () {
            timer.startStop();
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


