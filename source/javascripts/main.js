anime.timeline({loop: false})
  .add({
    targets: '.main-title .letter',
    translateY: ["1.1em", 0],
    translateZ: 0,
    duration: 850,
    delay: function(el, i) {
      return 500 + 50 * i;
    }
  }).add({
    targets: '.subtitle',
    opacity: [0, 1],
    rotate: [-5, 0],
    translateX: [-20, 0],
    duration: 900,
    offset: 1100
  }).add({
    targets: '.subtitle-description',
    opacity: [0, 1],
    translateY: [50, 0],
    duration: 900,
    offset: 1500
  });

//anime.timeline({loop: false})

let experienceAnimation = anime.timeline({
  loop: false,
  autoplay: false
})

experienceAnimation.add({
  targets: '[data-name="years-of-experience"] .first-letter',
  translateY: [4, 3, -2],
  translateX: [0, 5, -3],
  rotate: [-5, -10, 10, -1],
  duration: 350,
  easing: 'easeInOutQuad'
});

experienceAnimation.add({
  targets: '[data-name="years-of-experience"] .second-letter',
  translateY: [2, 4, 0],
  translateX: [-1, -4, 3, 0],
  rotate: [2, -5, 11, 0],
  duration: 400,
  easing: 'easeInOutQuad'
}, "-300");

$('[data-name="years-of-experience"]').hover(function() {
  if(experienceAnimation.reversed) {
    experienceAnimation.reverse();
  }
  experienceAnimation.play();
}, function() {
  if(!experienceAnimation.reversed) {
    experienceAnimation.reverse();
  }
  experienceAnimation.play();
});

let startupAnimation = anime.timeline({
  loop: false,
  autoplay: false
})

startupAnimation.add({
  targets: '[data-name="startup-founder"] .brick6',
  translateY: [-60, -9],
  translateX: [43, 43],
  rotate: [3, -10, 10, 0],
  duration: 350,
  easing: 'easeInOutQuad'
});

startupAnimation.add({
  targets: '[data-name="startup-founder"] .brick4',
  translateY: [-60, -25],
  translateX: [-13, -13],
  rotate: [3, -10, 10, 0],
  duration: 350,
  easing: 'easeInOutQuad'
});

startupAnimation.add({
  targets: '[data-name="startup-founder"] .brick5',
  translateY: [-60, -25],
  translateX: [31, 31],
  rotate: [3, -10, 10, 0],
  duration: 350,
  easing: 'easeInOutQuad'
});

$('[data-name="startup-founder"]').hover(function() {
  if(startupAnimation.reversed) {
    startupAnimation.reverse();
  }
  startupAnimation.play();
}, function() {
  if(!startupAnimation.reversed) {
    startupAnimation.reverse();
  }
  startupAnimation.play();
});
