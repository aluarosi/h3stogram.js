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

// Cosa 
COSA = {};

COSA.Cosa = function(spec){
    if (spec === undefined ) spec = {};
    this.parent3D = null;   // set by build()
    this.pos3D    = null;   // set by build()
    this.object3D = null;   // set by build()
    this.children = {};     // set by constructor
}

COSA.Cosa.prototype = {
    build    :   function(parent3D){
        // Build hierarchy of Object3D hanging from parent3D
        this.parent3D = parent3D;
        this.pos3D    = new THREE.Object3D();
        this.object3D = new THREE.Object3D();
        this.parent3D.add(this.pos3D);
        this.pos3D.add(this.object3D);
        var paint3D = new THREE.Object3D(); 
        this.paint(paint3D);
        this.object3D.add(paint3D);
        this.setPos3D(this.pos3D);
        var children = this.children;
        for ( child in children){
            children[child].build(this.object3D);
        }
    },    
    rebuild     : function(){
        // Replaces this.object3D with a new rebuilt object3D
        this.parent3D.remove(this.pos3D);
        this.build(this.parent3D);
    },
    setPos3D    : function(position_3d){
        // To be overriden by parent "Cosa" object
        // Sets position withing the parent object
        // Override using the parameter and building on and changing it
    }, 
    paint       : function(object_3d){
        // Default method for containers, so it is not needed to define paint() explicitly
        // To be overriden by leaf nodes, using parameter object_3d
        //   changing and modifying it.
    }
}
