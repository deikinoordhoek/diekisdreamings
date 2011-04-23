window.onload = function(){
	images = getImageElements();
	canvases = addCanvasElements(images);
	drawCanvasElements(canvases, images);
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
	canvas_elements = new Array();
	for (i = 0; i < images.length; i++){
		canvas_element = document.createElement('canvas');
		canvas_elements[i] = canvas_element;
		images[i].parentNode.insertBefore(canvas_elements[i], images[i]);
	}
	return canvas_elements;
}

function drawCanvasElements(canvas_elements, images){
	mask = new Array()
	image = new Array()
	for (i = 0; i < canvas_elements.length;i++){
		mask[i] = new Image()

		mask[i].src = images[i].getAttribute('data-mask');

		mask[i].onload = new drawImage(i, mask[i], images[i].getAttribute('data-image'), canvas_elements[i]);
	}
}

function drawImage(i_num, mask, image_src, canvas){
	// Remember, only mask is loaded at this point.
	context = canvas.getContext('2d');

	canvas.width = mask.width;
	canvas.height = mask.height;

	context.drawImage(mask, 0, 0);	

	imgd = context.getImageData(0, 0, mask.width, mask.height); 
	pix_mask = imgd.data;

	image = new Image();
	image.src = image_src;

	image.onload = function(){
		context.drawImage(this,0,0)
		imgd = context.getImageData(0,0,mask.width, mask.height);
		pix = imgd.data;
		for (var i=0; i < pix.length; i +=4){
			pix[i + 3] = pix_mask[i];
		}
		context.putImageData(imgd, 0, 0);
	}
	
	
}
