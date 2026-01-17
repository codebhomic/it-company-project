document.addEventListener("DOMContentLoaded", (e) => {
    const navbarMenuButton = document.querySelector(".navbar-menu .fa-bars");
    const navbarMenuButtonX = document.querySelector(".navbar-menu .fa-x");
    const navbar = document.querySelector(".navbar");
    const navbarMenu = document.querySelector(".navbar-right");
    navbarMenuButton.addEventListener("click", (e) => {
        navbarMenuButtonX.style.display = "inline";
        navbarMenuButton.style.display = "none";
        navbarMenu.classList.add("show");
    });
    navbarMenuButtonX.addEventListener("click", (e) => {
        navbarMenuButton.style.display = "inline";
        navbarMenuButtonX.style.display = "none";
        navbarMenu.classList.remove("show");
    });

    document.addEventListener("scroll", (e) => {
        if (window.scrollY > 20) {
            navbar.classList.add("shadow");
        }else{
            navbar.classList.remove("shadow");
        }
    })
});