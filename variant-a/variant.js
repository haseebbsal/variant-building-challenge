
// Find the hero headline and change it
const heroHeadline = document.querySelector('#hero-section h1.headline-xl');

if (heroHeadline) {
  // Replace the headline text with the new version
  heroHeadline.textContent = 'Every second counts — make yours profitable.';

  console.log('Headline updated successfully');

  // Emit variant rendered event
  window.CFQ = window.CFQ || [];
  window.CFQ.push({ emit: 'variantRendered' });
} else {
  console.error('Hero headline not found');
}
