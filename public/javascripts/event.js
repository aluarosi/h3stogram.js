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

// EventEmitter - Taken from  MY.EventDispatcher
EVENT = {};

EVENT.eventify = function(object, prefix){
    // Adds event emitter functionality to a single object

    var prefix =    prefix === undefined ||
                    prefix === ""
                    ?
                    ""
                    :
                    prefix = prefix+"_";
    // TO BE COMPLETED...
                    
    // TODO: check if this would overwritte a previous method and raise error!!!
    // or alternatively, add a prefix to the methods
    object.addListener = this._addListener;
    object.on = this._addListener;
    object.removeListener = this._removeListener;
    object.removeAllListeners = this._removeAllListeners;
    object.emit = this._emit;
    return object;
}

EVENT._addListener = function( type, listener){
    if ( this._listeners === undefined ){
        this._listeners = {}; 
    }
    var listeners = this._listeners;
    if ( listeners[type] === undefined ){
        listeners[type] = [];
    }
    if ( listeners[type].indexOf( listener ) === -1 ){
        listeners[type].push( listener );
    }
}

EVENT._emit = function( type, event_data  ){
/** 
 *
   The callback functions are called like this:
        
        function( emitter, event_data)

    The TRREE.js way is to call only 

        function( emitter )

    and bind the function to the emitter (referred with "this")
    
    I prefer to put emitter explicitly as the 1st argument.
    This way, *** the callback function could be bound to a RECEIVER object. ***
 *
 */
    
    var listeners = this._listeners;
    if  (   listeners === undefined ||
            listeners[type] === undefined ||
            listeners.length === 0  )
    { 
            return;
    }

    for (var i=0; i<listeners[type].length; i++){
        // We do not bind the callback to the emitter, but leave the possibility to bind it to the receiver
        listeners[type][i].call( null, this, event_data);
        
    } 
}

EVENT._removeListener = function( type, listener ){
}

EVENT._removeAllListeners = function( type ){
}

