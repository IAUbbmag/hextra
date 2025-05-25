/* ==================================================
   Homepage JavaScript
   Handles initialization and functionality for the homepage sliders.
   Uses jQuery and Vue.js for DOM manipulation and reactive behavior.
   Includes Main Slider (cool-slider) and Testimonials Slider (carousel-wrap).
================================================== */

$(document).ready(function() {
  /* ==================================================
     Main Slider (cool-slider)
     Manages the main homepage slider using Vue.js.
     Handles slide transitions, animations, and auto-slide functionality.
     Includes logic for extra elements in slide 3 with fadeInUp/fadeOutUp animations.
     Adds dynamic navigation controls (left/right) for user interaction.
  ================================================== */
  var coolSliderApp = new Vue({
    el: "#cool-slider-app",
    data: {
      slideNumber: 0,
      amountOfSlides: 4,
      inTransition: false,
      autoSlideInterval: null
    },
    methods: {
      init() {
        $('.slide').addClass('hidden');
        $('#slide-0').removeClass('hidden').addClass('in-right'); // Add in-right for initial animation

        // Remove in-right after animation completes (1s)
        setTimeout(() => {
          $('#slide-0').removeClass('in-right');
        }, 1000);

        // Initialize extra elements for slide 3
        $('#slide-3 .extra-element').each(function(index) {
          $(this).css({
            'opacity': '0',
            'transform': 'translateY(100px) rotateX(20deg)',
            'animation-delay': (index * 200) + 'ms'
          });
        });

        this.startAutoSlide();

        // Add navigation control areas
        const slider = document.querySelector('.cool-slider');
        const leftArea = document.createElement('div');
        leftArea.className = 'slide-control left';
        slider.appendChild(leftArea);
        const rightArea = document.createElement('div');
        rightArea.className = 'slide-control right';
        slider.appendChild(rightArea);

        leftArea.addEventListener('click', () => {
          if (this.inTransition) return;
          this.inTransition = true;
          this.previousSlide();
        });

        rightArea.addEventListener('click', () => {
          if (this.inTransition) return;
          this.inTransition = true;
          this.nextSlide();
        });
      },
      resetAnimation($elements, animationClass) {
        $elements.each(function(index) {
          const $el = $(this);
          const delay = index * 200;
          $el.removeClass('fadeInUp fadeOutUp');
          if (animationClass === 'fadeOutUp') {
            $el.css({
              'opacity': '1',
              'transform': 'translateY(0) rotateX(0deg)',
              'animation-delay': delay + 'ms'
            });
          } else if (animationClass === 'fadeInUp') {
            $el.css({
              'opacity': '0',
              'transform': 'translateY(100px) rotateX(20deg)',
              'animation-delay': delay + 'ms'
            });
          }
          setTimeout(() => {
            $el.addClass(animationClass);
            $el.addClass(`delay-${delay}`);
          }, 10);
        });
      },
      previousSlide() {
        var oldSlide = this.slideNumber;
        this.slideNumber--;
        if (this.slideNumber < 0) {
          this.slideNumber = this.amountOfSlides - 1;
        }
        var newSlide = this.slideNumber;
        $('#slide-' + newSlide).addClass('in-left');

        if (oldSlide === 3) {
          this.resetAnimation($('#slide-3 .extra-element'), 'fadeOutUp');
          setTimeout(() => {
            $('#slide-' + oldSlide).addClass('out-right');
            $('#slide-' + newSlide).removeClass('hidden');
            if (newSlide === 3) {
              setTimeout(() => {
                this.resetAnimation($('#slide-3 .extra-element'), 'fadeInUp');
              }, 1000);
            }
          }, 1500);
        } else {
          setTimeout(() => {
            $('#slide-' + oldSlide).addClass('out-right');
            $('#slide-' + newSlide).removeClass('hidden');
            if (newSlide === 3) {
              setTimeout(() => {
                this.resetAnimation($('#slide-3 .extra-element'), 'fadeInUp');
              }, 1000);
            }
          }, 1000);
        }

        setTimeout(() => {
          $('#slide-' + oldSlide).addClass('hidden');
          $('#slide-' + newSlide).removeClass('in-left');
        }, 2000);
        setTimeout(() => {
          $('#slide-' + oldSlide).removeClass('out-right');
          this.inTransition = false;
        }, 2500);
      },
      nextSlide() {
        var oldSlide = this.slideNumber;
        this.slideNumber++;
        if (this.slideNumber > this.amountOfSlides - 1) {
          this.slideNumber = 0;
        }
        var newSlide = this.slideNumber;
        $('#slide-' + newSlide).addClass('in-right');

        if (oldSlide === 3) {
          this.resetAnimation($('#slide-3 .extra-element'), 'fadeOutUp');
          setTimeout(() => {
            $('#slide-' + oldSlide).addClass('out-left');
            $('#slide-' + newSlide).removeClass('hidden');
            if (newSlide === 3) {
              setTimeout(() => {
                this.resetAnimation($('#slide-3 .extra-element'), 'fadeInUp');
              }, 1000);
            }
          }, 1500);
        } else {
          setTimeout(() => {
            $('#slide-' + oldSlide).addClass('out-left');
            $('#slide-' + newSlide).removeClass('hidden');
            if (newSlide === 3) {
              setTimeout(() => {
                this.resetAnimation($('#slide-3 .extra-element'), 'fadeInUp');
              }, 1000);
            }
          }, 1000);
        }

        setTimeout(() => {
          $('#slide-' + oldSlide).addClass('hidden');
          $('#slide-' + newSlide).removeClass('in-right');
        }, 2000);
        setTimeout(() => {
          $('#slide-' + oldSlide).removeClass('out-left');
          this.inTransition = false;
        }, 2500);
      },
      startAutoSlide() {
        this.autoSlideInterval = setInterval(() => {
          if (!this.inTransition) {
            this.inTransition = true;
            this.nextSlide();
          }
        }, 8000);
      },
      stopAutoSlide() {
        clearInterval(this.autoSlideInterval);
      }
    },
    mounted() {
      this.init();
    },
    beforeDestroy() {
      this.stopAutoSlide();
    }
  });

    /* ==================================================
     Testimonials Slider (carousel-wrap)
     Manages the testimonials slider using jQuery.
     Handles card positioning (main, left, right, back) with transitions.
     Includes auto-swap functionality and hover pause/resume.
     Adds click handlers for next/prev navigation controls.
  ================================================== */
  var carousel = {
    init() {
      var items = $('.carousel > li');
      var itemCount = items.length;
      var currentIndex = 0;
      var isAnimating = false;
      var autoSwap;

      function updateSlider() {
        if (isAnimating) return;
        isAnimating = true;

        items.removeClass('main-pos left-pos right-pos back-pos');

        var leftIndex = (currentIndex - 1 + itemCount) % itemCount;
        var rightIndex = (currentIndex + 1) % itemCount;

        items.eq(currentIndex).addClass('main-pos');
        items.eq(leftIndex).addClass('left-pos');
        items.eq(rightIndex).addClass('right-pos');

        items.each(function(index) {
          if (index !== currentIndex && index !== leftIndex && index !== rightIndex) {
            $(this).addClass('back-pos');
          }
        });

        setTimeout(function() {
          isAnimating = false;
        }, 600);
      }

      items.each(function(index) {
        if (index === 0) {
          $(this).addClass('main-pos');
        } else if (index === itemCount - 1) {
          $(this).addClass('left-pos');
        } else if (index === 1) {
          $(this).addClass('right-pos');
        } else {
          $(this).addClass('back-pos');
        }
      });

      function startAutoSwap() {
        autoSwap = setInterval(function() {
          if (!isAnimating) {
            currentIndex = (currentIndex + 1) % itemCount;
            updateSlider();
          }
        }, 5000);
      }

      startAutoSwap();

      $('.carousel-wrap').hover(
        function() {
          clearInterval(autoSwap);
        },
        function() {
          startAutoSwap();
        }
      );

      $('#next').click(function() {
        if (!isAnimating) {
          currentIndex = (currentIndex + 1) % itemCount;
          updateSlider();
        }
      });

      $('#prev').click(function() {
        if (!isAnimating) {
          currentIndex = (currentIndex - 1 + itemCount) % itemCount;
          updateSlider();
        }
      });
    }
  };
  
  carousel.init();
});