/* Digvijay Singh — portfolio interactions. Vanilla JS, no deps. */
(function () {
  "use strict";

  /* 1. Kinetic gold word in the hero — crossfade rotation */
  var words = ["directed", "produced", "edited", "crafted", "colored", "scored"];
  var el = document.querySelector(".kinword");
  if (el) {
    var i = 0;
    setInterval(function () {
      el.classList.add("swap");
      setTimeout(function () {
        i = (i + 1) % words.length;
        el.textContent = words[i];
        el.classList.remove("swap");
      }, 480);
    }, 2600);
  }

  /* 2. Aurora cursor parallax */
  var aurora = document.querySelector(".aurora");
  if (aurora && window.matchMedia("(pointer:fine)").matches) {
    window.addEventListener("mousemove", function (e) {
      var x = (e.clientX / window.innerWidth - 0.5) * 22;
      var y = (e.clientY / window.innerHeight - 0.5) * 22;
      aurora.style.translate = x + "px " + y + "px";
    });
  }

  /* 3. Nav background on scroll */
  var nav = document.querySelector(".nav");
  function onScroll() {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 24);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* 4. Scroll reveals via IntersectionObserver */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    reveals.forEach(function (r) { io.observe(r); });
  } else {
    reveals.forEach(function (r) { r.classList.add("in"); });
  }

  /* 5. Footer year */
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
