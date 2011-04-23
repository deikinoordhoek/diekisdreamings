window.onload = function(){
	$("#loading").fadeOut();
	drawLinksCanvas();
	$("#portfolio-bar").delay(200).animate({opacity:1, marginLeft:0}, 300, 'easeInQuad');
	$("#blog-bar").delay(400).animate({opacity:1, marginLeft:0}, 300, 'easeInQuad');
	$("#resources-bar").delay(600).animate({opacity:1, marginLeft:0}, 300, 'easeInQuad');
};

function drawLinksCanvas(){
	canvas = document.getElementById("links-canvas");
	context = canvas.getContext('2d');
	links_image = new Image();
	links_image.src = "../images/links.jpg"
	links_mask = new Image();
	links_mask.src = "../images/links_mask.png"
}
