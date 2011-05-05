function progressBar(canvas){
	this.canvas = canvas;
	this.percent = 0;
	this.updateProgress = progressBarUpdateProgress;
	this.redraw = progressBarRedraw;
	this.particles = new Array();
	this.newParticle = progressBarNewParticle;
	this.updateParticles = progressBarUpdateParticles;
	this.center_spin_frame = 0;
	setTimeout(this.redraw(this.canvas, this.percent, this), 20);

	
}

function progressBarUpdateProgress(percent){
	this.percent = percent;
	if (this.percent > 100) this.percent = 100;
	if (this.percent < 0) this.percent = 0;
}

function progressBarRedraw(canvas, percent, parent){
	return function() {
	//Reset canvas to fixed width and height
	canvas.width = 420;
	canvas.height = 420;

	context = canvas.getContext("2d");

	//Draw full, grey, circle
	context.strokeStyle = "#555";
	context.lineWidth = 4;
	context.beginPath();
		context.arc(200, 200, 100, 0, (Math.PI * 2), false);
	context.closePath();
	context.stroke();

	//Draw partial circle for progress indication
	context.strokeStyle = "#fff";
	context.lineWidth = 2;
	context.shadowColor = "#b4f5fd";
	context.shadowBlur = 6;
	context.shadowOffsetX = 0;
	context.shadowOffsetY = 0;

	context.beginPath();
	context.arc(200, 200, 100, 0, (percent / 100) * (Math.PI * 2), false);
	context.stroke();

	context.save();
		context.lineWidth = 2;
		context.shadowBlur = 0;

		context.beginPath();
		context.arc(200,200,30,0,(Math.PI * 2), false);
		context.closePath();
		context.strokeStyle = "#aaa";
		context.stroke();


		x = 200 + 30*Math.cos((parent.center_spin_frame / 15) * (Math.PI * 2));
		y = 200 + 30*Math.sin((parent.center_spin_frame / 15) * (Math.PI * 2));
		context.globalCompositeOperation = "lighter";

		glow_gradient = context.createRadialGradient(x, y, 0, x, y, 15);
		glow_gradient.addColorStop(0, "rgba(255,255,255,.7)");
		glow_gradient.addColorStop(.2, "rgba(180,245,255,.6)");
		glow_gradient.addColorStop(.5, "rgba(180,245,255,.2)");	
		glow_gradient.addColorStop(1, "rgba(64,64,64,0)");
	
		context.fillStyle = glow_gradient;
		context.beginPath();
		context.arc(x, y, 400, 0, (Math.PI * 2), false);
		context.closePath();
		context.fill();	

		context.beginPath();
		context.arc(x, y, 3, 0, (Math.PI * 2), false);
		context.closePath();
		context.fillStyle = "#fff"
		context.fill();
	context.restore();

	//Draw glowie thingie
	x = 200 + 100*Math.cos((percent / 100) * (Math.PI * 2));
	y = 200 + 100*Math.sin((percent / 100) * (Math.PI * 2));
	context.save();
		context.globalCompositeOperation = "lighter";

		glow_gradient = context.createRadialGradient(x, y, 0, x, y, 30);
		glow_gradient.addColorStop(0, "rgba(255,255,255,.7)");
		glow_gradient.addColorStop(.2, "rgba(180,245,255,.6)");
		glow_gradient.addColorStop(.5, "rgba(180,245,255,.2)");	
		glow_gradient.addColorStop(1, "rgba(64,64,64,0)");
	
		context.fillStyle = glow_gradient;
		context.beginPath();
		context.arc(x, y, 400, 0, (Math.PI * 2), false);
		context.closePath();
		context.fill();	
	context.restore();
	for (i = 0; i < 10; i++){
		parent.newParticle((percent / 100) * (Math.PI * 2));
	}
	parent.updateParticles();
	parent.center_spin_frame--;
	if (parent.center_spin_frame == 15) parent.center_spin_frame = 0;
	setTimeout(parent.redraw(parent.canvas, parent.percent, parent), 20);
	}	

}

function progressBarParticle(x, y, xd, yd, lifespan){
	this.x = x;
	this.y = y;
	this.xd = xd;
	this.yd = yd;
	this.alive = true;
	this.age = lifespan;
}

function progressBarNewParticle(radians){
	x = 200 + 100*Math.cos(radians);
	y = 200 + 100*Math.sin(radians);
	for (i = 0; i < this.particles.length; i++){	
		if (this.particles[i].alive == false){
			this.particles[i] = new progressBarParticle(x, y, (.5 - Math.random()) * 3, (.5 - Math.random()) * 3, 10);
			return;
		}
	}
	this.particles[this.particles.length] = new progressBarParticle(x, y, (.5 - Math.random()) * 3, (.5 - Math.random()) * 3, 10);
}


function progressBarUpdateParticles(){
	context = this.canvas.getContext('2d');
	for (i = 0; i < this.particles.length; i++){
		if (this.particles[i].alive) {
			this.particles[i].x += this.particles[i].xd;	
			this.particles[i].y += this.particles[i].yd;
			this.particles[i].age--;
			if (this.particles[i].age == 0) this.particles[i].alive = false;
			context.globalAlpha = (this.particles[i].age / 10);
			context.globalCompositeOperation = "lighter";

			context.shadowColor = "transparent";
			new_gradient = context.createRadialGradient(this.particles[i].x, this.particles[i].y, 0, this.particles[i].x, this.particles[i].y, 3);
			new_gradient.addColorStop(0, "rgba(255,255,255,.7)");
			new_gradient.addColorStop(.2, "rgba(180,245,255,.6)");
			new_gradient.addColorStop(.5, "rgba(180,245,255,.2)");	
			new_gradient.addColorStop(1, "rgba(64,64,64,0)");
			context.fillStyle = new_gradient;
			context.beginPath();
			context.arc(this.particles[i].x, this.particles[i].y, 3, (Math.PI * 2), false);
			context.fill();
		}	
	}

}
