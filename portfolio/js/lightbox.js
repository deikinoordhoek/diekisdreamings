
function initLightbox(){
	$("a.portfolio-image").click(function(event){
		canvas = document.createElement("canvas");
		if (!!canvas.getContext){
			event.preventDefault();			
			lightbox_image_title = this.getAttribute("data-title");
			displayLightbox(this.href, this.getAttribute("data-title"));
			$("#lightbox-canvas").click(function(){hideLightbox()});
			
		}
	});
}
function hideLightbox(){
	$("#lightbox-canvas").fadeOut(400);
	setTimeout(function(){$("#lightbox-canvas").remove()}, 400);
}
function displayLightbox(image_url, lightbox_image_title){
	//Create a new <canvas>, set it to body, and make it cover the whole page.

	canvas = document.createElement("canvas");
	document.getElementById("body").appendChild(canvas);
	canvas.id = "lightbox-canvas";

	canvas.width = $(window).width();
	canvas.height = $(window).height() + 20;

	$('#lightbox-canvas').css("position", "fixed");
	$('#lightbox-canvas').css("top", "0px");
	$('#lightbox-canvas').css("left", "0px");

	//Shade out the background.
	context = canvas.getContext('2d');
	context.fillStyle = "rgba(0,0,0,.5)";
	context.fillRect(0,0,canvas.width, canvas.height);

	//Load the image, and pass control on to the secondary function.
	image = new Image();
	image.src = image_url;
	image.onload = drawLightboxImage(image, lightbox_image_title);
}

function drawLightboxImage(image, lightbox_image_title){
	return function(){
		//Load some important objects and numbers
		canvas = document.getElementById("lightbox-canvas");
		context = canvas.getContext('2d');
		window_height = $(window).height();
		window_width = $(window).width();
		image_width = image.width;
		image_height = image.height;


		//Calculate the position and scale of the image
		image_scale = 1;
		if (image_height + 110 > window_height) image_scale = window_height / (image_height + 110);
		if ((image_width * image_scale) + 40 > window_width) image_scale = window_width / (image_width + 40);
		image_height *= image_scale;
		image_width *= image_scale;

		
		image_left_x = Math.floor((window_width / 2) - (image_width / 2));
		image_top_y = Math.floor((window_height / 2) - ((image_height - 60) / 2));
		image_right_x = image_left_x + image_width;
		image_bottom_y = image_top_y + image_height;
	
		//Prepare the inner glow first
		var ITEM_INNER_GLOW_RADIUS = 46;
		glow_canvas = document.createElement("canvas");
		glow_context = glow_canvas.getContext("2d");
		glow_canvas.width = window_width;
		glow_canvas.height = window_height;
		glow_context.rectWithRoundRectHole(0,0, glow_context.canvas.width, glow_context.canvas.height, image_left_x, image_top_y - 60, image_right_x, image_bottom_y, 5);
		glow_context.fillStyle = "white";
		glow_context.shadowColor = "rgba(255,255,255,1);"
		glow_context.shadowBlur = ITEM_INNER_GLOW_RADIUS;
		glow_context.shadowOffsetX = 0;
		glow_context.shadowOffsetY = 0;
		glow_context.fill();
		var lightbox_inner_glow_data = new Image()
		lightbox_inner_glow_data.src = glow_context.canvas.toDataURL("image/png")
		lightbox_inner_glow_data.onload = finishDrawingLightbox(canvas, lightbox_inner_glow_data);
	}

}

function finishDrawingLightbox(canvas, lightbox_inner_glow_data){
	return function(){
		//We do the rest of the drawing once the inner glow loads.
		
		//Draw the base box, w/shadow.
		context = canvas.getContext('2d');
		context.save();
			context.shadowColor = "black";
			context.shadowBlur = 20;
			context.shadowOffsetX = 2;
			context.shadowOffsetY = 2;
	
			context.roundRect(image_left_x, image_top_y - 60, image_right_x, image_bottom_y, 5);
			context.fillStyle = "#333";
			context.fill();
		context.restore();
			
		//Draw the image
		context.save();
			context.roundRect(image_left_x, image_top_y - 60, image_right_x, image_bottom_y, 5);
			context.clip();
			context.drawImage(image, image_left_x, image_top_y, image_width, image_height);
		context.restore();

		//Draw the top bar shadow
		context.save();
			box_shadow_gradient = context.createLinearGradient(0,image_top_y,0, image_top_y + 9);
			box_shadow_gradient.addColorStop(0, "rgba(0,0,0,.6)");
			box_shadow_gradient.addColorStop(1, "transparent");
			context.fillStyle = box_shadow_gradient;
			context.fillRect(image_left_x,image_top_y, image_width, 9);
		context.restore();
			//Draw the stroke around the outside
		context.save();
			context.globalCompositeOperation = "lighter";
			context.roundRect(image_left_x, image_top_y - 60, image_right_x, image_bottom_y +.5, 5);
			context.strokeStyle = "#888";
			context.stroke();
		context.restore();
			//Draw the text
		context.save();
			context.textAlign = "center";
			context.textBaseline = "bottom";
			context.font = "48px ChocolateBoxRegular";
			context.save();
				context.shadowColor = "rgba(0,0,0,.68)";
				context.shadowOffsetX = 2;
				context.shadowOffsetY = 1;
				context.shadowBlur = 4;
				context.fillText(lightbox_image_title, window_width / 2, image_top_y);
			context.restore();
				text_gradient = context.createLinearGradient(0,image_top_y - 45, 0, image_top_y );
			text_gradient.addColorStop(0, "#f9f9f9");
			text_gradient.addColorStop(1, "#bebebe");
			context.fillStyle= text_gradient;
			context.fillText(lightbox_image_title, window_width / 2, image_top_y);
		context.restore()
			//Draw the inner glow
		context.save();
			context.roundRect(image_left_x, image_top_y - 60, image_right_x, image_bottom_y, 5);
			context.clip();
			context.globalAlpha = .10;
			context.drawImage(lightbox_inner_glow_data, 0, 0);
		context.restore()
		
	}
}
CanvasRenderingContext2D.prototype.roundRect = function(sx,sy,ex,ey,r) {
	var r2d = Math.PI/180;
	if( ( ex - sx ) - ( 2 * r ) < 0 ) { r = ( ( ex - sx ) / 2 ); } //ensure that the radius isn't too large for x
	if( ( ey - sy ) - ( 2 * r ) < 0 ) { r = ( ( ey - sy ) / 2 ); } //ensure that the radius isn't too large for y
	this.beginPath();
	this.moveTo(sx+r,sy);
	this.lineTo(ex-r,sy);
	this.arc(ex-r,sy+r,r,r2d*270,r2d*360,false);
	this.lineTo(ex,ey-r);
	this.arc(ex-r,ey-r,r,r2d*0,r2d*90,false);
	this.lineTo(sx+r,ey);
	this.arc(sx+r,ey-r,r,r2d*90,r2d*180,false);
	this.lineTo(sx,sy+r);
	this.arc(sx+r,sy+r,r,r2d*180,r2d*270,false);
	this.closePath();
}

CanvasRenderingContext2D.prototype.rectWithRoundRectHole = function(sx,sy,ex,ey, sx2,sy2,ex2,ey2,r) {
	var r2d = Math.PI/180;
	if( ( ex - sx ) - ( 2 * r ) < 0 ) { r = ( ( ex - sx ) / 2 ); } //ensure that the radius isn't too large for x
	if( ( ey - sy ) - ( 2 * r ) < 0 ) { r = ( ( ey - sy ) / 2 ); } //ensure that the radius isn't too large for y

	this.beginPath();

	this.moveTo(sx2,sy2);
	this.lineTo(sx2, ey2);
	this.lineTo(ex2, ey2);
	this.lineTo(ex2, sy2);
 
	this.moveTo(sx+r,sy);
	this.lineTo(ex-r,sy);
	this.arc(ex-r,sy+r,r,r2d*270,r2d*360,false);
	this.lineTo(ex,ey-r);
	this.arc(ex-r,ey-r,r,r2d*0,r2d*90,false);
	this.lineTo(sx+r,ey);
	this.arc(sx+r,ey-r,r,r2d*90,r2d*180,false);
	this.lineTo(sx,sy+r);
	this.arc(sx+r,sy+r,r,r2d*180,r2d*270,false);

	this.closePath();
}
