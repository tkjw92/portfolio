let hasil = {};

const hitung = document.getElementById("calc");
hitung.addEventListener("click", () => {
    const o1 = document.getElementById("o1").value;
    const o2 = document.getElementById("o2").value;
    const o3 = document.getElementById("o3").value;
    const o4 = document.getElementById("o4").value;

    if (o1 == "" || o2 == "" || o3 == "" || o4 == "") {
        alert("field tidak boleh kosong");
        return;
    }

    if (o1 < 128 || o1 > 191) {
        alert("ip kelas b 128-191");
        return;
    }

    hasil.ip =
        o1.toString() +
        "." +
        o2.toString() +
        "." +
        o3.toString() +
        "." +
        o4.toString();

    hasil.raw_ip = hasil.ip.split(".");
    hasil.raw_ip.pop();
    hasil.raw_ip.pop();
    hasil.raw_ip = hasil.raw_ip.join(".");

    const slash = document.getElementById("slash").value;

    if (slash == "") {
        alert("field tidak boleh kosong");
        return;
    }

    if (slash < 16 || slash > 23) {
        alert("slash ip b (16 - 23)");
        return;
    }

    // find subnet mask nbinary
    hasil.biner = [];
    for (let i = 0; i < slash - 16; i++) {
        hasil.biner.push(1);
    }
    for (let i = 0; i < 8 - (slash - 16); i++) {
        hasil.biner.push(0);
    }
    hasil.biner = hasil.biner.join("");
    hasil.biner = "11111111.11111111." + hasil.biner + ".00000000";
    // end of subnet binary
    // find subnet mask
    hasil.subnet_mask = parseInt(hasil.biner.split(".")[2], 2).toString();
    hasil.subnet_mask = "255.255." + hasil.subnet_mask + ".0";
    // end of subnet mask
    // find blok
    hasil.blok = 256 - parseInt(hasil.subnet_mask.split(".")[2]);
    // end of blok
    // find ip valid
    hasil.ip_valid = [0];
    while (true) {
        if (
            hasil.ip_valid[hasil.ip_valid.length - 1] ==
            parseInt(hasil.subnet_mask.split(".")[2])
        ) {
            break;
        }
        hasil.ip_valid.push(
            hasil.ip_valid[hasil.ip_valid.length - 1] + hasil.blok
        );
    }
    // end of ip valid
    // find network
    hasil.network = [];
    for (let i = 0; i < hasil.ip_valid.length; i++) {
        hasil.network.push(hasil.raw_ip + "." + hasil.ip_valid[i] + ".0");
    }
    // end of network
    // find first host
    hasil.first_host = [];
    for (let i = 0; i < hasil.ip_valid.length; i++) {
        hasil.first_host.push(hasil.raw_ip + "." + hasil.ip_valid[i] + ".1");
    }
    // end of first host
    // find broadcast
    hasil.broadcast = [];
    for (let i = 0; i < hasil.ip_valid.length; i++) {
        if (i == hasil.ip_valid.length - 1) {
            hasil.broadcast.push(hasil.raw_ip + ".255.255");
        } else {
            hasil.broadcast.push(
                hasil.raw_ip + "." + (hasil.ip_valid[i + 1] - 1) + ".255"
            );
        }
    }
    // end of broadcast
    // find last host
    hasil.last_host = [];
    for (let i = 0; i < hasil.ip_valid.length; i++) {
        hasil.last_host.push(hasil.broadcast[i]);
    }
    for (let i = 0; i < hasil.ip_valid.length; i++) {
        hasil.last_host[i] = hasil.last_host[i].split(".");
        hasil.last_host[i].pop();
        hasil.last_host[i].push("254");
        hasil.last_host[i] = hasil.last_host[i].join(".");
    }

    // display
    const container = document.getElementById("container");
    const form = document.querySelector(".form");
    form.classList.add("out");
    setTimeout(() => {
        form.remove();
        const containerHasil = document.createElement("div");
        containerHasil.id = "hasil";
        container.appendChild(containerHasil);
        const CONTAINERHASIL = document.getElementById("hasil");
        const table = document.createElement("table");
        CONTAINERHASIL.appendChild(table);
        const tb = document.querySelector("#hasil table");
        tb.innerHTML = `
            <tr>
                <td>ip address</td>
                <td>${hasil.ip}</td>
            </tr>
            <tr>
                <td>binary</td>
                <td>${hasil.biner}</td>
            </tr>
            <tr>
                <td>subnet mask</td>
                <td>${hasil.subnet_mask}</td>
            </tr>
            <tr>
                <td>blok</td>
                <td>${hasil.blok}</td>
            </tr>
        `;
        const buatValid = document.createElement("div");
        buatValid.id = "valid";
        CONTAINERHASIL.appendChild(buatValid);
        const valid = document.getElementById("valid");
        const p1 = document.createElement("p");
        p1.innerHTML = "ip valid";
        const p2 = document.createElement("p");
        p2.innerHTML = hasil.ip_valid.join(", ");
        valid.appendChild(p1);
        valid.appendChild(p2);
        const main = document.createElement("table");
        main.id = "main";
        main.innerHTML = `
            <tr>
                <th>network</th>
                <th>range (hp - ht)</th>
                <th>broadcast</th>
            </tr>
        `;
        for (let i = 0; i < hasil.ip_valid.length; i++) {
            main.innerHTML += `
                <tr>
                    <td>${hasil.network[i]}</td>
                    <td>${hasil.first_host[i]} - ${hasil.last_host[i]}</td>
                    <td>${hasil.broadcast[i]}</td>
                </tr>
            `;
        }
        CONTAINERHASIL.appendChild(main);
        const re = document.createElement("button");
        re.id = "re";
        re.innerHTML = "hitung ulang";
        CONTAINERHASIL.appendChild(re);
        container.style.display = "block";
        re.addEventListener("click", () => {
            location.href = location.href;
        });
    }, 1000);
});
