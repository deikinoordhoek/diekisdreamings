//Fires onloadHandler when DOMContentLoaded happens.
try {    
	window.onerror = doError;
     }  catch(er) {}

(function(i) {var u =navigator.userAgent;var e=/*@cc_on!@*/false; var st = 
setTimeout;if(/webkit/i.test(u)){st(function(){var dr=document.readyState;
if(dr=="loaded"||dr=="complete"){i()}else{st(arguments.callee,10);}},10);}
else if((/mozilla/i.test(u)&&!/(compati)/.test(u)) || (/opera/i.test(u))){
document.addEventListener("DOMContentLoaded",i,false); } else if(e){     (
function(){var t=document.createElement('doc:rdy');try{t.doScroll('left');
i();t=null;}catch(e){st(arguments.callee,0);}})();}else{window.onload=i;}})(init);

function init(){
	width = window.innerWidth;
	if (!window.innerWidth){
		width = document.documentElement.offsetWidth;
	}
	if (width >= 1920) {
		document.getElementById("links").innerHTML = '<div id="links-left"> <a href="portfolio.html#/main"><img data-fallback="images/portfolio-bar.png" data-image-webp="images/portfolio-bars.webp" data-image="images/portfolio-bars.jpg" data-mask="images/portfolio-mask.png" id="portfolio-bar" class="bar-image" data-height="184"></a><img data-fallback="images/blank-banner.png" data-image="images/blank-banner-image.png" data-mask="images/blank-banner-mask.png" class="bar-image"><a href="resources.html"><img data-fallback="images/resources-bar.png" data-image="images/portfolio-bars.jpg" data-mask="images/portfolio-mask.png" id="portfolio-bar" class="bar-image" data-height="184" data-offset-y="368"></a></div><div id="links-right"><img data-fallback="images/blank-banner.png" data-image="images/blank-banner-image.png" data-mask="images/blank-banner-mask.png" class="bar-image">						<a href="http://blog.diekisdreamings.com"><img data-fallback="images/blog-bar.png" data-image="images/portfolio-bars.jpg" data-mask="images/portfolio-mask.png" id="portfolio-bar" class="bar-image" data-height="184" data-offset-y="184"></a><img data-fallback="images/blank-banner.png" data-image="images/blank-banner-image.png" data-mask="images/blank-banner-mask.png" class="bar-image"></div><div class="clear"></div>'
	}
	else if (width >= 1280 && width < 1920){
		document.getElementById("links").innerHTML = '<a href="portfolio.html#/main"><img data-fallback="images/portfolio-bar.png" data-image-webp="images/portfolio-bars.webp" data-image="images/portfolio-bars.jpg" data-mask="images/portfolio-mask.png" id="portfolio-bar" class="bar-image" data-height="184"></a><a href="http://blog.diekisdreamings.com"><img data-fallback="images/blog-bar.png" data-image-webp="images/portfolio-bars.webp" data-image="images/portfolio-bars.jpg" data-mask="images/portfolio-mask.png" id="portfolio-bar" class="bar-image" data-height="184" data-offset-y="184"></a><a href="resources.html"><img data-fallback="images/resources-bar.png" data-image-webp="images/portfolio-bars.webp" data-image="images/portfolio-bars.jpg" data-mask="images/portfolio-mask.png" id="portfolio-bar" class="bar-image" data-height="184" data-offset-y="368"></a>'
		document.getElementById("links").style.width = "680px";
		document.getElementById("links").style.marginRight = "120px";
	}
	else if (width < 1280){
		document.getElementById("links").innerHTML ='<a href="portfolio.html#/main"><img data-fallback="images/portfolio-bar-small.png" data-image="images/portfolio-bars-small.jpg" data-mask="images/portfolio-mask-small.png" id="portfolio-bar" class="bar-image" data-height="168"></a><a href="http://blog.diekisdreamings.com"><img data-fallback="images/blog-bar-small.png" data-image="images/portfolio-bars-small.jpg" data-mask="images/portfolio-mask-small.png" id="portfolio-bar" class="bar-image" data-height="168" data-offset-y="168"></a><a href="resources.html"><img data-fallback="images/resources-bar-small.png" data-image="images/portfolio-bars-small.jpg" data-mask="images/portfolio-mask-small.png" id="portfolio-bar" class="bar-image" data-height="168" data-offset-y="336"></a>'
		document.getElementById("links").style.width = "418px";
		document.getElementById("links").style.marginRight = "120px";
	}
	document.getElementById('email-link').href="mailto:" + retrieveEmail();
	onloadHandler();
}

function retrieveEmail(){
	return 'qvrxv@qvrxvfqernzvatf.pbz'.replace(/[a-zA-Z]/g,function(c){return String.fromCharCode((c<="Z"?90:122)>=(c=c.charCodeAt(0)+13)?c:c-26);});
}


//Detect WebP support

function handleImages(support_webp){
	image_list = document.getElementsByTagName("img");
	for (i = 0; i < image_list.length; i++){
		if (!!image_list[i].getAttribute("data-src-webp") && support_webp == true){
			image_list[i].src = image_list[i].getAttribute("data-src-webp")
		}
		else if (!!image_list[i].getAttribute("data-src")){
			image_list[i].src = image_list[i].getAttribute("data-src")
		}
	}
}


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

function stageTwoLoad(webp){
	if (!!document.createElement('canvas').getContext){
		images = getImageElements(webp);
		canvases = addCanvasElements(images);
		for (i = 0; i < images.length; i++){		
			drawCanvasElement(canvases[i], images[i]);
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
		canvas_element.width = 0;
		canvas_element.height = 0;
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
function doError(msg,url,ln) {
	var strValues = "errMsg=" + escape(msg);    strValues += "&errLine=" + ln;    strValues += "&queryString=" + escape(location.search);    strValues += "&Url=" + escape(location.pathname);    strValues += "&HTTPRef=" + escape(document.referrer);
	var requestImage = new image()
	image.src = "http://diekisdreamings-images.appspot.com/error-handler.gif?" + strValues
}


