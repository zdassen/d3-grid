/**
 *
 * svg.js
 *
 */


const SVG = (function () {


  /* スクロールバーを非表示にする */
  function hiddenScrollbar() {

    // body 要素を取得
    let b = document.querySelector("body");

    // スクロールバーを非表示にする
    b.style.overflow = "hidden";
    b.style.overflowY = "hidden";

  }


  /* SVG 要素のサイズを画面一杯に設定する */
  function setupFullSize(svgId, ml=0, mb=0) {

    // スクロールバーを非表示にする
    hiddenScrollbar();

    // SVG 要素を取得
    let svg = document.getElementById(svgId);

    // サイズを設定する
    let w = window.innerWidth - ml;
    let h = window.innerHeight - mb;
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);

    return svg;
  }


  return {
    setupFullSize: setupFullSize,
  };
}());