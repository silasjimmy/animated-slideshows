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
      const currentSlide = this.slides[this.currentSlideIndex];

      const animateTextOut = anime
        .timeline({
          targets: currentSlide.querySelectorAll("h1 > span"),
          direction: "reverse",
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
          targets: currentSlide.querySelectorAll("p > span"),
          duration: 500,
          delay: function (el, index) {
            return index * 20;
          },
          opacity: [0, 1],
        });

      const slideImageAnimation = () => {
        return new Promise((resolve, reject) => {
          anime({
            targets: currentSlide,
            duration: 800,
            easing: "easeOutQuint",
            translateX: dir === "next" ? -1 * this.rect.width : this.rect.width,
            complete: () => {
              currentSlide.classList.remove("current-slide");
              resolve();
            },
          });

          this.currentSlideIndex = 1;
          const nextSlide = this.slides[this.currentSlideIndex];
          nextSlide.classList.add("current-slide");

          anime({
            targets: nextSlide,
            duration: 800,
            easing: "easeOutQuint",
            translateX: [
              dir === "next" ? this.rect.width : -1 * this.rect.width,
              0,
            ],
          });
        });
      };

      const animateTextIn = () => {
        const newSlide = this.slides[this.currentSlideIndex];

        return anime
          .timeline({
            targets: newSlide.querySelectorAll("h1 > span"),
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
            targets: newSlide.querySelectorAll("p > span"),
            duration: 500,
            delay: function (el, index) {
              return index * 20;
            },
            opacity: [0, 1],
          });
      };

      animateTextOut.finished.then(slideImageAnimation).then(animateTextIn);
    }
  }

  new Slideshow(document.querySelector(".slideshow"));
}
