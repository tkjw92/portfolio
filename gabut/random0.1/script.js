const form = document.getElementById("form");
const btn = document.getElementById("add");
const total = document.getElementById("total");

let number = 2;

btn.addEventListener("click", function(){
    form.innerHTML += `<tr><td><input type="text" placeholder="Masukkan Nama ${number+1}" name="nama${number}" required></td></tr>`;
    total.value = parseInt(total.value) + 1;
    number++;
})