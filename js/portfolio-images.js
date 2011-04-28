function portfolioPiece(fullsize_url, thumbnail_url, image_title){
	this.fullsize = new portfolioImage(fullsize_url);
	this.thumbnail = new portfolioImage(thumbnail_url);
	this.image_title = image_title;
}

function portfolioImage (url){
	this.url = url;
	this.image = new Image();
}

function getPortfolioManifest(manifest_file){
	var req = new XMLHttpRequest();
	req.open('GET', manifest_file, false)
	req.send(null);
	if (req.status==200) return req.responseText;
}

function getImageData(input_xml){
	parser = new DOMParser();
	xmlDoc = parser.parseFromString(input_xml,"text/xml")
	image_data = new Array()
	for (i=0;i < xmlDoc.getElementsByTagName("image").length; i++){	

		thumbnail_url = xmlDoc.getElementsByTagName("image")[i].getElementsByTagName("thumbnail")[0].childNodes[0].nodeValue;
		fullsize_url = xmlDoc.getElementsByTagName("image")[i].getElementsByTagName("fullsize")[0].childNodes[0].nodeValue;
		image_title = xmlDoc.getElementsByTagName("image")[i].getElementsByTagName("image_title")[0].childNodes[0].nodeValue;
		image_data[i] = new portfolioPiece(fullsize_url, thumbnail_url, image_title);
	}
	return image_data;
}

function loadPortfolio(manifest_file){
	manifest = getPortfolioManifest(manifest_file);
	portfolio_data = getImageData(manifest);
	for (i = 0; i < portfolio_data.length; i++){
		portfolio_data[i].thumbnail.image.src = "portfolio/" + portfolio_data[i].thumbnail.url;
		portfolio_data[i].fullsize.image.src = "portfolio/" + portfolio_data[i].fullsize.url;
	}
	return portfolio_data;
}
