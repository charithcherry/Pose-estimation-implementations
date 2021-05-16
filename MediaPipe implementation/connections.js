const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
const controlsElement = document.getElementsByClassName('control-panel')[0];
const fpsControl = new FPS();
var pi = Math.PI;

/**function to calculate angle */
function calculate_angle(x,y,z)
{

  var a=x;
  var b=y;
  var c=z
  
  var radians= 
    Math.atan2(c[1]-b[1],c[0]-b[0])-Math.atan2(a[1]-b[1],a[0]-b[0]);
  var angle= radians * (180/pi)
  if(angle>180)
  {
    angle=360-angle;
  }
  return angle;
}






function onResults(results) {
  fpsControl.tick();
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
    results.image, 0, 0, canvasElement.width, canvasElement.height);
  drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
    { color: '#00FF00', lineWidth: 4 });
  drawLandmarks(canvasCtx, results.poseLandmarks,
    { color: '#FF0000', lineWidth: 2 });
  canvasCtx.font = "20px serif"
  canvasCtx.fillStyle = "#00FF00";
  var landmarks = results.poseLandmarks;
  var shoulder=[landmarks[POSE_LANDMARKS.LEFT_SHOULDER].x,landmarks[POSE_LANDMARKS.LEFT_SHOULDER].y]
  var elbow=[landmarks[POSE_LANDMARKS.LEFT_ELBOW].x,landmarks[POSE_LANDMARKS.LEFT_ELBOW].y]
  var wrist=[landmarks[POSE_LANDMARKS.LEFT_WRIST].x,landmarks[POSE_LANDMARKS.LEFT_WRIST].y]

  var result=Math.round(calculate_angle(shoulder,elbow,wrist))
  canvasCtx.fillText("angle between SEW"+result, 10, 30)

  //console.log(result)
  canvasCtx.restore();
}

const pose = new Pose({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
  }
});
pose.setOptions({
  modelComplexity: 1,
  smoothLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});
pose.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await pose.send({ image: videoElement });
  },
  width: 400,
  height: 400
});
camera.start();


new ControlPanel(controlsElement)
  .add([
    new StaticText({ title: 'MediaPipe Pose' }),
    fpsControl
  ]);