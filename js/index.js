window.addEventListener("DOMContentLoaded",function(){
	if (window.innerWidth >= 1920) {
		document.getElementById("links").innerHTML = '<div id="links-left"> <a href="portfolio"><img data-fallback="images/portfolio-bar.png" data-image="images/portfolio-bars.jpg" data-mask="images/portfolio-mask.png" id="portfolio-bar" class="bar-image" data-height="184"></a><img data-fallback="images/blank-banner.png" data-image="images/blank-banner-image.png" data-mask="images/blank-banner-mask.png" class="bar-image"><a href="resources"><img data-fallback="images/resources-bar.png" data-image="images/portfolio-bars.jpg" data-mask="images/portfolio-mask.png" id="portfolio-bar" class="bar-image" data-height="184" data-offset-y="368"></a></div><div id="links-right"><img data-fallback="images/blank-banner.png" data-image="images/blank-banner-image.png" data-mask="images/blank-banner-mask.png" class="bar-image">						<a href="http://blog.diekisdreamings.com"><img data-fallback="images/blog-bar.png" data-image="images/portfolio-bars.jpg" data-mask="images/portfolio-mask.png" id="portfolio-bar" class="bar-image" data-height="184" data-offset-y="184"></a><img data-fallback="images/blank-banner.png" data-image="images/blank-banner-image.png" data-mask="images/blank-banner-mask.png" class="bar-image"></div><div class="clear"></div>'
	}
	else if (window.innerWidth >= 1280 && window.innerWidth < 1920){
		document.getElementById("links").innerHTML = '<a href="portfolio"><img data-fallback="images/portfolio-bar.png" data-image="images/portfolio-bars.jpg" data-mask="images/portfolio-mask.png" id="portfolio-bar" class="bar-image" data-height="184"></a><a href="http://blog.diekisdreamings.com"><img data-fallback="images/blog-bar.png" data-image="images/portfolio-bars.jpg" data-mask="images/portfolio-mask.png" id="portfolio-bar" class="bar-image" data-height="184" data-offset-y="184"></a><a href="resources"><img data-fallback="images/resources-bar.png" data-image="images/portfolio-bars.jpg" data-mask="images/portfolio-mask.png" id="portfolio-bar" class="bar-image" data-height="184" data-offset-y="368"></a>'
		document.getElementById("links").style.width = "680px";
		document.getElementById("links").style.marginRight = "120px";
	}
	else if (window.innerWidth < 1280){
		document.getElementById("links").innerHTML ='<a href="portfolio"><img data-fallback="images/portfolio-bar-small.png" data-image="images/portfolio-bars-small.jpg" data-mask="images/portfolio-mask-small.png" id="portfolio-bar" class="bar-image" data-height="168"></a><a href="http://blog.diekisdreamings.com"><img data-fallback="images/blog-bar-small.png" data-image="images/portfolio-bars-small.jpg" data-mask="images/portfolio-mask-small.png" id="portfolio-bar" class="bar-image" data-height="168" data-offset-y="168"></a><a href="resources"><img data-fallback="images/resources-bar-small.png" data-image="images/portfolio-bars-small.jpg" data-mask="images/portfolio-mask-small.png" id="portfolio-bar" class="bar-image" data-height="168" data-offset-y="336"></a>'
		document.getElementById("links").style.width = "418px";
		document.getElementById("links").style.marginRight = "120px";
	}
	document.getElementById('email-link').href="mailto:" + retrieveEmail();
}, false);

function retrieveEmail(){
	return 'qvrxv@qvrxvfqernzvatf.pbz'.replace(/[a-zA-Z]/g,function(c){return String.fromCharCode((c<="Z"?90:122)>=(c=c.charCodeAt(0)+13)?c:c-26);});
}
