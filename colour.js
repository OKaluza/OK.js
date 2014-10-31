  /**
   * @constructor
   */
  function Palette(source, premultiply) {
    this.premultiply = premultiply;
    //Default transparent black background
    this.background = new Colour("rgba(0,0,0,0)");
    //Colour palette array
    this.colours = [];
    this.slider = new Image();
    this.slider.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAPCAYAAAA2yOUNAAAAj0lEQVQokWNIjHT8/+zZs//Pnj37/+TJk/9XLp/+f+bEwf9HDm79v2Prqv9aKrz/GUYVEaeoMDMQryJXayWIoi0bFmFV1NWS+z/E1/Q/AwMDA0NVcez/LRsWoSia2luOUAADVcWx/xfO6/1/5fLp/1N7y//HhlmhKoCBgoyA/w3Vyf8jgyyxK4CBUF8zDAUAAJRXY0G1eRgAAAAASUVORK5CYII=";

    if (!source) {
      //Default greyscale
      this.colours.push(new ColourPos("rgba(255,255,255,1)", 0));
      this.colours.push(new ColourPos("rgba(0,0,0,1)", 1.0));
      return;
    }

    //Palette data parser
    var lines = source.split("\n"); // split on newlines
    var position;
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      if (!line) continue;

      //Palette: parse into attrib=value pairs
      var pair = line.split("=");
      if (pair[0] == "Background")
        this.background = new Colour(pair[1]);
      else if (pair[0][0] == "P") //PositionX=
        position = parseFloat(pair[1]);
      else if (pair[0][0] == "C") { //ColourX=
        //Colour constructor handles html format colours, if no # or rgb/rgba assumes integer format
        this.colours.push(new ColourPos(pair[1], position));
        //Some old palettes had extra colours at end which screws things up so check end position
        if (position == 1.0) break;
      } else if (pair[0])
        //New style: position=value
        this.colours.push(new ColourPos(pair[1], pair[0]));
    }

    //Sort by position (fix out of order entries in old palettes)
    this.sort();

    //Check for all-transparent palette and fix
    var opaque = false;
    for (var c = 0; c < this.colours.length; c++) {
      if (this.colours[c].colour.alpha > 0) opaque = true;
      //Fix alpha=255
      if (this.colours[c].colour.alpha > 1.0)
        this.colours[c].colour.alpha = 1.0;
    }
    if (!opaque) {
      for (var c = 0; c < this.colours.length; c++)
        this.colours[c].colour.alpha = 1.0;
    }
  }

  Palette.prototype.sort = function() {
    this.colours.sort(function(a,b){return a.position - b.position});
  }

  Palette.prototype.newColour = function(position, colour) {
    var col = new ColourPos(colour, position);
    this.colours.push(col);
    this.sort();
    for (var i = 1; i < this.colours.length-1; i++)
      if (this.colours[i].position == position) return i;
    return -1;
  }

  Palette.prototype.inRange = function(pos, range, length) {
    for (var i = 0; i < this.colours.length; i++)
    {
      var x = this.colours[i].position * length;
      if (pos == x || (range > 1 && pos >= x - range / 2 && pos <= x + range / 2))
        return i;
    }
    return -1;
  }

  Palette.prototype.inDragRange = function(pos, range, length) {
    for (var i = 1; i < this.colours.length-1; i++)
    {
      var x = this.colours[i].position * length;
      if (pos == x || (range > 1 && pos >= x - range / 2 && pos <= x + range / 2))
        return i;
    }
    return 0;
  }

  Palette.prototype.remove = function(i) {
    this.colours.splice(i,1);
  }

  Palette.prototype.toString = function() {
    var paletteData = 'Background=' + this.background.html();
    for (var i = 0; i < this.colours.length; i++)
      paletteData += '\n' + this.colours[i].position.toFixed(6) + '=' + this.colours[i].colour.html();
    return paletteData;
  }

  //Palette draw to canvas
  Palette.prototype.draw = function(canvas, ui) {
    //Slider image not yet loaded?
    if (!this.slider.width && ui) {
      var _this = this;
      setTimeout(function() { _this.draw(canvas, ui); }, 150);
      return;
    }
    
    // Figure out if a webkit browser is being used
    if (!canvas) {alert("Invalid canvas!"); return;}
    var webkit = /webkit/.test(navigator.userAgent.toLowerCase());

    if (this.colours.length == 0) {
      this.background = new Colour("#ffffff");
      this.colours.push(new ColourPos("#000000", 0));
      this.colours.push(new ColourPos("#ffffff", 1));
    }

    //Colours might be out of order (especially during editing)
    //so save a (shallow) copy and sort it
    list = this.colours.slice(0);
    list.sort(function(a,b){return a.position - b.position});

    if (canvas.getContext) {
      //Draw the gradient(s)
      var width = canvas.width;
      var height = canvas.height;
      var context = canvas.getContext('2d');  
      context.clearRect(0, 0, width, height);

      if (webkit) {
        //Split up into sections or webkit draws a fucking awful gradient with banding
        var x0 = 0;
        for (var i = 1; i < list.length; i++) {
          var x1 = Math.round(width * list[i].position);
          context.fillStyle = context.createLinearGradient(x0, 0, x1, 0);
          var colour1 = list[i-1].colour;
          var colour2 = list[i].colour;
          //Pre-blend with background unless in UI mode
          if (this.premultiply && !ui) {
            colour1 = this.background.blend(colour1);
            colour2 = this.background.blend(colour2);
          }
          context.fillStyle.addColorStop(0.0, colour1.html());
          context.fillStyle.addColorStop(1.0, colour2.html());
          context.fillRect(x0, 0, x1-x0, height);
          x0 = x1;
        }
      } else {
        //Single gradient
        context.fillStyle = context.createLinearGradient(0, 0, width, 0);
        for (var i = 0; i < list.length; i++) {
          var colour = list[i].colour;
          //Pre-blend with background unless in UI mode
          if (this.premultiply && !ui)
            colour = this.background.blend(colour);
          context.fillStyle.addColorStop(list[i].position, colour.html());
        }
        context.fillRect(0, 0, width, height);
      }

      /* Posterise mode (no gradients)
      var x0 = 0;
      for (var i = 1; i < list.length; i++) {
        var x1 = Math.round(width * list[i].position);
        //Pre-blend with background unless in UI mode
        var colour2 = ui ? list[i].colour : this.background.blend(list[i].colour);
        context.fillStyle = colour2.html();
        context.fillRect(x0, 0, x1-x0, height);
        x0 = x1;
      }
      */

      //Background colour
      var bg = document.getElementById('backgroundCUR');
      if (bg) bg.style.background = this.background.html();

      //User interface controls
      if (!ui) return;  //Skip drawing slider interface
      for (var i = 1; i < list.length-1; i++)
      {
        var x = Math.floor(width * list[i].position) + 0.5;
        var HSV = list[i].colour.HSV();
        if (HSV.V > 50)
          context.strokeStyle = "black";
        else
          context.strokeStyle = "white";
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, canvas.height);
        context.closePath();
        context.stroke();
        x -= (this.slider.width / 2);
        context.drawImage(this.slider, x, 0);  
      } 
    } else alert("getContext failed!");
  }


  /**
   * @constructor
   */
  function ColourPos(colour, pos) {
    //Stores colour as rgba and position as real [0,1]
    this.position = parseFloat(pos);
    //Detect out of range...
    if (this.position >= 0 && this.position <= 1) {
      if (colour) {
        if (typeof(colour) == 'object')
          this.colour = colour;
        else
          this.colour = new Colour(colour);
      } else {
        this.colour = new Colour("#000000");
      }
    } else {
      throw( "Invalid Colour Position: " + pos);
    }
  }
  
  /**
   * @constructor
   */
  function Colour(colour) {
    //Construct... stores colour as r,g,b,a values
    //Can pass in html colour string, HSV object, Colour object or integer rgba
    if (typeof colour == "undefined")
      this.set("#ffffff")
    else if (typeof(colour) == 'string')
      this.set(colour);
    else if (typeof(colour) == 'object') {
      //Determine passed type, Colour, RGBA or HSV
      if (typeof colour.H != "undefined")
        //HSV
        this.setHSV(colour);
      else if (typeof colour.red != "undefined") {
        //Another Colour object
        this.red = colour.red;
        this.green = colour.green;
        this.blue = colour.blue;
        this.alpha = colour.alpha;
      } else if (colour.R) {
        //RGBA
        this.red = colour.R;
        this.green = colour.G;
        this.blue = colour.B;
        this.alpha = typeof colour.A == "undefined" ? 1.0 : colour.A;
      } else {
        //Assume array
        this.red = colour[0];
        this.green = colour[1];
        this.blue = colour[2];
        this.alpha = typeof colour[3] == "undefined" ? 1.0 : colour[3];
      }
    } else {
      //Convert from integer AABBGGRR
      this.fromInt(colour);
    }
  }

  Colour.prototype.set = function(val) {
    if (!val) val = "#ffffff"; //alert("No Value provided!");
    var re = /^rgba?\((\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,?\s*(\d\.?\d*)?\)$/;
    var bits = re.exec(val);
    if (bits)
    {
      this.red = parseInt(bits[1]);
      this.green = parseInt(bits[2]);
      this.blue = parseInt(bits[3]);
      this.alpha = typeof bits[4] == "undefined" ? 1.0 : parseFloat(bits[4]);

    } else if (val.charAt(0) == "#") {
      var hex = val.substring(1,7);
      this.alpha = 1.0;
      this.red = parseInt(hex.substring(0,2),16);
      this.green = parseInt(hex.substring(2,4),16);
      this.blue = parseInt(hex.substring(4,6),16);
    } else {
      //Attempt to parse as integer
      this.fromInt(parseInt(val));
    }
  }

  Colour.prototype.fromInt = function(intcolour) {
    //Convert from integer AABBGGRR
    this.red = (intcolour&0x000000ff);
    this.green = (intcolour&0x0000ff00) >>> 8;
    this.blue = (intcolour&0x00ff0000) >>> 16;
    this.alpha = ((intcolour&0xff000000) >>> 24) / 255.0;
  }

  Colour.prototype.toInt = function() {
    //Convert to integer AABBGGRR
    var result = this.red;
    result += (this.green << 8);
    result += (this.blue << 16);
    result += (Math.round(this.alpha * 255) << 24);
    return result;
  }

  Colour.prototype.toString = function() {return this.html();}

  Colour.prototype.html = function() {
    return "rgba(" + this.red + "," + this.green + "," + this.blue + "," + this.alpha + ")";
  }

  Colour.prototype.rgbaGL = function() {
    var arr = [this.red/255.0, this.green/255.0, this.blue/255.0, this.alpha];
    return new Float32Array(arr);
  }

  Colour.prototype.rgbaGLSL = function() {
    var c = this.rgbaGL();
    return "rgba(" + c[0].toFixed(4) + "," + c[1].toFixed(4) + "," + c[2].toFixed(4) + "," + c[3].toFixed(4) + ")";
  }

  Colour.prototype.rgba = function() {
    var rgba = [this.red, this.green, this.blue, this.alpha];
    return rgba;
  }

  Colour.prototype.rgbaObj = function() {
  //OK.debug('R:' + this.red + ' G:' + this.green + ' B:' + this.blue + ' A:' + this.alpha);
    return({'R':this.red, 'G':this.green, 'B':this.blue, 'A':this.alpha});
  }

  Colour.prototype.print = function() {
    OK.debug(this.printString(true));
  }

  Colour.prototype.printString = function(alpha) {
    return 'R:' + this.red + ' G:' + this.green + ' B:' + this.blue + (alpha ? ' A:' + this.alpha : '');
  }

  Colour.prototype.HEX = function(o) {
     o = Math.round(Math.min(Math.max(0,o),255));
     return("0123456789ABCDEF".charAt((o-o%16)/16)+"0123456789ABCDEF".charAt(o%16));
   }

  Colour.prototype.htmlHex = function(o) { 
    return("#" + this.HEX(this.red) + this.HEX(this.green) + this.HEX(this.blue)); 
  };

  Colour.prototype.hex = function(o) { 
    return(this.HEX(this.red) + this.HEX(this.green) + this.HEX(this.blue) + this.HEX(this.alpha*255)); 
  };

  Colour.prototype.setHSV = function(o)
  {
    var R, G, A, B, C, S=o.S/100, V=o.V/100, H=o.H/360;

    if(S>0) { 
      if(H>=1) H=0;

      H=6*H; F=H-Math.floor(H);
      A=Math.round(255*V*(1-S));
      B=Math.round(255*V*(1-(S*F)));
      C=Math.round(255*V*(1-(S*(1-F))));
      V=Math.round(255*V); 

      switch(Math.floor(H)) {
          case 0: R=V; G=C; B=A; break;
          case 1: R=B; G=V; B=A; break;
          case 2: R=A; G=V; B=C; break;
          case 3: R=A; G=B; B=V; break;
          case 4: R=C; G=A; B=V; break;
          case 5: R=V; G=A; B=B; break;
      }

      this.red = R ? R : 0;
      this.green = G ? G : 0;
      this.blue = B ? B : 0;
    } else {
      this.red = (V=Math.round(V*255));
      this.green = V;
      this.blue = V;
    }
    this.alpha = typeof o.A == "undefined" ? 1.0 : o.A;
  }

  Colour.prototype.HSV = function() {
    var r = ( this.red / 255.0 );                   //RGB values = 0 ÷ 255
    var g = ( this.green / 255.0 );
    var b = ( this.blue / 255.0 );

    var min = Math.min( r, g, b );    //Min. value of RGB
    var max = Math.max( r, g, b );    //Max. value of RGB
    deltaMax = max - min;             //Delta RGB value

    var v = max;
    var s, h;
    var deltaRed, deltaGreen, deltaBlue;

    if ( deltaMax == 0 )                     //This is a gray, no chroma...
    {
       h = 0;                               //HSV results = 0 ÷ 1
       s = 0;
    }
    else                                    //Chromatic data...
    {
       s = deltaMax / max;

       deltaRed = ( ( ( max - r ) / 6 ) + ( deltaMax / 2 ) ) / deltaMax;
       deltaGreen = ( ( ( max - g ) / 6 ) + ( deltaMax / 2 ) ) / deltaMax;
       deltaBlue = ( ( ( max - b ) / 6 ) + ( deltaMax / 2 ) ) / deltaMax;

       if      ( r == max ) h = deltaBlue - deltaGreen;
       else if ( g == max ) h = ( 1 / 3 ) + deltaRed - deltaBlue;
       else if ( b == max ) h = ( 2 / 3 ) + deltaGreen - deltaRed;

       if ( h < 0 ) h += 1;
       if ( h > 1 ) h -= 1;
    }

    return({'H':360*h, 'S':100*s, 'V':v*100});
  }

  Colour.prototype.HSVA = function() {
    var hsva = this.HSV();
    hsva.A = this.alpha;
    return hsva;
  }

  Colour.prototype.interpolate = function(other, lambda) {
    //Interpolate between this colour and another by lambda
    this.red = Math.round(this.red + lambda * (other.red - this.red));
    this.green = Math.round(this.green + lambda * (other.green - this.green));
    this.blue = Math.round(this.blue + lambda * (other.blue - this.blue));
    this.alpha = Math.round(this.alpha + lambda * (other.alpha - this.alpha));
  }

  Colour.prototype.blend = function(src) {
    //Blend this colour with another and return result (uses src alpha from other colour)
    return new Colour([
      Math.round((1.0 - src.alpha) * this.red + src.alpha * src.red),
      Math.round((1.0 - src.alpha) * this.green + src.alpha * src.green),
      Math.round((1.0 - src.alpha) * this.blue + src.alpha * src.blue),
      (1.0 - src.alpha) * this.alpha + src.alpha * src.alpha
    ]);
  }

