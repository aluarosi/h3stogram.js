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

/**
    VISUALIZER
 */
H3VIS = {};

H3VIS.H3Visualizer = function(spec){
    // Validate spec
    var spec = typeof spec !== "undefined" ? spec : {};
    this.size = typeof spec.size === "number" && spec.size ? spec.size : 2;
    this.histogram = typeof spec.histogram !== "undefined" ? spec.histogram : new H3.H3stogram(6);
    this.mode = typeof spec.mode !== "undefined" ? spec.mode : "bubble";
    this.wireframe = typeof spec.wireframe !== "undefined" && spec.wireframe === true ? true : false;
    this.threshold = typeof spec.threshold === "number" && spec.threshold >=0 && spec.threshold <=1 
                                    ?   
                                    spec.threshold
                                    :
                                    0.0; 
    this.opacity_factor = typeof spec.opacity_factor !== "undefined" ? spec.opacity_factor : 1.0;
    this.size_factor = typeof spec.size_factor !== "undefined" ? spec.size_factor : 1.0;
    this.show_cube_frame = typeof spec.show_cube_frame !== "undefined" ? spec.show_cube_frame : false;

    this.selected_color = null;  // 3-tuple with [r,g,b]

    // Extend Cosa
    COSA.Cosa.call(this, spec);
    
    // Children
    this.children = {
        cloud   :   new H3VIS.Cloud(this)
    }

    //Position children
    var that = this;
    this.children.cloud.setPos3D = function(position_3d){
    }
}

H3VIS.H3Visualizer.prototype = Object.create( COSA.Cosa.prototype );

H3VIS.H3Visualizer.prototype.setSelectedColor = function(pixel_color){
    this.selected_color = pixel_color;
    this.children.cloud.rebuild();
}

H3VIS.H3Visualizer.prototype.resetSelectedColor = function(){
    this.selected_color = null;
    this.children.cloud.rebuild();
}

H3VIS.H3Visualizer.prototype.updatedHistogram = function(emitter, event_data){
    this.histogram = emitter; //This allows to 'hijack' the visualizer to a new histogram3d
    this.children.cloud.rebuild();
}

H3VIS.H3Visualizer.prototype.setVisualizationMode = function(mode){
    this.mode = mode;
    this.children.cloud.rebuild();
}

H3VIS.H3Visualizer.prototype.setWireframe = function(wireframe){
    this.wireframe = wireframe;
    this.children.cloud.rebuild();
}

H3VIS.H3Visualizer.prototype.setThreshold = function(threshold){
    this.threshold = threshold;
    this.children.cloud.rebuild();
}

H3VIS.H3Visualizer.prototype.setOpacityFactor = function(factor){
    this.opacity_factor = factor;
    this.children.cloud.rebuild();
}

H3VIS.H3Visualizer.prototype.setSizeFactor = function(factor){
    this.size_factor = factor;
    this.children.cloud.rebuild();
}

H3VIS.H3Visualizer.prototype.paint = function(object_3d){
    var o = object_3d;

    var light = new THREE.HemisphereLight(0xffffff,0x777777);
    light.position.set(0,this.size,0);
    o.add(light);

    /**
     * CUBE
     */
    if ( this.show_cube_frame) {
        var v = [
            new THREE.Vector3( 0,0,0 ),
            new THREE.Vector3( 0,0,1 ),
            new THREE.Vector3( 0,1,0 ),
            new THREE.Vector3( 0,1,1 ),
            new THREE.Vector3( 1,0,0 ),
            new THREE.Vector3( 1,0,1 ),
            new THREE.Vector3( 1,1,0 ),
            new THREE.Vector3( 1,1,1 )
        ];
        var c = [
            new THREE.Color( "black" ),
            new THREE.Color( "blue" ),
            new THREE.Color( "green" ),
            new THREE.Color( "cyan" ),
            new THREE.Color( "red" ),
            new THREE.Color( "magenta" ),
            new THREE.Color( "yellow" ),
            new THREE.Color( "white" )
        ];
    
        var cube_geometry = new THREE.Geometry();
        cube_geometry.vertices.push( v[0] );
        cube_geometry.colors.push( c[0] );
        cube_geometry.vertices.push( v[1] );
        cube_geometry.colors.push( c[1] );
        cube_geometry.vertices.push( v[0] );
        cube_geometry.colors.push( c[0] );
        cube_geometry.vertices.push( v[2] );
        cube_geometry.colors.push( c[2] );
        cube_geometry.vertices.push( v[0] );
        cube_geometry.colors.push( c[0] );
        cube_geometry.vertices.push( v[4] );
        cube_geometry.colors.push( c[4] );
        cube_geometry.vertices.push( v[2] );
        cube_geometry.colors.push( c[2] );
        cube_geometry.vertices.push( v[6] );
        cube_geometry.colors.push( c[6] );
        cube_geometry.vertices.push( v[6] );
        cube_geometry.colors.push( c[6] );
        cube_geometry.vertices.push( v[4] );
        cube_geometry.colors.push( c[4] );
        cube_geometry.vertices.push( v[4] );
        cube_geometry.colors.push( c[4] );
        cube_geometry.vertices.push( v[5] );
        cube_geometry.colors.push( c[5] );
        cube_geometry.vertices.push( v[5] );
        cube_geometry.colors.push( c[5] );
        cube_geometry.vertices.push( v[1] );
        cube_geometry.colors.push( c[1] );
        cube_geometry.vertices.push( v[1] );
        cube_geometry.colors.push( c[1] );
        cube_geometry.vertices.push( v[3] );
        cube_geometry.colors.push( c[3] );
        cube_geometry.vertices.push( v[3] );
        cube_geometry.colors.push( c[3] );
        cube_geometry.vertices.push( v[2] );
        cube_geometry.colors.push( c[2] );
        cube_geometry.vertices.push( v[7] );
        cube_geometry.colors.push( c[7] );
        cube_geometry.vertices.push( v[6] );
        cube_geometry.colors.push( c[6] );
        cube_geometry.vertices.push( v[7] );
        cube_geometry.colors.push( c[7] );
        cube_geometry.vertices.push( v[5] );
        cube_geometry.colors.push( c[5] );
        cube_geometry.vertices.push( v[7] );
        cube_geometry.colors.push( c[7] );
        cube_geometry.vertices.push( v[3] );
        cube_geometry.colors.push( c[3] );
            
        var cube = new THREE.Line(
            cube_geometry,
            new THREE.LineBasicMaterial({
                color   :   0x1f1f1f,
                vertexColors : true,
                transparent    :   true,
                opacity :   0.5
            }),
            THREE.LinePieces 
        ); 
        cube.scale.set( this.size, this.size, this.size);
        cube.position.set( - this.size/2.0, -this.size/2.0, -this.size/2.0 );
    
        o.add(cube);
    }
    
    //Corners
    //var sphere_geometry = new THREE.SphereGeometry(0.02*this.size,16,16);
    var sphere_geometry = new THREE.CubeGeometry(0.02*this.size,0.02*this.size,0.02*this.size);

    var corner_black = new THREE.Mesh(
        sphere_geometry,
        new THREE.MeshPhongMaterial({
            color   :   0x000000
        })
    );
    corner_black.position.set(-this.size/2,-this.size/2,-this.size/2);
    o.add(corner_black);

    var corner_white = new THREE.Mesh(
        sphere_geometry,
        new THREE.MeshPhongMaterial({
            color   :   0xffffff
        })
    );
    corner_white.position.set(this.size/2,this.size/2,this.size/2);
    o.add(corner_white);

    var corner_red = new THREE.Mesh(
        sphere_geometry,
        new THREE.MeshPhongMaterial({
            color   :   0xff0000
        })
    );
    corner_red.position.set(this.size/2,-this.size/2,-this.size/2);
    o.add(corner_red);

    var corner_green = new THREE.Mesh(
        sphere_geometry,
        new THREE.MeshPhongMaterial({
            color   :   0x00ff00
        })
    );
    corner_green.position.set(-this.size/2,this.size/2,-this.size/2);
    o.add(corner_green);

    var corner_blue = new THREE.Mesh(
        sphere_geometry,
        new THREE.MeshPhongMaterial({
            color   :   0x0000ff
        })
    );
    corner_blue.position.set(-this.size/2,-this.size/2,this.size/2);
    o.add(corner_blue);

    var corner_yellow = new THREE.Mesh(
        sphere_geometry,
        new THREE.MeshPhongMaterial({
            color   :   0xffff00
        })
    );
    corner_yellow.position.set(this.size/2,this.size/2,-this.size/2);
    o.add(corner_yellow);

    var corner_cyan = new THREE.Mesh(
        sphere_geometry,
        new THREE.MeshPhongMaterial({
            color   :   0x00ffff
        })
    );
    corner_cyan.position.set(-this.size/2,this.size/2,this.size/2);
    o.add(corner_cyan);

    var corner_magenta = new THREE.Mesh(
        sphere_geometry,
        new THREE.MeshPhongMaterial({
            color   :   0xff00ff
        })
    );
    corner_magenta.position.set(this.size/2,-this.size/2,this.size/2);
    o.add(corner_magenta);
}


/**
    CLOUD
 */
H3VIS.Cloud = function(h3visualizer,spec){
    // Validate spec
    this.h3visualizer = h3visualizer;

    // Extend Cosa
    COSA.Cosa.call(this, spec);

    // Children
    // Position children
}

H3VIS.Cloud.prototype = Object.create( COSA.Cosa.prototype );

H3VIS.Cloud.prototype.paint = function(object_3d){
    var o = object_3d;

    var histogram = this.h3visualizer.histogram;
    // Color particles
    var max = histogram.max();
    var data = histogram.data;  // This is UintNArray (with N in 8,16,32)
    // Aux
    var grid_number = Math.pow(2,histogram.bits_per_channel);
    var grid_size = this.h3visualizer.size / grid_number;
    

    // TODO: This "if" is a quick hack not to use strategy pattern (so far)
    if (this.h3visualizer.mode === "brick"){
        var geom = new THREE.CubeGeometry(grid_size, grid_size, grid_size);
        var offset = 0.2;
    } else {
        var geom = new THREE.SphereGeometry(grid_size/2, 8,8);
        var offset = 0.2;
    }

    // This is another (very) ugly if for adding the feature "selected_color" quickly and dirty
    if ( this.h3visualizer.selected_color) {
        // If there is a selected color, paint a single sphere and exit
        var selected_color = this.h3visualizer.selected_color;
        var r = selected_color[0];
        var g = selected_color[1];
        var b = selected_color[2];
        var sel_col = new THREE.Color().setRGB( r/255, g/255, b/255 );
            
        var pointer = new THREE.Mesh(
            geom,
            new THREE.MeshPhongMaterial({
                color   :   sel_col,
                wireframe   :   this.h3visualizer.wireframe, 
                transparent    :   false,
            })
        );

        var pointer_position = new THREE.Vector3(
            (r/255-0.5) * this.h3visualizer.size,
            (g/255-0.5) * this.h3visualizer.size,
            (b/255-0.5) * this.h3visualizer.size
        ); 
        pointer.position.copy(pointer_position);
        o.add(pointer);
        return;
    }

    // Loop
    var value;
    var x,y,z;
    for (var i=0; i<data.length; i++){
        // It would be good to have an iterator for the histogram data (for now we do it here)
        var color = histogram.indexToColor(i); 
        value = data[i];
        var factor = value/max;

        // TODO: This "if" is a quick hack not to use strategy pattern (so far)
        var opacity =   this.h3visualizer.mode === "brick" 
                        ? 
                        offset+(1-offset)*factor 
                        : 
                        offset+(1-offset)*(1-factor);

        x = color[0]/255; 
        y = color[1]/255; 
        z = color[2]/255; 
    
        // Draw things
        var vert = new THREE.Vector3(
            (x-0.5) * this.h3visualizer.size,
            (y-0.5) * this.h3visualizer.size,
            (z-0.5) * this.h3visualizer.size
        ); 

        //if (value > max* this.h3visualizer.threshold){
        // Here we hardcode a gamma transfor for the slider to be more equalized
        if (value > max* Math.pow(this.h3visualizer.threshold, 2)){
            var col = new THREE.Color().setRGB( color[0]/255, color[1]/255 ,color[2]/255 );
            var microsphere = new THREE.Mesh(
                geom,
                new THREE.MeshPhongMaterial({
                    color   :   col,
                    wireframe   :   this.h3visualizer.wireframe, 
                    transparent    :   true,
                    opacity     :   opacity * this.h3visualizer.opacity_factor
                    //opacity     :   offset+(1-offset)*factor
            
            

                })
            );
            microsphere.position.copy(vert);
            // TODO: This "if" is a quick hack not to use strategy pattern (so far)
            if (this.h3visualizer.mode !== "brick"){
                var factor2 = Math.sqrt(factor)*histogram.bits_per_channel*histogram.bits_per_channel/8;
                factor2 = factor2 * this.h3visualizer.size_factor;
                microsphere.scale.set(factor2,factor2,factor2);
            }
            o.add( microsphere );
        }
    } 

    
    
    /**
    var geom = new THREE.Geometry();
    for ( var p=0; p<100; p++) {
        var x = Math.random();
        var y = Math.random();
        var z = Math.random();
        //x = x/4+0.2;
        var vert = new THREE.Vector3( 
            (x-0.5) * this.h3visualizer.size,
            (y-0.5) * this.h3visualizer.size,
            (z-0.5) * this.h3visualizer.size
         );
        var col = new THREE.Color().setRGB( x, y ,z );
        geom.vertices.push( vert );
        geom.colors.push( col );
    }

    var psystem = new THREE.ParticleSystem(
        geom,
        new THREE.ParticleBasicMaterial({
            color   :   0xffffff,
            size    :   this.h3visualizer.size/10,
            transparent :   true,
            opacity :   0.5,
            vertexColors : true
        })
    );
    o.add( psystem );

    */
}
