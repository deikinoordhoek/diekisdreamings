//Fires onloadHandler when DOMContentLoaded happens.
(function(i) {var u =navigator.userAgent;var e=/*@cc_on!@*/false; var st = 
setTimeout;if(/webkit/i.test(u)){st(function(){var dr=document.readyState;
if(dr=="loaded"||dr=="complete"){i()}else{st(arguments.callee,10);}},10);}
else if((/mozilla/i.test(u)&&!/(compati)/.test(u)) || (/opera/i.test(u))){
document.addEventListener("DOMContentLoaded",i,false); } else if(e){     (
function(){var t=document.createElement('doc:rdy');try{t.doScroll('left');
i();t=null;}catch(e){st(arguments.callee,0);}})();}else{window.onload=i;}})(init);

window.onload = displayImages;

function init() {
	onloadHandler();
	$("a.portfolio_image").fancybox({
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
function formatTitle(title, currentArray, currentIndex, currentOpts) {
    return '<div class="images-title">' + (title && title.length ? '<b>' + title + '</b>' : '' ) + '</div>';
}

function displayImages(){
	$("#fantasy-banner").delay(100).fadeIn();
	$("#scifi-banner").delay(200).fadeIn();
	fantasy_data = loadPortfolio("portfolio/fantasy.xml");
	fantasy_div = document.getElementById("fantasy-images")
	for (i = 0; i < fantasy_data.length; i++){
		a = document.createElement('a');
		a.href = fantasy_data[i].fullsize.image.src;
		a.setAttribute("class", "portfolio_image");
		a.setAttribute("title", fantasy_data[i].image_title);
		a.setAttribute("onclick", "_gaq.push(['_trackPageview'," + fantasy_data[i].fullsize.image.src + ']);');
		a.appendChild(fantasy_data[i].thumbnail.image);
		fantasy_div.appendChild(a);
	}
}

function showFantasy(){
	$("#fantasy-banner").fadeOut();
	$("#scifi-banner").fadeOut();
	$("#fantasy-images").delay(500).fadeIn();
}

