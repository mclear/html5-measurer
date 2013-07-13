var $ = function(id){return document.getElementById(id)}; // lazy dev is lazy
var localMediaStream = null;
var video = $('video');
var canvas = $('canvas'); // invisible canvas
var ctx = canvas.getContext('2d');

window.URL = window.URL || window.webkitURL;
navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia || navigator.msGetUserMedia;

// Start Video Stream
navigator.getUserMedia({video: true}, function(stream) {
  video.src = window.URL.createObjectURL(stream);
  localMediaStream = stream;
  console.log(video.offsetWidth);
  canvas.width = video.offsetWidth;
  canvas.height = video.offsetHeight;
}, function(){
   alert("Enable and Allow your camera");
});


function snapshot() {
  if (localMediaStream) {
    ctx.drawImage(video, 0, 0, video.offsetWidth, video.offsetHeight); // draw the captured content onto a canvas
    $('snapshot').src = canvas.toDataURL('image/png');
    video.style.display = "none";
  }
}
