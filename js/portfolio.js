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
}

function displayImages(){
	$("#fantasy-banner").delay(100).fadeIn();
	$("#scifi-banner").delay(200).fadeIn();
}

