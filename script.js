// ===============================
// ICONS INIT (Lucide Icons)
// ===============================
lucide.createIcons();


// ===============================
// SIDEBAR TOGGLE (OPEN / CLOSE)
// ===============================
const menuBtn = document.getElementById("menu-btn");
const closeBtns = document.getElementById("close-btn");
const sidebar = document.getElementById("sidebar");

// Open sidebar
menuBtn.addEventListener("click", () => {
  sidebar.classList.remove("-translate-x-full");
});

// Close sidebar
closeBtns.addEventListener("click", () => {
  sidebar.classList.add("-translate-x-full");
});


// ===============================
// CUSTOM CURSOR (DOT FOLLOW)
// ===============================

const dot = document.getElementById("cursor-dot");
const links = document.querySelectorAll("a");
const buttons = document.querySelectorAll("button");

let isActive = false;
let rafId = null;

// reusable function
function initCursor() {
  if (window.innerWidth < 768) {
    dot.style.display = "none";
    destroyCursor();
    return;
  }

  dot.style.display = "block";

  if (isActive) return; // prevent duplicate init
  isActive = true;

  let x = 0, y = 0;
  let targetX = 0, targetY = 0;

  // mouse move
  function mouseMove(e) {
    targetX = e.clientX;
    targetY = e.clientY;
  }

  window.addEventListener("mousemove", mouseMove);

  // animation loop
  function animate() {
    x += (targetX - x) * 0.12;
    y += (targetY - y) * 0.12;

    dot.style.left = x + "px";
    dot.style.top = y + "px";

    rafId = requestAnimationFrame(animate);
  }

  animate();

  // hover/click effects
  function addCursorEffect(elements) {
    elements.forEach((el) => {

      el.addEventListener("mouseenter", () => {
        dot.classList.add("active");
      });

      el.addEventListener("mouseleave", () => {
        dot.classList.remove("active");
      });

      el.addEventListener("click", () => {
        dot.classList.add("click");
        setTimeout(() => dot.classList.remove("click"), 200);
      });

    });
  }

  addCursorEffect(links);
  addCursorEffect(buttons);

  // cleanup function store
  initCursor.cleanup = () => {
    window.removeEventListener("mousemove", mouseMove);
    cancelAnimationFrame(rafId);
    isActive = false;
  };
}

// destroy cursor
function destroyCursor() {
  if (initCursor.cleanup) {
    initCursor.cleanup();
  }
}

// run on load
initCursor();

// run on resize
window.addEventListener("resize", () => {
  initCursor();
});



// ===============================
// INTRO LOADER ANIMATION (GSAP)
// ===============================
gsap.registerPlugin();

const tl = gsap.timeline();

// Text animation on load
tl.from(".load-text span", {
  y: -120,
  opacity: 0,
  stagger: 0.06,
  duration: 1,
  ease: "power3.out"
});


// ===============================
// PAGE LOAD EXIT ANIMATION
// ===============================
window.addEventListener("load", () => {

  const exitTl = gsap.timeline();

  exitTl
    .to({}, { duration: 0.3 }) // small delay

    // SVG wave animation
    .to("#loaderPath", {
      attr: {
        d: "M0,1000 C200,850 800,850 1000,1000 L1000,0 L0,0 Z"
      },
      duration: 1.4,
      ease: "power3.inOut"
    })

    // Move loader up
    .to(".intro", {
      y: "-110%",
      duration: 1.2,
      ease: "power3.inOut"
    }, "-=0.6")

    // Remove from DOM
    .set(".intro", {
      display: "none"
    });

});


// ===============================
// HERO TEXT ANIMATION (LETTER SPLIT)
// ===============================
document.addEventListener("DOMContentLoaded", () => {

  gsap.registerPlugin(ScrollTrigger);

  const titles = document.querySelectorAll(".hero-title");

  titles.forEach(title => {

    // Split text into letters
    function splitNode(node) {
      if (node.nodeName === "BR") return;

      if (node.nodeType === Node.TEXT_NODE) {

        const words = node.textContent.split(/\s+/).filter(w => w.length);
        const fragment = document.createDocumentFragment();

        words.forEach(word => {
          const wordSpan = document.createElement("span");
          wordSpan.classList.add("word");

          word.split("").forEach(letter => {
            const l = document.createElement("span");
            l.classList.add("letter");
            l.textContent = letter;
            wordSpan.appendChild(l);
          });

          fragment.appendChild(wordSpan);
          fragment.appendChild(document.createTextNode(" "));
        });

        node.replaceWith(fragment);
      }

      else if (node.nodeType === Node.ELEMENT_NODE) {
        const children = Array.from(node.childNodes);

        if (children.length === 0) {
          const text = node.textContent.trim();

          const wordSpan = document.createElement("span");
          wordSpan.classList.add("word");

          text.split("").forEach(letter => {
            const l = document.createElement("span");
            l.classList.add("letter");
            l.textContent = letter;
            wordSpan.appendChild(l);
          });

          node.innerHTML = "";
          node.appendChild(wordSpan);

        } else {
          children.forEach(child => splitNode(child));
        }
      }
    }

    splitNode(title);

    // Animate letters on scroll
    gsap.from(title.querySelectorAll(".letter"), {
      y: 80,
      opacity: 0,
      duration: 0.8,
      stagger: 0.03,
      ease: "power4.out",

      scrollTrigger: {
        trigger: title,
        start: "top 80%",
        once: true
      }
    });

  });


  // ===============================
  // HERO SLIDER (SWIPER)
  // ===============================
  new Swiper(".heroProductSwiper", {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    speed: 800,

    autoplay: {
      delay: 3000,
      disableOnInteraction: false
    },

    breakpoints: {
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 }
    }
  });

});


// ===============================
// TESTIMONIAL SCROLL (GSAP + PIN)
// ===============================
gsap.registerPlugin(ScrollTrigger);

const track = document.querySelector(".testimonial-track");
const slider = document.querySelector(".testimonial-slider");

let mm = gsap.matchMedia();

mm.add(
  {
    isMobile: "(max-width: 576px)",
    isDesktop: "(min-width: 577px)",
  },
  (context) => {

    const { isMobile } = context.conditions;

    // Calculate scroll distance
    const scrollHeight =
      track.scrollHeight - slider.offsetHeight;

    // Animate vertical scroll
    gsap.to(track, {
      y: -scrollHeight,

      scrollTrigger: {
        trigger: isMobile ? slider : ".testimonial-container",
        start: "top top",
        end: () => "+=" + scrollHeight,
        scrub: true,
        pin: true
      },
    });

  }
);



// ===============================
// CALCULATOR (PETROL vs EV COST)
// ===============================
function calculateCost() {
  const distance = document.getElementById('distance').value;
  const petrolPrice = document.getElementById('petrolPrice').value;
  const mileage = document.getElementById('mileage').value;
  const electricCost = document.getElementById('electricCost').value;
  const evEfficiency = document.getElementById('evEfficiency').value;

  if (!distance || !petrolPrice || !mileage || !electricCost || !evEfficiency) {
    alert("Please fill all fields");
    return;
  }

  const petrolCostPerDay = (distance / mileage) * petrolPrice;
  const evCostPerDay = (distance / evEfficiency) * electricCost;
  const savings = petrolCostPerDay - evCostPerDay;

  document.getElementById('result').innerHTML = `...`;
}



// ===============================
// CONTACT MODAL (POPUP OPEN/CLOSE)
// ===============================
const openBtn = document.getElementById('openContact');
const closeBtn = document.getElementById('closeContact');
const modal = document.getElementById('contactModal');

openBtn.addEventListener('click', () => {
  modal.classList.remove('hidden');
  modal.classList.add('flex');
});

closeBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
  modal.classList.remove('flex');
});

// Close on outside click
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
});

// Close on ESC
document.addEventListener('keydown', (e) => {
  if (e.key === "Escape") {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
});


// ===============================
// CONTACT FORM (API CALL)
// ===============================
async function sendMail() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  if (!name || !email || !message) {
    alert("Please fill all fields");
    return;
  }

  try {
    const res = await fetch("/api/send-mail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });

    const data = await res.json();

    alert(data.success ? "Message sent ✅" : "Failed ❌");

  } catch (error) {
    alert("Something went wrong");
  }
}


// ===============================
// PRODUCT SECTION (HORIZONTAL SCROLL)
// ===============================
const container = document.querySelector(".productsection");

let lastScroll = window.scrollY;
let scrollX = 0;

// ===============================
// DESKTOP SCROLL → HORIZONTAL
// ===============================
window.addEventListener("scroll", () => {
  const rect = container.getBoundingClientRect();

  if (rect.top < window.innerHeight && rect.bottom > 0) {
    let currentScroll = window.scrollY;
    let diff = currentScroll - lastScroll;

    scrollX += diff * 1.5;

    const maxScroll = container.scrollWidth - container.clientWidth;
    scrollX = Math.max(0, Math.min(scrollX, maxScroll));

    container.style.transform = `translateX(${-scrollX}px)`;
  }

  lastScroll = window.scrollY;
});


// ===============================
// TOUCH (MOBILE)
// ===============================
let startX = 0;
let isTouching = false;

container.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
  isTouching = true;
});

container.addEventListener("touchmove", (e) => {
  if (!isTouching) return;

  e.preventDefault();

  let currentX = e.touches[0].clientX;
  let diff = startX - currentX;

  scrollX += diff * 1.2;

  updateScroll();

  startX = currentX;
}, { passive: false });

container.addEventListener("touchend", () => {
  isTouching = false;
});


// ===============================
// MOUSE DRAG (DESKTOP TOUCH FEEL)
// ===============================
let isDragging = false;

container.addEventListener("mousedown", (e) => {
  isDragging = true;
  startX = e.clientX;
  container.style.cursor = "grabbing";
});

window.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  let currentX = e.clientX;
  let diff = startX - currentX;

  scrollX += diff * 1.2;

  updateScroll();

  startX = currentX;
});

window.addEventListener("mouseup", () => {
  isDragging = false;
  container.style.cursor = "grab";
});


// ===============================
// COMMON FUNCTION
// ===============================
function updateScroll() {
  const maxScroll = container.scrollWidth - container.clientWidth;
  scrollX = Math.max(0, Math.min(scrollX, maxScroll));
  container.style.transform = `translateX(${-scrollX}px)`;
}