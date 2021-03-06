function onloadHandler(){
	//Detect WebP support	
	var div = document.createElement('div');
	div.innerHTML = '<img id = "test_image" src="data:image/webp,RIFF*%00%00%00WEBPVP8%20%1E%00%00%00%10%02%00%9D%01*%04%00%04%00%0B%C7%08%85%85%88%85%84%88%3F%82%00%0C%0D%60%00%FE%E6%B5%00">';
	webp_test = div.firstChild;
	div.firstChild.onerror = function(){stageTwoLoad(false)}
	div.firstChild.onload = function(){stageTwoLoad(true)}

	var webp_opera_test = new Image();
	webp_opera_test.src = "data:image/webp,RIFF*%00%00%00WEBPVP8%20%1E%00%00%00%10%02%00%9D%01*%04%00%04%00%0B%C7%08%85%85%88%85%84%88%3F%82%00%0C%0D%60%00%FE%E6%B5%00"
	webp_opera_test.onerror = function(){stageTwoLoad(false)}
	webp_opera_test.onload = function(){stageTwoLoad(true)}

}
var canvases_loaded = new Array;
function stageTwoLoad(webp){
	if (!!document.createElement('canvas').getContext){
		images = getImageElements(webp);
		canvases = addCanvasElements(images);
		for (i = 0; i < images.length; i++){
			canvases_loaded[i] = false;
			drawCanvasElement(canvases[i], images[i], i);
		}
	}
	else{
		images = getImageElements(false);
		enableFallback(images);
	}
	
}

function enableFallback(images){
	for (i = 0; i < images.length; i++){
		if (!!images[i].getAttribute('data-fallback')){
			images[i].src = images[i].getAttribute('data-fallback');
		}
	}
}

function getImageElements(webp){
	images = new Array();
	num_images = 0;
	all_images = document.getElementsByTagName("img");
	for (i = 0; i < all_images.length; i++){
		if (all_images[i].getAttribute("data-image") && all_images[i].getAttribute("data-mask")){
			if (webp == true && !!all_images[i].getAttribute("data-image-webp"))  all_images[i].setAttribute("data-image", all_images[i].getAttribute("data-image-webp"));
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

function drawCanvasElement(canvas, image, i){
	mask = new Image()
	mask.onload = drawImage(mask, image.getAttribute('data-image'), canvas, i);
	mask.src = image.getAttribute('data-mask');
	
}

function drawImage(mask, image_src, canvas, i){
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
		image.onload = drawImageAlpha(canvas, image, pix_mask, i);
		image.src = image_src;	

	};
	
}

function drawImageAlpha(canvas, image, pix_mask, i){
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
		for (var i2=0; i2 < pix_length; i2 +=4){
			pix[i2 + 3] = pix_mask[i2];
		}

		context.putImageData(imgd, 0, 0);
		canvases_loaded[i] = true;
	}
}
