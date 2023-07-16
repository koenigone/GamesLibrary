const sidebarBtn = $('#sidebar-button');
const sidebar = $('#sidebar');
const overlay = $('#overlay');

let menuOpen = false;

function openMenu() {
    menuOpen = true;
    overlay.css('display', 'block');
    sidebar.css('width', '260px');
};

function closeMenu() {
    menuOpen = false
    overlay.css('display', 'none');
    sidebar.css('width', '0px');
};

sidebarBtn.click(function () {
    if (!menuOpen) {
        openMenu()
    }
});

overlay.click(function () {
    if (menuOpen) {
        closeMenu()
    }
});