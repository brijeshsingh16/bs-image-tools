//footer year auto change every year 

const year = document.getElementById("year");

if (year) {
    year.textContent = new Date().getFullYear();
}
