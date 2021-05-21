let video;
let poseNet;
let pose;
let skeleton;
let r=0;
let x=0;
var s = 100, ex = 10,i;
function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  Net = ml5.poseNet(video, modelLoaded);
  // const poseNet = await posenet.load({
  //   architecture: 'ResNet50',
  //   outputStride: 32,
  //   inputResolution: { width: 257, height: 200 },
  //   quantBytes: 2
  // });
  Net.on('pose', gotPoses);
  rectMode(CENTER)
  
}

function gotPoses(poses) {
  //console.log(poses);
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}

function modelLoaded() {
  console.log('poseNet ready');
}

function draw() {
  x=Math.round(frameRate());
  image(video, 0, 0);
  fill(255,0,0)
  textSize(30)
  text(x,50,50);

  if (pose) {
    fill(255, 0, 0);
    fill(0, 0, 255);
    // ellipse(pose.rightWrist.x, pose.rightWrist.y, 32);
    // ellipse(pose.leftWrist.x, pose.leftWrist.y, 32);

    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(0, 255, 0);
      ellipse(x, y, 16, 16);
    }

    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(2);
      stroke(255);
      line(a.position.x, a.position.y, b.position.x, b.position.y);
    }
  }
}
