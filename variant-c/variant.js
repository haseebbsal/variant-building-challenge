// Test Configuration
let testInfo = {
    name: `CF 01 - Ramp Home: Insert CFO ROI Snapshot section`,
  };
  
  // Initialize test and exit if already running
  let testInitiated = initTest(testInfo);
  if (!testInitiated) {
    // Already running; stop here
  } else {
    // Main Code
    addStyling();
    monitorChangesByConditionAndRun(checkForElements, onElementsFound);
  }
  
  // === MAIN FUNCTIONS ===
  
  function onElementsFound() {
    try {
      console.log(`Running Code for: `, testInfo.name, testInfo);
      document.querySelector(`body`)?.setAttribute(`cf-test-active`, testInfo.name);
  
      // Idempotency
      const existing = document.getElementById('cf-standout-roi');
      if (existing) {
        console.warn('cf-standout-roi already exists; skipping insert.');
        return;
      }
  
      // Anchor
      const anchor = document.querySelector('section.bg-white.spacer-p-t-l');
      if (!anchor) {
        console.error('Anchor section for Product Suite not found; aborting variant render.');
        return;
      }
  
      // Build UI (no JSX)
      const ui = StandoutROI();
  
      // Insert after the anchor
      if (anchor.parentElement) {
        anchor.insertAdjacentElement('afterend', ui);
      } else {
        console.error('Anchor has no parentElement; cannot insert ROI section.');
        return;
      }
  
      // Setup IntersectionObserver
      const sectionEl = document.getElementById('cf-standout-roi');
      const fillEl = document.getElementById('cf-roi-progress-fill');
      if (!sectionEl || !fillEl) {
        console.error('ROI section or progress fill element missing after insertion.');
        return;
      }
  
      // Prevent multiple observers
      if (!fillEl._cfObserverAttached) {
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
                fillEl.classList.add('cf:w-[82%]');
                io.disconnect();
              }
            });
          },
          { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] }
        );
        io.observe(sectionEl);
        fillEl._cfObserverAttached = true;
      }
  
      // Notify Coframe SDK
      window.CFQ = window.CFQ || [];
      window.CFQ.push({ emit: 'variantRendered' });
    } catch (e) {
      console.error('Unexpected error during variant render:', e);
    }
  }
  
  function checkForElements() {
    try {
      const cfDefined = typeof window.CF !== 'undefined';
      console.log("Check: typeof window.CF !== 'undefined' =>", cfDefined);
  
      const anchor = document.querySelector('section.bg-white.spacer-p-t-l');
      const anchorFound = !!anchor;
      console.log("Check: anchor 'section.bg-white.spacer-p-t-l' found =>", anchorFound);
  
      const notInserted = !document.getElementById('cf-standout-roi');
      console.log("Check: not already inserted (#cf-standout-roi) =>", notInserted);
  
      const testActiveSelector = `body[cf-test-active="${testInfo.name}"]`;
      const testActiveElem = document.querySelector(testActiveSelector);
      const testActiveAbsent = !testActiveElem;
      console.log(`Check: !document.querySelector('${testActiveSelector}') =>`, testActiveAbsent);
  
      return cfDefined && anchorFound && notInserted && testActiveAbsent;
    } catch (e) {
      console.error('Check error:', e);
      return false;
    }
  }
  
  // === HELPER FUNCTIONS ===
  
  function addStyling() {
    const cssArray = [];
    cssArray.forEach(({ desc, css }) => {
      const newStyleElem = document.createElement('style');
      newStyleElem.dataset.desc = desc;
      newStyleElem.innerHTML = css;
      document.head.insertAdjacentElement('beforeend', newStyleElem);
    });
  }
  
  function monitorChangesByConditionAndRun(check, code, keepChecking = false) {
    const checkAndRun = () => {
      if (check()) {
        if (!keepChecking) observer.disconnect();
        code();
        return true;
      }
      return false;
    };
  
    const observer = new MutationObserver(() => {
      try {
        checkAndRun();
      } catch (e) {
        console.error('monitorChangesByConditionAndRun error:', e);
      }
    });
  
    observer.observe(document.documentElement, { childList: true, subtree: true });
  
    try {
      checkAndRun();
    } catch (e) {
      console.error('Initial checkAndRun error:', e);
    }
  
    if (!keepChecking) setTimeout(() => observer.disconnect(), 10000);
  }
  
  function initTest() {
    let cfObj = window.CF || { qaTesting: false, testsRunning: [] };
  
    if (cfObj.testsRunning.find((test) => test.name == testInfo.name)) {
      console.warn(`The following test is already running: `, testInfo);
      return false;
    }
  
    cfObj.testsRunning = [...cfObj.testsRunning, testInfo];
    window.CF = { ...(window.CF || {}), ...cfObj };
  
    return window.CF;
  }
  
  // === COMPONENT BUILDERS (no JSX) ===
  
  function StandoutROI() {
    const section = document.createElement('section');
    section.id = 'cf-standout-roi';
    section.className =
      'cf:relative cf:overflow-hidden cf:bg-black cf:text-white cf:rounded-none cf:spacer-t-l cf:spacer-p-t-l cf:spacer-p-b-l cf:py-16 cf:md:py-20';
    section.setAttribute('aria-labelledby', 'cf-roi-headline');
  
    const wrapper = document.createElement('div');
    wrapper.className =
      'cf:mx-auto cf:w-full cf:max-w-screen-2xl cf:px-4 cf:md:px-8 cf:lg:px-12 cf:xl:px-16';
    section.appendChild(wrapper);
  
    const eyebrow = document.createElement('div');
    eyebrow.className = 'cf:text-xs cf:uppercase cf:tracking-wide cf:text-white/60';
    eyebrow.textContent = 'CFO ROI Snapshot';
    wrapper.appendChild(eyebrow);
  
    const headline = document.createElement('h2');
    headline.id = 'cf-roi-headline';
    headline.className =
      'cf:mt-4 cf:text-3xl cf:md:text-4xl cf:lg:text-5xl cf:leading-tight cf:font-normal';
    headline.textContent = 'Your time and money back, quantified.';
    wrapper.appendChild(headline);
  
    const subcopy = document.createElement('p');
    subcopy.className = 'cf:mt-4 cf:text-white/60 cf:max-w-[680px]';
    subcopy.textContent = 'Powered by 45,000+ finance teams on Ramp.';
    wrapper.appendChild(subcopy);
  
    const grid = document.createElement('div');
    grid.className = 'cf:mt-10 cf:grid cf:grid-cols-1 cf:md:grid-cols-3 cf:gap-4 cf:md:gap-6';
    wrapper.appendChild(grid);
  
    grid.appendChild(ROIStat('Accounting', 'Close 75% faster', 'Accounting automation across entities.'));
    grid.appendChild(ROIStat('Intake-to-pay', '8.5x more efficient', 'Procurement and AP in one flow.'));
    grid.appendChild(ROIStat('Time saved', '325 hours saved/mo', 'Company-wide, representative case.'));
  
    wrapper.appendChild(ProgressBar());
  
    const ctaRow = document.createElement('div');
    ctaRow.className =
      'cf:mt-10 cf:flex cf:flex-col cf:md:flex-row cf:items-stretch cf:md:items-center cf:gap-3';
    ctaRow.innerHTML = `
      <a href="/savings-calculator" class="cf:inline-flex cf:justify-center cf:items-center cf:rounded-md cf:px-5 cf:py-3 cf:bg-[#f6fab2] cf:text-black cf:transition cf:ease-in-out cf:duration-200 cf:hover:brightness-95 cf:text-sm cf:md:text-base">
        Calculate my savings
      </a>
      <a href="/see-a-demo" class="cf:inline-flex cf:justify-center cf:items-center cf:rounded-md cf:px-5 cf:py-3 cf:border cf:border-white/20 cf:text-white cf:hover:border-white/40 cf:bg-transparent cf:transition cf:ease-in-out cf:duration-200 cf:text-sm cf:md:text-base">
        See a demo
      </a>
    `;
    wrapper.appendChild(ctaRow);
  
    const footnote = document.createElement('div');
    footnote.className = 'cf:mt-4 cf:text-[11px] cf:text-white/50';
    footnote.textContent =
      'Figures are representative of customer stories featured on ramp.com; actual results may vary.';
    wrapper.appendChild(footnote);
  
    return section;
  }
  
  function ROIStat(badge, stat, desc) {
    const card = document.createElement('div');
    card.className = 'cf:rounded-xl cf:border cf:border-white/15 cf:bg-white/5 cf:p-5 cf:md:p-6';
    card.innerHTML = `
      <div class="cf:inline-flex cf:items-center cf:rounded-full cf:bg-white/10 cf:text-white/80 cf:text-[11px] cf:px-2 cf:py-1">${badge}</div>
      <div class="cf:mt-4 cf:text-2xl cf:md:text-3xl cf:leading-none">${stat}</div>
      <div class="cf:mt-2 cf:text-white/60">${desc}</div>
    `;
    return card;
  }
  
  function ProgressBar() {
    const container = document.createElement('div');
    container.className = 'cf:mt-10';
    container.innerHTML = `
      <div class="cf:flex cf:items-center cf:justify-between">
        <div class="cf:text-white/80 cf:text-sm">Your potential savings</div>
        <div class="cf:text-[#f6fab2] cf:text-sm">~82%</div>
      </div>
      <div class="cf:mt-3 cf:h-2.5 cf:w-full cf:rounded-full cf:bg-white/10" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="82" aria-label="Potential savings">
        <div id="cf-roi-progress-fill" class="cf:h-full cf:w-0 cf:rounded-full cf:bg-[#f6fab2] cf:transition-all cf:duration-700 cf:ease-out"></div>
      </div>
    `;
    return container;
  }
  