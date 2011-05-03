var MAIN_PAGE = 0;
var FANTASY_PAGE = 1;
var SCIFI_PAGE = 2;
var current_page = MAIN_PAGE;

$(document).ready(init);


function formatTitle(title, currentArray, currentIndex, currentOpts) {
    return '<div class="images-title">' + (title && title.length ? '<b>' + title + '</b>' : '' ) + '</div>';
}

$(function(){
	$('#fantasy-link').click(function(){
		showFantasy();
	});
	$('#scifi-link').click(function(){
		showScifi();
	});
	$.History.bind('/fantasy', showFantasy);
	$.History.bind('/scifi', showScifi);
	$.History.bind('/main', showMain);

});
var fantasy_data;

function init(){
	onloadHandler();
	displayImages();
	startProgressBar();	


}

function startProgressBar(){
	setTimeout(checkProgress, 100);
}

function checkProgress(){
	numloaded = 0;
	for (a = 0; a < fantasy_data.length; a++){
		if (fantasy_data[a].fullsize.is_loaded == true) numloaded++;
	}
	for (a = 0; a < scifi_data.length; a++){
		if (scifi_data[a].fullsize.is_loaded == true) numloaded++;
	}
	for (a = 0; a < canvases_loaded.length; a++){
		if (canvases_loaded[a] == true) numloaded++;
	}
	progress = (numloaded / (scifi_data.length + fantasy_data.length + canvases_loaded.length)) * 100;
	updateProgressBar(progress);
	if (progress == 100){
		 hideProgressBar()
	} else { 
		setTimeout(checkProgress, 100);
	}
}
function hideProgressBar(){
	$("#progress-counter").fadeOut();
	$("#progress-counter").delay(500).remove();
	//$("#fantasy-banner").delay(100).fadeIn();
	//$("#scifi-banner").delay(200).fadeIn();

}
function updateProgressBar(percent){
	canvas = document.getElementById("progress-canvas");
	context = canvas.getContext("2d");
	canvas.width = 400;
	canvas.height = 200;
	context.fillStyle = "#777";
	context.fillRect(0,0,400,3);
	context.fillStyle = "#fff";
	context.shadowColor = "white";
	context.shadowBlur= 4;
	context.fillRect(0,0,percent * 4, 3);

}
function displayImages(){
	fantasy_data = loadPortfolio("portfolio/images/fantasy.xml");
	fantasy_div = document.getElementById("fantasy-images")
	prerenderInnerGlow();
	for (n = 0; n < fantasy_data.length; n++){
		a = document.createElement('a');
		a.href = fantasy_data[n].fullsize.image.src;
		a.setAttribute("class", "portfolio-image");
		a.setAttribute("title", fantasy_data[n].image_title);
		a.setAttribute("onclick", "_gaq.push(['_trackPageview'," + fantasy_data[n].fullsize.image.src + ']);');
		if (Modernizr.canvas) {
			c = document.createElement('canvas');
			c.setAttribute("class", "portfolio-image");
			c.setAttribute("onmouseover", "fantasy_data[" + n + "].thumbnail.drawOnCanvas(this, true);");
			c.setAttribute("onmouseout", "fantasy_data[" + n + "].thumbnail.drawOnCanvas(this, false);");
			a.appendChild(c);
			fantasy_data[n].thumbnail.drawOnCanvas(c);
		} else {
			i = new Image();
			i.setAttribute("class", "portfolio-image");
			i.src = fantasy_data[n].thumbnail.ie_url;
			a.appendChild(i);
		}
		fantasy_div.appendChild(a);
	}

	scifi_data = loadPortfolio("portfolio/images/sci-fi.xml");
	scifi_div = document.getElementById("scifi-images")

	for (n = 0; n < scifi_data.length; n++){
		a = document.createElement('a');
		a.href = scifi_data[n].fullsize.image.src;
		a.setAttribute("class", "portfolio-image");
		a.setAttribute("title", scifi_data[n].image_title);
		a.setAttribute("onclick", "_gaq.push(['_trackPageview'," + scifi_data[n].fullsize.image.src + ']);');
		if (Modernizr.canvas) {
			c = document.createElement('canvas');
			c.setAttribute("class", "portfolio-image");
			c.setAttribute("onmouseover", "scifi_data[" + n + "].thumbnail.drawOnCanvas(this, true);");
			c.setAttribute("onmouseout", "scifi_data[" + n + "].thumbnail.drawOnCanvas(this, false);");
			a.appendChild(c);
			scifi_data[n].thumbnail.drawOnCanvas(c);
		} else {
			i = new Image();
			i.setAttribute("class", "portfolio-image");
			i.src = scifi_data[n].thumbnail.ie_url;
			a.appendChild(i);
		}
		scifi_div.appendChild(a);
	}
	$("a.portfolio-image").fancybox({
		'transitionIn'	     :	'fade',
		'transitionOut'	     :	'fade',
		'opacity'            :  'true',
		'overlayOpacity'     :  '.75',
		'overlayColor'       :  '#000',
		'hideOnContentClick' :  'true',
		'titlePosition'      :  'inside',
		'speedIn'            :  600,
		'titleFormat'        : formatTitle
		
	});
}

function showFantasy(){
	if (current_page == MAIN_PAGE) {
		$("#fantasy-banner").fadeOut();
		$("#scifi-banner").fadeOut();
		$("#fantasy-images").delay(500).fadeIn();
	} else if (current_page == SCIFI_PAGE) {
		$("#scifi-image").fadeOut();
		$("#fantasy-images").delay(500).fadeIn();
	}
	current_page = FANTASY_PAGE;
}

function showScifi(){
	if (current_page == MAIN_PAGE) {
		$("#fantasy-banner").fadeOut();
		$("#scifi-banner").fadeOut();
		$("#scifi-images").delay(500).fadeIn();
	} else if (current_page == FANTASY_PAGE) {
		$("#fantasy-images").fadeOut();
		$("#scifi-images").delay(500).fadeIn();
	}
	current_page = SCIFI_PAGE;

}

function showMain(){
	$("#fantasy-images").fadeOut();
	$("#scifi-images").fadeOut();
	$("#fantasy-banner").delay(500).fadeIn();
	$("#scifi-banner").delay(500).fadeIn();
	current_page = MAIN_PAGE;

}
