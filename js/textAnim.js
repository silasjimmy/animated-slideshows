{
  class TextAnim {
    constructor(el) {
      this.slideshow = el;
      this.slides = Array.from(
        this.slideshow.querySelectorAll(".slides > .slide")
      );
      this.slidesTotal = this.slides.length;
      this.currentSlideIndex = 0;

      this.nav = this.slideshow.querySelector(".slide--nav");
      this.nextBtn = this.nav.querySelector(".next");
      this.prevBtn = this.nav.querySelector(".prev");

      this.init();
      this.initEvents();
    }

    init() {
      // Split slide content to letters/spans
      this.slides.forEach((slide) => {
        const slideContent = slide.querySelector(".slide--content");
        const slideTitles = Array.from(slideContent.querySelectorAll("h1"));
        const slideSubtitle = slideContent.querySelector("h2");

        slideTitles.forEach((title) =>
          charming(title, { classPrefix: "letter" })
        );
        charming(slideSubtitle, { classPrefix: "letter" });
      });
    }

    initEvents() {
      this.nextBtn.addEventListener("click", () => this.animateText("next"));
      this.prevBtn.addEventListener("click", () => this.animateText("prev"));
    }

    animateText(dir) {
      const currentSlide = this.slides[this.currentSlideIndex];

      const animateText = (dir) => {
        const animation = anime
          .timeline({
            targets: currentSlide.querySelectorAll("h1 > span"),
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
            targets: currentSlide.querySelectorAll("h2 > span"),
            duration: 500,
            delay: function (el, index) {
              return index * 30;
            },
            opacity: [0, 1],
          });

        return animation;
      };

      animateText(dir);
    }
  }

  new TextAnim(document.querySelector(".slideshow"));
}
