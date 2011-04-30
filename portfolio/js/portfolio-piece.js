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
