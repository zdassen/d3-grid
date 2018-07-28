/**
 *
 * legend.js
 *
 */


/* レジェンドを追加するクラス */
class Legend {

  /* コンストラクタ */
  constructor(svgId, params) {

    // SVG 要素を取得する
    this.svg = d3.select(`#${svgId}`);

    // グラフの色
    let colors = [];

    // タイトル
    let titles = [];

    // 値を整理する
    Object.entries(params).forEach(kv => {
      let [title, color] = kv;
      titles.push(title);
      colors.push(color);
    });
    this.colors = colors;
    this.titles = titles;

  }

  /* レジェンドを描画する */
  draw(ml=40, mt=40) {

    // ※これを loc 毎に切り替えればよい
    // let baseLoc = [40, 40];    // loc="left-upper" の場合

    // g 要素を追加する
    let g = this.svg.append("g")
      .attr("class", "legend");

    // 四角形を描画する
    let h = 10;    // = box height
    let w = 10;   // = box width
    let mb = 3;    // = margin bottom
    let baselineAdjustH = 8;
    let baselineAdjustV = 5;
    let rects = g.selectAll("rect")
      .data(this.colors)
      .enter()
      .append("rect")
      .attr("width", w)
      .attr("height", h)
      .attr("fill", (d, i) => d)
      .attr(
        "transform", (d, i) => {
          return "translate(" + [
            ml,
            mt + (h + mb) * i
          ].join(",") + ")";
        }
      );

    // タイトル文字列を描画する
    let offsetY = 1;    // 微調整する
    let labels = g.selectAll("text")
      .data(this.titles)
      .enter()
      .append("text")
      .text((d, i) => d)
      .attr(
        "transform", (d, i) => {
          return "translate(" + [
            ml + w + baselineAdjustH,
            mt + (h + mb) * i + baselineAdjustV + offsetY
          ].join(",") + ")";
        }
      )
      .attr("dominant-baseline", "middle")
      .attr("font-size", "10px");

  }

}

/* テスト */
/*
let data = [
  [0, 100],
  [3, 450],
  [13, 300],
  [15, 600],
  [17, 580],
];

let svgId = "graphArea";
SVG.setupFullSize(svgId);
let g = new Grid(svgId, data);

// let colors = ["orange", "crimson", "blueviolet"];
// let titles = ["CSS", "Ruby on Rails", "Bootstrap"];
let params = {
  "CSS": "orange",
  "Ruby on Rails": "crimson",
  "Bootstrap": "blueviolet",
  "Django": "green",
};
let lg = new Legend(svgId, params);
// console.dir(lg);
lg.draw();
*/