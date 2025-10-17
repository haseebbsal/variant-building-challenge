// Test Configuration
var testInfo = {
    name: "CF XX - Hero Image & Benefits Section with Intelligent Layout Shift"
  };
  
  // Initialize test and exit if already running
  var testInitiated = initTest(testInfo);
  if (!testInitiated) return false;
  
  // Run when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onDOMReady);
  } else {
    onDOMReady();
  }
  
  function onDOMReady() {
    console.log("Running Code for:", testInfo.name);
    document.body.setAttribute("cf-test-active", testInfo.name);
  
    var imgUrl = "https://cdn.coframe.com/assets/memoryair/ChatGPT-Image-Oct-17-2025-06_06_21-AM-ac5fbffe-2dae-44ca-8083-3324b619ce0a.webp";
    var NEW_HERO_BG = "url('" + imgUrl + "')";
    var NEW_HERO_ALT = "Memory Air device in nature on moss";
  
    // Update hero background
    var heroHeadline = document.querySelector("#lp-pom-box-417");
    if (heroHeadline) {
      heroHeadline.style.backgroundImage = NEW_HERO_BG;
    }
  
    // Replace mobile image
    var mobileImgContainer = document.querySelector("#lp-pom-image-120 .lp-pom-image-container");
    if (mobileImgContainer) {
      var existingImg = mobileImgContainer.querySelector("img");
      if (existingImg) existingImg.remove();
  
      var newMobileImg = document.createElement("img");
      newMobileImg.src = imgUrl;
      newMobileImg.alt = NEW_HERO_ALT;
      newMobileImg.style.width = "100%";
      newMobileImg.style.height = "auto";
      mobileImgContainer.appendChild(newMobileImg);
    }
  
    // Insert new section AFTER #lp-pom-block-283
    var target = document.querySelector("#lp-pom-block-283");
    if (!target) {
      console.error("Could not find element with ID #lp-pom-block-283");
      return;
    }
  
    // Prevent duplicate insertion
    if (document.getElementById("cf-benefits-section")) {
      console.log("Benefits section already exists — skipping");
      return;
    }
  
    var benefitsSection = document.createElement("div");
    benefitsSection.id = "cf-benefits-section";
    benefitsSection.style.position = "relative";
    benefitsSection.style.width = "100%";
    benefitsSection.style.background = "#ffffff";
    benefitsSection.style.padding = "48px 16px";
    benefitsSection.style.boxSizing = "border-box";
  
    benefitsSection.innerHTML = `
      <div style="max-width: 1000px; margin: 0 auto;">
        <h2 style="text-align:center; font-size:2rem; font-weight:700; color:#000; margin-bottom:2rem;">
          Why Choose Memory Air™?
        </h2>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:24px;">
          ${createBenefit("Improves Memory by 226%", "Clinically proven to enhance recall and cognitive function.")}
          ${createBenefit("Works While You Sleep", "Effortless nightly scent therapy with rotating aromas.")}
          ${createBenefit("All-Natural, No Side Effects", "Drug-free therapy using gentle essential oil blends.")}
          ${createBenefit("Backed by 16 Years of Research", "Created by a Top 2% scientist. Featured in major media.")}
        </div>
      </div>
    `;
  
    target.insertAdjacentElement("afterend", benefitsSection);
    console.log("✅ Inserted new section after #lp-pom-block-283");
  }
  
  function createBenefit(title, description) {
    return `
      <div style="display:flex; align-items:flex-start; gap:12px; background:#fff; padding:16px; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
        <div style="flex-shrink:0; width:48px; height:48px; background:#000; color:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center;">
          ✓
        </div>
        <div>
          <div style="font-weight:700; font-size:1.1rem; margin-bottom:4px;">${title}</div>
          <div style="color:#555; font-size:0.9rem;">${description}</div>
        </div>
      </div>
    `;
  }
  
  function initTest(testInfo) {
    window.CF = window.CF || { qaTesting: false, testsRunning: [] };
  
    if (window.CF.testsRunning.find(function (t) { return t.name === testInfo.name; })) {
      console.warn("Test already running:", testInfo.name);
      return false;
    }
  
    window.CF.testsRunning.push(testInfo);
    return true;
  }
  