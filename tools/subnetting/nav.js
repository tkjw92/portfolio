const nav = document.querySelector("nav");
const btn = document.getElementById("menu");

btn.addEventListener("click", () => {
    nav.classList.toggle("hide");
});
