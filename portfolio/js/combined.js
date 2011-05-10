/*

StackBlur - a fast almost Gaussian Blur For Canvas

Version: 	0.5
Author:		Mario Klingemann
Contact: 	mario@quasimondo.com
Website:	http://www.quasimondo.com/StackBlurForCanvas
Twitter:	@quasimondo

In case you find this class useful - especially in commercial projects -
I am not totally unhappy for a small donation to my PayPal account
mario@quasimondo.de

Altered by Dieki Noordhoek to accept canvas element by direct reference instead of by id.

Or support me on flattr: 
https://flattr.com/thing/72791/StackBlur-a-fast-almost-Gaussian-Blur-Effect-for-CanvasJavascript

Copyright (c) 2010 Mario Klingemann

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

var mul_table = [
        512,512,456,512,328,456,335,512,405,328,271,456,388,335,292,512,
        454,405,364,328,298,271,496,456,420,388,360,335,312,292,273,512,
        482,454,428,405,383,364,345,328,312,298,284,271,259,496,475,456,
        437,420,404,388,374,360,347,335,323,312,302,292,282,273,265,512,
        497,482,468,454,441,428,417,405,394,383,373,364,354,345,337,328,
        320,312,305,298,291,284,278,271,265,259,507,496,485,475,465,456,
        446,437,428,420,412,404,396,388,381,374,367,360,354,347,341,335,
        329,323,318,312,307,302,297,292,287,282,278,273,269,265,261,512,
        505,497,489,482,475,468,461,454,447,441,435,428,422,417,411,405,
        399,394,389,383,378,373,368,364,359,354,350,345,341,337,332,328,
        324,320,316,312,309,305,301,298,294,291,287,284,281,278,274,271,
        268,265,262,259,257,507,501,496,491,485,480,475,470,465,460,456,
        451,446,442,437,433,428,424,420,416,412,408,404,400,396,392,388,
        385,381,377,374,370,367,363,360,357,354,350,347,344,341,338,335,
        332,329,326,323,320,318,315,312,310,307,304,302,299,297,294,292,
        289,287,285,282,280,278,275,273,271,269,267,265,263,261,259];
        
   
var shg_table = [
	     9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 
		17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 
		19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20,
		20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21,
		21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21,
		21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 
		22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
		22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 
		23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
		23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
		23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 
		23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 
		24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
		24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
		24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
		24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24 ];

function stackBlurImage( imageID, canvasID, radius, blurAlphaChannel )
{
			
 	var img = document.getElementById( imageID );
	var w = img.naturalWidth;
    var h = img.naturalHeight;
       
	var canvas = document.getElementById( canvasID );
      
    canvas.style.width  = w + "px";
    canvas.style.height = h + "px";
    canvas.width = w;
    canvas.height = h;
    
    var context = canvas.getContext("2d");
    context.clearRect( 0, 0, w, h );
    context.drawImage( img, 0, 0 );

	if ( isNaN(radius) || radius < 1 ) return;
	
	if ( blurAlphaChannel )
		stackBlurCanvasRGBA( canvasID, 0, 0, w, h, radius );
	else 
		stackBlurCanvasRGB( canvasID, 0, 0, w, h, radius );
}


function stackBlurCanvasRGBA( canvas, top_x, top_y, width, height, radius )
{
	if ( isNaN(radius) || radius < 1 ) return;
	radius |= 0;

	var context = canvas.getContext("2d");
	var imageData;
	
	try {
	  try {
		imageData = context.getImageData( top_x, top_y, width, height );
	  } catch(e) {
	  
		// NOTE: this part is supposedly only needed if you want to work with local files
		// so it might be okay to remove the whole try/catch block and just use
		// imageData = context.getImageData( top_x, top_y, width, height );
		try {
			netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
			imageData = context.getImageData( top_x, top_y, width, height );
		} catch(e) {
			alert("Cannot access local image");
			throw new Error("unable to access local image data: " + e);
			return;
		}
	  }
	} catch(e) {
	  alert("Cannot access image");
	  throw new Error("unable to access image data: " + e);
	}
			
	var pixels = imageData.data;
			
	var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum, a_sum, 
	r_out_sum, g_out_sum, b_out_sum, a_out_sum,
	r_in_sum, g_in_sum, b_in_sum, a_in_sum, 
	pr, pg, pb, pa, rbs;
			
	var div = radius + radius + 1;
	var w4 = width << 2;
	var widthMinus1  = width - 1;
	var heightMinus1 = height - 1;
	var radiusPlus1  = radius + 1;
	var sumFactor = radiusPlus1 * ( radiusPlus1 + 1 ) / 2;
	
	var stackStart = new BlurStack();
	var stack = stackStart;
	for ( i = 1; i < div; i++ )
	{
		stack = stack.next = new BlurStack();
		if ( i == radiusPlus1 ) var stackEnd = stack;
	}
	stack.next = stackStart;
	var stackIn = null;
	var stackOut = null;
	
	yw = yi = 0;
	
	var mul_sum = mul_table[radius];
	var shg_sum = shg_table[radius];
	
	for ( y = 0; y < height; y++ )
	{
		r_in_sum = g_in_sum = b_in_sum = a_in_sum = r_sum = g_sum = b_sum = a_sum = 0;
		
		r_out_sum = radiusPlus1 * ( pr = pixels[yi] );
		g_out_sum = radiusPlus1 * ( pg = pixels[yi+1] );
		b_out_sum = radiusPlus1 * ( pb = pixels[yi+2] );
		a_out_sum = radiusPlus1 * ( pa = pixels[yi+3] );
		
		r_sum += sumFactor * pr;
		g_sum += sumFactor * pg;
		b_sum += sumFactor * pb;
		a_sum += sumFactor * pa;
		
		stack = stackStart;
		
		for( i = 0; i < radiusPlus1; i++ )
		{
			stack.r = pr;
			stack.g = pg;
			stack.b = pb;
			stack.a = pa;
			stack = stack.next;
		}
		
		for( i = 1; i < radiusPlus1; i++ )
		{
			p = yi + (( widthMinus1 < i ? widthMinus1 : i ) << 2 );
			r_sum += ( stack.r = ( pr = pixels[p])) * ( rbs = radiusPlus1 - i );
			g_sum += ( stack.g = ( pg = pixels[p+1])) * rbs;
			b_sum += ( stack.b = ( pb = pixels[p+2])) * rbs;
			a_sum += ( stack.a = ( pa = pixels[p+3])) * rbs;
			
			r_in_sum += pr;
			g_in_sum += pg;
			b_in_sum += pb;
			a_in_sum += pa;
			
			stack = stack.next;
		}
		
		
		stackIn = stackStart;
		stackOut = stackEnd;
		for ( x = 0; x < width; x++ )
		{
			pixels[yi+3] = pa = (a_sum * mul_sum) >> shg_sum;
			if ( pa != 0 )
			{
				pa = 255 / pa;
				pixels[yi]   = ((r_sum * mul_sum) >> shg_sum) * pa;
				pixels[yi+1] = ((g_sum * mul_sum) >> shg_sum) * pa;
				pixels[yi+2] = ((b_sum * mul_sum) >> shg_sum) * pa;
			} else {
				pixels[yi] = pixels[yi+1] = pixels[yi+2] = 0;
			}
			
			r_sum -= r_out_sum;
			g_sum -= g_out_sum;
			b_sum -= b_out_sum;
			a_sum -= a_out_sum;
			
			r_out_sum -= stackIn.r;
			g_out_sum -= stackIn.g;
			b_out_sum -= stackIn.b;
			a_out_sum -= stackIn.a;
			
			p =  ( yw + ( ( p = x + radius + 1 ) < widthMinus1 ? p : widthMinus1 ) ) << 2;
			
			r_in_sum += ( stackIn.r = pixels[p]);
			g_in_sum += ( stackIn.g = pixels[p+1]);
			b_in_sum += ( stackIn.b = pixels[p+2]);
			a_in_sum += ( stackIn.a = pixels[p+3]);
			
			r_sum += r_in_sum;
			g_sum += g_in_sum;
			b_sum += b_in_sum;
			a_sum += a_in_sum;
			
			stackIn = stackIn.next;
			
			r_out_sum += ( pr = stackOut.r );
			g_out_sum += ( pg = stackOut.g );
			b_out_sum += ( pb = stackOut.b );
			a_out_sum += ( pa = stackOut.a );
			
			r_in_sum -= pr;
			g_in_sum -= pg;
			b_in_sum -= pb;
			a_in_sum -= pa;
			
			stackOut = stackOut.next;

			yi += 4;
		}
		yw += width;
	}

	
	for ( x = 0; x < width; x++ )
	{
		g_in_sum = b_in_sum = a_in_sum = r_in_sum = g_sum = b_sum = a_sum = r_sum = 0;
		
		yi = x << 2;
		r_out_sum = radiusPlus1 * ( pr = pixels[yi]);
		g_out_sum = radiusPlus1 * ( pg = pixels[yi+1]);
		b_out_sum = radiusPlus1 * ( pb = pixels[yi+2]);
		a_out_sum = radiusPlus1 * ( pa = pixels[yi+3]);
		
		r_sum += sumFactor * pr;
		g_sum += sumFactor * pg;
		b_sum += sumFactor * pb;
		a_sum += sumFactor * pa;
		
		stack = stackStart;
		
		for( i = 0; i < radiusPlus1; i++ )
		{
			stack.r = pr;
			stack.g = pg;
			stack.b = pb;
			stack.a = pa;
			stack = stack.next;
		}
		
		yp = width;
		
		for( i = 1; i <= radius; i++ )
		{
			yi = ( yp + x ) << 2;
			
			r_sum += ( stack.r = ( pr = pixels[yi])) * ( rbs = radiusPlus1 - i );
			g_sum += ( stack.g = ( pg = pixels[yi+1])) * rbs;
			b_sum += ( stack.b = ( pb = pixels[yi+2])) * rbs;
			a_sum += ( stack.a = ( pa = pixels[yi+3])) * rbs;
		   
			r_in_sum += pr;
			g_in_sum += pg;
			b_in_sum += pb;
			a_in_sum += pa;
			
			stack = stack.next;
		
			if( i < heightMinus1 )
			{
				yp += width;
			}
		}
		
		yi = x;
		stackIn = stackStart;
		stackOut = stackEnd;
		for ( y = 0; y < height; y++ )
		{
			p = yi << 2;
			pixels[p+3] = pa = (a_sum * mul_sum) >> shg_sum;
			if ( pa > 0 )
			{
				pa = 255 / pa;
				pixels[p]   = ((r_sum * mul_sum) >> shg_sum ) * pa;
				pixels[p+1] = ((g_sum * mul_sum) >> shg_sum ) * pa;
				pixels[p+2] = ((b_sum * mul_sum) >> shg_sum ) * pa;
			} else {
				pixels[p] = pixels[p+1] = pixels[p+2] = 0;
			}
			
			r_sum -= r_out_sum;
			g_sum -= g_out_sum;
			b_sum -= b_out_sum;
			a_sum -= a_out_sum;
		   
			r_out_sum -= stackIn.r;
			g_out_sum -= stackIn.g;
			b_out_sum -= stackIn.b;
			a_out_sum -= stackIn.a;
			
			p = ( x + (( ( p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1 ) * width )) << 2;
			
			r_sum += ( r_in_sum += ( stackIn.r = pixels[p]));
			g_sum += ( g_in_sum += ( stackIn.g = pixels[p+1]));
			b_sum += ( b_in_sum += ( stackIn.b = pixels[p+2]));
			a_sum += ( a_in_sum += ( stackIn.a = pixels[p+3]));
		   
			stackIn = stackIn.next;
			
			r_out_sum += ( pr = stackOut.r );
			g_out_sum += ( pg = stackOut.g );
			b_out_sum += ( pb = stackOut.b );
			a_out_sum += ( pa = stackOut.a );
			
			r_in_sum -= pr;
			g_in_sum -= pg;
			b_in_sum -= pb;
			a_in_sum -= pa;
			
			stackOut = stackOut.next;
			
			yi += width;
		}
	}
	
	context.putImageData( imageData, top_x, top_y );
	
}


function stackBlurCanvasRGB( canvas, top_x, top_y, width, height, radius )
{
	if ( isNaN(radius) || radius < 1 ) return;
	radius |= 0;
	
	var context = canvas.getContext("2d");
	var imageData;
	
	try {
	  try {
		imageData = context.getImageData( top_x, top_y, width, height );
	  } catch(e) {
	  
		// NOTE: this part is supposedly only needed if you want to work with local files
		// so it might be okay to remove the whole try/catch block and just use
		// imageData = context.getImageData( top_x, top_y, width, height );
		try {
			netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
			imageData = context.getImageData( top_x, top_y, width, height );
		} catch(e) {
			alert("Cannot access local image");
			throw new Error("unable to access local image data: " + e);
			return;
		}
	  }
	} catch(e) {
	  alert("Cannot access image");
	  throw new Error("unable to access image data: " + e);
	}
			
	var pixels = imageData.data;
			
	var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum,
	r_out_sum, g_out_sum, b_out_sum,
	r_in_sum, g_in_sum, b_in_sum,
	pr, pg, pb, rbs;
			
	var div = radius + radius + 1;
	var w4 = width << 2;
	var widthMinus1  = width - 1;
	var heightMinus1 = height - 1;
	var radiusPlus1  = radius + 1;
	var sumFactor = radiusPlus1 * ( radiusPlus1 + 1 ) / 2;
	
	var stackStart = new BlurStack();
	var stack = stackStart;
	for ( i = 1; i < div; i++ )
	{
		stack = stack.next = new BlurStack();
		if ( i == radiusPlus1 ) var stackEnd = stack;
	}
	stack.next = stackStart;
	var stackIn = null;
	var stackOut = null;
	
	yw = yi = 0;
	
	var mul_sum = mul_table[radius];
	var shg_sum = shg_table[radius];
	
	for ( y = 0; y < height; y++ )
	{
		r_in_sum = g_in_sum = b_in_sum = r_sum = g_sum = b_sum = 0;
		
		r_out_sum = radiusPlus1 * ( pr = pixels[yi] );
		g_out_sum = radiusPlus1 * ( pg = pixels[yi+1] );
		b_out_sum = radiusPlus1 * ( pb = pixels[yi+2] );
		
		r_sum += sumFactor * pr;
		g_sum += sumFactor * pg;
		b_sum += sumFactor * pb;
		
		stack = stackStart;
		
		for( i = 0; i < radiusPlus1; i++ )
		{
			stack.r = pr;
			stack.g = pg;
			stack.b = pb;
			stack = stack.next;
		}
		
		for( i = 1; i < radiusPlus1; i++ )
		{
			p = yi + (( widthMinus1 < i ? widthMinus1 : i ) << 2 );
			r_sum += ( stack.r = ( pr = pixels[p])) * ( rbs = radiusPlus1 - i );
			g_sum += ( stack.g = ( pg = pixels[p+1])) * rbs;
			b_sum += ( stack.b = ( pb = pixels[p+2])) * rbs;
			
			r_in_sum += pr;
			g_in_sum += pg;
			b_in_sum += pb;
			
			stack = stack.next;
		}
		
		
		stackIn = stackStart;
		stackOut = stackEnd;
		for ( x = 0; x < width; x++ )
		{
			pixels[yi]   = (r_sum * mul_sum) >> shg_sum;
			pixels[yi+1] = (g_sum * mul_sum) >> shg_sum;
			pixels[yi+2] = (b_sum * mul_sum) >> shg_sum;
			
			r_sum -= r_out_sum;
			g_sum -= g_out_sum;
			b_sum -= b_out_sum;
			
			r_out_sum -= stackIn.r;
			g_out_sum -= stackIn.g;
			b_out_sum -= stackIn.b;
			
			p =  ( yw + ( ( p = x + radius + 1 ) < widthMinus1 ? p : widthMinus1 ) ) << 2;
			
			r_in_sum += ( stackIn.r = pixels[p]);
			g_in_sum += ( stackIn.g = pixels[p+1]);
			b_in_sum += ( stackIn.b = pixels[p+2]);
			
			r_sum += r_in_sum;
			g_sum += g_in_sum;
			b_sum += b_in_sum;
			
			stackIn = stackIn.next;
			
			r_out_sum += ( pr = stackOut.r );
			g_out_sum += ( pg = stackOut.g );
			b_out_sum += ( pb = stackOut.b );
			
			r_in_sum -= pr;
			g_in_sum -= pg;
			b_in_sum -= pb;
			
			stackOut = stackOut.next;

			yi += 4;
		}
		yw += width;
	}

	
	for ( x = 0; x < width; x++ )
	{
		g_in_sum = b_in_sum = r_in_sum = g_sum = b_sum = r_sum = 0;
		
		yi = x << 2;
		r_out_sum = radiusPlus1 * ( pr = pixels[yi]);
		g_out_sum = radiusPlus1 * ( pg = pixels[yi+1]);
		b_out_sum = radiusPlus1 * ( pb = pixels[yi+2]);
		
		r_sum += sumFactor * pr;
		g_sum += sumFactor * pg;
		b_sum += sumFactor * pb;
		
		stack = stackStart;
		
		for( i = 0; i < radiusPlus1; i++ )
		{
			stack.r = pr;
			stack.g = pg;
			stack.b = pb;
			stack = stack.next;
		}
		
		yp = width;
		
		for( i = 1; i <= radius; i++ )
		{
			yi = ( yp + x ) << 2;
			
			r_sum += ( stack.r = ( pr = pixels[yi])) * ( rbs = radiusPlus1 - i );
			g_sum += ( stack.g = ( pg = pixels[yi+1])) * rbs;
			b_sum += ( stack.b = ( pb = pixels[yi+2])) * rbs;
			
			r_in_sum += pr;
			g_in_sum += pg;
			b_in_sum += pb;
			
			stack = stack.next;
		
			if( i < heightMinus1 )
			{
				yp += width;
			}
		}
		
		yi = x;
		stackIn = stackStart;
		stackOut = stackEnd;
		for ( y = 0; y < height; y++ )
		{
			p = yi << 2;
			pixels[p]   = (r_sum * mul_sum) >> shg_sum;
			pixels[p+1] = (g_sum * mul_sum) >> shg_sum;
			pixels[p+2] = (b_sum * mul_sum) >> shg_sum;
			
			r_sum -= r_out_sum;
			g_sum -= g_out_sum;
			b_sum -= b_out_sum;
			
			r_out_sum -= stackIn.r;
			g_out_sum -= stackIn.g;
			b_out_sum -= stackIn.b;
			
			p = ( x + (( ( p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1 ) * width )) << 2;
			
			r_sum += ( r_in_sum += ( stackIn.r = pixels[p]));
			g_sum += ( g_in_sum += ( stackIn.g = pixels[p+1]));
			b_sum += ( b_in_sum += ( stackIn.b = pixels[p+2]));
			
			stackIn = stackIn.next;
			
			r_out_sum += ( pr = stackOut.r );
			g_out_sum += ( pg = stackOut.g );
			b_out_sum += ( pb = stackOut.b );
			
			r_in_sum -= pr;
			g_in_sum -= pg;
			b_in_sum -= pb;
			
			stackOut = stackOut.next;
			
			yi += width;
		}
	}
	
	context.putImageData( imageData, top_x, top_y );
	
}

function BlurStack()
{
	this.r = 0;
	this.g = 0;
	this.b = 0;
	this.a = 0;
	this.next = null;
}

function progressBar(canvas){
	this.canvas = canvas;
	this.percent = 0;
	this.target_percent = 0;
	this.updateProgress = progressBarUpdateProgress;
	this.redraw = progressBarRedraw;
	this.particles = new Array();
	this.newParticle = progressBarNewParticle;
	this.updateParticles = progressBarUpdateParticles;
	this.center_spin_frame = 0;
	setTimeout(this.redraw(this.canvas, this.percent, this), 20);

	
}

function progressBarUpdateProgress(percent){
	if (percent > this.target_percent) this.target_percent = percent;
	if (this.target_percent > 100) this.target_percent = 100;
	if (this.target_percent < 0) this.target_percent = 0;
}

function progressBarRedraw(canvas, percent, parent){
	return function() {
	if (parent.target_percent > percent) percent++;
	if (!canvas.getContext) return;
	//Reset canvas to fixed width and height
	canvas.width = 420;
	canvas.height = 420;

	context = canvas.getContext("2d");

	//Draw full, grey, circle
	context.strokeStyle = "#555";
	context.lineWidth = 4;
	context.beginPath();
		context.arc(200, 200, 100, 0, (Math.PI * 2), false);
	context.closePath();
	context.stroke();

	//Draw partial circle for progress indication
	context.strokeStyle = "#fff";
	context.lineWidth = 2;
	context.shadowColor = "#b4f5fd";
	context.shadowBlur = 6;
	context.shadowOffsetX = 0;
	context.shadowOffsetY = 0;

	context.beginPath();
	context.arc(200, 200, 100, 0, (percent / 100) * (Math.PI * 2), false);
	context.stroke();

	context.save();
		context.lineWidth = 2;
		context.shadowBlur = 0;

		context.beginPath();
		context.arc(200,200,30,0,(Math.PI * 2), false);
		context.closePath();
		context.strokeStyle = "#aaa";
		context.stroke();


		x = 200 + 30*Math.cos((parent.center_spin_frame / 15) * (Math.PI * 2));
		y = 200 + 30*Math.sin((parent.center_spin_frame / 15) * (Math.PI * 2));
		context.globalCompositeOperation = "lighter";

		glow_gradient = context.createRadialGradient(x, y, 0, x, y, 15);
		glow_gradient.addColorStop(0, "rgba(255,255,255,.7)");
		glow_gradient.addColorStop(.2, "rgba(180,245,255,.6)");
		glow_gradient.addColorStop(.5, "rgba(180,245,255,.2)");	
		glow_gradient.addColorStop(1, "rgba(64,64,64,0)");
	
		context.fillStyle = glow_gradient;
		context.beginPath();
		context.arc(x, y, 400, 0, (Math.PI * 2), false);
		context.closePath();
		context.fill();	

		context.beginPath();
		context.arc(x, y, 3, 0, (Math.PI * 2), false);
		context.closePath();
		context.fillStyle = "#fff"
		context.fill();
	context.restore();

	//Draw glowie thingie
	x = 200 + 100*Math.cos((percent / 100) * (Math.PI * 2));
	y = 200 + 100*Math.sin((percent / 100) * (Math.PI * 2));
	context.save();
		context.globalCompositeOperation = "lighter";

		glow_gradient = context.createRadialGradient(x, y, 0, x, y, 30);
		glow_gradient.addColorStop(0, "rgba(255,255,255,.7)");
		glow_gradient.addColorStop(.2, "rgba(180,245,255,.6)");
		glow_gradient.addColorStop(.5, "rgba(180,245,255,.2)");	
		glow_gradient.addColorStop(1, "rgba(64,64,64,0)");
	
		context.fillStyle = glow_gradient;
		context.beginPath();
		context.arc(x, y, 400, 0, (Math.PI * 2), false);
		context.closePath();
		context.fill();	
	context.restore();
	for (i = 0; i < 10; i++){
		parent.newParticle((percent / 100) * (Math.PI * 2));
	}
	parent.updateParticles();
	parent.center_spin_frame--;
	if (parent.center_spin_frame == 15) parent.center_spin_frame = 0;
	setTimeout(parent.redraw(parent.canvas, parent.percent, parent), 20);
	}	

}

function progressBarParticle(x, y, xd, yd, lifespan){
	this.x = x;
	this.y = y;
	this.xd = xd;
	this.yd = yd;
	this.alive = true;
	this.age = lifespan;
}

function progressBarNewParticle(radians){
	x = 200 + 100*Math.cos(radians);
	y = 200 + 100*Math.sin(radians);
	for (i = 0; i < this.particles.length; i++){	
		if (this.particles[i].alive == false){
			this.particles[i] = new progressBarParticle(x, y, (.5 - Math.random()) * 3, (.5 - Math.random()) * 3, 10);
			return;
		}
	}
	this.particles[this.particles.length] = new progressBarParticle(x, y, (.5 - Math.random()) * 3, (.5 - Math.random()) * 3, 10);
}


function progressBarUpdateParticles(){
	context = this.canvas.getContext('2d');
	for (i = 0; i < this.particles.length; i++){
		if (this.particles[i].alive) {
			this.particles[i].x += this.particles[i].xd;	
			this.particles[i].y += this.particles[i].yd;
			this.particles[i].age--;
			if (this.particles[i].age == 0) this.particles[i].alive = false;
			context.globalAlpha = (this.particles[i].age / 10);
			context.globalCompositeOperation = "lighter";

			context.shadowColor = "transparent";
			new_gradient = context.createRadialGradient(this.particles[i].x, this.particles[i].y, 0, this.particles[i].x, this.particles[i].y, 3);
			new_gradient.addColorStop(0, "rgba(255,255,255,.7)");
			new_gradient.addColorStop(.2, "rgba(180,245,255,.6)");
			new_gradient.addColorStop(.5, "rgba(180,245,255,.2)");	
			new_gradient.addColorStop(1, "rgba(64,64,64,0)");
			context.fillStyle = new_gradient;
			context.beginPath();
			context.arc(this.particles[i].x, this.particles[i].y, 3, (Math.PI * 2), false);
			context.fill();
		}	
	}

}

function portfolioPiece(fullsize_url, ie_thumbnail_url, thumbnail_url, image_title, topX, topY, width, height){
	this.fullsize = new portfolioImage(this, fullsize_url);
	if (!topX) {
		this.thumbnail = new portfolioThumbnail(this, ie_thumbnail_url, thumbnail_url, image_title);
	}
	else {
		this.thumbnail = new portfolioThumbnail(this, ie_thumbnail_url, thumbnail_url, image_title, topX, topY, width, height)
	}
	this.image_title = image_title;
	this.is_loaded = false;
}

function portfolioImage (parent, url){
	this.parent = parent;
	this.url = url;
	this.image = new Image();

}

function portfolioThumbnail (parent, url, plain_url, title, topX, topY, width, height){
	this.parent = parent;

	this.ie_url = url;
	this.ie_image = new Image();
	this.plain_url = plain_url;
	this.image = new Image();
	this.title = title;
	this.drawOnCanvas = drawOnCanvas;
	if (!!topX){
		this.topX = topX;
		this.topY = topY;
		this.width = width;
		this.height = height;
	}

}

DOMAIN_2 = "http://diekisdreamings-images.appspot.com/";

var inner_glow_data;


function getPortfolioManifest(manifest_file){
	var req = new XMLHttpRequest();
	req.open('GET', manifest_file, false)
	req.send(null);
	if (req.status==200) return req.responseText;
}

function getImageData(input_xml, support_webp){
	if (window.DOMParser){
		parser = new DOMParser();
		xmlDoc = parser.parseFromString(input_xml,"text/xml")
	} else {
		xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async = "false";
		xmlDoc.loadXML(input_xml);
	}
	image_data = new Array()
	for (i=0;i < xmlDoc.getElementsByTagName("image").length; i++){	

		ie_thumbnail_url = "portfolio/images/" + xmlDoc.getElementsByTagName("image")[i].getElementsByTagName("thumbnail")[0].getElementsByTagName("url")[0].childNodes[0].nodeValue;
		thumbnail_url = xmlDoc.getElementsByTagName("image")[i].getElementsByTagName("thumbnail")[0].getElementsByTagName("plain_url")[0].childNodes[0].nodeValue;

		fullsize_url = xmlDoc.getElementsByTagName("image")[i].getElementsByTagName("fullsize")[0].getElementsByTagName("jpeg")[0].childNodes[0].nodeValue;
		if (support_webp) fullsize_url = xmlDoc.getElementsByTagName("image")[i].getElementsByTagName("fullsize")[0].getElementsByTagName("webp")[0].childNodes[0].nodeValue;
		if (thumbnail_url == "=fullsize") thumbnail_url = fullsize_url;

		image_title = xmlDoc.getElementsByTagName("image")[i].getElementsByTagName("image_title")[0].childNodes[0].nodeValue;
		subset  = xmlDoc.getElementsByTagName("image")[i].getElementsByTagName("thumbnail")[0].getElementsByTagName("subset")[0];
		if (!!subset){
			topX = parseInt(subset.getElementsByTagName("tlX")[0].childNodes[0].nodeValue);
			topY = parseInt(subset.getElementsByTagName("tlY")[0].childNodes[0].nodeValue);
			width = parseInt(subset.getElementsByTagName("brX")[0].childNodes[0].nodeValue) - topX;
			height = parseInt(subset.getElementsByTagName("brY")[0].childNodes[0].nodeValue) - topY;
			image_data[i] = new portfolioPiece(fullsize_url, ie_thumbnail_url, thumbnail_url, image_title, topX, topY, width, height);		
		}
		else {
			image_data[i] = new portfolioPiece(fullsize_url, ie_thumbnail_url, thumbnail_url, image_title);
		}
	}
	return image_data;
}

function loadPortfolio(manifest_file, support_webp){
	manifest = getPortfolioManifest(manifest_file);
	portfolio_data = getImageData(manifest, support_webp);
	for (i = 0; i < portfolio_data.length; i++){
		portfolio_data[i].fullsize.image.src = DOMAIN_2 + "images/" + portfolio_data[i].fullsize.url;
		portfolio_data[i].fullsize.image.onload = markImageLoaded(portfolio_data[i]);
	}
	return portfolio_data;
}
function markImageLoaded(data){
	return function(){
		data.fullsize.is_loaded = true;
		if (data.thumbnail.is_loaded == true){
			data.is_loaded = true;
		}
	}
}
function markThumbnailLoaded(data){ 
	return function(){
		data.thumbnail.is_loaded = true;
		if (data.fullsize.is_loaded == true){
			data.is_loaded = true;
		}
	}
}
function prerenderInnerGlow(){

	var ITEM_OFFSET = 9; 
	var ITEM_WIDTH = 662;
	var ITEM_HIEGHT = 162;
	var ITEM_INNER_GLOW_RADIUS = 46;
	canvas = document.createElement("canvas");

	if (!canvas.getContext) return;
	context = canvas.getContext("2d");
	canvas.width = 680;
	canvas.height = 180;
	context.rectWithRoundRectHole(0,0, context.canvas.width, context.canvas.height, ITEM_OFFSET + .5, ITEM_OFFSET + .5,ITEM_WIDTH - .5 + ITEM_OFFSET,ITEM_HIEGHT - .5 + ITEM_OFFSET,5);
	context.fillStyle = "white";
	context.fill();
	stackBlurCanvasRGBA(context.canvas, 0, 0, context.canvas.width, context.canvas.height, ITEM_INNER_GLOW_RADIUS);
	
	inner_glow_data = new Image()
	inner_glow_data.src = context.canvas.toDataURL("image/png")
}
function drawOnCanvas(canvas, highlight) {
	context = canvas.getContext('2d');

	i = this.image;
	i.src = DOMAIN_2 + "images/" + this.plain_url;
	if (i.width == 0) {
		i.onload = constructPortfolioDisplay(this, context, highlight, i);
	}
	else{
		markThumbnailLoaded(this.parent);
		i_c = constructPortfolioDisplay(this, context, highlight, i)
		i_c();
	}
	

}
function constructPortfolioDisplay(parent, context, highlight, image){
	return function(){
		context.canvas.width = 680;
		context.canvas.height = 180;
		markThumbnailLoaded(parent.parent);
		var ITEM_OFFSET = 9;
		var ITEM_WIDTH = 662;
		var ITEM_HIEGHT = 162;
		var ITEM_INNER_GLOW_RADIUS = 46;
		var DO_INNER_GLOW = true;

		image_offset_x = 0;
		image_offset_y = 0;
		image_scale = 1;
		if (!!parent.topX){
			image_offset_x = parent.topX;
			image_offset_y = parent.topY;
			image_scale =  ITEM_WIDTH / parent.width;
		}

		//Draw the shadow
		context.save();
			context.roundRect(ITEM_OFFSET, ITEM_OFFSET, ITEM_WIDTH + ITEM_OFFSET, ITEM_HIEGHT + ITEM_OFFSET,5);
			context.fillStyle = "black";
			context.shadowColor = "black";
			context.shadowOffsetX = 0;
			context.shadowOffsetY = 0;
			context.shadowBlur = 10;
			context.fill();
		context.restore();

		//Draw the background box.
		context.save()
			context.roundRect(ITEM_OFFSET, ITEM_OFFSET, ITEM_WIDTH + ITEM_OFFSET, ITEM_HIEGHT + ITEM_OFFSET,5);
			context.fillStyle = "#444";
			context.fill();
	
			//Clip and draw the image.
			context.save();
			context.clip();
			if (!!parent.topX){
				context.drawImage(image,image_offset_x, image_offset_y, parent.width, parent.height, ITEM_OFFSET,50 + ITEM_OFFSET, ITEM_WIDTH, 112);
			}
			else {
				context.drawImage(image, ITEM_OFFSET,50 + ITEM_OFFSET);				
			}
			//Draw the highlight
			if (highlight == true){
				context.save();
					highlight_gradient = context.createRadialGradient(ITEM_WIDTH / 2, ITEM_HIEGHT / 2, 0, ITEM_WIDTH / 2, ITEM_HIEGHT / 2, ITEM_WIDTH * .4);
					highlight_gradient.addColorStop(0,  "rgba(128,128,255,.4)");
					highlight_gradient.addColorStop(1,  "rgba(255,255,255,0)");
					context.roundRect(ITEM_OFFSET - .5, ITEM_OFFSET - .5,ITEM_WIDTH + .5 + ITEM_OFFSET,ITEM_HIEGHT + .5 + ITEM_OFFSET,5);
					context.globalCompositeOperation = "lighter";
					context.fillStyle = highlight_gradient;
					context.fill();
				context.restore();
			}	
			//Draw the top rectangular box w/gradient.
			text_box_gradient = context.createLinearGradient(0,9,0,54);
			text_box_gradient.addColorStop(0, "#333333");
			text_box_gradient.addColorStop(1, "#333333");
	
			context.fillStyle = text_box_gradient;
			context.fillRect(ITEM_OFFSET, ITEM_OFFSET,ITEM_WIDTH,54);
		
		
			//Draw the shadow for top rectangular box

			box_shadow_gradient = context.createLinearGradient(0,52 + ITEM_OFFSET,0, 61 + ITEM_OFFSET);
			box_shadow_gradient.addColorStop(0, "rgba(0,0,0,.6)");
			box_shadow_gradient.addColorStop(1, "transparent");
			context.fillStyle = box_shadow_gradient;
			context.fillRect(ITEM_OFFSET,54 + ITEM_OFFSET,662, 9);

		context.restore();


		//Draw text on titlebar
		context.save();
	
			context.textAlign = "center";
			context.textBaseline = "bottom";
			context.font = "48px ChocolateBoxRegular";
			context.save();
				context.shadowColor = "rgba(0,0,0,.68)";
				context.shadowOffsetX = 2;
				context.shadowOffsetY = 1;
				context.shadowBlur = 4;
				context.fillText(parent.title, ITEM_WIDTH / 2 + ITEM_OFFSET, 60 + ITEM_OFFSET);
			context.restore();

			text_gradient = context.createLinearGradient(0,15,0, 60);
			text_gradient.addColorStop(0, "#f9f9f9");
			text_gradient.addColorStop(1, "#bebebe");
			context.fillStyle= text_gradient;
			context.fillText(parent.title, ITEM_WIDTH / 2 + ITEM_OFFSET, 60 + ITEM_OFFSET);
		context.restore()

		//Put the inner glow
		if (DO_INNER_GLOW){
			context.save();
				context.roundRect(ITEM_OFFSET, ITEM_OFFSET, ITEM_WIDTH + ITEM_OFFSET, ITEM_HIEGHT + ITEM_OFFSET,5);
				context.clip();
				context.globalAlpha = .18;
				context.drawImage(inner_glow_data, 0, 0);
			context.restore()
		}
	
		//Draw the stroke around the outside.

		context.save();
			context.roundRect(ITEM_OFFSET + .5, ITEM_OFFSET + .5,ITEM_WIDTH - .5 + ITEM_OFFSET,ITEM_HIEGHT - .5 + ITEM_OFFSET,5);
			context.strokeStyle = "#888";
			context.lineWidth   = 1;
			context.stroke();
		context.restore();



	}
}
CanvasRenderingContext2D.prototype.roundRect = function(sx,sy,ex,ey,r) {
	var r2d = Math.PI/180;
	if( ( ex - sx ) - ( 2 * r ) < 0 ) { r = ( ( ex - sx ) / 2 ); } //ensure that the radius isn't too large for x
	if( ( ey - sy ) - ( 2 * r ) < 0 ) { r = ( ( ey - sy ) / 2 ); } //ensure that the radius isn't too large for y
	this.beginPath();
	this.moveTo(sx+r,sy);
	this.lineTo(ex-r,sy);
	this.arc(ex-r,sy+r,r,r2d*270,r2d*360,false);
	this.lineTo(ex,ey-r);
	this.arc(ex-r,ey-r,r,r2d*0,r2d*90,false);
	this.lineTo(sx+r,ey);
	this.arc(sx+r,ey-r,r,r2d*90,r2d*180,false);
	this.lineTo(sx,sy+r);
	this.arc(sx+r,sy+r,r,r2d*180,r2d*270,false);
	this.closePath();
}

CanvasRenderingContext2D.prototype.rectWithRoundRectHole = function(sx,sy,ex,ey, sx2,sy2,ex2,ey2,r) {
	var r2d = Math.PI/180;
	if( ( ex - sx ) - ( 2 * r ) < 0 ) { r = ( ( ex - sx ) / 2 ); } //ensure that the radius isn't too large for x
	if( ( ey - sy ) - ( 2 * r ) < 0 ) { r = ( ( ey - sy ) / 2 ); } //ensure that the radius isn't too large for y

	this.beginPath();

	this.moveTo(sx2,sy2);
	this.lineTo(sx2, ey2);
	this.lineTo(ex2, ey2);
	this.lineTo(ex2, sy2);
 
	this.moveTo(sx+r,sy);
	this.lineTo(ex-r,sy);
	this.arc(ex-r,sy+r,r,r2d*270,r2d*360,false);
	this.lineTo(ex,ey-r);
	this.arc(ex-r,ey-r,r,r2d*0,r2d*90,false);
	this.lineTo(sx+r,ey);
	this.arc(sx+r,ey-r,r,r2d*90,r2d*180,false);
	this.lineTo(sx,sy+r);
	this.arc(sx+r,sy+r,r,r2d*180,r2d*270,false);

	this.closePath();
}

var MAIN_PAGE = 0;
var FANTASY_PAGE = 1;
var SCIFI_PAGE = 2;
var current_page = MAIN_PAGE;
var progress_bar;
$(document).ready(init);
$(window).bind("load", 	function(){displayImages(); initLightbox()});

function formatTitle(title, currentArray, currentIndex, currentOpts) {
    return '<div class="images-title">' + (title && title.length ? '<b>' + title + '</b>' : '' ) + '</div>';
}

function finishLoading(){
	$('#fantasy-link').click(function(){
		showFantasy();
	});
	$('#scifi-link').click(function(){
		showScifi();
	});
	$.History.bind('/fantasy', showFantasy);
	$.History.bind('/scifi', showScifi);
	$.History.bind('/main', showMain);
	$("#banner").delay(900).fadeIn();	
	$("#fantasy-banner").delay(1000).fadeIn();
	$("#scifi-banner").delay(1100).fadeIn();

};
var fantasy_data;
global_webp_support = false;
function portfolioStageTwoLoad(webp){
	global_webp_support = webp;
	loadImages(webp);	
}
function portfolioOnloadHandler(){
	//Detect WebP support	
	var div = document.createElement('div');
	div.innerHTML = '<img id = "test_image" src="data:image/webp,RIFF*%00%00%00WEBPVP8%20%1E%00%00%00%10%02%00%9D%01*%04%00%04%00%0B%C7%08%85%85%88%85%84%88%3F%82%00%0C%0D%60%00%FE%E6%B5%00">';
	webp_test = div.firstChild;
	div.firstChild.onerror = function(){portfolioStageTwoLoad(false)}
	div.firstChild.onload = function(){portfolioStageTwoLoad(true)}

	var webp_opera_test = new Image();
	webp_opera_test.src = "data:image/webp,RIFF*%00%00%00WEBPVP8%20%1E%00%00%00%10%02%00%9D%01*%04%00%04%00%0B%C7%08%85%85%88%85%84%88%3F%82%00%0C%0D%60%00%FE%E6%B5%00"
	webp_opera_test.onerror = function(){portfolioStageTwoLoad(false)}
	webp_opera_test.onload = function(){portfolioStageTwoLoad(true)}

}
function init(){
	onloadHandler();
	portfolioOnloadHandler();
	startProgressBar();	


}

function startProgressBar(){
	progress_bar = new progressBar(document.getElementById("progress-bar"));
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
	progress_bar.updateProgress(progress);
	if (progress == 100){
		 setTimeout(hideProgressBar, 500);
	} else { 
		setTimeout(checkProgress, 100);
	}
}
function hideProgressBar(){
	$("#progress-counter").delay(100).fadeOut(500);
	$("#loading-text").delay(100).fadeOut(500);
	finishLoading();
	
}
function loadImages(webp){
	fantasy_data = loadPortfolio("portfolio/images/fantasy.xml", webp);
	fantasy_div = document.getElementById("fantasy-images")
	prerenderInnerGlow();
	var i1 = Array, i2 = new Array;
	for (n = 0; n < fantasy_data.length; n++){
		if (Modernizr.canvas){
			i1[n] = new Image();
			i1[n].src = DOMAIN_2 + "images/" + fantasy_data[n].thumbnail.plain_url;
			i1[n].onload = markThumbnailLoaded(fantasy_data[n]);
		}
	}
	scifi_data = loadPortfolio("portfolio/images/sci-fi.xml", webp);
	scifi_div = document.getElementById("scifi-images")
	var i3 = Array, i4 = new Array;
	for (n = 0; n < scifi_data.length; n++){
		if (Modernizr.canvas){
			i2[n] = new Image();
			i2[n].src = DOMAIN_2 + "images/" + scifi_data[n].thumbnail.plain_url;
			i2[n].onload = markThumbnailLoaded(scifi_data[n]);
		}
	}
}
function displayImages(){
	fantasy_data = loadPortfolio("portfolio/images/fantasy.xml", global_webp_support);
	fantasy_div = document.getElementById("fantasy-images")
	prerenderInnerGlow();
	for (n = 0; n < fantasy_data.length; n++){
		a = document.createElement('a');
		a.href = fantasy_data[n].fullsize.image.src;
		a.setAttribute("class", "portfolio-image");
		a.setAttribute("data-title", fantasy_data[n].image_title);
		//a.setAttribute("onclick", "_gaq.push(['_trackPageview'," + fantasy_data[n].fullsize.image.src + ']);');
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
	fantasy_credit_div = document.createElement('div');
	fantasy_credit_div.innerHTML = ""
	fantasy_credit_div.setAttribute("class", "credit");
	fantasy_div.appendChild(fantasy_credit_div);

	scifi_data = loadPortfolio("portfolio/images/sci-fi.xml", global_webp_support);
	scifi_div = document.getElementById("scifi-images")

	for (n = 0; n < scifi_data.length; n++){
		a = document.createElement('a');
		a.href = scifi_data[n].fullsize.image.src;
		a.setAttribute("class", "portfolio-image");
		a.setAttribute("data-title", scifi_data[n].image_title);
		//a.setAttribute("onclick", "_gaq.push(['_trackPageview'," + scifi_data[n].fullsize.image.src + ']);');
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
	scifi_credit_div = document.createElement('div');
	scifi_credit_div.innerHTML = "Gun model by Patrick Sharkey. Gears by Obsidian Dawn."
	scifi_credit_div.setAttribute("class", "credit");
	scifi_div.appendChild(scifi_credit_div);
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
	$("#scifi-banner").delay(600).fadeIn();
	current_page = MAIN_PAGE;

}

// Modernizr v1.7  www.modernizr.com
window.Modernizr=function(a,b,c){function G(){e.input=function(a){for(var b=0,c=a.length;b<c;b++)t[a[b]]=!!(a[b]in l);return t}("autocomplete autofocus list placeholder max min multiple pattern required step".split(" ")),e.inputtypes=function(a){for(var d=0,e,f,h,i=a.length;d<i;d++)l.setAttribute("type",f=a[d]),e=l.type!=="text",e&&(l.value=m,l.style.cssText="position:absolute;visibility:hidden;",/^range$/.test(f)&&l.style.WebkitAppearance!==c?(g.appendChild(l),h=b.defaultView,e=h.getComputedStyle&&h.getComputedStyle(l,null).WebkitAppearance!=="textfield"&&l.offsetHeight!==0,g.removeChild(l)):/^(search|tel)$/.test(f)||(/^(url|email)$/.test(f)?e=l.checkValidity&&l.checkValidity()===!1:/^color$/.test(f)?(g.appendChild(l),g.offsetWidth,e=l.value!=m,g.removeChild(l)):e=l.value!=m)),s[a[d]]=!!e;return s}("search tel url email datetime date month week time datetime-local number range color".split(" "))}function F(a,b){var c=a.charAt(0).toUpperCase()+a.substr(1),d=(a+" "+p.join(c+" ")+c).split(" ");return!!E(d,b)}function E(a,b){for(var d in a)if(k[a[d]]!==c&&(!b||b(a[d],j)))return!0}function D(a,b){return(""+a).indexOf(b)!==-1}function C(a,b){return typeof a===b}function B(a,b){return A(o.join(a+";")+(b||""))}function A(a){k.cssText=a}var d="1.7",e={},f=!0,g=b.documentElement,h=b.head||b.getElementsByTagName("head")[0],i="modernizr",j=b.createElement(i),k=j.style,l=b.createElement("input"),m=":)",n=Object.prototype.toString,o=" -webkit- -moz- -o- -ms- -khtml- ".split(" "),p="Webkit Moz O ms Khtml".split(" "),q={svg:"http://www.w3.org/2000/svg"},r={},s={},t={},u=[],v,w=function(a){var c=b.createElement("style"),d=b.createElement("div"),e;c.textContent=a+"{#modernizr{height:3px}}",h.appendChild(c),d.id="modernizr",g.appendChild(d),e=d.offsetHeight===3,c.parentNode.removeChild(c),d.parentNode.removeChild(d);return!!e},x=function(){function d(d,e){e=e||b.createElement(a[d]||"div");var f=(d="on"+d)in e;f||(e.setAttribute||(e=b.createElement("div")),e.setAttribute&&e.removeAttribute&&(e.setAttribute(d,""),f=C(e[d],"function"),C(e[d],c)||(e[d]=c),e.removeAttribute(d))),e=null;return f}var a={select:"input",change:"input",submit:"form",reset:"form",error:"img",load:"img",abort:"img"};return d}(),y=({}).hasOwnProperty,z;C(y,c)||C(y.call,c)?z=function(a,b){return b in a&&C(a.constructor.prototype[b],c)}:z=function(a,b){return y.call(a,b)},r.flexbox=function(){function c(a,b,c,d){a.style.cssText=o.join(b+":"+c+";")+(d||"")}function a(a,b,c,d){b+=":",a.style.cssText=(b+o.join(c+";"+b)).slice(0,-b.length)+(d||"")}var d=b.createElement("div"),e=b.createElement("div");a(d,"display","box","width:42px;padding:0;"),c(e,"box-flex","1","width:10px;"),d.appendChild(e),g.appendChild(d);var f=e.offsetWidth===42;d.removeChild(e),g.removeChild(d);return f},r.canvas=function(){var a=b.createElement("canvas");return a.getContext&&a.getContext("2d")},r.canvastext=function(){return e.canvas&&C(b.createElement("canvas").getContext("2d").fillText,"function")},r.webgl=function(){return!!a.WebGLRenderingContext},r.touch=function(){return"ontouchstart"in a||w("@media ("+o.join("touch-enabled),(")+"modernizr)")},r.geolocation=function(){return!!navigator.geolocation},r.postmessage=function(){return!!a.postMessage},r.websqldatabase=function(){var b=!!a.openDatabase;return b},r.indexedDB=function(){for(var b=-1,c=p.length;++b<c;){var d=p[b].toLowerCase();if(a[d+"_indexedDB"]||a[d+"IndexedDB"])return!0}return!1},r.hashchange=function(){return x("hashchange",a)&&(b.documentMode===c||b.documentMode>7)},r.history=function(){return !!(a.history&&history.pushState)},r.draganddrop=function(){return x("dragstart")&&x("drop")},r.websockets=function(){return"WebSocket"in a},r.rgba=function(){A("background-color:rgba(150,255,150,.5)");return D(k.backgroundColor,"rgba")},r.hsla=function(){A("background-color:hsla(120,40%,100%,.5)");return D(k.backgroundColor,"rgba")||D(k.backgroundColor,"hsla")},r.multiplebgs=function(){A("background:url(//:),url(//:),red url(//:)");return(new RegExp("(url\\s*\\(.*?){3}")).test(k.background)},r.backgroundsize=function(){return F("backgroundSize")},r.borderimage=function(){return F("borderImage")},r.borderradius=function(){return F("borderRadius","",function(a){return D(a,"orderRadius")})},r.boxshadow=function(){return F("boxShadow")},r.textshadow=function(){return b.createElement("div").style.textShadow===""},r.opacity=function(){B("opacity:.55");return/^0.55$/.test(k.opacity)},r.cssanimations=function(){return F("animationName")},r.csscolumns=function(){return F("columnCount")},r.cssgradients=function(){var a="background-image:",b="gradient(linear,left top,right bottom,from(#9f9),to(white));",c="linear-gradient(left top,#9f9, white);";A((a+o.join(b+a)+o.join(c+a)).slice(0,-a.length));return D(k.backgroundImage,"gradient")},r.cssreflections=function(){return F("boxReflect")},r.csstransforms=function(){return!!E(["transformProperty","WebkitTransform","MozTransform","OTransform","msTransform"])},r.csstransforms3d=function(){var a=!!E(["perspectiveProperty","WebkitPerspective","MozPerspective","OPerspective","msPerspective"]);a&&"webkitPerspective"in g.style&&(a=w("@media ("+o.join("transform-3d),(")+"modernizr)"));return a},r.csstransitions=function(){return F("transitionProperty")},r.fontface=function(){var a,c,d=h||g,e=b.createElement("style"),f=b.implementation||{hasFeature:function(){return!1}};e.type="text/css",d.insertBefore(e,d.firstChild),a=e.sheet||e.styleSheet;var i=f.hasFeature("CSS2","")?function(b){if(!a||!b)return!1;var c=!1;try{a.insertRule(b,0),c=/src/i.test(a.cssRules[0].cssText),a.deleteRule(a.cssRules.length-1)}catch(d){}return c}:function(b){if(!a||!b)return!1;a.cssText=b;return a.cssText.length!==0&&/src/i.test(a.cssText)&&a.cssText.replace(/\r+|\n+/g,"").indexOf(b.split(" ")[0])===0};c=i('@font-face { font-family: "font"; src: url(data:,); }'),d.removeChild(e);return c},r.video=function(){var a=b.createElement("video"),c=!!a.canPlayType;if(c){c=new Boolean(c),c.ogg=a.canPlayType('video/ogg; codecs="theora"');var d='video/mp4; codecs="avc1.42E01E';c.h264=a.canPlayType(d+'"')||a.canPlayType(d+', mp4a.40.2"'),c.webm=a.canPlayType('video/webm; codecs="vp8, vorbis"')}return c},r.audio=function(){var a=b.createElement("audio"),c=!!a.canPlayType;c&&(c=new Boolean(c),c.ogg=a.canPlayType('audio/ogg; codecs="vorbis"'),c.mp3=a.canPlayType("audio/mpeg;"),c.wav=a.canPlayType('audio/wav; codecs="1"'),c.m4a=a.canPlayType("audio/x-m4a;")||a.canPlayType("audio/aac;"));return c},r.localstorage=function(){try{return!!localStorage.getItem}catch(a){return!1}},r.sessionstorage=function(){try{return!!sessionStorage.getItem}catch(a){return!1}},r.webWorkers=function(){return!!a.Worker},r.applicationcache=function(){return!!a.applicationCache},r.svg=function(){return!!b.createElementNS&&!!b.createElementNS(q.svg,"svg").createSVGRect},r.inlinesvg=function(){var a=b.createElement("div");a.innerHTML="<svg/>";return(a.firstChild&&a.firstChild.namespaceURI)==q.svg},r.smil=function(){return!!b.createElementNS&&/SVG/.test(n.call(b.createElementNS(q.svg,"animate")))},r.svgclippaths=function(){return!!b.createElementNS&&/SVG/.test(n.call(b.createElementNS(q.svg,"clipPath")))};for(var H in r)z(r,H)&&(v=H.toLowerCase(),e[v]=r[H](),u.push((e[v]?"":"no-")+v));e.input||G(),e.crosswindowmessaging=e.postmessage,e.historymanagement=e.history,e.addTest=function(a,b){a=a.toLowerCase();if(!e[a]){b=!!b(),g.className+=" "+(b?"":"no-")+a,e[a]=b;return e}},A(""),j=l=null,f&&a.attachEvent&&function(){var a=b.createElement("div");a.innerHTML="<elem></elem>";return a.childNodes.length!==1}()&&function(a,b){function p(a,b){var c=-1,d=a.length,e,f=[];while(++c<d)e=a[c],(b=e.media||b)!="screen"&&f.push(p(e.imports,b),e.cssText);return f.join("")}function o(a){var b=-1;while(++b<e)a.createElement(d[b])}var c="abbr|article|aside|audio|canvas|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",d=c.split("|"),e=d.length,f=new RegExp("(^|\\s)("+c+")","gi"),g=new RegExp("<(/*)("+c+")","gi"),h=new RegExp("(^|[^\\n]*?\\s)("+c+")([^\\n]*)({[\\n\\w\\W]*?})","gi"),i=b.createDocumentFragment(),j=b.documentElement,k=j.firstChild,l=b.createElement("body"),m=b.createElement("style"),n;o(b),o(i),k.insertBefore(m,k.firstChild),m.media="print",a.attachEvent("onbeforeprint",function(){var a=-1,c=p(b.styleSheets,"all"),k=[],o;n=n||b.body;while((o=h.exec(c))!=null)k.push((o[1]+o[2]+o[3]).replace(f,"$1.iepp_$2")+o[4]);m.styleSheet.cssText=k.join("\n");while(++a<e){var q=b.getElementsByTagName(d[a]),r=q.length,s=-1;while(++s<r)q[s].className.indexOf("iepp_")<0&&(q[s].className+=" iepp_"+d[a])}i.appendChild(n),j.appendChild(l),l.className=n.className,l.innerHTML=n.innerHTML.replace(g,"<$1font")}),a.attachEvent("onafterprint",function(){l.innerHTML="",j.removeChild(l),j.appendChild(n),m.styleSheet.cssText=""})}(a,b),e._enableHTML5=f,e._version=d,g.className=g.className.replace(/\bno-js\b/,"")+" js "+u.join(" ");return e}(this,this.document)

function initLightbox(){
	$("a.portfolio-image").click(function(event){
		canvas = document.createElement("canvas");
		if (!!canvas.getContext){
			event.preventDefault();			
			lightbox_image_title = this.getAttribute("data-title");
			displayLightbox(this.href, this.getAttribute("data-title"));
			$("#lightbox-canvas").click(function(){hideLightbox()});
			
		}
	});
}
function hideLightbox(){
	$("#lightbox-canvas").fadeOut(400);
	setTimeout(function(){$("#lightbox-canvas").remove()}, 400);
}
function displayLightbox(image_url, lightbox_image_title){
	//Create a new <canvas>, set it to body, and make it cover the whole page.

	canvas = document.createElement("canvas");
	document.getElementById("body").appendChild(canvas);
	canvas.id = "lightbox-canvas";

	canvas.width = $(window).width();
	canvas.height = $(window).height() + 20;

	$('#lightbox-canvas').css("position", "fixed");
	$('#lightbox-canvas').css("top", "0px");
	$('#lightbox-canvas').css("left", "0px");

	//Shade out the background.
	context = canvas.getContext('2d');
	context.fillStyle = "rgba(0,0,0,.5)";
	context.fillRect(0,0,canvas.width, canvas.height);

	//Load the image, and pass control on to the secondary function.
	image = new Image();
	image.src = image_url;
	image.onload = drawLightboxImage(image, lightbox_image_title);
}

function drawLightboxImage(image, lightbox_image_title){
	return function(){
		//Load some important objects and numbers
		canvas = document.getElementById("lightbox-canvas");
		context = canvas.getContext('2d');
		window_height = $(window).height();
		window_width = $(window).width();
		image_width = image.width;
		image_height = image.height;


		//Calculate the position and scale of the image
		image_scale = 1;
		if (image_height + 110 > window_height) image_scale = window_height / (image_height + 110);
		if ((image_width * image_scale) + 40 > window_width) image_scale = window_width / (image_width + 40);
		image_height *= image_scale;
		image_width *= image_scale;

		
		image_left_x = Math.floor((window_width / 2) - (image_width / 2));
		image_top_y = Math.floor((window_height / 2) - ((image_height - 60) / 2));
		image_right_x = image_left_x + image_width;
		image_bottom_y = image_top_y + image_height;
	
		//Prepare the inner glow first
		var ITEM_INNER_GLOW_RADIUS = 46;
		glow_canvas = document.createElement("canvas");
		glow_context = glow_canvas.getContext("2d");
		glow_canvas.width = window_width;
		glow_canvas.height = window_height;
		glow_context.rectWithRoundRectHole(0,0, glow_context.canvas.width, glow_context.canvas.height, image_left_x, image_top_y - 60, image_right_x, image_bottom_y, 5);
		glow_context.fillStyle = "white";
		glow_context.shadowColor = "rgba(255,255,255,1);"
		glow_context.shadowBlur = ITEM_INNER_GLOW_RADIUS;
		glow_context.shadowOffsetX = 0;
		glow_context.shadowOffsetY = 0;
		glow_context.fill();
		var lightbox_inner_glow_data = new Image()
		lightbox_inner_glow_data.src = glow_context.canvas.toDataURL("image/png")
		lightbox_inner_glow_data.onload = finishDrawingLightbox(canvas, lightbox_inner_glow_data);
	}

}

function finishDrawingLightbox(canvas, lightbox_inner_glow_data){
	return function(){
		//We do the rest of the drawing once the inner glow loads.
		
		//Draw the base box, w/shadow.
		context = canvas.getContext('2d');
		context.save();
			context.shadowColor = "black";
			context.shadowBlur = 20;
			context.shadowOffsetX = 2;
			context.shadowOffsetY = 2;
	
			context.roundRect(image_left_x, image_top_y - 60, image_right_x, image_bottom_y, 5);
			context.fillStyle = "#333";
			context.fill();
		context.restore();
			
		//Draw the image
		context.save();
			context.roundRect(image_left_x, image_top_y - 60, image_right_x, image_bottom_y, 5);
			context.clip();
			context.drawImage(image, image_left_x, image_top_y, image_width, image_height);
		context.restore();

		//Draw the top bar shadow
		context.save();
			box_shadow_gradient = context.createLinearGradient(0,image_top_y,0, image_top_y + 9);
			box_shadow_gradient.addColorStop(0, "rgba(0,0,0,.6)");
			box_shadow_gradient.addColorStop(1, "transparent");
			context.fillStyle = box_shadow_gradient;
			context.fillRect(image_left_x,image_top_y, image_width, 9);
		context.restore();
			//Draw the stroke around the outside
		context.save();
			context.globalCompositeOperation = "lighter";
			context.roundRect(image_left_x, image_top_y - 60, image_right_x, image_bottom_y +.5, 5);
			context.strokeStyle = "#888";
			context.stroke();
		context.restore();
			//Draw the text
		context.save();
			context.textAlign = "center";
			context.textBaseline = "bottom";
			context.font = "48px ChocolateBoxRegular";
			context.save();
				context.shadowColor = "rgba(0,0,0,.68)";
				context.shadowOffsetX = 2;
				context.shadowOffsetY = 1;
				context.shadowBlur = 4;
				context.fillText(lightbox_image_title, window_width / 2, image_top_y);
			context.restore();
				text_gradient = context.createLinearGradient(0,image_top_y - 45, 0, image_top_y );
			text_gradient.addColorStop(0, "#f9f9f9");
			text_gradient.addColorStop(1, "#bebebe");
			context.fillStyle= text_gradient;
			context.fillText(lightbox_image_title, window_width / 2, image_top_y);
		context.restore()
			//Draw the inner glow
		context.save();
			context.roundRect(image_left_x, image_top_y - 60, image_right_x, image_bottom_y, 5);
			context.clip();
			context.globalAlpha = .10;
			context.drawImage(lightbox_inner_glow_data, 0, 0);
		context.restore()
		
	}
}
CanvasRenderingContext2D.prototype.roundRect = function(sx,sy,ex,ey,r) {
	var r2d = Math.PI/180;
	if( ( ex - sx ) - ( 2 * r ) < 0 ) { r = ( ( ex - sx ) / 2 ); } //ensure that the radius isn't too large for x
	if( ( ey - sy ) - ( 2 * r ) < 0 ) { r = ( ( ey - sy ) / 2 ); } //ensure that the radius isn't too large for y
	this.beginPath();
	this.moveTo(sx+r,sy);
	this.lineTo(ex-r,sy);
	this.arc(ex-r,sy+r,r,r2d*270,r2d*360,false);
	this.lineTo(ex,ey-r);
	this.arc(ex-r,ey-r,r,r2d*0,r2d*90,false);
	this.lineTo(sx+r,ey);
	this.arc(sx+r,ey-r,r,r2d*90,r2d*180,false);
	this.lineTo(sx,sy+r);
	this.arc(sx+r,sy+r,r,r2d*180,r2d*270,false);
	this.closePath();
}

CanvasRenderingContext2D.prototype.rectWithRoundRectHole = function(sx,sy,ex,ey, sx2,sy2,ex2,ey2,r) {
	var r2d = Math.PI/180;
	if( ( ex - sx ) - ( 2 * r ) < 0 ) { r = ( ( ex - sx ) / 2 ); } //ensure that the radius isn't too large for x
	if( ( ey - sy ) - ( 2 * r ) < 0 ) { r = ( ( ey - sy ) / 2 ); } //ensure that the radius isn't too large for y

	this.beginPath();

	this.moveTo(sx2,sy2);
	this.lineTo(sx2, ey2);
	this.lineTo(ex2, ey2);
	this.lineTo(ex2, sy2);
 
	this.moveTo(sx+r,sy);
	this.lineTo(ex-r,sy);
	this.arc(ex-r,sy+r,r,r2d*270,r2d*360,false);
	this.lineTo(ex,ey-r);
	this.arc(ex-r,ey-r,r,r2d*0,r2d*90,false);
	this.lineTo(sx+r,ey);
	this.arc(sx+r,ey-r,r,r2d*90,r2d*180,false);
	this.lineTo(sx,sy+r);
	this.arc(sx+r,sy+r,r,r2d*180,r2d*270,false);

	this.closePath();
}
