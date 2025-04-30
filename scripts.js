document.addEventListener('DOMContentLoaded', function() {
    // Get references to HTML elements
    const footer = document.querySelector('footer');
    const body = document.body;
    const html = document.documentElement;
    
    // Function to check if content is taller than viewport
    function adjustFooter() {
        // Calculate total document height
        const documentHeight = Math.max(
            body.scrollHeight, body.offsetHeight,
            html.clientHeight, html.scrollHeight, html.offsetHeight
        );
        
        // Get viewport height
        const viewportHeight = window.innerHeight;
        
        // Check if there's enough content to scroll
        if (documentHeight > viewportHeight + 150) { // Adding buffer for footer height
            // Content exceeds viewport - use dynamic footer
            footer.classList.remove('fixed');
            footer.classList.add('dynamic');
        } else {
            // Content fits within viewport - use fixed footer
            footer.classList.remove('dynamic');
            footer.classList.add('fixed');
        }
    }
    
    // Initial check
    adjustFooter();
    
    // Check on resize and content change
    window.addEventListener('resize', adjustFooter);
    
    // Check on page load complete (for images, etc.)
    window.addEventListener('load', adjustFooter);
    
    // For mobile devices
    if (window.matchMedia('(max-width: 768px)').matches) {
        // Always dynamic on mobile regardless of content height
        footer.classList.remove('fixed');
        footer.classList.add('dynamic');
    }
}); 