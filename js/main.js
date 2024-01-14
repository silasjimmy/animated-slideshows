{
  class Slideshow {
    constructor(el) {
      this.slideshow = el;
      this.rect = this.slideshow.getBoundingClientRect();
      this.slides = Array.from(
        this.slideshow.querySelectorAll(".slides > .slide")
      );

      this.navWrapper = this.slideshow.querySelector(".navigation");
      this.prevCtrl = this.navWrapper.querySelector("span.prev");
      this.nextCtrl = this.navWrapper.querySelector("span.next");

      this.currentSlideIndex = 0;

      // this.createNav();
      this.initEvents();
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

      anime({
        targets: currentSlide,
        translateX: dir === "next" ? -1 * this.rect.width : this.rect.width,
        duration: 800,
        easing: dir === "next" ? "easeInCubic" : "easeOutCubic",
      });

      // // Update the index of the current slide
      // this.currentSlideIndex = this.slides.indexOf(
      //   this.slideshow.querySelector(".slides > .current-slide")
      // );

      // console.log(this.rect.width);
    }
  }

  new Slideshow(document.querySelector(".slideshow"));
}
