
let video;
let poseNet;
let foundPoses = [];
let skeleton;
let faces = [];

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);
  imageMode(CENTER);
}

function gotPoses(poses) {
  if (poses.length > 0) {
    foundPoses = poses;
  }
}

function modelLoaded() {
  console.log('poseNet ready');
}

function draw() {
  image(video, width / 2, height / 2);
  for (let i = 0; i < foundPoses.length; i++) {
    let pose = foundPoses[i].pose;
    let skeleton = foundPoses[i].skeleton;

    if (pose && pose.score > 0.30) {

      let eyeR = pose.rightEye;
      let eyeL = pose.leftEye;
      let earL = pose.leftEar;
      let earR = pose.rightEar;
      let headWidth = dist(earL.x, earL.y, earR.x, earR.y);
      let headHeight = 2 * headWidth;

      let newFace;
      if (faces.length > 0) {
        newFace = faces.shift();
      }
      faces.push(get(pose.nose.x - headWidth/2, pose.nose.y - headWidth, headWidth, headHeight));

      if (newFace) {
        image(newFace, pose.nose.x, pose.nose.y, headWidth, headHeight);
      }
      
      strokeWeight(4);
      stroke(255);
      for (let i = 0; i < skeleton.length; i++) {
        let a = skeleton[i][0];
        let b = skeleton[i][1];
        line(a.position.x, a.position.y, b.position.x, b.position.y);
      }

      noStroke();

      fill(0, 0, 255);
      ellipse(pose.rightWrist.x, pose.rightWrist.y, 32);
      ellipse(pose.leftWrist.x, pose.leftWrist.y, 32);

    }
  }
}