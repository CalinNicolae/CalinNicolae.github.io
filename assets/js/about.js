function observeTimelineNodes() {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.timeline-node').forEach(el => observer.observe(el));
}

function initContactForm() {
  document.getElementById('contact-form').addEventListener('submit', e => {
    e.preventDefault();
    document.getElementById('contact-success').style.display = 'block';
  });
}

observeTimelineNodes();
initContactForm();
