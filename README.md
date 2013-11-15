h3stogram.js
============
H3stogram is an Interactive three dimensional color histogram for visualizing and analyzing the color structure of an image.

H3stogram is a 3D depiction of an image's color distribution (histogram) in the RGB space. It is developed in javascript/HTML5 on the Threejs framework, which wraps on the WebGL api. For more information see the article in DoF ideas.

Go to http://h3stogram.dofideas.com and...

Play with it!
------------

1. Pick an image from the bottom fringe. This will load it into the canvas on the top left corner, and from there into the cube in the center of the screen
2. Navigate the 3D histogram
    * Left button + drag --> Circle around
    * Mouse wheel --> Dolly
    * Right button + drag --> Travelling
3. Play with the visualization parameters on the controls right column (Visualization folder)
    * Select brick (cube) or bubble elements
    * Select solid or wireframe elements
    * Show only the predominant colors increasing the Threshold value
    * Choose the opacity and size of the elements
4. Change the resolution of the 3d histogram (Histogram folder)
    * Bits Per Channel: 4 is the default. Try 5 while it does not get very sluggish
    * Bytes Per Point: 2 is the default and recommended value (feel free to experiment)
5. Navigate to highlighted viewpoints (Viewpoint folder)
    * Color Lights --> Color wheel view, from the white corner of the RGB cube
    * Color Shadows --> Color wheel view, from the black corner of the RGB cube
    * BW Cold --> View of the cube's black-white long diagonal, from the cold colors edge (blue-cyan)
    * BW Warm --> View of the cube's black-white long diagonal, from the warm colors edge (red-yellow)
    * Rest --> Frontal view

Installation notes
------------------
0. You will need nodejs installed on your system
1. Clone the repo
2. Run nodejs in the root directory 
    $ node app.js
3. Browse http://localhost:8000
