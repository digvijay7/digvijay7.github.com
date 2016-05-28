var player;
function main_canvas_cleanup(){
  var seconds = 15;
  var overlap = 2;
  var reduce_step = 100/seconds;
  lower_title_song_volume(100,reduce_step,seconds);
  setTimeout(stop_uptown_funk, seconds * 1000);
  setTimeout(function () { play_video('ivideo'); },(seconds - overlap) * 1000);
}

function stop_uptown_funk(){
  $('#uptown-funk').remove();
}

function setup_uptown_funk(){
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}
function onYouTubeIframeAPIReady() {
  //This iframeId parameter needs to match your Iframe's id attribute
  player = new YT.Player('uptown-funk', {
    width: 300,
    height: 300,
    videoId: 'IbFEEfNE1YQ',
    playerVars: {
      autoplay: 1,
      loop: 1,
      controls: 0,
      showinfo: 0,
      autohide: 1
    },
    events: {
        'onReady': onPlayerReady
    }
  });
}

function onPlayerReady(event){
  event.target.playVideo();
  $('uptown-funk').get(0).style = "width:1px;height:1px;overflow:hidden";
}

function lower_title_song_volume(volume, reduce_step, seconds_left){
  player.setVolume(volume);
  var new_volume = volume - reduce_step;
  if (new_volume > 0 && seconds_left > 0){
    setTimeout(function(){ lower_title_song_volume(new_volume, reduce_step, seconds_left-1);},1000)
  }
}
