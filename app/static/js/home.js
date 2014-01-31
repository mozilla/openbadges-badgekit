$(document).ready(function() {
  var leftWhatIsContainer = $('.home-what-is-badge');
  var rightWhatIsContainer = $('.home-what-is-image');

  leftWhatIsContainer.resize(function() {
    rightWhatIsContainer.height(leftWhatIsContainer.height());
  });
  leftWhatIsContainer.resize();
});