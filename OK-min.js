/*
 Javascript graphics utility library
 Helper functions, WebGL classes, Mouse input, Colours and Gradients UI
 Copyright (c) 2014, Owen Kaluza
 Released into public domain:
 This program is free software. It comes without any warranty, to
 the extent permitted by applicable law. You can redistribute it
 and/or modify it as long as this header remains intact
*/
var OK=function(){var a={debug_on:!1,debug:function(b){if(a.debug_on){var c=document.getElementById("console");c?c.innerHTML="<div style=\"font-family: 'monospace'; font-size: 8pt;\">"+b+"</div>"+c.innerHTML:console.log(b)}},clear:function(){var a=document.getElementById("console");a&&(a.innerHTML="")}};return a}();function getSearchVariable(a,b){for(var c=window.location.search.substring(1).split("&"),d=0;d<c.length;d++){var e=c[d].split("=");if(unescape(e[0])==a)return unescape(e[1])}return b}
function getImageDataURL(a){var b=document.createElement("canvas");b.width=a.width;b.height=a.height;b.getContext("2d").drawImage(a,0,0);return b.toDataURL("image/png")}window.$||(window.$=function(a,b){return("object"==typeof b?b:document).getElementById(a)});window.$S||(window.$S=function(a){if(a=$(a))return a.style});window.toggle||(window.toggle=function(a){var b=$S(a).display;"none"!=b&&b?$S(a).display="none":$S(a).display="block"});
function setAll(a,b){for(var c=document.getElementsByClassName(b),d=0;d<c.length;d++)c[d].style.display=a}function getSourceFromElement(a){var b=document.getElementById(a);if(!b)return null;a="";for(b=b.firstChild;b;)3==b.nodeType&&(a+=b.textContent),b=b.nextSibling;return a}function removeChildren(a){if(a.hasChildNodes())for(;0<a.childNodes.length;)a.removeChild(a.firstChild)}
window.requestAnimationFrame||(window.requestAnimationFrame=function(){return window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame}());function requestFullScreen(a){a=document.getElementById(a);a.requestFullscreen?a.requestFullscreen():a.mozRequestFullScreen?a.mozRequestFullScreen():a.webkitRequestFullScreen&&a.webkitRequestFullScreen()}
function typeOf(a){var b=typeof a;"object"===b&&(a?"number"!==typeof a.length||a.propertyIsEnumerable("length")||"function"!==typeof a.splice||(b="array"):b="null");return b}function isEmpty(a){var b,c;if("object"===typeOf(a))for(b in a)if(c=a[b],void 0!==c&&"function"!==typeOf(c))return!1;return!0}
function ajaxReadFile(a,b,c,d){var e=new XMLHttpRequest,f=0;void 0!=d&&("number"==typeof d?f=d:e.onprogress=d);e.onreadystatechange=function(){if(0<f&&2<e.readyState){var c=parseInt(e.responseText.length);d&&setProgress(c/f*100)}4==e.readyState&&(200==e.status?(d&&setProgress(100),OK.debug("RECEIVED: "+a),b&&b(e.responseText,a)):b?b("Error: "+e.status):OK.debug("Ajax Read File Error: returned status code "+e.status+" "+e.statusText))};c?e.open("GET",a+"?d="+(new Date).getTime(),!0):e.open("GET",a,
!0);e.send(null)}function readURL(a,b,c){var d=new XMLHttpRequest,e=0;void 0!=c&&("number"==typeof c?e=c:d.onprogress=c);d.onreadystatechange=function(){if(0<e&&2<d.readyState){var a=parseInt(d.responseText.length);c&&setProgress(a/e*100)}};b?d.open("GET",a+"?d="+(new Date).getTime(),!1):d.open("GET",a,!1);d.overrideMimeType("text/plain; charset=x-user-defined");d.send(null);if(200!=d.status)return"";c&&setProgress(100);return d.responseText}
function updateProgress(a){a.lengthComputable&&(setProgress(a.loaded/a.total*100),OK.debug(a.loaded+" / "+a.total))}function setProgress(a){a=Math.round(a);$S("progressbar").width=3*a+"px";$("progressstatus").innerHTML=a+"%"}
function ajaxPost(a,b,c,d,e){var f=new XMLHttpRequest;void 0!=d&&(f.upload.onprogress=d);f.onreadystatechange=function(){4==f.readyState&&(200==f.status?(d&&setProgress(100),OK.debug("POST: "+a),c&&c(f.responseText)):c?c("Error, status:"+f.status):OK.debug("Ajax Post Error: returned status code "+f.status+" "+f.statusText))};f.open("POST",a,!0);"string"==typeof b&&(f.setRequestHeader("Content-type","application/x-www-form-urlencoded"),f.setRequestHeader("Content-length",b.length));if(e)for(key in e)f.setRequestHeader(key,
e[key]);f.send(b)}var defaultMouse,dragMouse;function MouseEventHandler(a,b,c,d,e,f,g){this.click=a;this.wheel=b;this.move=c;this.down=d;this.up=e;this.leave=f;this.pinch=g}
function Mouse(a,b,c){this.element=a;this.handler=b;this.isdown=this.disabled=!1;this.button=null;this.dragged=!1;this.lastY=this.lastX=this.absoluteY=this.absoluteX=this.x=this.x=0;this.slider=null;this.spin=0;this.moveUpdate=!1;this.enableContext=c?!0:!1;a.addEventListener("onwheel"in document?"wheel":"mousewheel",handleMouseWheel,!1);a.onmousedown=handleMouseDown;a.onmouseout=handleMouseLeave;document.onmouseup=handleMouseUp;document.onmousemove=handleMouseMove;a.addEventListener("touchstart",
touchHandler,!0);a.addEventListener("touchmove",touchHandler,!0);a.addEventListener("touchend",touchHandler,!0);a.oncontextmenu=function(){return this.mouse.enableContext}}Mouse.prototype.setDefault=function(){defaultMouse=document.mouse=this};Mouse.prototype.update=function(a){a||(a=window.event);var b=mousePageCoord(a);this.x=b[0];this.y=b[1];this.absoluteX=this.x;this.absoluteY=this.y;b=findElementPos(this.element);this.x-=b[0];this.y-=b[1];this.clientx=a.clientX-b[0];this.clienty=a.clientY-b[1]};
function mousePageCoord(a){var b;a.pageX||a.pageY?(b=a.pageX,a=a.pageY):(b=a.clientX+document.body.scrollLeft+document.documentElement.scrollLeft,a=a.clientY+document.body.scrollTop+document.documentElement.scrollTop);return[b,a]}function elementRelativeCoord(a,b){var c=findElementPos(a);b[0]-=c[0];b[1]-=c[1]}function findElementPos(a){var b=curtop=0;do b+=a.offsetLeft,curtop+=a.offsetTop;while(a=a.offsetParent);return[b,curtop]}
function getMouse(a){a||(a=window.event);var b=a.target.mouse;if(b)return b;for(a=a.target;a!=document;)if(a=a.parentNode,a.mouse)return a.mouse;return null}function handleMouseDown(a){var b=getMouse(a);if(!b||b.disabled)return!0;b.target=(a||window.event).target;b.dragged=!1;b.update(a);b.isdown||(b.lastX=b.absoluteX,b.lastY=b.absoluteY);b.isdown=!0;dragMouse=b;b.button=a.button;document.mouse=b;var c=!0;b.handler.down&&(c=b.handler.down(a,b));!c&&a.preventDefault&&a.preventDefault();return c}
function handleMouseUp(a){var b=document.mouse;if(!b||b.disabled)return!0;var c=!0;b.isdown&&(b.update(a),b.handler.click&&(c=b.handler.click(a,b)),b.isdown=!1,dragMouse=null,b.button=null,b.dragged=!1);b.handler.up&&(c=c&&b.handler.up(a,b));document.mouse=defaultMouse;!c&&a.preventDefault&&a.preventDefault();return c}
function handleMouseMove(a){var b=dragMouse?dragMouse:getMouse(a);if(!b||b.disabled)return!0;b.update(a);b.deltaX=b.absoluteX-b.lastX;b.deltaY=b.absoluteY-b.lastY;var c=!0;!b.dragged&&b.isdown&&3<Math.abs(b.deltaX)+Math.abs(b.deltaY)&&(b.dragged=!0);b.handler.move&&(c=b.handler.move(a,b));b.moveUpdate&&(b.lastX=b.absoluteX,b.lastY=b.absoluteY);!c&&a.preventDefault&&a.preventDefault();return c}
function handleMouseWheel(a){var b=getMouse(a);if(!b||b.disabled)return!0;b.update(a);var c=!1;a.spin=0<(a.deltaY?-a.deltaY:a.wheelDelta)?1:-1;b.handler.wheel&&(c=b.handler.wheel(a,b));!c&&a.preventDefault&&a.preventDefault();return c}function handleMouseLeave(a){var b=getMouse(a);if(!b||b.disabled)return!0;var c=!0;b.handler.leave&&(c=b.handler.leave(a,b));!c&&a.preventDefault&&a.preventDefault();return a.returnValue=c}
function touchHandler(a){var b=a.changedTouches[0],c=null,d=getMouse(a);switch(a.type){case "touchstart":2==a.touches.length?(d.isdown=!1,d.scaling=0):c="mousedown";break;case "touchmove":if(null!=d.scaling&&2==a.touches.length){var e=Math.sqrt((a.touches[0].pageX-a.touches[1].pageX)*(a.touches[0].pageX-a.touches[1].pageX)+(a.touches[0].pageY-a.touches[1].pageY)*(a.touches[0].pageY-a.touches[1].pageY));0<d.scaling?(a.distance=e-d.scaling,d.handler.pinch&&d.handler.pinch(a,d),a.returnValue=!0):d.scaling=
e}else c="mousemove";break;case "touchend":null!=d.scaling?d.scaling=0==d.scaling?null:0:c="mouseup";break;default:return}1<a.touches.length&&(c=null);c&&(d=document.createEvent("MouseEvent"),d.initMouseEvent(c,!0,!0,window,1,b.screenX,b.screenY,b.clientX,b.clientY,a.ctrlKey,a.altKey,a.shiftKey,a.metaKey,0,null),b.target.dispatchEvent(d),a.preventDefault())}function Viewport(a,b,c,d){this.x=a;this.y=b;this.width=c;this.height=d}
function WebGL(a,b){this.program=null;this.modelView=new ViewMatrix;this.perspective=new ViewMatrix;this.textures=[];this.timer=null;if(!window.WebGLRenderingContext)throw"No browser WebGL support";try{this.gl=a.getContext("webgl",b)||a.getContext("experimental-webgl",b)}catch(c){throw OK.debug("detectGL exception: "+c),"No context";}this.viewport=new Viewport(0,0,a.width,a.height);if(!this.gl)throw"Failed to get context";}
WebGL.prototype.setMatrices=function(){this.gl.uniformMatrix4fv(this.program.mvMatrixUniform,!1,this.modelView.matrix);this.gl.uniformMatrix4fv(this.program.pMatrixUniform,!1,this.perspective.matrix);if(this.program.nMatrixUniform){var a=mat4.create(this.modelView.matrix);mat4.inverse(a);mat4.transpose(a);this.gl.uniformMatrix4fv(this.program.nMatrixUniform,!1,a)}};
WebGL.prototype.initDraw2d=function(){this.gl.viewport(this.viewport.x,this.viewport.y,this.viewport.width,this.viewport.height);this.gl.enableVertexAttribArray(this.program.attributes.aVertexPosition);this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.vertexPositionBuffer);this.gl.vertexAttribPointer(this.program.attributes.aVertexPosition,this.vertexPositionBuffer.itemSize,this.gl.FLOAT,!1,0,0);this.program.attributes.aTextureCoord&&(this.gl.enableVertexAttribArray(this.program.attributes.aTextureCoord),
this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.textureCoordBuffer),this.gl.vertexAttribPointer(this.program.attributes.aTextureCoord,this.textureCoordBuffer.itemSize,this.gl.FLOAT,!1,0,0));this.setMatrices()};WebGL.prototype.updateTexture=function(a,b,c){void 0==c&&(c=this.gl.TEXTURE0);this.gl.activeTexture(c);this.gl.bindTexture(this.gl.TEXTURE_2D,a);this.gl.texImage2D(this.gl.TEXTURE_2D,0,this.gl.RGBA,this.gl.RGBA,this.gl.UNSIGNED_BYTE,b);this.gl.bindTexture(this.gl.TEXTURE_2D,null)};
WebGL.prototype.init2dBuffers=function(a){void 0==a&&(a=this.gl.TEXTURE0);this.vertexPositionBuffer=this.gl.createBuffer();this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.vertexPositionBuffer);this.gl.bufferData(this.gl.ARRAY_BUFFER,new Float32Array([1,1,-1,1,1,-1,-1,-1]),this.gl.STATIC_DRAW);this.vertexPositionBuffer.itemSize=2;this.vertexPositionBuffer.numItems=4;this.gl.activeTexture(a);this.gradientTexture=this.gl.createTexture();this.gl.bindTexture(this.gl.TEXTURE_2D,this.gradientTexture);this.gl.texParameteri(this.gl.TEXTURE_2D,
this.gl.TEXTURE_MAG_FILTER,this.gl.NEAREST);this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.gl.NEAREST);this.textureCoordBuffer=this.gl.createBuffer();this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.textureCoordBuffer);this.gl.bufferData(this.gl.ARRAY_BUFFER,new Float32Array([1,1,0,1,1,0,0,0]),this.gl.STATIC_DRAW);this.textureCoordBuffer.itemSize=2;this.textureCoordBuffer.numItems=4};
WebGL.prototype.loadTexture=function(a,b){void 0==b&&(b=this.gl.NEAREST);this.texid=this.textures.length;this.textures.push(this.gl.createTexture());this.gl.bindTexture(this.gl.TEXTURE_2D,this.textures[this.texid]);this.gl.texImage2D(this.gl.TEXTURE_2D,0,this.gl.LUMINANCE,this.gl.LUMINANCE,this.gl.UNSIGNED_BYTE,a);this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MAG_FILTER,b);this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,b);this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_S,
this.gl.CLAMP_TO_EDGE);this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_T,this.gl.CLAMP_TO_EDGE);this.gl.bindTexture(this.gl.TEXTURE_2D,null);return this.textures[this.texid]};WebGL.prototype.setPerspective=function(a,b,c,d){this.perspective.matrix=mat4.perspective(a,b,c,d)};WebGL.prototype.use=function(a){this.program=a;this.program.program&&this.gl.useProgram(this.program.program)};
function WebGLProgram(a,b,c){this.program=null;0>b.indexOf("main")&&(b=getSourceFromElement(b));0>c.indexOf("main")&&(c=getSourceFromElement(c));this.gl=a;this.program&&this.gl.isProgram(this.program)&&(this.gl.isShader(this.vshader)&&(this.gl.detachShader(this.program,this.vshader),this.gl.deleteShader(this.vshader)),this.gl.isShader(this.fshader)&&(this.gl.detachShader(this.program,this.fshader),this.gl.deleteShader(this.fshader)),this.gl.deleteProgram(this.program));this.program=this.gl.createProgram();
this.vshader=this.compileShader(b,this.gl.VERTEX_SHADER);this.fshader=this.compileShader(c,this.gl.FRAGMENT_SHADER);this.gl.attachShader(this.program,this.vshader);this.gl.attachShader(this.program,this.fshader);this.gl.linkProgram(this.program);if(!this.gl.getProgramParameter(this.program,this.gl.LINK_STATUS))throw"Could not initialise shaders: "+this.gl.getProgramInfoLog(this.program);}
WebGLProgram.prototype.compileShader=function(a,b){var c=this.gl.createShader(b);this.gl.shaderSource(c,a);this.gl.compileShader(c);if(!this.gl.getShaderParameter(c,this.gl.COMPILE_STATUS))throw this.gl.getShaderInfoLog(c);return c};
WebGLProgram.prototype.setup=function(a,b,c){if(this.program){void 0==a&&(a=["aVertexPosition","aTextureCoord"]);this.attributes={};for(var d in a)this.attributes[a[d]]=this.gl.getAttribLocation(this.program,a[d]),c||this.gl.enableVertexAttribArray(this.attributes[a[d]]);this.uniforms={};for(d in b)this.uniforms[b[d]]=this.gl.getUniformLocation(this.program,b[d]);this.mvMatrixUniform=this.gl.getUniformLocation(this.program,"uMVMatrix");this.pMatrixUniform=this.gl.getUniformLocation(this.program,"uPMatrix");
this.nMatrixUniform=this.gl.getUniformLocation(this.program,"uNMatrix")}};function ViewMatrix(){this.matrix=mat4.create();mat4.identity(this.matrix);this.stack=[]}ViewMatrix.prototype.toString=function(){return JSON.stringify(this.toArray())};ViewMatrix.prototype.toArray=function(){return JSON.parse(mat4.str(this.matrix))};ViewMatrix.prototype.push=function(a){a?(this.stack.push(mat4.create(a)),this.matrix=mat4.create(a)):this.stack.push(mat4.create(this.matrix))};
ViewMatrix.prototype.pop=function(){if(0==this.stack.length)throw"Matrix stack underflow";return this.matrix=this.stack.pop()};ViewMatrix.prototype.mult=function(a){mat4.multiply(this.matrix,a)};ViewMatrix.prototype.identity=function(){mat4.identity(this.matrix)};ViewMatrix.prototype.scale=function(a){mat4.scale(this.matrix,a)};ViewMatrix.prototype.translate=function(a){mat4.translate(this.matrix,a)};ViewMatrix.prototype.rotate=function(a,b){mat4.rotate(this.matrix,a*Math.PI/180,b)};
function Palette(a,b){this.premultiply=b;this.background=new Colour("rgba(0,0,0,0)");this.colours=[];this.slider=new Image;this.slider.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAPCAYAAAA2yOUNAAAAj0lEQVQokWNIjHT8/+zZs//Pnj37/+TJk/9XLp/+f+bEwf9HDm79v2Prqv9aKrz/GUYVEaeoMDMQryJXayWIoi0bFmFV1NWS+z/E1/Q/AwMDA0NVcez/LRsWoSia2luOUAADVcWx/xfO6/1/5fLp/1N7y//HhlmhKoCBgoyA/w3Vyf8jgyyxK4CBUF8zDAUAAJRXY0G1eRgAAAAASUVORK5CYII=";if(a){for(var c=a.split("\n"),d,e=0;e<c.length;e++){var f=c[e].trim();
if(f)if(f=f.split("="),"Background"==f[0])this.background=new Colour(f[1]);else if("P"==f[0][0])d=parseFloat(f[1]);else if("C"==f[0][0]){if(this.colours.push(new ColourPos(f[1],d)),1==d)break}else f[0]&&this.colours.push(new ColourPos(f[1],f[0]))}this.sort();c=!1;for(d=0;d<this.colours.length;d++)0<this.colours[d].colour.alpha&&(c=!0),1<this.colours[d].colour.alpha&&(this.colours[d].colour.alpha=1);if(!c)for(d=0;d<this.colours.length;d++)this.colours[d].colour.alpha=1}else this.colours.push(new ColourPos("rgba(255,255,255,1)",
0)),this.colours.push(new ColourPos("rgba(0,0,0,1)",1))}Palette.prototype.sort=function(){this.colours.sort(function(a,b){return a.position-b.position})};Palette.prototype.newColour=function(a,b){var c=new ColourPos(b,a);this.colours.push(c);this.sort();for(c=1;c<this.colours.length-1;c++)if(this.colours[c].position==a)return c;return-1};Palette.prototype.inRange=function(a,b,c){for(var d=0;d<this.colours.length;d++){var e=this.colours[d].position*c;if(a==e||1<b&&a>=e-b/2&&a<=e+b/2)return d}return-1};
Palette.prototype.inDragRange=function(a,b,c){for(var d=1;d<this.colours.length-1;d++){var e=this.colours[d].position*c;if(a==e||1<b&&a>=e-b/2&&a<=e+b/2)return d}return 0};Palette.prototype.remove=function(a){this.colours.splice(a,1)};Palette.prototype.toString=function(){for(var a="Background="+this.background.html(),b=0;b<this.colours.length;b++)a+="\n"+this.colours[b].position.toFixed(6)+"="+this.colours[b].colour.html();return a};
Palette.prototype.toJSON=function(){var a={};a.background=this.background.html();a.colours=[];for(var b=0;b<this.colours.length;b++)a.colours.push({position:this.colours[b].position,colour:this.colours[b].colour.html()});return JSON.stringify(a)};
Palette.prototype.draw=function(a,b){if(!this.slider.width&&b){var c=this;setTimeout(function(){c.draw(a,b)},150)}else if(a){var d=/webkit/.test(navigator.userAgent.toLowerCase());0==this.colours.length&&(this.background=new Colour("#ffffff"),this.colours.push(new ColourPos("#000000",0)),this.colours.push(new ColourPos("#ffffff",1)));list=this.colours.slice(0);list.sort(function(a,b){return a.position-b.position});if(a.getContext){var e=a.width,f=a.height,g=a.getContext("2d");g.clearRect(0,0,e,f);
if(d)for(var h=0,d=1;d<list.length;d++){var k=Math.round(e*list[d].position);g.fillStyle=g.createLinearGradient(h,0,k,0);var l=list[d-1].colour,m=list[d].colour;this.premultiply&&!b&&(l=this.background.blend(l),m=this.background.blend(m));g.fillStyle.addColorStop(0,l.html());g.fillStyle.addColorStop(1,m.html());g.fillRect(h,0,k-h,f);h=k}else{g.fillStyle=g.createLinearGradient(0,0,e,0);for(d=0;d<list.length;d++)h=list[d].colour,this.premultiply&&!b&&(h=this.background.blend(h)),g.fillStyle.addColorStop(list[d].position,
h.html());g.fillRect(0,0,e,f)}if(f=document.getElementById("backgroundCUR"))f.style.background=this.background.html();if(b)for(d=1;d<list.length-1;d++)f=Math.floor(e*list[d].position)+.5,50<list[d].colour.HSV().V?g.strokeStyle="black":g.strokeStyle="white",g.beginPath(),g.moveTo(f,0),g.lineTo(f,a.height),g.closePath(),g.stroke(),f-=this.slider.width/2,g.drawImage(this.slider,f,0)}else alert("getContext failed!")}else alert("Invalid canvas!")};
function ColourPos(a,b){this.position=parseFloat(b);if(0<=this.position&&1>=this.position)this.colour=a?"object"==typeof a?a:new Colour(a):new Colour("#000000");else throw"Invalid Colour Position: "+b;}
function Colour(a){"undefined"==typeof a?this.set("#ffffff"):"string"==typeof a?this.set(a):"object"==typeof a?"undefined"!=typeof a.H?this.setHSV(a):"undefined"!=typeof a.red?(this.red=a.red,this.green=a.green,this.blue=a.blue,this.alpha=a.alpha):a.R?(this.red=a.R,this.green=a.G,this.blue=a.B,this.alpha="undefined"==typeof a.A?1:a.A):(this.red=a[0],this.green=a[1],this.blue=a[2],this.alpha="undefined"==typeof a[3]?1:a[3]):this.fromInt(a)}
Colour.prototype.set=function(a){a||(a="#ffffff");var b=/^rgba?\((\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,?\s*(\d\.?\d*)?\)$/.exec(a);b?(this.red=parseInt(b[1]),this.green=parseInt(b[2]),this.blue=parseInt(b[3]),this.alpha="undefined"==typeof b[4]?1:parseFloat(b[4])):"#"==a.charAt(0)?(a=a.substring(1,7),this.alpha=1,this.red=parseInt(a.substring(0,2),16),this.green=parseInt(a.substring(2,4),16),this.blue=parseInt(a.substring(4,6),16)):this.fromInt(parseInt(a))};
Colour.prototype.fromInt=function(a){this.red=a&255;this.green=(a&65280)>>>8;this.blue=(a&16711680)>>>16;this.alpha=((a&4278190080)>>>24)/255};Colour.prototype.toInt=function(){var a=this.red,a=a+(this.green<<8),a=a+(this.blue<<16);return a+=Math.round(255*this.alpha)<<24};Colour.prototype.toString=function(){return this.html()};Colour.prototype.html=function(){return"rgba("+this.red+","+this.green+","+this.blue+","+this.alpha.toFixed(2)+")"};
Colour.prototype.rgbaGL=function(){return new Float32Array([this.red/255,this.green/255,this.blue/255,this.alpha])};Colour.prototype.rgbaGLSL=function(){var a=this.rgbaGL();return"rgba("+a[0].toFixed(4)+","+a[1].toFixed(4)+","+a[2].toFixed(4)+","+a[3].toFixed(4)+")"};Colour.prototype.rgba=function(){return[this.red,this.green,this.blue,this.alpha]};Colour.prototype.rgbaObj=function(){return{R:this.red,G:this.green,B:this.blue,A:this.alpha}};Colour.prototype.print=function(){OK.debug(this.printString(!0))};
Colour.prototype.printString=function(a){return"R:"+this.red+" G:"+this.green+" B:"+this.blue+(a?" A:"+this.alpha:"")};Colour.prototype.HEX=function(a){a=Math.round(Math.min(Math.max(0,a),255));return"0123456789ABCDEF".charAt((a-a%16)/16)+"0123456789ABCDEF".charAt(a%16)};Colour.prototype.htmlHex=function(a){return"#"+this.HEX(this.red)+this.HEX(this.green)+this.HEX(this.blue)};Colour.prototype.hex=function(a){return this.HEX(255*this.alpha)+this.HEX(this.blue)+this.HEX(this.green)+this.HEX(this.red)};
Colour.prototype.setHSV=function(a){var b,c,d,e,f;f=a.S/100;var g=a.V/100,h=a.H/360;if(0<f){1<=h&&(h=0);h*=6;F=h-Math.floor(h);d=Math.round(255*g*(1-f));e=Math.round(255*g*(1-f*F));f=Math.round(255*g*(1-f*(1-F)));g=Math.round(255*g);switch(Math.floor(h)){case 0:b=g;c=f;e=d;break;case 1:b=e;c=g;e=d;break;case 2:b=d;c=g;e=f;break;case 3:b=d;c=e;e=g;break;case 4:b=f;c=d;e=g;break;case 5:b=g,c=d}this.red=b?b:0;this.green=c?c:0;this.blue=e?e:0}else this.blue=this.green=this.red=g=Math.round(255*g);this.alpha=
"undefined"==typeof a.A?1:a.A};Colour.prototype.HSV=function(){var a=this.red/255,b=this.green/255,c=this.blue/255,d=Math.min(a,b,c),e=Math.max(a,b,c);deltaMax=e-d;var f,g,h,k;0==deltaMax?d=f=0:(d=deltaMax/e,g=((e-a)/6+deltaMax/2)/deltaMax,h=((e-b)/6+deltaMax/2)/deltaMax,k=((e-c)/6+deltaMax/2)/deltaMax,a==e?f=k-h:b==e?f=1/3+g-k:c==e&&(f=2/3+h-g),0>f&&(f+=1),1<f&&(f-=1));return{H:360*f,S:100*d,V:100*e}};Colour.prototype.HSVA=function(){var a=this.HSV();a.A=this.alpha;return a};
Colour.prototype.interpolate=function(a,b){this.red=Math.round(this.red+b*(a.red-this.red));this.green=Math.round(this.green+b*(a.green-this.green));this.blue=Math.round(this.blue+b*(a.blue-this.blue));this.alpha=Math.round(this.alpha+b*(a.alpha-this.alpha))};Colour.prototype.blend=function(a){return new Colour([Math.round((1-a.alpha)*this.red+a.alpha*a.red),Math.round((1-a.alpha)*this.green+a.alpha*a.green),Math.round((1-a.alpha)*this.blue+a.alpha*a.blue),(1-a.alpha)*this.alpha+a.alpha*a.alpha])};
function MoveWindow(a){if(a){this.element=$(a);if(!this.element)return alert("No such element: "+a),null;this.mouse=new Mouse(this.element,this);this.mouse.moveUpdate=!0;this.element.mouse=this.mouse}}
MoveWindow.prototype.open=function(a,b){var c=this.element.style;0>a&&(a=0);0>b&&(b=0);void 0!=a&&(c.left=a+"px");void 0!=b&&(c.top=b+"px");c.display="block";var d=this.element.offsetWidth,e=this.element.offsetHeight;a+d>window.innerWidth-20&&(c.left=window.innerWidth-d-20+"px");b+e>window.innerHeight-20&&(c.top=window.innerHeight-e-20+"px")};MoveWindow.prototype.close=function(){this.element.style.display="none"};
MoveWindow.prototype.move=function(a,b){if(b.isdown&&!(0<b.button)){var c=b.element.style;c.left=parseInt(c.left)+b.deltaX+"px";c.top=parseInt(c.top)+b.deltaY+"px"}};MoveWindow.prototype.down=function(a,b){return!1};function scale(a,b,c,d){return clamp(d*a/b,c,d)}function clamp(a,b,c){return Math.max(b,Math.min(c,a))}
function ColourPicker(a,b){function c(a,b,c){var d=document.createElement("div");d.id=a;b&&(d.innerHTML=b);c&&(d.style.cssText=c);return d}var d=document.body;this.element=c("picker",null,"display:none; top: 58px; z-index: 20; background: #0d0d0d; color: #aaa; cursor: move; font-family: arial; font-size: 11px; padding: 7px 10px 11px 10px; position: fixed; width: 229px; border-radius: 5px; border: 1px solid #444;");var e=c("pickCURBG",null,'background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAIElEQVQ4jWP4TwAcOHAAL2YYNWBYGEBIASEwasCwMAAALvidroqDalkAAAAASUVORK5CYII="); float: left; width: 12px; height: 12px; margin-right: 3px;');
e.appendChild(c("pickCUR",null,"float: left; width: 12px; height: 12px; background: #fff; margin-right: 3px;"));this.element.appendChild(e);e=c("pickRGB","R: 255 G: 255 B: 255","float: left; position: relative; top: -1px;");e.onclick="colours.picker.updateString()";this.element.appendChild(e);this.element.appendChild(c("pickCLOSE","X","float: right; cursor: pointer; margin: 0 8px 3px;"));this.element.appendChild(c("pickOK","OK","float: right; cursor: pointer; margin: 0 8px 3px;"));e=c("SV",null,"position: relative; cursor: crosshair; float: left; height: 170px; width: 170px; margin-right: 10px; background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAEG0lEQVQ4jQEQBO/7APz8/Pz7+/vx+/v75Pr6+tb6+vrF+Pj4tPf396H4+PiO9/f3e/X19Wfz8/NU8PDwQuvr6zLi4uIjzs7OFZmZmQoA8PDw/O/v7/Ht7e3l7Ozs2Ozs7Mjq6uq35ubmpeXl5ZLf39+A3NzcbtXV1VvMzMxLvr6+O6ioqCyEhIQfQEBAFADk5OT84eHh8uDg4Obe3t7Z3Nzcy9nZ2brV1dWq0NDQmcrKyofCwsJ2uLi4ZKqqqlSYmJhFfX19N1lZWSsnJychANPT0/zT09Pz0NDQ6c3NzdzKysrNx8fHv8DAwK+6urqfsrKyj6mpqX+cnJxvjIyMX3l5eVBeXl5EPz8/ORsbGy8Aw8PD/MHBwfS+vr7qurq63ra2ttKxsbHErKystaOjo6eampqXj4+PiYODg3lycnJrXl5eX0hISFIuLi5IEBAQPwCwsLD9r6+v9aysrOynp6fioqKi1p2dncmVlZW8jo6OroODg6F5eXmUa2trhl1dXXlLS0ttNzc3YiIiIlkNDQ1RAJ6env2bm5v2l5eX7pSUlOWPj4/aiIiIz4GBgcN5eXm3cHBwq2RkZJ5XV1eSSkpKhzk5OX0qKipzGBgYawgICGMAioqK/YeHh/eDg4PvgICA6Hp6et90dHTVbW1ty2VlZcBcXFy1UVFRqkZGRqA6OjqWLS0tjSEhIYQSEhJ9BgYGdwB2dnb+c3Nz+HFxcfJra2vrZmZm42JiYttaWlrRUlJSyUtLS79CQkK2Nzc3rS0tLaQiIiKdGBgYlQ4ODo8EBASKAGNjY/5gYGD5XV1d9FpaWu5VVVXnTk5O4UlJSdlCQkLRPDw8yTQ0NMEqKiq7IiIisxkZGa0RERGmCgoKoQMDA5wAUFBQ/k9PT/pKSkr3R0dH8kNDQ+w+Pj7mOTk54DMzM9otLS3TJycnzSAgIMgZGRnBExMTvA0NDbcHBweyAwMDrwA9PT3+PDw8+zo6Ovg2Njb0MzMz8DAwMOwqKirnJSUl4iEhId4cHBzYFxcX1BISEtAODg7KCQkJxwQEBMQBAQHBAC0tLf4rKyv9Kioq+iYmJvclJSX0ISEh8R4eHu4aGhrqFhYW5xMTE+MQEBDgDQ0N3AgICNkGBgbWBAQE0wAAANEAHh4e/h0dHf0bGxv7Ghoa+hgYGPcWFhb2FBQU8xEREfEPDw/uDAwM7AoKCuoICAjoBgYG5gMDA+MBAQHiAAAA4QARERH+EBAQ/g8PD/0NDQ38DQ0N+wsLC/kKCgr4CAgI9wcHB/YFBQX0BAQE8wICAvIBAQHwAQEB7wAAAO8AAADuAAUFBf4FBQX+BAQE/gQEBP4DAwP+AwMD/QMDA/0CAgL8AQEB/AEBAfsAAAD7AAAA+wAAAPoAAAD6AAAA+QAAAPmq2NbsCl2m4wAAAABJRU5ErkJggg==') no-repeat; background-size: 100%;");
e.appendChild(c("SVslide",null,"background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAALUlEQVQYlWNgQAX/kTBW8B8ZYFMIk0ARQFaIoQCbQuopIspNRPsOrpABSzgBAFHzU61KjdKlAAAAAElFTkSuQmCC'); height: 9px; width: 9px; position: absolute; cursor: crosshair"));this.element.appendChild(e);e=c("H",null,'cursor: crosshair; float: left; height: 170px; position: relative; width: 19px; padding: 0;background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAIElEQVQ4jWP4TwAcOHAAL2YYNWBYGEBIASEwasCwMAAALvidroqDalkAAAAASUVORK5CYII=");');
e.appendChild(c("Hmodel",null,"position: relative;"));e.appendChild(c("Hslide",null,'top: 0px; left: -5px; background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAFCAYAAAC5Fuf5AAAAKklEQVQokWP4////fwY6gv////9n+A8F9LIQxVJaW4xiz4D5lB4WIlsMAPjER7mTpG/OAAAAAElFTkSuQmCC"); height: 5px; width: 29px; position: absolute; '));this.element.appendChild(e);e=c("O",null,'cursor: crosshair; float: left; height: 170px; position: relative; width: 19px; padding: 0;background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAIElEQVQ4jWP4TwAcOHAAL2YYNWBYGEBIASEwasCwMAAALvidroqDalkAAAAASUVORK5CYII=");border: 1px solid #888; left: 9px;');
e.appendChild(c("Omodel",null,"position: relative;"));e.appendChild(c("Oslide",null,'top: 0px; left: -5px; background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAFCAYAAAC5Fuf5AAAAKklEQVQokWP4////fwY6gv////9n+A8F9LIQxVJaW4xiz4D5lB4WIlsMAPjER7mTpG/OAAAAAElFTkSuQmCC"); height: 5px; width: 29px; position: absolute; '));this.element.appendChild(e);d.appendChild(this.element);d=document.createElement("style");d.styleSheet?d.styleSheet.cssText="#pickRGB:hover {color: #FFD000;} #pickCLOSE:hover {color: #FFD000;} #pickOK:hover {color: #FFD000;}":
d.appendChild(document.createTextNode("#pickRGB:hover {color: #FFD000;} #pickCLOSE:hover {color: #FFD000;} #pickOK:hover {color: #FFD000;}"));document.getElementsByTagName("head")[0].appendChild(d);MoveWindow.call(this,"picker");this.savefn=a;this.abortfn=b;this.size=170;this.sv=5;this.oh=2;this.picked={H:360,S:100,V:100,A:1};this.max={H:360,S:100,V:100,A:1};this.colour=new Colour;for(var e="",f,d=0;d<=this.size;d++)f=new Colour({H:Math.round(360/this.size*d),S:100,V:100,A:1}),e+="<div class='hue' style='height: 1px; width: 19px; margin: 0; padding: 0; background: "+
f.htmlHex()+";'> </div>";$("Hmodel").innerHTML=e;e="";for(d=0;d<=this.size;d++)f=1-d/this.size,e+="<div class='opacity' style='height: 1px; width: 19px; margin: 0; padding: 0; background: #000;opacity: "+f.toFixed(2)+";'> </div>";$("Omodel").innerHTML=e}ColourPicker.prototype=new MoveWindow;ColourPicker.prototype.constructor=MoveWindow;ColourPicker.prototype.pick=function(a,b,c){this.update(a.HSVA());"block"!=this.element.style.display&&MoveWindow.prototype.open.call(this,b,c)};
ColourPicker.prototype.select=function(a,b,c){if(!b||!c){var d=findElementPos(a);b=b?b:d[0]+32;c=c?c:d[1]+32}d=new Colour(a.style.backgroundColor);this.update(d.HSVA());"block"!=this.element.style.display&&(MoveWindow.prototype.open.call(this,b,c),this.target=a)};
ColourPicker.prototype.click=function(a,b){if("pickCLOSE"==b.target.id)this.abortfn&&this.abortfn(),toggle("picker");else if("pickOK"==b.target.id){this.savefn&&this.savefn(this.picked);if(this.target){var c=new Colour(this.picked);this.target.style.backgroundColor=c.html()}toggle("picker")}else"SV"==b.target.id?this.setSV(b):"Hslide"==b.target.id||"hue"==b.target.className?this.setHue(b):"Oslide"!=b.target.id&&"opacity"!=b.target.className||this.setOpacity(b)};
ColourPicker.prototype.move=function(a,b){b.isdown&&0==b.button&&("picker"==b.target.id||"pickCUR"==b.target.id||"pickRGB"==b.target.id?MoveWindow.prototype.move.call(this,a,b):b.target&&this.click(a,b))};ColourPicker.prototype.wheel=function(a,b){this.incHue(-a.spin)};ColourPicker.prototype.setSV=function(a){var b=a.clientx-parseInt($("SV").offsetLeft);a=a.clienty-parseInt($("SV").offsetTop);this.picked.S=scale(b,this.size,0,this.max.S);this.picked.V=this.max.V-scale(a,this.size,0,this.max.V);this.update(this.picked)};
ColourPicker.prototype.setHue=function(a){parseInt($("H").offsetLeft);a=a.clienty-parseInt($("H").offsetTop);this.picked.H=scale(a,this.size,0,this.max.H);this.update(this.picked)};ColourPicker.prototype.incHue=function(a){this.picked.H+=a;this.picked.H=clamp(this.picked.H,0,this.max.H);this.update(this.picked)};ColourPicker.prototype.setOpacity=function(a){parseInt($("O").offsetLeft);a=a.clienty-parseInt($("O").offsetTop);this.picked.A=1-clamp(a/this.size,0,1);this.update(this.picked)};
ColourPicker.prototype.updateString=function(a){a||(a=prompt("Edit colour:",this.colour.html()));a&&(this.colour=new Colour(a),this.update(this.colour.HSV()))};
ColourPicker.prototype.update=function(a){this.picked=a;this.colour=new Colour(a);rgba=this.colour.rgbaObj();rgbaStr=this.colour.html();bgcol=new Colour({H:a.H,S:100,V:100,A:255});$("pickRGB").innerHTML=this.colour.printString();$S("pickCUR").background=rgbaStr;$S("pickCUR").backgroundColour=rgbaStr;$S("SV").backgroundColor=bgcol.htmlHex();$S("Hslide").top=a.H/360*this.size-this.oh+"px";$S("SVslide").top=Math.round(this.size-a.V/100*this.size-this.sv)+"px";$S("SVslide").left=Math.round(a.S/100*this.size-
this.sv)+"px";$S("Oslide").top=this.size*(1-a.A)-this.oh-1+"px"};function GradientEditor(a,b,c,d,e){this.canvas=a;this.callback=b;this.premultiply=c;this.changed=!0;this.inserting=!1;this.element=this.editing=null;this.spin=0;this.scrollable=e;d||(this.picker=new ColourPicker(this.save.bind(this),this.cancel.bind(this)));this.palette=new Palette(null,c);this.canvas.mouse=new Mouse(this.canvas,this);this.canvas.oncontextmenu="return false;";this.canvas.oncontextmenu=function(){return!1}}
GradientEditor.prototype.read=function(a){this.palette=new Palette(a,this.premultiply);this.reset();this.update(!0)};GradientEditor.prototype.update=function(a){this.changed=!0;this.palette.draw(this.canvas,!0);!a&&this.callback&&this.callback(this)};GradientEditor.prototype.get=function(a,b){if(b&&!this.changed)return!1;this.changed=!1;this.palette.draw(a,!1);return!0};
GradientEditor.prototype.insert=function(a,b,c){this.inserting=!0;var d=new Colour;this.editing=this.palette.newColour(a,d);this.update();this.picker.pick(d,b,c)};GradientEditor.prototype.editBackground=function(a){this.editing=-1;var b=findElementPos(a);this.element=a;this.picker.pick(this.palette.background,b[0]+32,b[1]+32)};
GradientEditor.prototype.edit=function(a,b,c){"number"==typeof a?(this.editing=a,this.picker.pick(this.palette.colours[a].colour,b,c)):"object"==typeof a&&(this.cancel(),this.element=a,b=new Colour(a.style.backgroundColor),a=findElementPos(a),this.picker.pick(b,a[0]+32,a[1]+32));this.update()};
GradientEditor.prototype.save=function(a){null!=this.editing&&(0<=this.editing?this.palette.colours[this.editing].colour.setHSV(a):this.palette.background.setHSV(a));if(this.element){var b=new Colour(0);b.setHSV(a);this.element.style.backgroundColor=b.html();if(this.element.onchange)this.element.onchange()}this.reset();this.update()};GradientEditor.prototype.cancel=function(){0<=this.editing&&this.inserting&&this.palette.remove(this.editing);this.reset();this.update()};
GradientEditor.prototype.reset=function(){this.inserting=!1;this.element=this.editing=null};
GradientEditor.prototype.click=function(a,b){if(a.ctrlKey){for(var c=0;c<this.palette.colours.length;c++)this.palette.colours[c].position=1-this.palette.colours[c].position;this.update();return!1}this.scrollable||(b.x=b.clientx);if(null!=b.slider)return b.slider=null,this.palette.sort(),this.update(),!1;var d=this.canvas;if(d.getContext){this.cancel();d.getContext("2d");var e=findElementPos(d)[1]+30,c=this.palette.inRange(b.x,this.palette.slider.width,d.width);0<=c?0==a.button?this.edit(c,a.clientX-
128,e):2==a.button&&(this.palette.remove(c),this.update()):this.insert(b.x/d.width,a.clientX-128,e)}return!1};GradientEditor.prototype.down=function(a,b){return!1};
GradientEditor.prototype.move=function(a,b){if(!b.isdown)return!0;this.scrollable||(b.x=b.clientx);if(null==b.slider){var c=this.palette.inDragRange(b.x,this.palette.slider.width,this.canvas.width);0<c&&(b.slider=c)}null==b.slider?b.isdown=!1:(1>b.x&&(b.x=1),b.x>this.canvas.width-1&&(b.x=this.canvas.width-1),this.palette.colours[b.slider].position=b.x/this.canvas.width,this.update(!0))};
GradientEditor.prototype.wheel=function(a,b){this.timer?clearTimeout(this.timer):this.canvas.style.cursor="wait";this.spin+=.01*a.spin;var c=this;this.timer=setTimeout(function(){c.cycle(c.spin);c.spin=0},150)};GradientEditor.prototype.leave=function(a,b){};
GradientEditor.prototype.cycle=function(a){this.canvas.style.cursor="default";this.timer=null;for(var b=1;b<this.palette.colours.length-1;b++){var c=this.palette.colours[b].position,c=c+a;0>=c&&(c+=1);1<=c&&(c-=1);this.palette.colours[b].position=c}this.palette.sort();this.update()};
