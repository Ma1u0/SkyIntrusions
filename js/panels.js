// This JS handles opening/closing panels (legend, filters, future panels)
document.querySelectorAll('.panel-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const panel = document.getElementById(btn.dataset.target);
    // Toggle the 'collapsed' class
    panel.classList.toggle('collapsed');
    // Change the button icon
    btn.textContent = panel.classList.contains('collapsed') ? '▸' : '▾';
  });
});
