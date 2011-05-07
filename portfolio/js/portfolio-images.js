var inner_glow_data;
function getPortfolioManifest(manifest_file){
	var req = new XMLHttpRequest();
	req.open('GET', manifest_file, false)
	req.send(null);
	if (req.status==200) return req.responseText;
}

function getImageData(input_xml){
	if (window.DOMParser){
		parser = new DOMParser();
		xmlDoc = parser.parseFromString(input_xml,"text/xml")
	} else {
		xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async = "false";
		xmlDoc.loadXML(input_xml);
	}
	image_data = new Array()
	for (i=0;i < xmlDoc.getElementsByTagName("image").length; i++){	

		ie_thumbnail_url = "portfolio/images/" + xmlDoc.getElementsByTagName("image")[i].getElementsByTagName("thumbnail")[0].getElementsByTagName("url")[0].childNodes[0].nodeValue;
		thumbnail_url = xmlDoc.getElementsByTagName("image")[i].getElementsByTagName("thumbnail")[0].getElementsByTagName("plain_url")[0].childNodes[0].nodeValue;
		fullsize_url = xmlDoc.getElementsByTagName("image")[i].getElementsByTagName("fullsize")[0].getElementsByTagName("url")[0].childNodes[0].nodeValue;
		image_title = xmlDoc.getElementsByTagName("image")[i].getElementsByTagName("image_title")[0].childNodes[0].nodeValue;
		subset  = xmlDoc.getElementsByTagName("image")[i].getElementsByTagName("thumbnail")[0].getElementsByTagName("subset")[0];
		if (!!subset){
			topX = parseInt(subset.getElementsByTagName("tlX")[0].childNodes[0].nodeValue);
			topY = parseInt(subset.getElementsByTagName("tlY")[0].childNodes[0].nodeValue);
			width = parseInt(subset.getElementsByTagName("brX")[0].childNodes[0].nodeValue) - topX;
			height = parseInt(subset.getElementsByTagName("brY")[0].childNodes[0].nodeValue) - topY;
			image_data[i] = new portfolioPiece(fullsize_url, ie_thumbnail_url, thumbnail_url, image_title, topX, topY, width, height);		
		}
		else {
			image_data[i] = new portfolioPiece(fullsize_url, ie_thumbnail_url, thumbnail_url, image_title);
		}
	}
	return image_data;
}

function loadPortfolio(manifest_file){
	manifest = getPortfolioManifest(manifest_file);
	portfolio_data = getImageData(manifest);
	for (i = 0; i < portfolio_data.length; i++){
		portfolio_data[i].fullsize.image.src = "portfolio/images/" + portfolio_data[i].fullsize.url;
		portfolio_data[i].fullsize.image.onload = markImageLoaded(portfolio_data[i]);
	}
	return portfolio_data;
}
function markImageLoaded(data){
	return function(){
		data.fullsize.is_loaded = true;
		if (data.thumbnail.is_loaded == true){
			data.is_loaded = true;
		}
	}
}
function markThumbnailLoaded(data){ 
	return function(){
		data.thumbnail.is_loaded = true;
		if (data.fullsize.is_loaded == true){
			data.is_loaded = true;
		}
	}
}
function prerenderInnerGlow(){

	var ITEM_OFFSET = 9; 
	var ITEM_WIDTH = 662;
	var ITEM_HIEGHT = 162;
	var ITEM_INNER_GLOW_RADIUS = 46;
	canvas = document.createElement("canvas");

	if (!canvas.getContext) return;
	context = canvas.getContext("2d");
	canvas.width = 680;
	canvas.height = 180;
	context.rectWithRoundRectHole(0,0, context.canvas.width, context.canvas.height, ITEM_OFFSET + .5, ITEM_OFFSET + .5,ITEM_WIDTH - .5 + ITEM_OFFSET,ITEM_HIEGHT - .5 + ITEM_OFFSET,5);
	context.fillStyle = "white";
	context.fill();
	stackBlurCanvasRGBA(context.canvas, 0, 0, context.canvas.width, context.canvas.height, ITEM_INNER_GLOW_RADIUS);
	
	inner_glow_data = new Image()
	inner_glow_data.src = context.canvas.toDataURL("image/png")
}
function drawOnCanvas(canvas, highlight) {
	context = canvas.getContext('2d');

	i = this.image;
	i.src = "portfolio/images/" + this.plain_url;
	if (i.width == 0) {
		i.onload = constructPortfolioDisplay(this, context, highlight, i);
	}
	else{
		markThumbnailLoaded(this.parent);
		i_c = constructPortfolioDisplay(this, context, highlight, i)
		i_c();
	}
	

}
function constructPortfolioDisplay(parent, context, highlight, image){
	return function(){
		context.canvas.width = 680;
		context.canvas.height = 180;
		markThumbnailLoaded(parent.parent);
		var ITEM_OFFSET = 9;
		var ITEM_WIDTH = 662;
		var ITEM_HIEGHT = 162;
		var ITEM_INNER_GLOW_RADIUS = 46;
		var DO_INNER_GLOW = true;

		image_offset_x = 0;
		image_offset_y = 0;
		image_scale = 1;
		if (!!parent.topX){
			image_offset_x = parent.topX;
			image_offset_y = parent.topY;
			image_scale =  ITEM_WIDTH / parent.width;
		}

		//Draw the shadow
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
			if (!!parent.topX){
				context.drawImage(image,image_offset_x, image_offset_y, parent.width, parent.height, ITEM_OFFSET,50 + ITEM_OFFSET, ITEM_WIDTH, 112);
			}
			else {
				context.drawImage(image, ITEM_OFFSET,50 + ITEM_OFFSET);				
			}
			//Draw the highlight
			if (highlight == true){
				context.save();
					highlight_gradient = context.createRadialGradient(ITEM_WIDTH / 2, ITEM_HIEGHT / 2, 0, ITEM_WIDTH / 2, ITEM_HIEGHT / 2, ITEM_WIDTH * .4);
					highlight_gradient.addColorStop(0,  "rgba(128,128,255,.4)");
					highlight_gradient.addColorStop(1,  "rgba(255,255,255,0)");
					context.roundRect(ITEM_OFFSET - .5, ITEM_OFFSET - .5,ITEM_WIDTH + .5 + ITEM_OFFSET,ITEM_HIEGHT + .5 + ITEM_OFFSET,5);
					context.globalCompositeOperation = "lighter";
					context.fillStyle = highlight_gradient;
					context.fill();
				context.restore();
			}	
			//Draw the top rectangular box w/gradient.
			text_box_gradient = context.createLinearGradient(0,9,0,54);
			text_box_gradient.addColorStop(0, "#333333");
			text_box_gradient.addColorStop(1, "#333333");
	
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
				context.fillText(parent.title, ITEM_WIDTH / 2 + ITEM_OFFSET, 60 + ITEM_OFFSET);
			context.restore();

			text_gradient = context.createLinearGradient(0,15,0, 60);
			text_gradient.addColorStop(0, "#f9f9f9");
			text_gradient.addColorStop(1, "#bebebe");
			context.fillStyle= text_gradient;
			context.fillText(parent.title, ITEM_WIDTH / 2 + ITEM_OFFSET, 60 + ITEM_OFFSET);
		context.restore()

		//Put the inner glow
		if (DO_INNER_GLOW){
			context.save();
				context.roundRect(ITEM_OFFSET, ITEM_OFFSET, ITEM_WIDTH + ITEM_OFFSET, ITEM_HIEGHT + ITEM_OFFSET,5);
				context.clip();
				context.globalAlpha = .18;
				context.drawImage(inner_glow_data, 0, 0);
			context.restore()
		}
	
		//Draw the stroke around the outside.

		context.save();
			context.roundRect(ITEM_OFFSET + .5, ITEM_OFFSET + .5,ITEM_WIDTH - .5 + ITEM_OFFSET,ITEM_HIEGHT - .5 + ITEM_OFFSET,5);
			context.strokeStyle = "#888";
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
