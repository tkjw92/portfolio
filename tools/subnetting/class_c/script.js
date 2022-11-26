// bentuk target : 192.168.1.1/24

let hasil = {};
let run = false;
const submit = document.getElementById("calc");

submit.addEventListener("click", () => {
    const o1 = document.getElementById("o1").value.toString();
    const o2 = document.getElementById("o2").value.toString();
    const o3 = document.getElementById("o3").value.toString();
    const o4 = document.getElementById("o4").value.toString();

    if (o1 != "") {
        if (o2 != "") {
            if (o3 != "") {
                if (o4 != "") {
                    run = true;
                }
            }
        }
    }

    if (parseInt(o1) < 192 || parseInt(o1) > 223) {
        alert("ip kelas c 192-233");
        return;
    }

    if (run) {
        const slash = document.getElementById("slash").value;
        if (slash == "") {
            alert("field tidak boleh kosong");
            return;
        }

        if (slash < 24) {
            alert("slash ip c (24 - 30)");
            return;
        }
        if (slash > 30) {
            alert("slash ip c (24 - 30)");
            return;
        }

        // switch page
        document.querySelector(".form").classList.add("out");
        setTimeout(() => {
            document.querySelector(".form").remove();
            const output = document.createElement("div");
            output.id = "hasil";
            document.getElementById("container").appendChild(output);
        }, 1000);

        const val = o1 + "." + o2 + "." + o3 + "." + o4;
        // insert raw ip
        let temp_raw_ip = val.split("/")[0].split(".");
        temp_raw_ip.pop();
        hasil.raw_ip = temp_raw_ip.join(".");
        // end of insert raw ip
        // find binary for netmask
        let temp_bin = [];
        // looping number 1
        for (let i = 0; i < slash - 24; i++) {
            temp_bin.push(1);
        }
        // looping number 0
        for (let i = 0; i < 8 - (slash - 24); i++) {
            temp_bin.push(0);
        }
        bin = ["11111111.11111111.11111111"];
        bin.push(temp_bin.join(""));
        hasil.biner = bin.join(".");
        // end of binary
        // find subnet mask
        let temp_mask = parseInt(temp_bin.join(""), 2);
        hasil.subnet_mask = "255.255.255." + temp_mask;
        // end of subnet mask
        // find blok
        hasil.blok = 256 - temp_mask;
        // end of blok
        // find ip valid
        let temp_ip_valid = [0];
        while (true) {
            if (temp_ip_valid[temp_ip_valid.length - 1] == temp_mask) {
                break;
            }
            temp_ip_valid.push(
                temp_ip_valid[temp_ip_valid.length - 1] + hasil.blok
            );
        }
        hasil.ip_valid = temp_ip_valid;
        // end of ip valid
        // find network
        let temp_network = [];
        for (let i = 0; i < hasil.ip_valid.length; i++) {
            temp_network.push(hasil.raw_ip + "." + temp_ip_valid[i]);
        }
        hasil.network = temp_network;
        // end of network
        // find frst host
        let temp_first_host = [];
        for (let i = 0; i < hasil.ip_valid.length; i++) {
            temp_first_host.push(
                hasil.raw_ip +
                    "." +
                    String(parseInt(hasil.network[i].split(".")[3]) + 1)
            );
        }
        hasil.first_host = temp_first_host;
        // end of first host
        // find broadcast
        let temp_broadcast = [];
        for (let i = 0; i < hasil.ip_valid.length; i++) {
            if (hasil.network[i + 1] != undefined) {
                temp_broadcast.push(
                    hasil.raw_ip +
                        "." +
                        String(parseInt(hasil.network[i + 1].split(".")[3]) - 1)
                );
            } else {
                temp_broadcast.push(hasil.raw_ip + ".255");
            }
        }
        hasil.broadcast = temp_broadcast;
        // end of broadcast
        // find last host
        let temp_last_host = [];
        for (let i = 0; i < hasil.ip_valid.length; i++) {
            temp_last_host.push(
                hasil.raw_ip +
                    "." +
                    String(parseInt(hasil.broadcast[i].split(".")[3]) - 1)
            );
        }
        hasil.last_host = temp_last_host;
    } else {
        alert("field tidak boleh kosong");
    }

    // display output
    // create tabel
    setTimeout(() => {
        const output = document.getElementById("hasil");
        const table = document.createElement("table");
        output.appendChild(table);
        document.querySelector("#hasil table").innerHTML = `
            <tr>
                <td>ip address</td>
                <td>${hasil.raw_ip + "." + o4}</td>
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
        const validContainer = document.createElement("div");
        validContainer.id = "valid";
        output.appendChild(validContainer);
        const p1 = document.createElement("p");
        const p2 = document.createElement("p");
        document.getElementById("valid").appendChild(p1);
        document.getElementById("valid").appendChild(p2);
        document.querySelector("#valid p:nth-child(1)").innerHTML = "ip valid";
        document.querySelector("#valid p:nth-child(2)").innerHTML =
            hasil.ip_valid.join(", ");
        document.getElementById("container").style.display = "block";

        // main table
        const mainTable = document.createElement("table");
        mainTable.id = "main";
        output.appendChild(mainTable);
        const main = document.getElementById("main");

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

        const refresh = document.createElement("button");
        refresh.id = "re";
        output.appendChild(refresh);
        document.getElementById("re").innerHTML = "hitung ulang";
        document.getElementById("re").addEventListener("click", () => {
            location.href = location.href;
        });
    }, 1000);
});
