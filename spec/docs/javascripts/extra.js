// Add animation classes to elements when they come into view
document.addEventListener('DOMContentLoaded', function() {
  // Add animation to hero sections
  const heroElements = document.querySelectorAll('.hero');
  heroElements.forEach(element => {
    element.classList.add('animate-in');
  });

  // Add copy feedback for code blocks
  document.querySelectorAll('.md-clipboard').forEach(button => {
    const originalTitle = button.title;
    button.addEventListener('click', () => {
      button.title = 'Copied!';
      setTimeout(() => {
        button.title = originalTitle;
      }, 1500);
    });
  });

  // Add smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId !== '#') {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }
    });
  });
});
