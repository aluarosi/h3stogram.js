/**
 * This file is part of H3stogram
 * (Interactive Three Dimensional Color Histogram)
 * https://github.com/aluarosi/h3stogram.js
 * 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2013  Alvaro Santamaria Herrero (aluarosi)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

H3 = {};

H3.H3stogram = function(bits_per_channel, bytes_per_point, type){
/**
 *  H3stogram   :   constructor for 3D Histogram
 *      bits_per_channel    :   
 *      bytes_per_point     :   1,2,4
 *      type                :   "rgb","lab"
 *
*/
    this.bits_per_channel   =   typeof bits_per_channel === 'number' &&
                                bits_per_channel > 0 && bits_per_channel <= 8 
                                ?
                                bits_per_channel | 0
                                :
                                6;
    
    this.bytes_per_point    =   typeof bytes_per_point === "number" &&
                                [1,2,4].indexOf(bytes_per_point) !== -1
                                ?
                                bytes_per_point
                                :   
                                2;
    this.type               =   typeof type === "string" &&
                                ["rgb","lab"].indexOf(type) !== -1
                                ?
                                type
                                :  
                                "rgb"; 
    
    var UintNArray = {
        1   :   Uint8Array,
        2   :   Uint16Array,
        4   :   Uint32Array 
    };
    this.data   = new UintNArray[this.bytes_per_point]( Math.pow(2,3*this.bits_per_channel) );
    // TODO: check if the array is all 0's
    
    // Auxiliar
    this.bsize = Math.pow(2,this.bits_per_channel); // Block size, to be used by functions, it is better to calculate it only once
    
}

H3.H3stogram.prototype.loadFromCanvas = function(canvas){
    var w = canvas.width;
    var h = canvas.height;
    var ctx = canvas.getContext("2d");
    var image_data = ctx.getImageData(0,0,w,h);
    var data = image_data.data
    var r,g,b;
    for (var i=0; i<data.length; i=i+4){
        // 4 bytes blocks : RGBA
        r = data[i];
        g = data[i+1];
        b = data[i+2];
        this.incrementColor([r,g,b]); 
    } 
}

H3.H3stogram.prototype.reset = function(){
    for (var i=0; i<this.data.length; i++){
        this.data[i] = 0;
    } 
}

H3.H3stogram.prototype.max = function(){
    var max = 0;
    for (var i=1; i<this.data.length; i++){
        max = Math.max(this.data[i],max);
    } 
    return max;
}

H3.H3stogram.prototype.getPoint = function(point){
    var index = this.pointToIndex(point);
    var value = this.data[index];
    return value 
}

H3.H3stogram.prototype.getColor = function(color){
    return this.getPoint(this.colorToPoint(color));
}

H3.H3stogram.prototype.incrementColor = function(color){
    var point = this.colorToPoint(color);
    var index = this.pointToIndex(point);
    this.data[index] = this.data[index] +1;
}

H3.H3stogram.prototype.pointToIndex = function(point){
    var x,y,z;
    x = point[0];
    y = point[1];
    z = point[2];
    var index;
    index = x*this.bsize*this.bsize + y*this.bsize + z;
    return index 
}

H3.H3stogram.prototype.colorToPoint = function(color){
    var r,g,b;
    r = color[0];
    g = color[1];
    b = color[2];
    var ratio = Math.pow(2, 8-this.bits_per_channel);
    var rr, gg, bb;
    x = r/ratio | 0;
    y = g/ratio | 0;
    z = b/ratio | 0;
    return [x,y,z] 
}

H3.H3stogram.prototype.pointToColor = function(point){
    var x,y,z;
    x = point[0];
    y = point[1];
    z = point[2];
    var ratio = Math.pow(2, 8-this.bits_per_channel);
    //r = (x)*ratio;
    //g = (y)*ratio;
    //b = (z)*ratio;
    r = (x+0.5)*ratio;
    g = (y+0.5)*ratio;
    b = (z+0.5)*ratio;
    //// Take the "ceiling" of the color for that point
    //r = (x+1)*ratio-1;
    //g = (y+1)*ratio-1;
    //b = (z+1)*ratio-1;
    return [r,g,b]
}

H3.H3stogram.prototype.indexToPoint = function(index){
    var remainder = index;
    var x,y,z;
    var bs = this.bsize;
    var point;
    var color;

    x = (remainder / (bs*bs)) | 0;
    remainder = remainder - x*bs*bs;
    y = (remainder / bs) | 0;
    remainder = remainder - y*bs;
    z = remainder;
    
    point = [x,y,z];
    return point;
}

H3.H3stogram.prototype.indexToColor = function(index){
    var color =  this.pointToColor(this.indexToPoint(index)); 
    return color;
}

//EVENTIFY the prototype/class
EVENT.eventify( H3.H3stogram.prototype );
