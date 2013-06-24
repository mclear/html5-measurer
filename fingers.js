window.URL = window.URL || window.webkitURL;
navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia || navigator.msGetUserMedia;

var $ = function(id){return document.getElementById(id)}; // lazy dev is lazy

var canvas = new fabric.Canvas('canvas'); // the main canvas element that can be modified by resizing etc.
var video = document.querySelector('video'); // the video input source
var canvas2 = $('canvas2').getContext('2d'); // the canvas element that will contain the video captured
var stripWidth = 170; // The magnetic strip width
var count=1; // The countdown duration in seconds -- note the extra second for kids..
var counter; // The actual timer.

localMediaStream = null;

// The magnetic strip rectangle.
var strip = new fabric.Rect({
  width: stripWidth,
  height: 25,
  top: 342,
  left: 355,
  hasBorders: false,
  cornerSize: 5,
  fill: 'rgba(255,255,255,0.5)'
});

var finger = new fabric.Rect({
  width: 48,
  height: 15,
  top: 247,
  left: 392,
  angle: 367,
  lockScalingY: true,
  hasBorders: false,
  cornerSize: 5,
  fill: 'rgba(0,0,255,0.5)'
});

strip.on('modified', function(options) {
  stripWidth = strip.getWidth(); // get teh new width
  console.log('new Width', stripWidth);
  document.getElementById('finger').innerHTML=scaleToRingSize(finger.getWidth());
});

finger.on('modified', function(options) {
  document.getElementById('finger').innerHTML=scaleToRingSize(finger.getWidth()) + "mm";
});

function snapshot() {
  
  console.log("Grabbing snapshot");

  if (localMediaStream) {
    video.style.display = "none";
    $('guide').style.display = "none";
	$('go').style.display = "none";
    // $('sizes').style.display = "block";
	$('msi').style.display = "block"; // show the instruction to resize mag strip

    canvas2.drawImage(video, 0, 0, 800, 600); // draw the captured content onto a canvas
	canvas.add(strip); // add the strip rectangle to the edit canvas
	$('msn').style.display = "block"; // show the instruction to resize mag strip
	
  }
}

// Takes a scale value and tries to figure out the mm diameter of each ring
function scaleToRingSize(widthPx){
  // console.log(widthPx);
  return (85.72500 / stripWidth * widthPx).toFixed(2);;
}

// Start Video Stream
navigator.getUserMedia({video: true}, function(stream) {
  video.src = window.URL.createObjectURL(stream);
  localMediaStream = stream;
  $('guide').style.display = "block";
  $('go').style.display = "block";
  $('prompt').style.display = "none";

  // Draw shapes onto Canvas
}, function(){
   alert("Enable and Allow your camera");
});

function countdown(){
  $('timer').style.display = "block"; // show countdown
  // counting down
  counter=setInterval(timer, 1000); //1000 will  run it every 1 second
}

// Create snapshot on click
document.getElementById('go').addEventListener('click', countdown, false);

// Show finger ring thing on next button click
document.getElementById('msn').addEventListener('click', showFinger, false);

// Show mm size on finish
document.getElementById('finish').addEventListener('click', showFinished, false);

// show finished
function showFinished(){
  $('finished').style.display = "block";
  $('sizes').style.display = "block";
  $('fsi').style.display = "none";
  $('finish').style.display = "none";
  $('finger').style.display = "block";
  $('reset').style.display = "block";
}

// Show finger
function showFinger(){
  $('msn').style.display = "none";
  $('msi').style.display = "none";
  $('fsi').style.display = "block";
  $('finish').style.display = "block";

  strip.remove();
  canvas.add(finger); // add the first finger to the edit canvas
}

function timer()
{
  count=count-1;
  // console.log(count);
  document.getElementById('timer').innerHTML = count;

  if(count == 0){
    $('timer').style.display = "none";
    snapshot();
    clearInterval(counter);
    return;
  }
}