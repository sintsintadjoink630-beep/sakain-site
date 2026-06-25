// ===========================================================
// さかいインテリア サイト共通スクリプト
// ===========================================================


document.addEventListener("DOMContentLoaded", function () {
  // --- モバイルナビ開閉 ---
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }

  // --- 今週のおすすめ：4種を週替わりで順番に表示 ---
  // ドレープカーテン → レースカーテン → ブラインド → ロールスクリーン の順で
  // 年初からの週番号に応じて自動的に切り替わる
  var recommendEl = document.querySelector("[data-recommend]");
  if (recommendEl) {
    var items = [
      {
        name: "ドレープカーテン",
        desc: "お部屋の主役になる厚手の遮光・遮熱カーテン。素材やヒダの本数までこだわってお作りします。",
        link: "products/drape.html",
        img: "images/drape/drape01-1.jpg",
      },
      {
        name: "レースカーテン",
        desc: "光を優しく取り込みながら視線をカット。UVカットや防炎タイプなど機能性レースも豊富です。",
        link: "products/lace.html",
      },
      {
        name: "ブラインド",
        desc: "光の入り方を自在に調整できるブラインド。木製・アルミ製など空間に合わせて選べます。",
        link: "products/blind.html",
      },
      {
        name: "ロールスクリーン",
        desc: "すっきりとしたデザインで圧迫感の少ないロールスクリーン。ウイルス対策用の透明タイプもご用意。",
        link: "products/roll-screen.html",
      },
    ];

    var oneWeek = 7 * 24 * 60 * 60 * 1000;
    var now = new Date();
    var startOfYear = new Date(now.getFullYear(), 0, 1);
    var weekNumber = Math.floor((now - startOfYear) / oneWeek);
    var index = ((weekNumber % items.length) + items.length) % items.length;
    var current = items[index];

    var titleEl = recommendEl.querySelector("[data-recommend-title]");
    var descEl = recommendEl.querySelector("[data-recommend-desc]");
    var linkEl = recommendEl.querySelector("[data-recommend-link]");
    var dotsEl = recommendEl.querySelectorAll("[data-recommend-dots] span");
    var imgEl = recommendEl.querySelector("[data-recommend-img]");
    var placeholderEl = recommendEl.querySelector("[data-recommend-placeholder]");

    if (titleEl) titleEl.textContent = current.name;
    if (descEl) descEl.textContent = current.desc;
    if (linkEl) linkEl.setAttribute("href", current.link);
    if (imgEl && placeholderEl) {
      if (current.img) {
        imgEl.src = current.img;
        imgEl.alt = current.name;
        imgEl.hidden = false;
        placeholderEl.hidden = true;
      } else {
        imgEl.hidden = true;
        placeholderEl.hidden = false;
      }
    }
    if (dotsEl && dotsEl.length) {
      dotsEl.forEach(function (dot, i) {
        dot.classList.toggle("active", i === index);
      });
    }
  }
});

// ===========================================================
// 商品ギャラリー＋ライトボックス（写真クリックで詳細表示）
// ===========================================================
window.SakaiGallery = (function () {
  var products = [];
  var basePath = "";
  var productIndex = 0;
  var imageIndex = 0;

  function render(containerId, productList, base) {
    products = productList;
    basePath = base;
    var container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = products
      .map(function (p, i) {
        var thumb = encodeURI(basePath + p.images[0]);
        return (
          '<figure class="product-card">' +
          '<button class="product-thumb" type="button" data-index="' +
          i +
          '" aria-label="' +
          p.name +
          'の写真を見る">' +
          '<img src="' +
          thumb +
          '" alt="' +
          p.name +
          '" loading="lazy"></button>' +
          '<figcaption class="sr-only">' +
          p.name +
          "</figcaption>" +
          "</figure>"
        );
      })
      .join("");

    container.querySelectorAll(".product-thumb").forEach(function (btn) {
      btn.addEventListener("click", function () {
        open(parseInt(btn.getAttribute("data-index"), 10));
      });
    });

    var lightbox = document.getElementById("lightbox");
    if (lightbox && !lightbox.dataset.bound) {
      lightbox.dataset.bound = "1";
      lightbox.querySelector(".lightbox-close").addEventListener("click", close);
      lightbox.querySelector(".lightbox-nav.prev").addEventListener("click", function () { nav(-1); });
      lightbox.querySelector(".lightbox-nav.next").addEventListener("click", function () { nav(1); });
      lightbox.addEventListener("click", function (e) {
        if (e.target === lightbox) close();
      });
      document.addEventListener("keydown", function (e) {
        if (lightbox.hidden) return;
        if (e.key === "Escape") close();
        if (e.key === "ArrowLeft") nav(-1);
        if (e.key === "ArrowRight") nav(1);
      });
    }
  }

  function open(index) {
    productIndex = index;
    imageIndex = 0;
    update();
    var lightbox = document.getElementById("lightbox");
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function close() {
    var lightbox = document.getElementById("lightbox");
    lightbox.hidden = true;
    document.body.style.overflow = "";
  }

  function nav(dir) {
    var p = products[productIndex];
    imageIndex = (imageIndex + dir + p.images.length) % p.images.length;
    update();
  }

  function update() {
    var p = products[productIndex];
    var lightbox = document.getElementById("lightbox");
    var img = lightbox.querySelector(".lightbox-img");
    var title = lightbox.querySelector(".lightbox-title");
    var desc = lightbox.querySelector(".lightbox-desc");
    var dots = lightbox.querySelector(".lightbox-dots");
    var prevBtn = lightbox.querySelector(".lightbox-nav.prev");
    var nextBtn = lightbox.querySelector(".lightbox-nav.next");

    img.src = encodeURI(basePath + p.images[imageIndex]);
    img.alt = p.name;
    title.textContent = p.fullName;
    desc.textContent = p.desc;
    dots.innerHTML = p.images
      .map(function (_, i) {
        return '<span class="' + (i === imageIndex ? "active" : "") + '"></span>';
      })
      .join("");
    var multi = p.images.length > 1;
    prevBtn.style.display = multi ? "" : "none";
    nextBtn.style.display = multi ? "" : "none";
  }

  return { render: render };
})();
