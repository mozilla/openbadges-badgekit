$(document).ready(function() {
  var leftWhatIsContainer = $('.home-what-is-badge');
  var rightWhatIsContainer = $('.home-what-is-image');

  function resizeWhatIsContainer() {
    rightWhatIsContainer.height(leftWhatIsContainer.height());
  }

  leftWhatIsContainer.resize(resizeWhatIsContainer);
  resizeWhatIsContainer();
});