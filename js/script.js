// JavaScript to toggle the sidebar menu
document.addEventListener("DOMContentLoaded", function() {
  const menuBtn = document.getElementById('menu-btn');
  const sidebar = document.getElementById('sidebar');

  // Initially hide the sidebar
  sidebar.style.display = 'none';

  // Toggle sidebar visibility on menu button click
  menuBtn.addEventListener('click', function() {
    if (sidebar.style.display === 'none') {
      sidebar.style.display = 'block';  // Show the sidebar
    } else {
      sidebar.style.display = 'none';  // Hide the sidebar
    }
  });
});
