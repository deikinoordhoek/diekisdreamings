function portfolioPiece(fullsize_url, ie_thumbnail_url, thumbnail_url, image_title, topX, topY, width, height){
	this.fullsize = new portfolioImage(fullsize_url);
	if (!topX) {
		this.thumbnail = new portfolioThumbnail(ie_thumbnail_url, thumbnail_url, image_title);
	}
	else {
		this.thumbnail = new portfolioThumbnail(ie_thumbnail_url, thumbnail_url, image_title, topX, topY, width, height)
	}
	this.image_title = image_title;
}

function portfolioImage (url){
	this.url = url;
	this.image = new Image();	
}

function portfolioThumbnail (url, plain_url, title, topX, topY, width, height){
	this.ie_url = url;
	this.ie_image = new Image();
	this.plain_url = plain_url;
	this.image = new Image();
	this.title = title;
	this.drawOnCanvas = drawOnCanvas;
	if (!!topX){
		this.topX = topX;
		this.topY = topY;
		this.width = width;
		this.height = height;
	}

}
function getPortfolioManifest(manifest_file){
	var req = new XMLHttpRequest();
	req.open('GET', manifest_file, false)
	req.send(null);
	if (req.status==200) return req.responseText;
}

function getImageData(input_xml){
	parser = new DOMParser();
	xmlDoc = parser.parseFromString(input_xml,"text/xml")
	image_data = new Array()
	for (i=0;i < xmlDoc.getElementsByTagName("image").length; i++){	

		ie_thumbnail_url = xmlDoc.getElementsByTagName("image")[i].getElementsByTagName("thumbnail")[0].getElementsByTagName("url")[0].childNodes[0].nodeValue;
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
		//portfolio_data[i].thumbnail.ie_image.src = "portfolio/" + portfolio_data[i].thumbnail.ie_url;
		portfolio_data[i].fullsize.image.src = "portfolio/" + portfolio_data[i].fullsize.url;
	}
	return portfolio_data;
}

function drawOnCanvas(canvas, webp) {
	context = canvas.getContext('2d');
	canvas.width = 680;
	canvas.height = 180;
	i = this.image;
	if (webp) {
		i.src= "portfolio/" + this.webp_url;
	}
	else {
		i.src = "portfolio/" + this.plain_url;
	}
	i.onload = constructPortfolioDisplay(this, context);
	

}
function constructPortfolioDisplay(parent, context){
	return function(){
		var ITEM_OFFSET = 9;
		var ITEM_WIDTH = 662;
		var ITEM_HIEGHT = 162;
		var image_offset_x = 0;
		var image_offset_y = 0;
		var image_scale = 1;
		if (!!parent.topX){
			image_offset_x = parent.topX;
			image_offset_y = parent.topY;
			image_scale =  ITEM_WIDTH / parent.width;
		}
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
				context.drawImage(this,image_offset_x, image_offset_y, parent.width, parent.height, ITEM_OFFSET,50 + ITEM_OFFSET, ITEM_WIDTH, 112);
			}
			else {
				context.drawImage(this, ITEM_OFFSET,50 + ITEM_OFFSET);				
			}
	
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
				context.fillText(parent.title, ITEM_WIDTH / 2, 69);
			context.restore();

			text_gradient = context.createLinearGradient(0,15,0, 60);
			text_gradient.addColorStop(0, "#f9f9f9");
			text_gradient.addColorStop(1, "#bebebe");
			context.fillStyle= text_gradient;
			context.fillText(parent.title, ITEM_WIDTH / 2, 69);
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
