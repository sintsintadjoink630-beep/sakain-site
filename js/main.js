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

    if (titleEl) titleEl.textContent = current.name;
    if (descEl) descEl.textContent = current.desc;
    if (linkEl) linkEl.setAttribute("href", current.link);
    if (dotsEl && dotsEl.length) {
      dotsEl.forEach(function (dot, i) {
        dot.classList.toggle("active", i === index);
      });
    }
  }
});
