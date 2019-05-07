anime.timeline({loop: false})
  .add({
    targets: '.main-title .letter',
    translateY: ["1.1em", 0],
    translateZ: 0,
    duration: 850,
    delay: function(el, i) {
      return 500 + 50 * i;
    }
  });
