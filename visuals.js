/* Presentation only: connects original town art to existing, tested alpha actions.
 * No game-state duplication, remote assets, keys, timers that award currency,
 * analytics, email, API requests or paid services.
 */
document.addEventListener('DOMContentLoaded', () => {
  const hint = document.getElementById('worldHint');
  const stage = document.getElementById('battleStage');
  const result = document.getElementById('battleResult');
  const hotspots = document.querySelectorAll('[data-upgrade]');
  const displayNames = { mine: 'Ember Mine', forge: 'Cinder Forge', tavern: "Traveler's Inn" };
  let messageTimeout;
  function hintText(value) {
    if (!hint) return;
    hint.textContent = value;
    clearTimeout(messageTimeout);
    messageTimeout = setTimeout(() => { hint.textContent = 'Tap a building to upgrade it'; }, 3000);
  }
  function refreshLevels() {
    for (const hot of hotspots) {
      const key = hot.getAttribute('data-upgrade');
      const level = document.getElementById('level-' + key)?.textContent || 'LEVEL 1';
      hot.setAttribute('aria-label', displayNames[key] + ': ' + level + '. Tap to upgrade.');
      hot.dataset.level = String((level.match(/LEVEL (\d+)/) || [])[1] || '1');
    }
  }
  for (const hot of hotspots) {
    hot.addEventListener('click', () => {
      const key = hot.getAttribute('data-upgrade');
      const button = document.getElementById('upgrade-' + key);
      if (!button || button.disabled) {
        hintText('Earn and collect more coins before upgrading ' + displayNames[key] + '.');
        return;
      }
      button.click(); // Delegates to existing economy logic and save flow.
      refreshLevels();
      hintText(displayNames[key] + ' upgraded! Your haven is growing.');
    });
    const key = hot.getAttribute('data-upgrade');
    const label = document.getElementById('level-' + key);
    if (label) new MutationObserver(refreshLevels).observe(label, { childList: true, characterData: true, subtree: true });
  }
  refreshLevels();
  document.getElementById('fight')?.addEventListener('click', () => {
    if (!stage) return;
    stage.classList.remove('victory', 'active');
    void stage.offsetWidth;
    stage.classList.add('active');
    setTimeout(() => stage.classList.remove('active'), 1000);
  });
  if (result && stage) {
    new MutationObserver(() => {
      stage.classList.toggle('victory', result.textContent?.trim().startsWith('VICTORY') === true);
    }).observe(result, { childList: true, characterData: true, subtree: true });
  }
});
