// Navbar mobile menu functionality


const menuToggle =
    document.getElementById("menuToggle");

const navMenu =
    document.getElementById("navMenu");

if (menuToggle) {

    menuToggle.addEventListener("click", () => {

        navMenu.classList.toggle("active");

        const icon =
            menuToggle.querySelector("i");

        icon.classList.toggle(
            "fa-bars");

        icon.classList.toggle(
            "fa-xmark");

    });

}
