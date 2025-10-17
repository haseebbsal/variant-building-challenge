
// Find the hero headline and change it
const imgUrl="https://cdn.coframe.com/assets/memoryair/ChatGPT-Image-Oct-17-2025-06_06_21-AM-ac5fbffe-2dae-44ca-8083-3324b619ce0a.webp"
const NEW_HERO_URL = `url("${imgUrl}")`;
const NEW_HERO_ALT = 'Memory Air device in nature on moss';
const heroHeadline = document.querySelector('#lp-pom-box-417');
const heroHeadlineMobile = document.querySelector('#lp-pom-image-120').querySelector("img");



if (heroHeadline) {
  // Replace the headline text with the new version

  heroHeadline.style.backgroundImage = NEW_HERO_URL

  heroHeadlineMobile.src = NEW_HERO_URL
  heroHeadlineMobile.remove()

  const newMobileImg=document.createElement("img")
  newMobileImg.src=imgUrl
  newMobileImg.alt=NEW_HERO_ALT

  // mobile image container
  const mobileImgContainer=document.querySelector('#lp-pom-image-120').querySelector(".lp-pom-image-container")
  mobileImgContainer.appendChild(newMobileImg)

  // Emit variant rendered event
  window.CFQ = window.CFQ || [];
  window.CFQ.push({ emit: 'variantRendered' });
} else {
  console.error('Hero headline not found');
}
