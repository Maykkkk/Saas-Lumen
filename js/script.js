/* ==========================================================
   Lumen landing page – interactions
   No libraries. Sections:
   1.  Mobile navigation
   2.  Header, scroll progress + active link highlight
   3.  Pricing monthly/yearly toggle (animated numbers)
   4.  Sign-up modal
   5.  Form validation + success messages
   6.  Scroll reveal (staggered) + count-up stats
   7.  Card spotlight + hero 3D tilt
   8.  Live inbox feed in the hero mockup
   ========================================================== */

document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Mobile navigation ---------- */
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");

  function setMenu(open) {
    navMenu.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(open));
  }

  navToggle.addEventListener("click", () => {
    setMenu(navToggle.getAttribute("aria-expanded") !== "true");
  });
  // Close the menu after choosing a link or button, or pressing Escape
  navMenu.addEventListener("click", (e) => {
    if (e.target.closest("a, button")) setMenu(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });

  /* ---------- 2. Header, progress bar, active link ---------- */
  const header = document.querySelector(".site-header");
  const progress = document.getElementById("progress");
  const navLinks = [...document.querySelectorAll(".nav-links a")];

  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > 8);

    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.setProperty("--p", max > 0 ? Math.min(y / max, 1).toFixed(4) : 0);

    // Back in the hero: no section is "current", so clear the highlight
    if (y < 200) navLinks.forEach((link) => link.classList.remove("active"));
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || window.scrollY < 200) return;
          navLinks.forEach((link) =>
            link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id)
          );
        });
      },
      { rootMargin: "-45% 0px -50% 0px" } // a section is "current" when it crosses mid-screen
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- 3. Pricing toggle ---------- */
  const billingSwitch = document.getElementById("billing-switch");
  const lblMonthly = document.getElementById("lbl-monthly");
  const lblYearly = document.getElementById("lbl-yearly");
  const amounts = document.querySelectorAll(".amount");

  // Smoothly count a price from its current value to a new one
  function tweenNumber(el, to, prefix = "") {
    const from = parseFloat(el.textContent.replace(/[^0-9.]/g, "")) || 0;
    if (reduceMotion || from === to) {
      el.textContent = prefix + to;
      return;
    }
    const start = performance.now();
    const duration = 450;
    (function frame(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = prefix + Math.round(from + (to - from) * eased);
      if (t < 1) requestAnimationFrame(frame);
    })(start);
  }

  billingSwitch.addEventListener("click", () => {
    const yearly = billingSwitch.getAttribute("aria-checked") !== "true";
    billingSwitch.setAttribute("aria-checked", String(yearly));
    lblMonthly.classList.toggle("is-active", !yearly);
    lblYearly.classList.toggle("is-active", yearly);
    amounts.forEach((el) => tweenNumber(el, Number(yearly ? el.dataset.yearly : el.dataset.monthly), "$"));
  });

  /* ---------- 4. Sign-up modal ---------- */
  const modal = document.getElementById("signup-modal");
  const signupForm = document.getElementById("signup-form");
  const signupSuccess = document.getElementById("signup-success");
  const planSelect = document.getElementById("su-plan");
  let lastFocused = null;

  function openModal(plan) {
    lastFocused = document.activeElement;
    resetForm(signupForm, signupSuccess);
    if (plan) planSelect.value = plan;
    if (typeof modal.showModal === "function") modal.showModal();
    else modal.setAttribute("open", ""); // very old browsers
    document.getElementById("su-name").focus();
  }

  function closeModal() {
    if (typeof modal.close === "function") modal.close();
    else modal.removeAttribute("open");
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll("[data-open-signup]").forEach((btn) =>
    btn.addEventListener("click", () => openModal(btn.dataset.plan))
  );
  modal.querySelectorAll("[data-close-modal]").forEach((btn) =>
    btn.addEventListener("click", closeModal)
  );
  // Click on the dark backdrop (outside the dialog box) closes it
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  /* ---------- 5. Form validation ---------- */
  const validators = {
    required: (v) => v.trim() !== "" || "This field is required.",
    email: (v) =>
      v.trim() === "" || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || "Please enter a valid email address.",
    min: (v, n) => v.trim() === "" || v.trim().length >= n || `Please enter at least ${n} characters.`,
  };

  function setError(field, message) {
    const wrap = field.closest(".field");
    const out = wrap.querySelector(".error");
    out.textContent = message;
    wrap.classList.toggle("has-error", Boolean(message));
    field.setAttribute("aria-invalid", message ? "true" : "false");
  }

  function validateField(field) {
    const rules = (field.dataset.rules || "").split("|").filter(Boolean);
    const value = field.type === "checkbox" ? (field.checked ? "1" : "") : field.value;
    for (const rule of rules) {
      const [name, arg] = rule.split(":");
      const result = validators[name](value, Number(arg));
      if (result !== true) {
        // A friendlier message for the terms checkbox
        setError(field, field.type === "checkbox" ? "Please accept the terms to continue." : result);
        return false;
      }
    }
    setError(field, "");
    return true;
  }

  function resetForm(form, successBox) {
    form.reset();
    form.hidden = false;
    successBox.hidden = true;
    form.querySelectorAll("[data-rules]").forEach((f) => setError(f, ""));
  }

  function handleForm(form, successBox, extra) {
    const fields = [...form.querySelectorAll("[data-rules]")];

    // Validate live: after the first blur, re-check on every change
    fields.forEach((field) => {
      field.addEventListener("blur", () => validateField(field));
      const evt = field.tagName === "SELECT" || field.type === "checkbox" ? "change" : "input";
      field.addEventListener(evt, () => {
        if (field.closest(".field").classList.contains("has-error")) validateField(field);
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const results = fields.map(validateField);
      const firstBad = fields[results.indexOf(false)];
      if (firstBad) {
        firstBad.focus();
        return;
      }

      // Success: no backend, so we just show a confirmation message
      const firstName = form.elements.name.value.trim().split(/\s+/)[0];
      successBox.querySelector("[data-success-name]").textContent = firstName;
      if (extra) extra(form, successBox);
      form.hidden = true;
      successBox.hidden = false;
      successBox.focus();
    });
  }

  handleForm(document.getElementById("demo-form"), document.getElementById("demo-success"));
  handleForm(signupForm, signupSuccess, (form, box) => {
    box.querySelector("[data-success-plan]").textContent = form.elements.plan.value;
  });

  document.querySelectorAll("[data-reset-form]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const form = document.getElementById(btn.dataset.resetForm);
      resetForm(form, form.parentElement.querySelector(".success"));
      form.querySelector("input").focus();
    })
  );

  /* ---------- 6. Scroll reveal + count-up ---------- */
  // Stagger: each .reveal gets a delay based on its position among siblings
  document.querySelectorAll(".reveal").forEach((el) => {
    const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
    el.style.setProperty("--d", Math.min(siblings.indexOf(el), 6));
  });

  function countUp(el) {
    const target = parseFloat(el.dataset.count);
    const decimals = Number(el.dataset.decimals || 0);
    const suffix = el.dataset.suffix || "";
    const format = (n) => n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
    if (reduceMotion) {
      el.textContent = format(target);
      return;
    }
    const start = performance.now();
    const duration = 1600;
    (function frame(now) {
      const t = Math.min((now - start) / duration, 1);
      el.textContent = format(target * (1 - Math.pow(1 - t, 4)));
      if (t < 1) requestAnimationFrame(frame);
    })(start);
  }

  const revealEls = document.querySelectorAll(".reveal");
  const counters = document.querySelectorAll("[data-count]");
  // Show real values even if JS observers never fire
  counters.forEach((el) => (el.textContent = el.dataset.count + (el.dataset.suffix || "")));

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          entry.target.querySelectorAll("[data-count]").forEach(countUp);
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  /* ---------- 7. Card spotlight + hero tilt ---------- */
  document.querySelectorAll(".spot").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", e.clientX - r.left + "px");
      card.style.setProperty("--my", e.clientY - r.top + "px");
    });
  });

  const tilt = document.getElementById("tilt");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (tilt && finePointer && !reduceMotion) {
    const mock = tilt.querySelector(".mock");
    tilt.addEventListener("pointermove", (e) => {
      const r = tilt.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      mock.style.setProperty("--ry", (x * 10).toFixed(2) + "deg");
      mock.style.setProperty("--rx", (-y * 8).toFixed(2) + "deg");
    });
    tilt.addEventListener("pointerleave", () => {
      mock.style.setProperty("--ry", "0deg");
      mock.style.setProperty("--rx", "0deg");
    });
  }

  /* ---------- 8. Live inbox feed in the hero mockup ---------- */
  const feed = document.getElementById("feed");
  if (feed && !reduceMotion) {
    const incoming = [
      ["SN", "a2", "Sneha Nair", "Where can I find my invoice?"],
      ["RV", "a3", "Rahul Verma", "Loving the new update!"],
      ["TB", "a4", "Tara Bose", "Need help with the API key"],
      ["OK", "a1", "Omar Khan", "Can we add 5 more seats?"],
    ];
    let i = 0;

    setInterval(() => {
      if (document.hidden) return;
      const [initials, tone, name, text] = incoming[i++ % incoming.length];

      const item = document.createElement("div");
      item.className = "mock-msg new";
      item.innerHTML =
        `<span class="avatar ${tone}">${initials}</span>` +
        `<div><strong>${name}</strong><small>${text}</small></div><em>now</em>`;
      feed.insertBefore(item, feed.firstChild);

      // Keep four rows; age the timestamps of the rest
      [...feed.children].slice(1).forEach((row, n) => {
        const em = row.querySelector("em");
        if (em && n === 0) em.textContent = "1m";
      });
      while (feed.children.length > 4) feed.lastElementChild.remove();
    }, 4200);
  }

  // Footer year
  document.getElementById("year").textContent = new Date().getFullYear();
});
