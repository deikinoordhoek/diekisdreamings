window.onload = drawPortfolioImage;
var ITEM_WIDTH = 662;
var ITEM_HIEGHT = 162;
var ITEM_OFFSET = 9;
var image_offset_x = 0;
var image_offset_y = 0;
var image_scale = 1;
function drawPortfolioImage(){
	canvas = document.getElementById("portfolio-image-canvas");
	context = canvas.getContext('2d');
	i = new Image();
	i.src = "thumbnail2.jpg";

	i.onload = function(){
		context.save();
			context.roundRect(ITEM_OFFSET, ITEM_OFFSET, ITEM_WIDTH + ITEM_OFFSET, ITEM_HIEGHT + ITEM_OFFSET,5);
			context.fillStyle = "black";
			context.shadowColor = "black";
			context.shadowOffsetX = 0;
			context.shadowOffsetY = 0;
			context.shadowBlur = 10;
			context.fill();
		context.restore();

		//Draw the background box.
		context.save()
			context.roundRect(ITEM_OFFSET, ITEM_OFFSET, ITEM_WIDTH + ITEM_OFFSET, ITEM_HIEGHT + ITEM_OFFSET,5);
			context.fillStyle = "#444";
			context.fill();
	
			//Clip and draw the image.
			context.save();
			context.clip();
			context.drawImage(i, ITEM_OFFSET - image_offset_x,54 + ITEM_OFFSET - image_offset_y, i.width * image_scale, i.height * image_scale);
	
			//Draw the top rectangular box w/gradient.
			text_box_gradient = context.createLinearGradient(0,9,0,54);
			text_box_gradient.addColorStop(0, "#383838");
			text_box_gradient.addColorStop(1, "#2b2b2b");
	
			context.fillStyle = text_box_gradient;
			context.fillRect(ITEM_OFFSET, ITEM_OFFSET,ITEM_WIDTH,54);
		
		
			//Draw the shadow for top rectangular box
			box_shadow_gradient = context.createLinearGradient(0,52 + ITEM_OFFSET,0, 61 + ITEM_OFFSET);
			box_shadow_gradient.addColorStop(0, "rgba(0,0,0,.6)");
			box_shadow_gradient.addColorStop(1, "transparent");
			context.fillStyle = box_shadow_gradient;
			context.fillRect(ITEM_OFFSET,54 + ITEM_OFFSET,662, 9);
		context.restore();


		//Draw text on titlebar
		context.save();
	
			context.textAlign = "center";
			context.textBaseline = "bottom";
			context.font = "48px ChocolateBoxRegular";
			context.save();
				context.shadowColor = "rgba(0,0,0,.68)";
				context.shadowOffsetX = 2;
				context.shadowOffsetY = 1;
				context.shadowBlur = 4;
				context.fillText("Lantern Waste", ITEM_WIDTH / 2, 69);
			context.restore();

			text_gradient = context.createLinearGradient(0,15,0, 60);
			text_gradient.addColorStop(0, "#f9f9f9");
			text_gradient.addColorStop(1, "#bebebe");
			context.fillStyle= text_gradient;
			context.fillText("Lantern Waste", ITEM_WIDTH / 2, 69);
		context.restore()
	
		//Draw the stroke around the outside.
		context.save();
			context.roundRect(ITEM_OFFSET - .5, ITEM_OFFSET - .5,ITEM_WIDTH + .5 + ITEM_OFFSET,ITEM_HIEGHT + .5 + ITEM_OFFSET,5);
			context.strokeStyle = "rgba(255,255,255,.48);";
			context.lineWidth   = 1;
			context.stroke();
		context.restore();
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
