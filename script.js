/**
 * FAVTOON DOWNLOAD PAGE SCRIPT
 * Clean, lightweight, and fast
 */

// Download Notification Handler
function handleDownload(event) {
  showToast('📥 Mengunduh Favtoon v2.0.1 (4.1 MB)...');
}

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
