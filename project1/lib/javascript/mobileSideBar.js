const hamburger = document.getElementById('sidebar-button')
const sidebar = document.getElementById('sidebar')
const overlay = document.getElementById('overlay')

let menuOpen = false

function openMenu() {
    menuOpen = true
    overlay.style.display = 'block'
    sidebar.style.width = '260px'
}

function closeMenu() {
    menuOpen = false
    overlay.style.display = 'none'
    sidebar.style.width = '0px'
}

hamburger.addEventListener('click', function () {
    if (!menuOpen) {
        openMenu()
    }
})

overlay.addEventListener('click', function () {
    if (menuOpen) {
        closeMenu()
    }
})