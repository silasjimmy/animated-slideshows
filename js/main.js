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
      this.init();
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

    init() {
      // Add click event listener to navigation buttons
      let navButtons = Array.from(this.navWrapper.querySelectorAll("span.num"));

      navButtons.forEach((el) => {
        el.addEventListener("click", () => {
          const index = navButtons.indexOf(el);
          this.slideshow
            .querySelector(".slides > .current-slide")
            .classList.remove("current-slide");
          this.slides[index].classList.add("current-slide");
        });
      });
    }

    navigate(el) {}
  }

  new Slideshow(document.querySelector(".slideshow"));
}
