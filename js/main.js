{
  // From https://davidwalsh.name/javascript-debounce-function.
  function debounce(func, wait, immediate) {
    var timeout;
    return function () {
      var context = this,
        args = arguments;
      var later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  class Slideshow {
    constructor(el) {
      this.slideshow = el;

      this.slides = Array.from(
        this.slideshow.querySelectorAll(".slides > .slide")
      );
      this.slidesTotal = this.slides.length;

      this.slideshowNav = this.slideshow.querySelector(".slide--nav");
      this.nextBtn = this.slideshowNav.querySelector(".next");
      this.prevBtn = this.slideshowNav.querySelector(".prev");

      this.currentSlideIndex = 0;
      this.rect = this.slideshow.getBoundingClientRect();

      this.initEvents();
    }

    initEvents() {
      this.nextBtn.addEventListener("click", () => this.navigate("next"));
      this.prevBtn.addEventListener("click", () => this.navigate("prev"));
      window.addEventListener(
        "resize",
        debounce(() => {
          this.rect = this.slideshow.getBoundingClientRect();
        }, 20)
      );
    }

    navigate(dir) {
      if (this.isAnimating) return false;
      this.isAnimating = true;

      const animateSlides = () => {
        return new Promise((resolve, reject) => {
          const currentSlide = this.slides[this.currentSlideIndex];

          anime({
            targets: currentSlide,
            duration: 600,
            easing: "easeOutQuint",
            translateX: dir === "next" ? -1 * this.rect.width : this.rect.width,
            complete: () => {
              currentSlide.classList.remove("current--slide");
              resolve();
            },
          });

          this.currentSlideIndex =
            dir === "next"
              ? this.currentSlideIndex < this.slidesTotal - 1
                ? this.currentSlideIndex + 1
                : 0
              : this.currentSlideIndex > 0
              ? this.currentSlideIndex - 1
              : this.slidesTotal - 1;

          const newSlide = this.slides[this.currentSlideIndex];
          newSlide.classList.add("current--slide");

          anime({
            targets: newSlide,
            duration: 600,
            easing: "easeOutQuint",
            translateX: [
              dir === "next" ? this.rect.width : -1 * this.rect.width,
              0,
            ],
          });

          const newSlideImg = newSlide.querySelector(".slide--img");
          anime.remove(newSlideImg);
          anime({
            targets: newSlideImg,
            duration: 600 * 4,
            easing: "easeOutQuint",
            translateX: [dir === "next" ? 200 : -200, 0],
          });

          anime({
            targets: [
              newSlide.querySelector("h1"),
              newSlide.querySelector("h2"),
            ],
            duration: 600 * 2,
            easing: "easeOutQuint",
            delay: (t, i) => i * 100 + 100,
            translateX: [dir === "next" ? 300 : -300, 0],
            opacity: [0, 1],
            complete: () => (this.isAnimating = false),
          });
        });
      };

      animateSlides();
    }
  }

  new Slideshow(document.querySelector(".slideshow"));
}
