Notification.requestPermission().then(function(result) {
  console.log(result);
});
function single() {
  history.pushState(null, null, '/');
  window.location.replace("static/singleplayer.html");
}
function multi() {
  history.pushState(null, null, '/');
  window.location.replace("static/multiplayer.html");
}
function credits() {
  history.pushState(null, null, '/');
  window.location.replace("static/credits.html");
}
function home() {
  history.pushState(null, null, '/');
  window.location.replace("/");
}
function spawnNotification(body, icon, title) {
  var options = {
      body: body,
      icon: icon
  };
  var n = new Notification(title, options);
}