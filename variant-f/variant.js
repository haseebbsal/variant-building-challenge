// Test Configuration
var testInfo = {
    name: "CF Ramp - Homepage: 'Lovable' Overhaul Variant",
  };
  
  // Initialize test and exit if already running
  var testInitiated = initTest(testInfo);
  if (!testInitiated) {
    console.warn("Test already initiated or failed to initialize.");
  } else {
    addStyling();
    monitorChangesByConditionAndRun(checkForElements, onElementsFound);
  }
  
  // === MAIN FUNCTIONS ===
  
  function onElementsFound() {
    try {
      if (document.documentElement.dataset.cfVariantApplied === "true") {
        console.warn("Variant already applied; skipping.");
        return;
      }
  
      console.log("Running Code for:", testInfo.name);
  
      var hero = document.querySelector("#hero-section");
      var header = document.querySelector("nav header");
      var main = document.querySelector("main");
  
      if (!hero || !header || !main) {
        throw new Error("Required elements not found during applyVariant.");
      }
  
      enhanceHero(hero);
      mountFloatingDock();
      mountStickyCTA(hero, header);
      navbarPolish(header);
      productCardPolish();
      testimonialsPolish();
      footerPolish();
  
      document.documentElement.dataset.cfVariantApplied = "true";
      document.body.setAttribute("cf-test-active", testInfo.name);
  
      window.CFQ = window.CFQ || [];
      window.CFQ.push({ emit: "variantRendered" });
  
      console.log("✅ Variant applied successfully!");
    } catch (err) {
      console.error("❌ Variant failed to apply:", err);
    }
  }
  
  function checkForElements() {
    try {
      var header = !!document.querySelector("nav header");
      var hero = !!document.querySelector("#hero-section");
      var main = !!document.querySelector("main");
      var notApplied = document.documentElement.dataset.cfVariantApplied !== "true";
      var cfObjExists = typeof window.CF !== "undefined";
  
      console.log("Check:", { header, hero, main, notApplied, cfObjExists });
      return header && hero && main && notApplied;
    } catch (e) {
      console.error("Check error:", e);
      return false;
    }
  }
  
  // === VARIANT HELPERS ===
  
  function enhanceHero(hero) {
    try {
      // Create hero backdrop if missing
      if (!document.getElementById("cf-hero-backdrop")) {
        var backdrop = document.createElement("div");
        backdrop.id = "cf-hero-backdrop";
        backdrop.className = "cf:absolute cf:inset-0 cf:-z-10 cf:overflow-hidden";
        backdrop.innerHTML = `
          <div class="cf:absolute cf:inset-0 cf:opacity-90"
            style="background:linear-gradient(135deg,rgba(11,15,31,1)0%,rgba(21,26,47,1)30%,rgba(11,15,31,1)70%,rgba(31,38,63,1)100%);
            background-size:200% 200%;animation:cf-kf-gradientShift 16s ease infinite;">
          </div>
          <div class="cf-particles-layer cf:absolute cf:inset-0 cf:pointer-events-none"></div>
        `;
        hero.prepend(backdrop);
        seedParticles(backdrop.querySelector(".cf-particles-layer"), 10);
      }
  
      // Add badge above headline
      var h1 = hero.querySelector("h1.headline-xl");
      if (h1 && !document.getElementById("cf-hero-badge")) {
        var badge = document.createElement("div");
        badge.id = "cf-hero-badge";
        badge.className = "cf:inline-flex cf:items-center cf:gap-2 cf:rounded-full cf:bg-white/10 cf:text-white/80 cf:px-3 cf:py-1 cf:text-xs cf:mb-3";
        badge.innerHTML = "<span>Loved by 45,000+ finance teams</span>";
        h1.insertAdjacentElement("beforebegin", badge);
      }
  
      // Highlight “Time is money”
      if (h1 && !h1.querySelector(".cf-gradient-text")) {
        var html = h1.innerHTML;
        var replaced = html.replace(/Time is money\.?/i, function (m) {
          var clean = m.replace(/\./, "");
          return '<span class="cf-gradient-text">' + clean + "</span>" + (m.endsWith(".") ? "." : "");
        });
        if (replaced !== html) h1.innerHTML = replaced;
      }
    } catch (e) {
      console.error("enhanceHero error:", e);
    }
  }
  
  function mountFloatingDock() {
    try {
      if (document.getElementById("cf-floating-dock")) return;
      var dock = document.createElement("div");
      dock.id = "cf-floating-dock";
      dock.className =
        "cf:hidden cf:lg:flex cf:fixed cf:bottom-6 cf:right-6 cf:z-50 cf:flex cf:flex-col cf:gap-2 cf:p-2 cf:rounded-2xl cf:shadow-lg cf-glass";
  
      dock.innerHTML = `
        ${dockButton("/see-a-demo", "See a demo", "primary")}
        ${dockButton("/explore-product", "Explore product")}
        ${dockButton("/pricing", "Pricing")}
        ${dockButton("https://app.ramp.com/sign-in", "Sign in")}
      `;
      document.body.appendChild(dock);
    } catch (e) {
      console.error("mountFloatingDock error:", e);
    }
  }
  
  function mountStickyCTA(hero, header) {
    try {
      if (document.getElementById("cf-sticky-cta")) return;
  
      var bar = document.createElement("div");
      bar.id = "cf-sticky-cta";
      bar.className =
        "cf:hidden cf:lg:flex cf:fixed cf:inset-x-0 cf:opacity-0 cf:-translate-y-2 cf:transition-all cf:duration-300 cf:z-40";
      bar.style.top = "var(--nav-height)";
      bar.innerHTML = `
        <div class="cf:mx-auto cf:w-full cf:max-w-screen-2xl cf:px-4 cf:md:px-8 cf:lg:px-12 cf:xl:px-16">
          <div class="cf:mx-auto cf:w-full cf:rounded-xl cf:px-4 cf:py-3 cf:flex cf:items-center cf:justify-between cf-glass">
            <div class="cf:text-sm cf:text-white/90">Save time and money with Ramp</div>
            <a href="/see-a-demo" aria-label="See a demo"
              class="cf:px-4 cf:py-2 cf:rounded-lg cf:bg-[#f6fab2] cf:text-black cf:text-sm cf:font-medium cf-glow-btn">See a demo</a>
          </div>
        </div>
      `;
      document.body.appendChild(bar);
  
      var sticky = document.getElementById("cf-sticky-cta");
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var visible = entry.isIntersecting && entry.intersectionRatio > 0.5;
          if (visible) {
            sticky.classList.remove("cf:opacity-100", "cf:translate-y-0");
            sticky.classList.add("cf:opacity-0", "cf:-translate-y-2");
          } else {
            sticky.classList.remove("cf:opacity-0", "cf:-translate-y-2");
            sticky.classList.add("cf:opacity-100", "cf:translate-y-0");
          }
        });
      }, { threshold: [0, 0.5, 1] });
      observer.observe(hero);
  
      window.addEventListener("beforeunload", function () {
        observer.disconnect();
      });
    } catch (e) {
      console.error("mountStickyCTA error:", e);
    }
  }
  
  function navbarPolish(header) {
    try {
      header.classList.add("cf-glass");
      var demoCTA = header.querySelector('a[href="/see-a-demo"]');
      if (demoCTA) demoCTA.classList.add("cf-glow-btn", "cf:rounded-lg");
      header.querySelectorAll("ul a, [data-testid*='navbar-desktop-trigger']").forEach(function (a) {
        a.classList.add("cf-underline");
      });
    } catch (e) {
      console.error("navbarPolish error:", e);
    }
  }
  
  function productCardPolish() {
    try {
      var selectors = [
        "/intelligence",
        "/corporate-cards",
        "/expense-management",
        "/travel",
        "/accounts-payable",
        "/procurement",
        "/accounting-automation-software",
        "/treasury",
      ];
      var links = document.querySelectorAll(selectors.map(function (s) {
        return 'a[href="' + s + '"]';
      }).join(", "));
      links.forEach(function (a) {
        a.classList.add("cf-card-hover", "cf:rounded-2xl");
      });
    } catch (e) {
      console.error("productCardPolish error:", e);
    }
  }
  
  function testimonialsPolish() {
    try {
      var headings = Array.from(document.querySelectorAll("section h2"));
      var targetSection = headings.find(function (h) {
        return /Don't just take our word for it\./i.test(h.textContent || "");
      });
      if (!targetSection) return;
      var section = targetSection.closest("section");
      if (!section) return;
  
      section.querySelectorAll('[role="button"], [role="group"]').forEach(function (card) {
        card.classList.add("cf-card-hover");
      });
  
      section.querySelectorAll(".pointer-events-none.absolute.inset-0").forEach(function (ov) {
        ov.style.opacity = "0.05";
      });
    } catch (e) {
      console.error("testimonialsPolish error:", e);
    }
  }
  
  function footerPolish() {
    try {
      document.querySelectorAll("footer a").forEach(function (a) {
        a.classList.add("cf-underline", "cf:hover:text-white");
      });
    } catch (e) {
      console.error("footerPolish error:", e);
    }
  }
  
  function dockButton(href, label, variant) {
    var base =
      "cf:flex cf:items-center cf:justify-center cf:rounded-md cf:px-4 cf:py-3 cf:text-sm cf:transition cf:duration-200 cf-glow-btn";
    var variantClass =
      variant === "primary"
        ? "cf:bg-[#f6fab2] cf:text-black cf:hover:bg-[#fff3a0]"
        : "cf:bg-white/10 cf:text-white cf:hover:bg-white/20";
    return '<a href="' + href + '" class="' + base + " " + variantClass + '">' + label + "</a>";
  }
  
  // === PARTICLES ===
  
  function seedParticles(layer, count) {
    if (!layer) return;
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    for (var i = 0; i < count; i++) {
      var dot = document.createElement("span");
      dot.className = "cf:absolute cf:block cf:rounded-full";
      var size = 3 + Math.floor(Math.random() * 3);
      dot.style.width = size + "px";
      dot.style.height = size + "px";
      dot.style.background = "rgba(246,250,178,0.5)";
      dot.style.left = Math.random() * 100 + "%";
      dot.style.top = Math.random() * 100 + "%";
      if (!reduced) {
        var delay = (Math.random() * 6).toFixed(2);
        var duration = (8 + Math.random() * 6).toFixed(2);
        dot.style.animation = "cf-kf-particles " + duration + "s ease-in-out " + delay + "s infinite";
      }
      layer.appendChild(dot);
    }
  }
  
  // === STYLES ===
  
  function addStyling() {
    if (document.getElementById("cf-lovable-styles")) return;
    var css = `
  @keyframes cf-kf-gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
  @keyframes cf-kf-particles { 0% { transform: translate(0,0) scale(1); opacity:0; } 10% { opacity:.6; } 50% { transform: translate(20px,-20px) scale(1.05); opacity:.4; } 100% { transform: translate(60px,-60px) scale(1); opacity:0; } }
  
  .cf-glass {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.12);
    backdrop-filter: blur(12px);
  }
  
  .cf-gradient-text {
    background: linear-gradient(135deg, #f6fab2 0%, #ffd700 50%, #f6fab2 100%);
    -webkit-background-clip: text; color: transparent;
    animation: cf-kf-gradientShift 10s ease-in-out infinite;
  }
  
  .cf-card-hover:hover { transform: translateY(-6px) scale(1.01); box-shadow: 0 20px 40px rgba(0,0,0,0.15); }
  `;
    var style = document.createElement("style");
    style.id = "cf-lovable-styles";
    style.innerHTML = css;
    document.head.appendChild(style);
  }
  
  // === UTILITIES ===
  
  function monitorChangesByConditionAndRun(check, code, keepChecking) {
    var fired = false;
    var observer = new MutationObserver(function () {
      if (!fired && check()) {
        if (!keepChecking) observer.disconnect();
        fired = true;
        code();
      }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    if (check()) code();
    if (!keepChecking) setTimeout(function () { observer.disconnect(); }, 10000);
  }
  
  function initTest(info) {
    window.CF = window.CF || { qaTesting: false, testsRunning: [] };
    if (window.CF.testsRunning.find(function (t) { return t.name === info.name; })) {
      console.warn("Test already running:", info);
      return false;
    }
    window.CF.testsRunning.push(info);
    return true;
  }
  