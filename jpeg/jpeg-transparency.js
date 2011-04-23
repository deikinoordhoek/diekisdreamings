window.onload = function(){
	if (!!document.createElement('canvas').getContext){
		images = getImageElements();
		canvases = addCanvasElements(images);
		drawCanvasElements(canvases, images);
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

function drawCanvasElements(canvas_elements, images){
	mask = new Array()
	image = new Array()
	for (i = 0; i < canvas_elements.length;i++){
		mask[i] = new Image()
		
		mask[i].onload = drawImage(i, mask[i], images[i].getAttribute('data-image'), canvas_elements[i]);

		mask[i].src = images[i].getAttribute('data-mask');
	}
}

function drawImage(i_num, mask, image_src, canvas){
	return function(){
		//Draw the mask to the canvas, then retrieve the pixel data. 
		//Pass that to drawImageAlpha, which loads the image and actually draws everything.
		//This is necessary because events are confusing.
		
		context = canvas.getContext('2d');
		canvas.width = mask.width;
		canvas.height = mask.height;
		if (!!canvas.getAttribute('data-width')) canvas.width = canvas.getAttribute('data-width');		
		if (!!canvas.getAttribute('data-height')) canvas.width = canvas.getAttribute('data-height');

		context.drawImage(mask, 0, 0);	
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
		context.drawImage(image,0,0)
		context = canvas.getContext('2d')
		imgd = context.getImageData(0,0,canvas.width, canvas.height);
		pix = imgd.data;
		pix_length = pix.length;
		for (var i=0; i < pix_length; i +=4){
			pix[i + 3] = pix_mask[i]; //Alpha channel.
		}
		context.putImageData(imgd, 0, 0);
	}
}
