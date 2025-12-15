// Get the sidebar element
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('sidebar-toggle'); // optional button for mobile

// Optional: toggle sidebar open/close (for mobile or collapsible sidebar)
if (toggleBtn && sidebar) {
  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });
}

// Highlight active page in the sidebar
const currentPage = window.location.pathname.split("/").pop();
const links = sidebar.querySelectorAll('a');

links.forEach(link => {
  if (link.getAttribute('href') === currentPage) {
    link.classList.add('active');
  }
});
