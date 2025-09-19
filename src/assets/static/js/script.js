document.addEventListener("DOMContentLoaded", function () {
    function loadComponent(componentPath, componentSelector, callback) {
        fetch(componentPath)
            .then(response => response.text())
            .then(data => {
                const element = document.querySelector(componentSelector);
                if (element) {
                    element.innerHTML = data;
                    if (callback) callback();
                } else {
                    console.log(`Element not found for selector: ${componentSelector}`);
                }
            })
            .catch(error => console.error(`Error loading component from ${componentPath}:`, error));
    }

    loadComponent('components/header.html', 'header', initializeMenu);
    loadComponent('components/footer.html', 'footer');
    loadComponent('components/nav.html', '.sidebar-container', enhanceSidebar);

    function initializeMenu() {
        const menuButton = document.querySelector(".hamburger-menu");
        const navLinks = document.querySelector(".nav-links");

        if (menuButton && navLinks) {
            menuButton.addEventListener("click", function () {
                navLinks.classList.toggle("show");

                // Toggle the icon
                if (navLinks.classList.contains("show")) {
                    menuButton.innerHTML = '&#10005;'; // Unicode for X
                } else {
                    menuButton.innerHTML = '&#9776;'; // Unicode for ☰
                }
            });
        } else {
            console.log('Menu button or navigation links not found.');
        }
    }

    function enhanceSidebar() {
        const currentLocation = window.location.href;

        document.querySelectorAll('.sidebar a').forEach(link => {
            if (link.href === currentLocation) {
                link.classList.add('active');
            }
        });

        const headings = document.querySelectorAll('.content h2');
        const currentPageLinks = document.createElement('ul');

        headings.forEach(heading => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = `#${heading.id}`;
            link.textContent = heading.textContent;
            listItem.appendChild(link);
            currentPageLinks.appendChild(listItem);
        });

        const activeLink = document.querySelector('.sidebar a.active');
        if (activeLink && currentPageLinks.childElementCount > 0) {
            activeLink.parentElement.appendChild(currentPageLinks);
        }
    }
});