window.onload = function(){
	$("#loading").fadeOut();

};

function drawLinksCanvas(){
	canvas = document.getElementById("links-canvas");
	context = canvas.getContext('2d');
	links_image = new Image();
	links_image.src = "../images/links.jpg"
	links_mask = new Image();
	links_mask.src = "../images/links_mask.png"
}
