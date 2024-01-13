{
  class Slideshow {
    constructor(el) {
      this.slideshow = el;
      this.navWrapper = this.slideshow.querySelector(".navigation");

      // Slides
      this.slides = Array.from(
        this.slideshow.querySelectorAll(".slides > .slide")
      );

      this.createNav();
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

    navigate() {}
  }

  new Slideshow(document.querySelector(".slideshow"));
}
