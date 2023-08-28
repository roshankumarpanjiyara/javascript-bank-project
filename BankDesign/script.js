"use strict";
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");

const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");

const nav = document.querySelector(".nav");

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");
///////////////////////////////////////
// Modal window

const openModal = function (e) {
    e.preventDefault();
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
};

const closeModal = function () {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

// for (let i = 0; i < btnsOpenModal.length; i++)
//     btnsOpenModal[i].addEventListener("click", openModal);

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
        closeModal();
    }
});

//button scrolling
btnScrollTo.addEventListener("click", function (e) {
    const s1coords = section1.getBoundingClientRect();//section 1 coordinates

    //coordinates and dimensions
    console.log(s1coords);
    console.log(e.target.getBoundingClientRect());
    console.log('current scroll x, y', window.pageXOffset, pageYOffset);
    console.log('width, height viewport', document.documentElement.clientWidth, document.documentElement.clientHeight);

    //scrolling

    // window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset);

    // window.scrollTo({
    //     left: s1coords.left + window.scrollX,
    //     top: s1coords.top + window.scrollY,
    //     behavior: "smooth",
    // })

    //another way of scroll
    section1.scrollIntoView({ behavior: "smooth" });
});

//page navigation

// document.querySelectorAll('.nav__link').forEach(function (el) {
//     el.addEventListener("click", function (e) {
//         e.preventDefault();
//         // console.log("LINK");
//         const id = this.getAttribute("href");
//         document.querySelector(id).scrollIntoView({ behavior: "smooth" });
//     });
// });

//event propagation
document.querySelector('.nav__links').addEventListener("click", function (e) {
    // console.log(e.target);
    e.preventDefault();

    //matching strategy
    if (e.target.classList.contains("nav__link")) {
        // console.log("LINK");
        const id = e.target.getAttribute("href");
        document.querySelector(id).scrollIntoView({ behavior: "smooth" });
    }
});

//tabbed component

// tabs.forEach(t => t.addEventListener('click', () => console.log("TAB")));
tabsContainer.addEventListener("click", function (e) {
    const clicked = e.target.closest('.operations__tab');
    // console.log(clicked);

    //guard clause
    if (!clicked) {
        return;
    }

    //active tab
    tabs.forEach(t => t.classList.remove("operations__tab--active"));
    clicked.classList.add("operations__tab--active");

    //activate content area
    tabsContent.forEach(c => c.classList.remove("operations__content--active"));
    document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});

//menu fade animation
const handleHover = function (e) {
    if (e.target.classList.contains("nav__link")) {
        const link = e.target;
        const siblings = link.closest(".nav").querySelectorAll('.nav__link');
        const logo = link.closest('.nav').querySelector("img");

        siblings.forEach(el => {
            if (el !== link) {
                el.style.opacity = this;
            }
        });
        logo.style.opacity = this;
    }
};
//passing "argument" into handler
nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));

//sticky navbar
// const initialCoords = section1.getBoundingClientRect();
// window.addEventListener("scroll", function (e) {
//     // console.log(window.scrollY);
//     if (window.scrollY > initialCoords.top) {
//         nav.classList.add("sticky");
//     } else {
//         nav.classList.remove("sticky");
//     }
// });

//intersection observer API
const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
    const [entry] = entries;
    // console.log(entry);

    if (!entry.isIntersecting) {
        nav.classList.add("sticky");
    } else {
        nav.classList.remove("sticky");
    }
};

const headerObserver = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

//reveal sections
const allSections = document.querySelectorAll(".section");
const revealSection = function (entries, observer) {
    const [entry] = entries;
    if (!entry.isIntersecting) {
        return;
    }
    entry.target.classList.remove("section--hidden");
    observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15
});

allSections.forEach(function (section) {
    sectionObserver.observe(section);
    section.classList.add("section--hidden");
});

//lazy loading images
const imgTargets = document.querySelectorAll("img[data-src]");// images having data-src attribute

const loadImg = function (entries, observer) {
    const [entry] = entries;

    if (!entry.isIntersecting) {
        return;
    }

    //replace src with data-src
    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener('load', function () {
        entry.target.classList.remove("lazy-img");
    });

    observer.unobserve(entry.target);
};

const imgObserve = new IntersectionObserver(loadImg, {
    root: null,
    threshold: 0,
    rootMargin: '+200px',
});

imgTargets.forEach(img => imgObserve.observe(img));

// slider component
const slider = function () {
    const slides = document.querySelectorAll(".slide");
    const btnLeft = document.querySelector(".slider__btn--left");
    const btnRight = document.querySelector(".slider__btn--right");
    const dotContainer = document.querySelector(".dots");

    let currentSlide = 0;
    const maxSlide = slides.length;

    //functions
    //dots on slide
    const createDots = function () {
        slides.forEach(function (s, i) {
            dotContainer.insertAdjacentHTML('beforeend', `<button class = "dots__dot" data-slide="${i}"></button>`);
        });
    };
    // createDots();

    const activeDot = function (slide) {
        document.querySelectorAll(".dots__dot").forEach(dot => dot.classList.remove("dots__dot--active"));
        document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
    }
    // activeDot(0);

    const goToSlide = function (slide) {
        slides.forEach((s, i) => s.style.transform = `translateX(${100 * (i - slide)}%)`);
    };
    // goToSlide(0);

    // slides.forEach((s, i) => s.style.transform = `translateX(${100 * i}%)`); // 0%, 100%, 200%

    //next slide
    const nextSlide = function () {
        if (currentSlide == maxSlide - 1) {
            currentSlide = 0;
        } else {
            currentSlide++;
        }
        goToSlide(currentSlide); // -100%, 0%, 100%
        activeDot(currentSlide);
    };

    //prev slide
    const prevSlide = function () {
        if (currentSlide == 0) {
            currentSlide = maxSlide - 1;
        } else {
            currentSlide--;
        }
        goToSlide(currentSlide); // -100%, 0%, 100%
        activeDot(currentSlide);
    };

    const init = function () {
        goToSlide(0);
        createDots();
        activeDot(0);
    }
    init();

    //event handler
    btnRight.addEventListener("click", nextSlide);
    btnLeft.addEventListener("click", prevSlide);

    document.addEventListener("keydown", function (e) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        }
        e.key === 'ArrowRight' && nextSlide();
    });

    dotContainer.addEventListener("click", function (e) {
        if (e.target.classList.contains("dots__dot")) {
            const { slide } = e.target.dataset;
            goToSlide(slide);
            activeDot(slide);
        }
    });
}
slider();
