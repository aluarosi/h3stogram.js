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

MY = {
    clock       :   new THREE.Clock(), renderer    :   null,
    camera      :   null,
    
    h3visualizer    :   null,
    h3visualizer_controls    :  {
        size    :   3,
        type    :   'bubble',
        types   :   ['bubble','brick'],
        wireframe   :   true,
        show_cube_frame   :   true,
        threshold   :   0.01,
        opacity_factor :   2.0,
        opacity_factors :   [0.5,1.0,2.0,4.0],
        size_factor :   2.0,
        size_factors    :   [1,2,4,8],
        bpc     :   4,
        bpcs    :   [1,2,3,4,5],
        bpp     :   1,
        bpps    :   [1,2],
        view_colorwheel_light : function(){},
        view_colorwheel_shadow : function(){},
        view_BWdiagonal_cold : function(){},
        view_BWdiagonal_warm : function(){},
        view_reset : function(){},
        background_brightness : 128
    },  

    stats       :   null,

    image_source    :   "images/default/JavierVillarroel_048flor01_o_350.png",
    image_canvas    :   null,
    image_context   :   null,
    image_data      :   null,

    histogram       :   null,
    histograms      :   {
    },

    cameraControls  :   null,
    cameraDriver    :   null
};

MY.main = function(){
    this.setupCanvas();
    this.setupHistogram();
    this.setupModels();
    this.setupRenderersAndCameras(); 
    this.setupScene();
    this.setupGui();
    this.setupConnectors();
    this.setupStats();
    this.render(); 
    //
    this.setupGallery();
    this.loadPicture();
    // Locate camera
    var k = MY.h3visualizer_controls.size * 2;
    MY.cameraDriver.setDestination( -k,0,k ).go();
};

MY.setupGallery = function(){
    console.log("in setupGallery");
    var gallery_pics = $("img.gallery");
    gallery_pics.each( function(i){
        var image = $(this);
        image.click( function(e){
            MY.loadPicture(image[0].src);    
        });
     });
    /*
    // PROBLEM: tainted canvas!!!
    // https://developer.mozilla.org/en-US/docs/HTML/CORS_Enabled_Image?redirectlocale=en-US&redirectslug=CORS_Enabled_Image
    // Setup the image loader
    var button = $("#custom_image_submit");
    var text_box = $("#custom_image_url");
    button.click(function(evt){
        console.log(evt);
        evt.preventDefault();
        var url = text_box.val();
        MY.loadPicture(url);
    });
    */
}

MY.setupCanvas = function(){
    console.log("in setupCanvas");
    this.image_canvas = document.getElementById("image_canvas");
    this.image_context = this.image_canvas.getContext("2d");
    var cnv = this.image_canvas;
    console.log(image_canvas.width, image_canvas.height);
    // Handler for clicking on the image
    //TODO: this does not work in FIREFOX
    //TODO: the implementation in CHROME is buggy, 
    //      gotten pixel color does not match 

    var getPixelColor = function(canvas, image_data, x, y){
        //TODO --> Bug here
        /** Params:
                canvas      :
                image_data  :   as result of  context.getImageData()
                x,y         :   click coordinates
            
         */
        var rect = canvas.getBoundingClientRect();
        var x = x;
        var y = y;
        x -= rect.left;
        y -= rect.top;
        x = x|0;
        y = y|0;
        var W = image_data.width;
        var H = image_data.height;
        var data = image_data.data;
        var index = y*H*4 + x*4;
        var r = data[index];  
        var g = data[index+1];  
        var b = data[index+2];  
        return [r,g,b];
    };

    /* TODO: Disabled until buggy behaviour is fixed
    cnv.addEventListener("mousedown", function(e){
        // Get pixel color and set selected color in h3visualizer
        var x = e.x;
        var y = e.y;
        pxcolor = getPixelColor(MY.image_canvas, MY.image_data, x, y);
        console.log(x,y,pxcolor); 
        // --> SET selected point in visualizer
        MY.h3visualizer.setSelectedColor(pxcolor);
        
    },false);
    cnv.addEventListener("mouseup", function(e){
        // Unset selected color in h3visualizer
        MY.h3visualizer.resetSelectedColor();
        
    },false);
    cnv.addEventListener("mousemove", function(e){
        // Get pixel color and set selected color in h3visualizer
        var x = e.x;
        var y = e.y;
        // Update selected color only if there is a selected color in h3visualizer
        if ( MY.h3visualizer.selected_color ) {
            pxcolor = getPixelColor(MY.image_canvas, MY.image_data, x, y);
            console.log(pxcolor); 
            // --> SET selected point in visualizer
            MY.h3visualizer.setSelectedColor(pxcolor);
        }
        
    },false);
    */
};

MY.setupHistogram = function(){
    console.log("in setupHistogram");
    this.histogram = new H3.H3stogram(
        this.h3visualizer_controls.bpc,
        this.h3visualizer_controls.bpp
    );
    
    // Load Histogram from Canvas
    this.histogram.loadFromCanvas(this.image_canvas); 
    if (this.h3visualizer){
        this.h3visualizer.updatedHistogram(this.histogram,"qq");
    }
     
};

MY.loadPicture = function(picture){
    var picture = picture === undefined ? this.image_source : picture;
    var image = new Image();
    image.src = picture;


    var that = this;
    image.onload = function(ev){
        //Fill in the image info (caption)
        var image_path = picture;
        var image_filename = image_path.split("/")[image_path.split("/").length-1];
        var image_info = images_info[image_filename];
        if (image_info.title !== undefined) {
            $("#image_info").html(image_info.title);
        }
        if (image_info.author !== undefined) {
            $("#image_info").append("<br/> "+" "+image_info.author);
        }
        if (image_info.license !== undefined) {
            $("#image_info").append("<br/> "+image_info.license);
        }
        var W = image.width;
        var H = image.height;
        var canvas = document.getElementById("image_canvas");
        canvas.width = W;
        canvas.height = H;
        
        //that.image_context.clearRect(0,0,w,h);
        that.image_context.drawImage(image,0,0);                     

        // Update Histogram
        that.setupHistogram();
        that.histogram.loadFromCanvas(that.image_canvas);
        that.histogram.emit("update");
        
        // Get canvas data too to be used in the main program 
        //      i.e. highlighting clicked color
        var ctx = canvas.getContext("2d");
        MY.image_data = ctx.getImageData(0,0,W,H);
    };


};

MY.setupGui = function(){
    console.log("in setupGui");
    var gui = new dat.GUI({autoPlace: false});
    var controlsContainer = $('#controls');
    controlsContainer.append(gui.domElement); 
    //Folders
    var f_visualizer = gui.addFolder("Visualization");
    var f_histogram = gui.addFolder("Histogram");
    var f_viewpoint = gui.addFolder("Viewpoint");
    f_visualizer.open();
    f_histogram.open();
    f_viewpoint.open();
    //Controls
    var ctrl_brightness = f_visualizer.add(
        this.h3visualizer_controls,
        'background_brightness',0,255
    ).name("Background");
    var ctrl_type = f_visualizer.add(
        this.h3visualizer_controls,
        'type',this.h3visualizer_controls.types
    ).name("Type");
    var ctrl_wireframe = f_visualizer.add(
        this.h3visualizer_controls,
        'wireframe'
    ).name("Wireframe");
    var ctrl_threshold = f_visualizer.add(
        this.h3visualizer_controls,
        'threshold', 0.0, 1.0
    ).name("Threshold");
    var ctrl_opacity = f_visualizer.add(
        this.h3visualizer_controls,
        'opacity_factor', this.h3visualizer_controls.opacity_factors
    ).name("Opacity");
    var ctrl_size = f_visualizer.add(
        this.h3visualizer_controls,
        'size_factor', this.h3visualizer_controls.size_factors
    ).name("Element size");
    var ctrl_bits_per_channel = f_histogram.add(
        this.h3visualizer_controls,
        'bpc',this.h3visualizer_controls.bpcs
    ).name("Bits Per Channel");
    var ctrl_bytes_per_point = f_histogram.add(
        this.h3visualizer_controls,
        'bpp',this.h3visualizer_controls.bpps
    ).name("Bytes Per Point");
    // Viewpoints
    var view_color_light = f_viewpoint.add(
        this.h3visualizer_controls,
        'view_colorwheel_light'
    ).name("Color Lights");
    var view_color_shadow = f_viewpoint.add(
        this.h3visualizer_controls,
        'view_colorwheel_shadow'
    ).name("Color Shadows");
    var view_bw_cold = f_viewpoint.add(
        this.h3visualizer_controls,
        'view_BWdiagonal_cold'
    ).name("BW Cold");
    var view_bw_warm = f_viewpoint.add(
        this.h3visualizer_controls,
        'view_BWdiagonal_warm'
    ).name("BW Warm");
    var view_reset = f_viewpoint.add(
        this.h3visualizer_controls,
        'view_reset'
    ).name("Reset");
    
    /** 
     * Connections
     */ 
    var that = this;
    ctrl_brightness.onChange( function(val) {
        console.log(val);
        var val = val|0;
        $("body").css('background-color', 'rgb('+val+','+val+','+val+')');
    });
    ctrl_type.onChange( function(val) {
        that.h3visualizer.setVisualizationMode(val);
    });
    ctrl_wireframe.onChange( function(val) {
        that.h3visualizer.setWireframe(val);
    });
    ctrl_threshold.onChange( function(val) {
        that.h3visualizer.setThreshold(val );
    });
    ctrl_opacity.onChange( function(val) {
        that.h3visualizer.setOpacityFactor(val);
    });
    ctrl_size.onChange( function(val) {
        that.h3visualizer.setSizeFactor(val);
    });
    ctrl_bits_per_channel.onChange( function(val){
        that.h3visualizer_controls['bpc'] = parseInt(val);
        that.setupHistogram();
    }); 
    ctrl_bytes_per_point.onChange( function(val){
        that.h3visualizer_controls['bpp'] = parseInt(val);
        that.setupHistogram();
    }); 
    //Viewpoints (connections)
    view_color_light.onChange( function(val){
        var k = MY.h3visualizer_controls.size * 1.5;
        MY.cameraDriver.setDestination(k,k,k).go();
    });
    view_color_shadow.onChange( function(val){
        var k = MY.h3visualizer_controls.size * 1.5;
        MY.cameraDriver.setDestination( -k,-k,-k ).go();
    });
    view_bw_cold.onChange( function(val){
        var k = MY.h3visualizer_controls.size * 2;
        MY.cameraDriver.setDestination( -k,0,k ).go();
    });
    view_bw_warm.onChange( function(val){
        var k = MY.h3visualizer_controls.size * 2;
        MY.cameraDriver.setDestination( k,0,-k ).go();
    });
    view_reset.onChange( function(val){
        var k = MY.h3visualizer_controls.size * 3;
        MY.cameraDriver.setDestination( 0,0,k ).go();
    });
    
};

MY.setupConnectors = function(){
    // h3visualizer must listen to histogram  
    this.histogram.on("update", this.h3visualizer.updatedHistogram.bind(this.h3visualizer));
    /** Alternatively, I used to do something like this, a "glue" function
     *  Now I bind the callback to the receiver function
    console.log(this.h3visualizer);
    var that = this;
    this.histogram.on("update", function(emitter, event_data){
        that.h3visualizer.updatedHistogram(emitter,event_data); 
    });
    */
};

MY.setupModels = function(){
    console.log("in setupModels");
};

MY.setupRenderersAndCameras = function(){
    // Grab container div and append renderer.domElement
    var container = $("#containerR");
    // Create Renderer(s) and add it to our container div
    this.renderer = new THREE.WebGLRenderer( {antialias: true} );
    this.renderer.setSize( $('#containerR').outerWidth(), $('#containerR').outerHeight() );
    this.renderer.gammaOutput = false;
    container.append( this.renderer.domElement );
    
    // Cameras
    this.camera = new THREE.PerspectiveCamera(
        35.0,
        $('#containerR').outerWidth()/$('#containerR').outerHeight(),
        0.01, 4000
    );
    this.camera.position.set( 0, 0, this.h3visualizer_controls.size *2.8 );
    // On window resize : update camera and renderer dom element size
    var that = this;
    window.addEventListener( 'resize',
        function(){
            that.camera.aspect = $('#containerR').outerWidth()/$('#containerR').outerHeight();
            that.camera.updateProjectionMatrix();
            that.renderer.setSize( $('#containerR').outerWidth(), $('#containerR').outerHeight());
        }, 
        false
    );
    // We add controls to cameras
    this.cameraControls = new THREE.OrbitAndPanControls(
        this.camera, this.renderer.domElement
    );
    this.cameraControls.target.set( 0,0,0 );
    // We add the driver to the camera
    this.cameraDriver = new MY.CameraDriver(this.camera);
};

MY.setupScene = function(){
    // Create the Scene
    console.log("in setupScene");
    this.scene = new THREE.Scene(); 
    
    this.h3visualizer = new H3VIS.H3Visualizer({
        size    : this.h3visualizer_controls.size, 
        histogram: this.histogram,
        mode    :   this.h3visualizer_controls.mode,
        wireframe   :   this.h3visualizer_controls.wireframe,
        show_cube_frame   :   this.h3visualizer_controls.show_cube_frame,
        threshold   :   this.h3visualizer_controls.threshold,
        opacity_factor  :   this.h3visualizer_controls.opacity_factor,
        size_factor  :   this.h3visualizer_controls.opacity_factor
        
    });
    this.h3visualizer.build(this.scene);

};

MY.setupStats = function(){
    console.log("in stats");
    this.stats = new Stats();
    this.stats.setMode(0);
    //this.stats.domElement.style.position = 'absolute';
    //this.stats.domElement.style.bottom = '0px';
    var container = document.getElementById('stats');
    container.appendChild( this.stats.domElement );
};

MY.render = function(){
    console.log("in render");

    // Get elapsed time
    var delta = this.clock.getDelta();


    // TODO: this should be done with an reactor and event emitter pattern but we get by for now
    // Update with camera controls unless the camera driver is active
    if (this.cameraDriver.is_active){
        this.cameraDriver.update(delta);
    } else {
        this.cameraControls.update(delta);
    }
        

    // Animation...

    // Render the Scene
    this.renderer.render( this.scene, this.camera );
    // Animate
    //requestAnimationFrame( function(){MY.render() });
    requestAnimationFrame( MY.render.bind(this) );
    this.stats.update();
};



//Auxiliar (candidates to put somwhere else in a module)
MY.CameraDriver = function(camera){
    // Drives the camera to a destination point, while looking at the origin all the time
    this.camera = camera;
    this.destination = null;    // Destination
    this.time_total = 0.6;      // Total time to reach destination (seconds)
    this.is_active = false;          

    this.time_remainder = null;      // Remaining time to reach destination

    this.at = new THREE.Vector3(0,0,0);     // Point at which camera looks at
}

MY.CameraDriver.prototype = {};

MY.CameraDriver.prototype.setDestination = function(x,y,z){
    console.log("DESTINATION set ",x,y,z);
    this.destination = [x,y,z];
    return this;
}

MY.CameraDriver.prototype.go = function(){
    this.is_active = true;
    this.time_remainder = this.time_total;
}

MY.CameraDriver.prototype.update  = function(delta){
    console.log("update", delta);
    var alpha = delta/this.time_remainder;  // Interponation coeficient
    this.time_remainder = this.time_remainder - delta;
    if (this.time_remainder <= 0) {
        // The camera has reached the destination point
        this.is_active = false;
        // Adjust the final position to the exact value
        this.camera.position.set(
            this.destination[0],
            this.destination[1],
            this.destination[2]
        );
    }

    // Origin is actual camera position, destination is this.destination
    console.log(this.camera);
    var x = this.camera.position.x;
    var y = this.camera.position.y;
    var z = this.camera.position.z;
    // New camera position
    var x_ = x*(1-alpha) + (alpha) * this.destination[0];
    var y_ = y*(1-alpha) + (alpha) * this.destination[1];
    var z_ = z*(1-alpha) + (alpha) * this.destination[2];
    this.camera.position.set(x_,y_,z_);
    // Camera keeps looking at the origin
    this.camera.lookAt(this.at);
}
