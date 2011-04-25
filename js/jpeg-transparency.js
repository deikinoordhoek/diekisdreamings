window.addEventListener("DOMContentLoaded",onloadHandler, false);

function onloadHandler(){
	if (!!document.createElement('canvas').getContext){
		images = getImageElements();
		canvases = addCanvasElements(images);
		for (i = 0; i < images.length; i++){		
			drawCanvasElement(canvases[i], images[i]);
		}
	}
	else{
		images = getImageElements();
		enableFallback(images)
	}
}

function enableFallback(images){
	for (i = 0; i < images.length; i++){
		if (!!images[i].getAttribute('data-fallback')){
			images[i].src = images[i].getAttribute('data-fallback');
		}
	}
}

function getImageElements(){
	images = new Array();
	num_images = 0;
	all_images = document.getElementsByTagName("img");
	for (i = 0; i < all_images.length; i++){
		if (all_images[i].getAttribute("data-image") && all_images[i].getAttribute("data-mask")){
			images[num_images] = all_images[i];
			num_images++;
		}
	}
	return images;
}

function addCanvasElements(images){
	//Also removes the image elements
	canvas_elements = new Array();
	for (i = 0; i < images.length; i++){
		canvas_element = document.createElement('canvas');

		//Transfer attributes to canvas element
		for (j = 0; j < images[i].attributes.length; j++){
			canvas_element.setAttribute(images[i].attributes[j].nodeName, images[i].attributes[j].nodeValue)
		}
		canvas_elements[i] = canvas_element;

		//Insert the canvas element
		images[i].parentNode.insertBefore(canvas_elements[i], images[i]);

		//Remove the image element
		images[i].parentNode.removeChild(images[i]);	
	}
	return canvas_elements;
}

function drawCanvasElement(canvas, image){
	mask = new Image()
	mask.onload = drawImage(mask, image.getAttribute('data-image'), canvas);
	mask.src = image.getAttribute('data-mask');
	
}

function drawImage(mask, image_src, canvas){
	return function(){
		//Draw the mask to the canvas, then retrieve the pixel data. 
		//Pass that to drawImageAlpha, which loads the image and actually draws everything.
		//This is necessary because events are confusing.
		
		context = canvas.getContext('2d');
		
		if (!!canvas.getAttribute('data-width')) canvas.width = canvas.getAttribute('data-width');
		else canvas.width = mask.width;
		if (!!canvas.getAttribute('data-height')) canvas.height = canvas.getAttribute('data-height');
		else canvas.height = mask.height;

		if (!!canvas.getAttribute('data-offset-x')) offset_x = canvas.getAttribute('data-offset-x');
		else offset_x = 0;
		if (!!canvas.getAttribute('data-offset-y')) offset_y = canvas.getAttribute('data-offset-y');
		else offset_y = 0;

		context.drawImage(mask, -offset_x, -offset_y);	
		imgd = context.getImageData(0, 0, canvas.width, canvas.height); 
		pix_mask = imgd.data;

		canvas.width = canvas.width;

		image = new Image();
		image.onload = drawImageAlpha(canvas, image, pix_mask);
		image.src = image_src;	
	};
	
}

function drawImageAlpha(canvas, image, pix_mask){
	return function(){
		context = canvas.getContext('2d')
		if (!!canvas.getAttribute('data-offset-x')) offset_x = canvas.getAttribute('data-offset-x');
		else offset_x = 0;
		if (!!canvas.getAttribute('data-offset-y')) offset_y = canvas.getAttribute('data-offset-y');
		else offset_y = 0;

		context.drawImage(image,-offset_x, -offset_y)
		imgd = context.getImageData(0,0,canvas.width, canvas.height);
		pix = imgd.data;
		pix_length = pix.length;

		//Step through all the image data and apply the mask
		for (var i=0; i < pix_length; i +=4){
			pix[i + 3] = pix_mask[i];
		}

		context.putImageData(imgd, 0, 0);
	}
}
