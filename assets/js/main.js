const navMenu = document.getElementById("nav-menu"),
  navToggle = document.getElementById("nav-toggle"),
  navClose = document.getElementById("nav-close");

if (navToggle) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.add("show-menu");
  });
}

if (navClose) {
  navClose.addEventListener("click", () => {
    navMenu.classList.remove("show-menu");
  });
}

const navLink = document.querySelectorAll(".nav__link");

const linkAction = () => {
  const navMenu = document.getElementById("nav-menu");
  navMenu.classList.remove("show-menu");
};
navLink.forEach((n) => n.addEventListener("click", linkAction));

const typedHome = new Typed("#home-typed", {
  strings: [
    "a Developer",
    "a Student",
    "an Enthusiast",
    "an Innovator",
    "a Technologist",
  ],
  typeSpeed: 80,
  backSpeed: 40,
  backDelay: 2000,
  loop: true,
  cursorChar: "_",
});

const shadowHeader = () => {
  const header = document.getElementById("header");
  this.scrollY >= 50
    ? header.classList.add("shadow-header")
    : header.classList.remove("shadow-header");
};

window.addEventListener("scroll", shadowHeader);

const contactForm = document.getElementById("contact-form"),
  contactMessage = document.getElementById("contact-message");

const sendEmail = (e) => {
  e.preventDefault();
  emailjs
    .sendForm(
      "service_yae2sl5",
      "template_ps5tnjr",
      "#contact-form",
      "mw4HjgALzc5F6pg84",
    )
    .then(
      () => {
        contactMessage.textContent = "Message sent successfully!";

        setTimeout(() => {
          contactMessage.textContent = "";
        }, 5000);

        contactForm.reset();
      },
      () => {
        contactMessage.textContent = "Message not sent.";
      },
    );
};

contactForm.addEventListener("submit", sendEmail);

const scrollUp = () => {
  const scrollUp = document.getElementById("scroll-up");
  this.scrollY >= 350
    ? scrollUp.classList.add("show-scroll")
    : scrollUp.classList.remove("show-scroll");
};

window.addEventListener("scroll", scrollUp);

const sections = document.querySelectorAll("section[id]");

const scrollActive = () => {
  const scrollDown = window.scrollY;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight,
      sectionTop = current.offsetTop - 58,
      sectionId = current.getAttribute("id"),
      sectionsClass = document.querySelector(
        ".nav__menu a[href*=" + sectionId + "]",
      );

    if (scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight) {
      sectionsClass.classList.add("active-link");
    } else {
      sectionsClass.classList.remove("active-link");
    }
  });
};

window.addEventListener("scroll", scrollActive);

const sr = ScrollReveal({
  origin: "top",
  distance: "60px",
  duration: 2000,
});

sr.reveal(".home__content, .resume__content:nth-child(1), .footer__container");
sr.reveal(".home__data, .resume__content:nth-child(2)", {
  delay: 300,
  origin: "bottom",
});

sr.reveal(".about__content, .contact__content", { origin: "bottom" });
sr.reveal(".about__image, .contact__form", { delay: 300 });

sr.reveal(".projects__card", { interval: 100 });
