
window.onload = displayImages;


function formatTitle(title, currentArray, currentIndex, currentOpts) {
    return '<div class="images-title">' + (title && title.length ? '<b>' + title + '</b>' : '' ) + '</div>';
}
var fantasy_data;
function displayImages(){
	$("#fantasy-banner").delay(100).fadeIn();
	$("#scifi-banner").delay(200).fadeIn();
	fantasy_data = loadPortfolio("portfolio/images/fantasy.xml");
	fantasy_div = document.getElementById("fantasy-images")
	for (n = 0; n < fantasy_data.length; n++){
		a = document.createElement('a');
		a.href = fantasy_data[n].fullsize.image.src;
		a.setAttribute("class", "portfolio-image");
		a.setAttribute("title", fantasy_data[n].image_title);
		a.setAttribute("onclick", "_gaq.push(['_trackPageview'," + fantasy_data[n].fullsize.image.src + ']);');

		c = document.createElement('canvas');
		c.setAttribute("class", "portfolio-image");
		c.setAttribute("data-num", n);
		a.appendChild(c);
		fantasy_data[n].thumbnail.drawOnCanvas(c);
		fantasy_div.appendChild(a);
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
	$("#fantasy-banner").fadeOut();
	$("#scifi-banner").fadeOut();
	$("#fantasy-images").delay(500).fadeIn();
}

