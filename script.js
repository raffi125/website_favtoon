/**
 * FAVTOON DOWNLOAD PAGE SCRIPT
 * Clean, lightweight, and fast
 */

// Version metadata, synced from version.json
const appMeta = { versionName: '', apkUrl: '', size: '4.1 MB' };

// Download Notification Handler
function handleDownload(event) {
  const version = appMeta.versionName ? ` v${appMeta.versionName}` : '';
  showToast(`📥 Mengunduh Favtoon${version} (${appMeta.size})...`);
}

// Keep page text in sync with version.json (single source of truth).
// Native app repo not published yet, so read the local copy.
// To share one file for app + web: point this to the app's public version.json URL.
const APP_VERSION_URL = 'version.json';

async function syncAppMeta() {
  const version = await fetchVersion(APP_VERSION_URL);
  if (!version) return;

  if (version.versionName) {
    appMeta.versionName = version.versionName;
    setText('updateVersion', `Update v${version.versionName}`);
    setText('downloadLabel', `Download (v${version.versionName})`);

    const desc = document.querySelector('meta[name="description"]');
    if (desc) {
      desc.content = desc.content.replace(/v\d+(\.\d+)*/, `v${version.versionName}`);
    }
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.content = `Download Favtoon v${version.versionName} APK - Baca Komik Indonesia`;
    }
  }

  if (version.downloadUrl) {
    appMeta.apkUrl = /\.apk(\?|$)/i.test(version.downloadUrl)
      ? version.downloadUrl
      : `assets/favtoon-v${version.versionName}.apk`;
    const btn = document.getElementById('downloadBtn');
    if (btn) btn.href = appMeta.apkUrl;
  }

  if (version.changelog) {
    const list = document.getElementById('changelogList');
    if (list) {
      const items = version.changelog
        .split('\n')
        .map((line) => line.replace(/^[•\-\s]+/, '').trim())
        .filter(Boolean);
      list.innerHTML = items
        .map((text) => `<li><span>•</span><span>${escapeHtml(text)}</span></li>`)
        .join('');
    }
  }

  if (appMeta.apkUrl) updateFileSize(appMeta.apkUrl);
}

async function fetchVersion(url) {
  try {
    const res = await fetch(`${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function updateFileSize(url) {
  try {
    const res = await fetch(url, { method: 'HEAD', cache: 'no-store' });
    const bytes = Number(res.headers.get('content-length'));
    if (!bytes) return;
    appMeta.size = `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    setText('appSize', appMeta.size);
  } catch {
    // keep fallback size
  }
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', syncAppMeta);


// Feedback Modal Handler
function openFeedbackModal() {
  const modal = document.getElementById('feedbackModal');
  if (modal) modal.classList.add('active');
}

function closeFeedbackModal() {
  const modal = document.getElementById('feedbackModal');
  if (modal) modal.classList.remove('active');
}

function submitFeedback(event) {
  event.preventDefault();
  const btn = document.getElementById('btnFeedbackSubmit');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengirim...';

  setTimeout(() => {
    closeFeedbackModal();
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Kirim Masukan';
    document.getElementById('feedbackForm').reset();
    showToast('🎉 Terima kasih! Masukan berhasil terkirim.');
  }, 700);
}

// Toast Utility
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.innerHTML = `<i class="fa-solid fa-circle-check text-yellow"></i> ${message}`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

// Close Modal when clicking outside
window.addEventListener('click', (e) => {
  const modal = document.getElementById('feedbackModal');
  if (modal && e.target === modal) {
    closeFeedbackModal();
  }
});
