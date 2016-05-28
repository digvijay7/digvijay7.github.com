var DEBUG=true
function debug(msg){
  if(DEBUG){
    console.log(msg)
  }
}

function play_video(video_id){
  debug("play_video called with video_id: "+ String(video_id));
  $("#" + String(video_id)).get(0).play();
}
