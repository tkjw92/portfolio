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

    if (o1 < 0 || o1 > 126) {
        alert("ip kelas a 1-126");
        return;
    }

    hasil.ip = o1 + "." + o2 + "." + o3 + "." + o4;
    hasil.raw_ip = hasil.ip.split(".");
    hasil.raw_ip.pop();
    hasil.raw_ip.pop();
    hasil.raw_ip.pop();
    hasil.raw_ip = hasil.raw_ip.join(".");

    const slash = document.getElementById("slash").value;

    if (slash == "") {
        alert("field tidak boleh kosong");
        return;
    }

    if (slash < 8 || slash > 16) {
        alert("slash ip a (8 - 16)");
        return;
    }

    // find binary
    hasil.biner = [];
    for (let i = 0; i < slash - 8; i++) {
        hasil.biner.push(1);
    }
    for (let i = 0; i < 8 - (slash - 8); i++) {
        hasil.biner.push(0);
    }
    hasil.biner = "11111111." + hasil.biner.join("") + ".00000000.00000000";
    // end of biner
    // find subnet mask
    hasil.subnet_mask =
        "255." + parseInt(hasil.biner.split(".")[1], 2).toString() + ".0.0";
    // end of subnet mask
    // find blok
    hasil.blok = 256 - parseInt(hasil.subnet_mask.split(".")[1]);
    // end of blok
    // find ip valid
    hasil.ip_valid = [0];
    while (true) {
        if (
            hasil.ip_valid[hasil.ip_valid.length - 1] ==
            parseInt(hasil.subnet_mask.split(".")[1])
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
        hasil.network.push(hasil.raw_ip + "." + hasil.ip_valid[i] + ".0.0");
    }
    // end of network
    // find first host
    hasil.first_host = [];
    for (let i = 0; i < hasil.ip_valid.length; i++) {
        hasil.first_host.push(hasil.raw_ip + "." + hasil.ip_valid[i] + ".0.1");
    }
    // end of first host
    // find broadcast
    hasil.broadcast = [];
    for (let i = 1; i < hasil.ip_valid.length; i++) {
        hasil.broadcast.push(
            hasil.raw_ip + "." + (hasil.ip_valid[i] - 1) + ".255.255"
        );
    }
    hasil.broadcast.push(hasil.raw_ip + ".255.255.255");
    // end of broadcast
    // find last host
    hasil.last_host = [];
    for (let i = 0; i < hasil.ip_valid.length; i++) {
        hasil.last_host.push(
            hasil.raw_ip + "." + hasil.broadcast[i].split(".")[1] + ".255.254"
        );
    }
    // end of last host
    // display
    const container = document.getElementById("container");
    const form = document.querySelector(".form");
    form.classList.add("out");
    setTimeout(() => {
        form.remove();
        const containerHasil = document.createElement("div");
        containerHasil.id = "hasil";
        const table = document.createElement("table");
        table.innerHTML = `
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
        containerHasil.appendChild(table);
        const valid = document.createElement("div");
        valid.id = "valid";
        const p1 = document.createElement("p");
        const p2 = document.createElement("p");
        p1.innerHTML = "ip valid";
        p2.innerHTML = hasil.ip_valid.join(", ");
        valid.appendChild(p1);
        valid.appendChild(p2);
        containerHasil.appendChild(valid);
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
        const re = document.createElement("button");
        re.id = "re";
        re.innerHTML = "hitung ulang";
        containerHasil.appendChild(main);
        containerHasil.appendChild(re);
        container.appendChild(containerHasil);
        container.style.display = "block";
        re.addEventListener("click", () => {
            location.href = location.href;
        });
    }, 1000);
});
