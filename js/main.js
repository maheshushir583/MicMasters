// Global interactions for Mic Masters Academy

document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("navbar");
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const navLinks = document.querySelector(".nav-links");

  const updateNavbar = () => {
    if (!navbar) return;
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  };

  updateNavbar();
  window.addEventListener("scroll", updateNavbar, { passive: true });

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("active");
      navbar?.classList.toggle("menu-open", isOpen);
      mobileMenuBtn.setAttribute("aria-expanded", String(isOpen));

      const icon = mobileMenuBtn.querySelector("i");
      icon?.classList.toggle("fa-bars", !isOpen);
      icon?.classList.toggle("fa-times", isOpen);
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        navbar?.classList.remove("menu-open");
        mobileMenuBtn.setAttribute("aria-expanded", "false");

        const icon = mobileMenuBtn.querySelector("i");
        icon?.classList.add("fa-bars");
        icon?.classList.remove("fa-times");
      });
    });
  }

  const animatedElements = document.querySelectorAll(".fade-up, .fade-in, .fade-left, .fade-right");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    animatedElements.forEach((element) => observer.observe(element));
  } else {
    animatedElements.forEach((element) => element.classList.add("in-view"));
  }

  const statsSection = document.getElementById("stats");
  if (statsSection && "IntersectionObserver" in window) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || statsSection.classList.contains("counted")) return;

          statsSection.classList.add("counted");
          document.querySelectorAll(".stat-number[data-target]").forEach((counter) => {
            const target = Number(counter.getAttribute("data-target"));
            const showPlus = counter.getAttribute("data-plus") === "true";
            let current = 0;
            const increment = Math.max(target / 50, 1);

            const updateCount = () => {
              current += increment;
              if (current < target) {
                counter.textContent = `${Math.ceil(current)}${showPlus ? "+" : ""}`;
                requestAnimationFrame(updateCount);
              } else {
                counter.textContent = `${target}${showPlus ? "+" : ""}`;
              }
            };

            updateCount();
          });
        });
      },
      { threshold: 0.45 }
    );

    statsObserver.observe(statsSection);
  }

  document.querySelectorAll("[data-whatsapp-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const recipient = form.getAttribute("data-whatsapp-recipient") || "919921362708";
      const prefix = form.getAttribute("data-whatsapp-prefix") || "New enquiry from Mic Masters website";
      const lines = [prefix, ""];

      formData.forEach((value, key) => {
        const label = key
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (letter) => letter.toUpperCase());
        lines.push(`${label}: ${value}`);
      });

      window.open(`https://wa.me/${recipient}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");
      form.reset();
    });
  });

  const filterBtns = document.querySelectorAll("[data-filter]");
  const galleryItems = document.querySelectorAll("[data-gallery-category]");

  if (filterBtns.length && galleryItems.length) {
    filterBtns.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.getAttribute("data-filter");

        filterBtns.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        galleryItems.forEach((item) => {
          const category = item.getAttribute("data-gallery-category");
          item.hidden = filter !== "all" && category !== filter;
        });
      });
    });
  }
});
