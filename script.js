const root = document.documentElement;
const motion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

window.addEventListener("pointermove", (event) => {
  root.style.setProperty("--mx", event.clientX + "px");
  root.style.setProperty("--my", event.clientY + "px");
});

const bar = document.getElementById("progress-bar");
const onScroll = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const value = max > 0 ? (window.scrollY / max) * 100 : 0;
  bar.style.width = value + "%";
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const reveals = document.querySelectorAll(".reveal");
if (motion) {
  reveals.forEach((node) => node.classList.add("in"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );
  reveals.forEach((node, index) => {
    node.style.transitionDelay = (index % 4) * 0.08 + "s";
    observer.observe(node);
  });
}

const canvas = document.getElementById("specks");
const context = canvas.getContext("2d");

if (!motion && context) {
  let width = 0;
  let height = 0;
  let specks = [];

  const seed = () => {
    const count = Math.min(70, Math.floor(window.innerWidth / 18));
    specks = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.5 + 0.3,
      s: Math.random() * 0.35 + 0.05,
      a: Math.random() * 0.4 + 0.08,
      drift: Math.random() * 0.3 - 0.15
    }));
  };

  const resize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    seed();
  };

  const draw = () => {
    context.clearRect(0, 0, width, height);
    specks.forEach((speck) => {
      speck.y -= speck.s;
      speck.x += speck.drift;
      if (speck.y < -4) speck.y = height + 4;
      if (speck.x < -4) speck.x = width + 4;
      if (speck.x > width + 4) speck.x = -4;
      context.beginPath();
      context.fillStyle = "rgba(236, 238, 242, " + speck.a + ")";
      context.arc(speck.x, speck.y, speck.r, 0, Math.PI * 2);
      context.fill();
    });
    requestAnimationFrame(draw);
  };

  window.addEventListener("resize", resize);
  resize();
  draw();
}
