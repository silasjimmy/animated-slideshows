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
      this.navBtns = Array.from(this.slideshowNav.querySelectorAll("span"));
      this.indicatorBars = Array.from(
        this.slideshowNav.querySelectorAll(".bar")
      );

      this.currentSlideIndex = 0;
      this.rect = this.slideshow.getBoundingClientRect();

      this.init();
      this.initEvents();
    }

    init() {
      this.slides.forEach((slide) => {
        const slideContent = slide.querySelector(".slide--content");
        const slideTitles = Array.from(slideContent.querySelectorAll("h1"));
        const slideSubtitle = slideContent.querySelector("h2");

        // Split slide content to letters/spans
        slideTitles.forEach((title) =>
          charming(title, { classPrefix: "letter" })
        );
        charming(slideSubtitle, { classPrefix: "letter" });

        // Change opacity of the first slide content
        if (this.currentSlideIndex === this.slides.indexOf(slide)) {
          slideTitles.forEach((title) => {
            title
              .querySelectorAll("span")
              .forEach((letter) => (letter.style.opacity = 1));

            slideSubtitle
              .querySelectorAll("span")
              .forEach((letter) => (letter.style.opacity = 1));
          });
        }
      });
    }

    initEvents() {
      this.navBtns.forEach((nav) => {
        nav.addEventListener("click", () => {
          clearInterval(this.automaticAnimation);

          this.navigate(this.navBtns.indexOf(nav));

          this.automaticAnimation = setInterval(
            () => this.navigate("next"),
            6000
          );
        });
      });

      window.addEventListener(
        "resize",
        debounce(() => {
          this.rect = this.slideshow.getBoundingClientRect();
        }, 20)
      );

      document.addEventListener("keydown", (ev) => {
        const keyCode = ev.keyCode || ev.which;
        if (keyCode === 37) {
          clearInterval(this.automaticAnimation);

          this.navigate("prev");

          this.automaticAnimation = setInterval(
            () => this.navigate("next"),
            6000
          );
        } else if (keyCode === 39) {
          clearInterval(this.automaticAnimation);

          this.navigate("next");

          this.automaticAnimation = setInterval(
            () => this.navigate("next"),
            6000
          );
        }
      });

      this.automaticAnimation = setInterval(() => this.navigate("next"), 6000);
    }

    navigate(index = null, dir = null) {
      if (typeof index === "number") {
        if (index === this.currentSlideIndex) return;

        // Calculate direction of the slides
        dir =
          this.currentSlideIndex + 1 === this.slidesTotal && index === 0
            ? "next"
            : index > this.currentSlideIndex
            ? "next"
            : "prev";
      } else dir = index;

      if (this.isAnimating) return false;
      this.isAnimating = true;

      this.navBtns[this.currentSlideIndex].classList.remove(
        "current--indicator"
      );

      const animateTextOut = anime
        .timeline({
          targets:
            this.slides[this.currentSlideIndex].querySelectorAll("h1 > span"),
          duration: 800,
          direction: "reverse",
          delay: function (el, index) {
            return index * 50;
          },
          easing: "easeOutElastic",
          opacity: [0, 1],
          translateY: function (el, index) {
            return index % 2 === 0 ? ["-80%", "0%"] : ["80%", "0%"];
          },
        })
        .add({
          targets:
            this.slides[this.currentSlideIndex].querySelectorAll("h2 > span"),
          duration: 500,
          delay: function (el, index) {
            return index * 30;
          },
          opacity: [0, 1],
        });

      const animateSlides = () => {
        const currentSlide = this.slides[this.currentSlideIndex];

        return new Promise((resolve, reject) => {
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

          if (typeof index === "number") this.currentSlideIndex = index;
          else
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
        });
      };

      const animateTextIn = () => {
        const animation = anime
          .timeline({
            targets:
              this.slides[this.currentSlideIndex].querySelectorAll("h1 > span"),
            duration: 800,
            delay: function (el, index) {
              return index * 50;
            },
            easing: "easeOutElastic",
            opacity: [0, 1],
            translateY: function (el, index) {
              return index % 2 === 0 ? ["-80%", "0%"] : ["80%", "0%"];
            },
          })
          .add({
            targets:
              this.slides[this.currentSlideIndex].querySelectorAll("h2 > span"),
            duration: 500,
            delay: function (el, index) {
              return index * 30;
            },
            opacity: [0, 1],
            complete: () => {
              this.navBtns[this.currentSlideIndex].classList.add(
                "current--indicator"
              );
              this.isAnimating = false;
            },
          });

        return animation;
      };

      animateTextOut.finished.then(animateSlides).then(animateTextIn);
    }
  }

  new Slideshow(document.querySelector(".slideshow"));
}
