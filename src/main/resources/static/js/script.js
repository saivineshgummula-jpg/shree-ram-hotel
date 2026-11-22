/*
  ============================================================
  SREE RAM HOTEL — script.js
  ============================================================

  WHAT IS JAVASCRIPT IN A WEBPAGE?
  - HTML  = Structure (the skeleton of the page)
  - CSS   = Style (how it looks — colors, fonts, layout)
  - JS    = Behaviour (what happens when you click/scroll/interact)

  As a Java dev: JavaScript runs in the BROWSER (client-side).
  No compilation needed. The browser reads and runs it line by line.
  
  KEY CONCEPT — The DOM (Document Object Model):
  When the browser loads your HTML, it builds a "tree" of objects in memory.
  Every HTML element becomes a "node" in this tree.
  JavaScript can find these nodes and change them in real time.
  
  document.getElementById('navbar')  ← like a Java object reference
  element.classList.add('scrolled')  ← calling a method on that object
  ============================================================
*/

/*
  'DOMContentLoaded' fires when the browser has finished reading
  the HTML and built the DOM — but BEFORE images are fully loaded.
  It's like a @PostConstruct in Spring — "do this once everything is ready".
  
  We wrap everything in this event listener so our JS doesn't run
  before the HTML elements it needs exist on the page.
*/
document.addEventListener('DOMContentLoaded', function () {

    // =========================================================
    // 1. NAVBAR — Scroll-based styling + Mobile menu toggle
    // =========================================================

    const navbar     = document.getElementById('navbar');
    const navToggle  = document.getElementById('navToggle');
    const navLinks   = document.getElementById('navLinks');

    /*
      SCROLL EVENT: fires every time the user scrolls the page.
      window.scrollY = how many pixels scrolled from the top.
      If > 50px, we add the 'scrolled' class to the navbar.
      CSS then gives that class a dark background (see style.css).
    */
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /*
      HAMBURGER MENU (mobile): clicking the ☰ button toggles
      the nav links open/closed by adding/removing the 'open' class.
      CSS handles the actual animation (sliding from right).
    */
    navToggle.addEventListener('click', function () {
        navLinks.classList.toggle('open');
    });

    /*
      Close mobile menu when any nav link is clicked.
      querySelectorAll returns a NodeList (like a Java List<Element>).
      We iterate it with forEach.
    */
    document.querySelectorAll('.nav-links a').forEach(function (link) {
        link.addEventListener('click', function () {
            navLinks.classList.remove('open');
        });
    });


    // =========================================================
    // 2. MENU CATEGORY FILTER TABS
    // =========================================================

    /*
      How this works:
      - Each menu item has a data-category attribute (data-category="breakfast")
      - Each tab button has a data-category attribute (data-category="breakfast")
      - When a tab is clicked, we show only items matching that category
      - "all" = show everything
      
      In Java terms: this is like a Stream filter on a List of objects.
    */

    const tabButtons = document.querySelectorAll('.tab-btn');
    const menuItems  = document.querySelectorAll('.menu-item');

    tabButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {

            // 1. Remove 'active' class from all tabs
            tabButtons.forEach(function (b) { b.classList.remove('active'); });

            // 2. Add 'active' class to the clicked tab
            btn.classList.add('active');

            // 3. Get the category value from the button's data attribute
            //    btn.dataset.category reads: data-category="breakfast" → "breakfast"
            const selectedCategory = btn.dataset.category;

            // 4. Loop through all menu items
            menuItems.forEach(function (item) {
                const itemCategory = item.dataset.category;

                if (selectedCategory === 'all' || itemCategory === selectedCategory) {
                    // Show this item: remove the 'hidden' class
                    item.classList.remove('hidden');

                    /*
                      Fade-in animation: set opacity to 0 first,
                      then animate to 1. We use a tiny timeout so the
                      browser has time to register the opacity: 0 state
                      before the transition starts (a classic CSS trick).
                    */
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(10px)';
                    setTimeout(function () {
                        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        item.style.opacity    = '1';
                        item.style.transform  = 'translateY(0)';
                    }, 10);
                } else {
                    // Hide this item: add the 'hidden' class (CSS sets display: none)
                    item.classList.add('hidden');
                }
            });
        });
    });


    // =========================================================
    // 3. SMOOTH ACTIVE SECTION HIGHLIGHTING IN NAVBAR
    //    (Highlights the nav link for the currently visible section)
    // =========================================================

    /*
      IntersectionObserver is a modern browser API that fires a callback
      whenever an observed element enters or leaves the viewport.
      
      Think of it like a Java Listener that fires when an element
      becomes visible — no need for expensive scroll event calculations.
      
      threshold: 0.4 means the callback fires when 40% of the section
      is visible in the viewport.
    */
    const sections    = document.querySelectorAll('section[id]');
    const navLinkList = document.querySelectorAll('.nav-links a');

    const sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                // Get the id of the visible section (e.g., "menu")
                const activeId = entry.target.id;

                // Remove 'active' from all nav links
                navLinkList.forEach(function (link) {
                    link.classList.remove('active-link');
                });

                // Find the nav link pointing to this section and highlight it
                const activeLink = document.querySelector(`.nav-links a[href="#${activeId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active-link');
                }
            }
        });
    }, { threshold: 0.4 });

    // Start observing each section
    sections.forEach(function (section) {
        sectionObserver.observe(section);
    });


    // =========================================================
    // 4. SCROLL REVEAL ANIMATION
    //    (Elements fade in as you scroll down to them)
    // =========================================================

    /*
      We use another IntersectionObserver to watch elements with
      the class 'reveal'. When they enter the viewport, we add
      the 'revealed' class which triggers a CSS transition.
      
      First, we find all candidate elements and mark them.
    */
    const revealElements = document.querySelectorAll(
        '.special-card, .menu-item, .gallery-item, .contact-item, .highlight'
    );

    // Set initial state: invisible and shifted down
    revealElements.forEach(function (el) {
        el.style.opacity   = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    const revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity   = '1';
                entry.target.style.transform = 'translateY(0)';

                // Once revealed, stop observing (saves memory)
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 }); // fires when just 10% is visible

    revealElements.forEach(function (el) {
        revealObserver.observe(el);
    });


    // =========================================================
    // 5. CURRENT YEAR IN FOOTER (keep copyright year auto-updated)
    // =========================================================
    const yearEl = document.querySelector('.footer-bottom p');
    if (yearEl) {
        // Replace the hardcoded year with the current year dynamically
        yearEl.innerHTML = yearEl.innerHTML.replace(
            '2024',
            new Date().getFullYear()
        );
    }


    // =========================================================
    // 6. ACTIVE LINK STYLING (add extra CSS for active state)
    // =========================================================
    /*
      We inject a tiny CSS rule so the active nav link gets a golden color.
      This is dynamic CSS — we could also put this in style.css,
      but it's here to show you how JS can manipulate styles directly.
    */
    const style = document.createElement('style');
    style.textContent = `
        .nav-links a.active-link {
            color: #D4A853 !important;
        }
        .nav-links a.active-link::after {
            width: 100% !important;
        }
    `;
    document.head.appendChild(style);

    console.log('🌸 Sree Ram Hotel website loaded successfully!');
    console.log('💡 Tip: Open DevTools (F12) → Console to see JS logs.');
    console.log('💡 Tip: Elements tab lets you inspect and live-edit any HTML/CSS!');
});
