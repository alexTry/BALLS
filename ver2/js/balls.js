
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
		Ball.range.reset = false;
		$.Storage.remove('setArea'); // сброс хранилища setArea

	});


// 	Конструктор шариков
	var Ball = function(obj) {

		if (Ball.range.p === undefined ) {
			// parent DOM element
			Ball.range.p = $('.myPlate');

			this.initBorders();

			// reset trigger
			Ball.range.reset = true;
		}

		if (!obj) {
			var obj = {location: 'set'};
		}
		this.loc = obj.location || 'set';
		this.move = obj.move || 'off';

		if (obj.id >= 0) {
			this.loady(obj.id);
		} else {
			this.id = Ball.id;
			Ball.id += 1;
			this.init();
		}
		this.checkPosition('paintBall','moveBall');
		if ((this.move === 'on') ) {

				this.moveTo();
		}
	}

	Ball.id = 0,
	Ball.setArea = [];
	Ball.range = {};

	Ball.prototype.init = function() {
		var move =  {
			horiz: {
				v: 3,
			speed: 1
			 },
			vert: {
				v: 3,
			speed: 1
			}
		};
		this.initPos();
		this.initMoving(move);
		this.create();
		this.addBallToDOM();
		this.addBallToSetArea();
		this.events();
	}

	Ball.prototype.addBallToSetArea = function() {
		var obj = {};
		obj.id = this.id;
		obj.x = this.x;
		obj.y = this.y;
		obj.m = {
			move: this.move,
			horiz: this.horiz,
			vert: this.vert
		};
		Ball.setArea.push(obj);
	}

	Ball.prototype.addBallToDOM = function() {
		Ball.range.p.append(this.elem);
	}

	Ball.prototype.initMoving = function(move) {
		this.move = 'off';
		this.horiz = {
			v: move.horiz.v,
		speed: move.horiz.speed
		};
		this.vert = {
			v: move.vert.v,
		speed: move.vert.speed
		};
	}

	Ball.prototype.create = function() {
		var that = this;
		this.elem = $('<div/>')
		.attr('class','ball')
		.css({
			'left': that.x,
			'top':that.y
		});
	}

	Ball.prototype.initBorders = function() {
		var balR = Ball.range,
		shiftRight = 455;
		balR.l = 0 + shiftRight;
		balR.r = parseInt(Ball.range.p.css('width')) - 50 + shiftRight;
		balR.t = 0;
		balR.b = parseInt(Ball.range.p.css('height')) - 55;
	}

	Ball.prototype.initPos = function() {
		this.x = this.randomInteger(0, 250);
		this.y = this.randomInteger(0, 350);

		if (!this.checkPosAllBalls()) {
			this.initPos();
		}
	}

	Ball.prototype.dist = function(ind) {
		var dx = this.x - Ball.setArea[ind].x,
			dy = this.y - Ball.setArea[ind].y,
		radius = Math.pow(dx*dx + dy*dy, 0.5);

		return(radius);
	}

	Ball.prototype.checkPosAllBalls = function(n){
		var area = Ball.setArea;
		for (var i in area) {
	        if (area.hasOwnProperty(i)) { // фильтрация

			   	if (this.id !== area[i].id ) {

			   		if (this.dist(i) < 50 ) {
			   			if (n) {
				   			return i;
			   			}
				   		return false;
			   		}
			   	}
	       }
		}
		return true;
	}

	Ball.prototype.loady = function(ind) {

		var setArea = Ball.setArea[ind];
		this.x = setArea.x;
		this.y = setArea.y;
		this.id = setArea.id;
		this.move = setArea.m.move;
		this.horiz = setArea.m.horiz;
		this.vert = setArea.m.vert;
		this.create();

		this.addBallToDOM();
		this.events();
	}

	Ball.prototype.randomInteger = function(min, max) {

	    var rand = min + Math.random() * (max + 1 - min);
	    rand = Math.floor(rand);
	    return rand;
  	}

  	Ball.prototype.saveSetAreaToLocalStorage =  function() {

	  	if (Ball.range.reset){
	  		$.Storage.set('setArea',JSON.stringify(Ball.setArea));
	  	}
  	}

  	Ball.prototype.saveBallToSetArea = function(id) {

		Ball.setArea[this.id] = {
			id: this.id,
			 x: this.x,
			 y: this.y,
			 m: {
				 move: this.move,
				horiz: this.horiz,
				 vert: this.vert
			 }
		};
	}

	Ball.prototype.moToSt = function() {

		this.x = parseFloat(this.elem.css('left'));
		this.y = parseFloat(this.elem.css('top'));
		this.saveBallToSetArea();
		this.saveSetAreaToLocalStorage();

		if (!((this.y < Ball.range.b) && (this.y > Ball.range.t) && (this.x < Ball.range.r) && (this.x > Ball.range.l) && this.checkPosAllBalls()) ) {

			if ( this.checkPosAllBalls()) {
				if (!((this.y < Ball.range.b) && (this.y > Ball.range.t) ) ) {
					this.vert.v *= -1;
				}
				if (!((this.x < Ball.range.r) && (this.x > Ball.range.l) ) ) {
					this.horiz.v *= -1;
				}

			}  else {
				var ind = this.checkPosAllBalls(true),
				vectX = this.x - Ball.setArea[ind].x,
				vectY = this.y - Ball.setArea[ind].y,
				vy = -1,
				vx = -1;
// 						console.log(vectX, vectY);

				if (vectX < 0) { // Left Kick
					console.log('left'+vectX);
					/*
if (vectY > 0) {
						vx = 1;
					} else {
						vy = 1;
					}
*/
// 					this.horiz.v = 2;
				} else if (vectX > 0) {// Right Kick
					console.log('right'+vectX);
					/* if (vectY > 0) { */ // Right - Bottom
						/* console.log('right-bottom: '+vectX + '/' + vectY); */
						/*
var x1 = 50,
							y1 = 0,
							x2 = vectX,
							y2 = vectY,
						   rad = Math.atan((x1*y2 - y1*x2)/(x1*x2 - y1*y2));
						if (rad*(180/Math.PI) >= 45) {
							var res = 90 - (rad*(180/Math.PI)),
								res2= Math.abs(this.horiz.v) - res * 3/45,
								res3= Math.abs(this.vert.v) + res * 3/45;
							console.log(
							'угол = ' + res + '˚\n' +
							' v.x = ' + this.horiz.v +'\n'+
							' v.y = ' + this.vert.v + '\n'+
							' n.x = ' + (this.horiz.v < 0 ? this.horiz.v=(res2 * -1): this.horiz.v=res2)
							);
							(this.vert.v < 0) ? this.vert.v=(res3 * -1): this.vert.v=res3;
*/
							/*
vx = 1;
// 						}

					} else {
							vy = 1
					}
*/
				} else {

				}

				if (vectY < 0) { // Top Kick
					console.log('top'+vectY);
// 					this.horiz.v = 1;
				} else  if (vectY > 0){ // Bottom Kick
					console.log('bottom'+vectY);
				} else {

				}

				this.vert.v *= vy;
				this.horiz.v *= vx;

			}
			this.moveTo();

		}  else {
			this.moveTo();
		}

	}
	Ball.prototype.moveTo = function() {
// 	console.log('speed-'+this.horiz.speed);
		var that = this;


		this.elem.animate(
			{
				left: '+=' + that.horiz.v,
				top: '+=' + that.vert.v
			},
			that.horiz.speed,
			function () {
				that.moToSt();
			}
		); //1
	}
	// end new ======================




	Ball.prototype.events = function(ind) {
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

				// Save if drag to Ball.setArea & LocalStorage
				that.saveBallToSetArea();
				that.saveSetAreaToLocalStorage();


				$(me).css({'left': that.x,'top': that.y});

				$(this).mouseup(function(e) {

					document.onmousemove = null;
					if (that.elem.hasClass('select')){
				that.elem.removeClass('select');

// 				rerecord coordinate in set base
				if (that.loc === 'set') {

					that.checkPosition('paintBall','moveBall');

				}

// 				that.select = false;
			} else {
// 				that.select = true;
			}


	// 				that.select = true;
				});

			}

		});


		this.elem.on({

			'click': function(e){
				if (that.move === 'off') {
if (that.moveBall() === 1){


					that.move = 'on';
					that.saveBallToSetArea();
					that.saveSetAreaToLocalStorage();
					that.moveTo();
					}
				} else {
					that.elem.stop(true);
					that.move = 'off';
					that.saveBallToSetArea();
					that.saveSetAreaToLocalStorage();
				}
			},

			'mouseover': function(e){

				if (that.move === 'on') {
					that.elem.stop(true);
					that.move = 'off';
					that.saveBallToSetArea();
					that.saveSetAreaToLocalStorage();
				}
				e.preventDefault();
				that.checkPosAllBalls();

			}
		});


	}
	Ball.prototype.checkPosition = function () {

		if (((this.x > 455) && (this.x < 705)) && ((this.y > -40) && (this.y < 395))) {
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
		var that = this, bol;

		if (((this.x > 455) && (this.x < 705)) && ((this.y > -40) && (this.y < 395))) {
			bol = 1;
		} else {
			bol = 2;
		}
		return bol;

	}



	var setArea = $.Storage.get('setArea');
	if(setArea){
// 		if(setArea[0].m){
			Ball.setArea = JSON.parse(setArea);
// 		}
	}

	var arrSet = [];
	if (Ball.setArea.length > 0) {
		for (var i = 0, j = Ball.setArea.length; i < j; i += 1) {
			arrSet[i] = new Ball({
				id: i, // Ball.setArea[i].name
				location: 'set'
			});
		}
	} else {

		var num = 4, ball = [];
		for (var i = 0, j= num; i < j; i += 1) {
			ball[i] = new Ball();
		}

		$.Storage.set('setArea',JSON.stringify(Ball.setArea));
	}


	console.log(Ball.setArea);

});