const url = document.getElementById("url");
const btn = document.getElementById("hit");
const glink = document.querySelector(".glink");
const loading = document.getElementById("loading");
const final = document.querySelector(".finally");
const download = document.createElement("a");
const title = document.createElement("h2");
const thumb = document.createElement("img");
const ukuran = document.createElement("h3");

// mobile link  : https://youtu.be/FB1YNEOspyA
// desktop link : https://www.youtube.com/watch?v=FB1YNEOspyA

const getId = (url) => {
    url = url.split("https://")[1];
    const cek = url.search("youtu.be");
    if (cek != -1) {
        return url.split("/")[1];
    } else {
        return url.split("?v=")[1];
    }
};

const getLink = (uri) => {
    url.value = "";
    const api = "https://api.vevioz.com/api/button/mp3/";
    fetch(api + getId(uri))
        .then((res) => res.text())
        .then((response) => {
            const body = response.split("<body>")[1];
            const res = body.split("</body>")[0];
            if (res.search("Oops!") != -1) {
                swal({
                    title: "Error",
                    text: "invalid URL",
                    icon: "error",
                });
                loading.style.display = "none";
                glink.style.display = "none";
                return;
            }

            const wrapper = document.createElement("div");
            wrapper.innerHTML = res;
            const a = wrapper.querySelector("a");
            const link = a.getAttribute("href");
            const size = a.innerText.split("\n")[4].replaceAll(" ", "");

            fetch("https://noembed.com/embed?url=" + uri)
                .then((res) => res.json())
                .then((res) => {
                    const thumbImg = res.thumbnail_url;
                    const judul = res.title;

                    loading.style.display = "none";
                    glink.style.display = "none";
                    download.className = "link";
                    download.setAttribute("href", link);
                    download.setAttribute("download", "");
                    download.innerHTML = "<button>Download</button>";
                    title.innerText = judul;
                    thumb.setAttribute("src", thumbImg);
                    ukuran.innerText = size;
                    final.appendChild(thumb);
                    final.appendChild(title);
                    final.appendChild(ukuran);
                    final.appendChild(download);
                });
        });
    loading.style.display = "block";
    glink.style.display = "block";
};

// cek browser
if (
    navigator.userAgent.toLowerCase().search("chrome") == -1 &&
    navigator.userAgent.toLowerCase().search("firefox") == -1
) {
    location.href = "err.html";
}

btn.addEventListener("click", () => {
    if (url.value != "") {
        try {
            getLink(url.value);
        } catch {
            swal({
                title: "Error",
                text: "Please try again later",
                icon: "error",
            });
        }
    }
});
