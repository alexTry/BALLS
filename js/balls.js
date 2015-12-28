
$(document).ready(function(){




function fixPageXY(e) {
  if (e.pageX == null && e.clientX != null ) {
    var html = document.documentElement
    var body = document.body

    e.pageX = e.clientX + (html.scrollLeft || body && body.scrollLeft || 0)
    e.pageX -= html.clientLeft || 0

    e.pageY = e.clientY + (html.scrollTop || body && body.scrollTop || 0)
    e.pageY -= html.clientTop || 0
  }
}

	$('h1').click(function(){
		$.Storage.remove('setArea'); // сброс хранилища setArea
	});


// 	Конструктор шариков
	var Ball = function(obj) {

		if (!obj) {
			var obj = {location: 'set'};
		}
		this.loc = obj.location || 'set';
		this.move = obj.move || 'off';

		if (obj.name >= 0) {
			this.loady(obj.name);
			Ball.id = obj.name;
			this.id = Ball.id;


		} else {
			this.init();
			this.id = Ball.id;
			Ball.id += 1;
		}
		this.checkPosition('paintBall','moveBall');

	}

	Ball.id = 0,
	Ball.setArea = [];

	Ball.prototype.init = function() {

		this.createDomBall();
		this.seekPlaceToBall({x: true, y: true});
		this.addToDOM();

	}

	Ball.prototype.loady = function(ind) {

		this.createDomBall();
		this.x = Ball.setArea[ind].x;
		this.y = Ball.setArea[ind].y;
		this.elem.css('left',this.x+'px');
		this.elem.css('top',this.y+'px');
		this.addToDOM();

	}

	Ball.prototype.randomInteger = function(min, max) {

	    var rand = min + Math.random() * (max + 1 - min);
	    rand = Math.floor(rand);
	    return rand;

  	}

  	Ball.prototype.saveToSetArea =  function() {
	  	$.Storage.set('setArea',JSON.stringify(Ball.setArea));
  	}

	Ball.prototype.createDomBall = function() {

		this.elem = $('<div/>').attr('class','ball');

// 		console.log('Ball '+Ball.id+' is Create');
	}

	Ball.prototype.events = function() {
		var that = this;
		this.elem.mouseover(function(){
			that.elem.stop(true);
		});

		this.elem.mousedown(function(e){
			that.elem.stop();
			if (!that.elem.hasClass('select')){
				that.elem.addClass('select');
			}

			var me = this,
				x = parseInt($(me).css('left')),
				y = parseInt($(me).css('top')),
				client;

			document.onmousemove = function(e) {
			  	var e = e || event;
			  	fixPageXY(e);
				if (!client) {
					client = {x: e.clientX, y: e.clientY};
				}
				that.x = x + (e.clientX - client.x );
				that.y = y + (e.clientY - client.y );

				$(me).css({'left': that.x,'top': that.y});

				$(this).mouseup(function(e) {

					document.onmousemove = null;

	// 				that.select = true;
				});

			}

		});
		this.elem.mouseup(function(e){
			if (that.elem.hasClass('select')/*  && that.select === true */ ){
				that.elem.removeClass('select');
// 				rerecord coordinate in set base
				if (that.loc === 'set') {
					Ball.setArea[that.id].x = that.x;
					Ball.setArea[that.id].y = that.y;
					that.saveToSetArea();
					that.checkPosition('paintBall','moveBall');


				}

// 				that.select = false;
			} else {
// 				that.select = true;
			}
		});

	}
	Ball.prototype.checkPosition = function () {

		if (((this.x > 410) && (this.x < 750)) && ((this.y > -40) && (this.y < 395))) {
			for (var i = 0; i < arguments.length; i += 1) {
				this[arguments[i]](true);
			}

		} else {
			for (var i = 0; i < arguments.length; i += 1) {
				this[arguments[i]]();
			}

		}
	}
	Ball.prototype.paintBall = function(todo) {
		if (todo) {
			this.elem.removeClass('ball');
			this.elem.addClass('ballPlay');
		} else {
			this.elem.removeClass('ballPlay');
			this.elem.addClass('ball');
		}
	}

	Ball.prototype.moveBall = function(todo) {
		var that = this,
		animUp = function () {
            that.elem.animate({ top: 0 }, 1000, "swing", animDown);
        },
         animDown = function () {
            that.elem.animate({ top: 350 }, 1000, "swing", animUp);
        }
		if (todo) {
			animUp();
		} else {

			this.elem.stop(true);
		}
	}

	Ball.prototype.seekPlaceToBall = function(obj) {
		this.x = this.randomInteger(2, 248);
		this.y = this.randomInteger(2, 348);

		Ball.setArea.push({
			name: Ball.id,
			x: this.x,
			y: this.y
		});

		this.elem.css('left',this.x+'px');
		this.elem.css('top',this.y+'px');
	}

	Ball.prototype.addToDOM = function() {
		this.events();
		$('.myPlate').append(this.elem);

// 		console.log('Ball '+Ball.id+' add to DOM');

	}

	var setArea = $.Storage.get('setArea');
	if(setArea){
		Ball.setArea = JSON.parse(setArea);
	}
	var arrSet = [];
	if (Ball.setArea.length > 0) {
		for (var i = 0, j = Ball.setArea.length; i < j; i += 1) {
			arrSet[i] = new Ball({
				name: i, // Ball.setArea[i].name
				location: 'set'
			});
		}
	} else {

		var ball_1 = new Ball(),
		ball_2 = new Ball(),
		ball_3 = new Ball(),
		ball_4 = new Ball();
		$.Storage.set('setArea',JSON.stringify(Ball.setArea));
	}



	console.log(Ball.setArea);

})