setTimeout(process, 33);

process_percent = 0;
particles = new Array;

function process(){
	process_percent++;
	updateProgressBar(document.getElementById('progress-bar'), process_percent);
	if (process_percent < 100) setTimeout(process, 100);
}

function updateProgressBar(canvas, percent){
	canvas.width = 420;
	canvas.height = 420;
	context = canvas.getContext("2d");

	context.strokeStyle = "#444";
	context.beginPath();
	context.arc(200, 200, 100, 0, (Math.PI * 2), false);

	context.closePath();
	context.lineWidth = 4;
	context.stroke();

	context.beginPath();
	context.arc(200, 200, 100, 0, (percent / 100) * (Math.PI * 2), false);
	//context.lineTo(200,200);
	//context.closePath();
	
	context.strokeStyle = "#fff";
	context.lineWidth = 2;
	context.shadowColor = "white";
	context.shadowBlur = 4;
	context.shadowOffsetX = 0;
	context.shadowOffsetY = 0;
	context.stroke();

	context.font = "bold 40px ChocolateBox";
	context.fillStyle = "#fff";
	context.textAlign = "center";
	context.textBaseline = "middle";
	context.fillText(percent + "%", 200, 200);

	x = 200 + 100*Math.cos((percent / 100) * (Math.PI * 2));
	y = 200 + 100*Math.sin((percent / 100) * (Math.PI * 2));
	context.save();
	context.globalCompositeOperation = "lighter";
	new_gradient = context.createRadialGradient(x, y, 0, x, y, 30);
	new_gradient.addColorStop(0, "rgba(255,255,255,.7)");
	new_gradient.addColorStop(.2, "rgba(180,245,255,.6)");
	new_gradient.addColorStop(.5, "rgba(180,245,255,.2)");	
	new_gradient.addColorStop(1, "rgba(64,64,64,0)");

	context.fillStyle = new_gradient;
	context.beginPath();
	context.arc(x, y, 400, 0, (Math.PI * 2), false);
	context.closePath();


	context.fill();
	
	context.restore();
	for (p = 0; p < 10; p++){
		newParticle( (percent / 100) * (Math.PI * 2) );
	}
	updateParticles();
};

function particle(x, y, xd, yd, lifespan){
	this.x = x;
	this.y = y;
	this.xd = xd;
	this.yd = yd;
	this.alive = true;
	this.age = lifespan;
}

function newParticle(radians){
	x = 200 + 100*Math.cos(radians);
	y = 200 + 100*Math.sin(radians);
	particles[particles.length] = new particle(x, y, (.5 - Math.random()) * 2, (.5 - Math.random()) * 2, 10);
}

function updateParticles(){
	for (i = 0; i < particles.length; i++){
		if (particles[i].alive) {
			particles[i].x += particles[i].xd;	
			particles[i].y += particles[i].yd;
			particles[i].age--;
			if (particles[i].age == 0) particles[i].alive = false;
			context.globalAlpha = (particles[i].age / 10);
			context.globalCompositeOperation = "lighter";

			context.shadowColor = "transparent";
			new_gradient = context.createRadialGradient(particles[i].x, particles[i].y, 0, particles[i].x, particles[i].y, 3);
			new_gradient.addColorStop(0, "rgba(255,255,255,.7)");
			new_gradient.addColorStop(.2, "rgba(180,245,255,.6)");
			new_gradient.addColorStop(.5, "rgba(180,245,255,.2)");	
			new_gradient.addColorStop(1, "rgba(64,64,64,0)");
			context.fillStyle = new_gradient;
			context.beginPath();
			context.arc(particles[i].x, particles[i].y, 3, (Math.PI * 2), false);
			context.fill();
		}	
	}

}
