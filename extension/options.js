document.addEventListener('DOMContentLoaded', async () => {
  const toggle = document.getElementById('toggle-blocker');

  try {
    const result = await browser.storage.local.get('enabled');
    toggle.checked = result.enabled !== false;
  } catch (e) {
    console.error('⚠️ Failed to load setting:', e);
    toggle.checked = true;
  }

  toggle.addEventListener('change', async () => {
    try {
      await browser.storage.local.set({ enabled: toggle.checked });
      console.log('✅ Setting saved:', toggle.checked);
    } catch (e) {
      console.error('❌ Failed to save setting:', e);
    }
  });
});
