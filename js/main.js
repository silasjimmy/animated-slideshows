{
  class Slideshow {
    constructor(el) {
      this.slideshow = el;
      this.rect = this.slideshow.getBoundingClientRect();

      this.slides = Array.from(
        this.slideshow.querySelectorAll(".slides > .slide")
      );
      this.slideTitles = this.slideshow.querySelectorAll("h1");
      this.slideSubTitles = this.slideshow.querySelectorAll("p");

      this.navWrapper = this.slideshow.querySelector(".navigation");
      this.prevCtrl = this.navWrapper.querySelector("span.prev");
      this.nextCtrl = this.navWrapper.querySelector("span.next");

      this.currentSlideIndex = 0;

      // this.createNav();
      this.init();
      this.initEvents();
    }

    init() {
      // Split slide titles and subtitles to separate characters
      this.slideTitles.forEach((el) => charming(el, { classPrefix: "letter" }));
      this.slideSubTitles.forEach((el) =>
        charming(el, { classPrefix: "letter" })
      );
    }

    /**
     * Creates the slideshow navigation
     */
    createNav() {
      for (let i = 0; i < this.slides.length; i++) {
        const indicator = document.createElement("span");
        indicator.className = "num";
        indicator.textContent = "0" + (i + 1);
        this.navWrapper.appendChild(indicator);

        if (i !== this.slides.length - 1) {
          const sep = document.createElement("div");
          sep.className = "bar";
          this.navWrapper.appendChild(sep);
        }
      }
    }

    initEvents() {
      this.prevCtrl.addEventListener("click", () => this.navigate("prev"));
      this.nextCtrl.addEventListener("click", () => this.navigate("next"));
    }

    navigate(dir) {
      const animateSlideImage = (slide) => {
        const slideWidth = slide.getBoundingClientRect().width;

        return anime({
          targets: slide,
          translateX: dir === "next" ? -1 * slideWidth : slideWidth,
          duration: 800,
          easing: dir === "next" ? "easeInCubic" : "easeInOutCubic",
          // complete: () => resolve(),
        });
      };

      const animateSlideText = (slide) => {
        const animation = anime
          .timeline({
            targets: slide.querySelectorAll("h1 > span"),
            direction: dir === "next" ? "normal" : "reverse",
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
            targets: slide.querySelectorAll("p > span"),
            duration: 500,
            direction: dir === "next" ? "normal" : "reverse",
            delay: function (el, index) {
              return index * 20;
            },
            easing: "easeOutElastic",
            opacity: [0, 1],
            translateY: function (el, index) {
              return index % 2 === 0 ? ["-80%", "0%"] : ["80%", "0%"];
            },
          });

        return animation;
      };

      /**
       * Next animation pseudocode
       * 1. reverse current slide subtitle
       * 2. reverse current slide title
       * 3. exit current slide image
       * 4. enter next slide image
       * 5. normal next slide title
       * 6. normal next slide subtitle
       */

      animateSlideImage(this.slides[this.currentSlideIndex]);

      // Next slide animation

      // const nextSlideAnimation = anime
      //   .timeline({
      //     targets:
      //       this.slideTitles[this.currentSlideIndex].querySelectorAll(
      //         "h1 > span"
      //       ),
      //     direction: dir === "next" ? "normal" : "reverse",
      //     duration: 800,
      //     delay: function (el, index) {
      //       return index * 50;
      //     },
      //     easing: "easeOutElastic",
      //     opacity: [0, 1],
      //     translateY: function (el, index) {
      //       return index % 2 === 0 ? ["-80%", "0%"] : ["80%", "0%"];
      //     },
      //   })
      //   .add({
      //     targets:
      //       this.slideSubTitles[this.currentSlideIndex].querySelectorAll(
      //         "p > span"
      //       ),
      //     duration: 500,
      //     direction: dir === "next" ? "normal" : "reverse",
      //     delay: function (el, index) {
      //       return index * 20;
      //     },
      //     easing: "easeOutElastic",
      //     opacity: [0, 1],
      //     translateY: function (el, index) {
      //       return index % 2 === 0 ? ["-80%", "0%"] : ["80%", "0%"];
      //     },
      //   });

      // nextSlideAnimation.finished.then(animateSlideImage);

      // // Update the index of the current slide
      // this.currentSlideIndex = this.slides.indexOf(
      //   this.slideshow.querySelector(".slides > .current-slide")
      // );
    }
  }

  new Slideshow(document.querySelector(".slideshow"));
}
