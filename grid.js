/**
 *
 * Grid.js
 *
 */


class Grid {

  /* コンストラクタ */
  constructor(svgId, xMin, xMax, yMin, yMax, 
    margin={top: 30, right: 30, bottom: 50, left: 30}) {

    // マージンの値をチェック & セットする
    Grid.checkMargin(margin);
    this.margin = margin;

    // SVG 要素 ( とそのサイズ ) を取得する
    this.svg = d3.select(`#${svgId}`);
    this.width = parseInt(
      this.svg.style("width").replace("px", ""));
    this.height = parseInt(
      this.svg.style("height").replace("px", ""));

    // x 方向の入力値が日付オブジェクトかどうか
    this.xIsDate = xMin instanceof Date;

    // x 方向のスケールを作成する
    this.x = this.createXScale(xMin, xMax);

    // y 方向のスケールを作成する
    this.y = this.createYScale(yMin, yMax);

    // x 軸と目盛りを作成する
    this.xAxis = this.setXAxis();

    // y 軸と目盛りを作成する
    this.yAxis = this.setYAxis();

  }

  /*数値であることの確認を行う */
  static isNumeric(n) { 
    return !isNaN(parseFloat(n)) && isFinite(n);
  };

  /* マージンの値をチェックする */
  static checkMargin(margin) {    

    let validNames = ["top", "right", "bottom", "left"];
    Object.entries(margin).forEach((kv) => {
      let [attr, val] = kv;

      // 値のチェック
      if (!Grid.isNumeric(val)) {
        let emsg = "margin value is not numeric";
        throw Error(emsg);
      }

      // 属性名のチェック
      if (validNames.indexOf(attr) === -1) {
        let emsg = `invalid attr name "${attr}"`;
        throw Error(emsg);
      }

    });

  }

  /* x 方向のスケールを作成する */
  createXScale(xMin, xMax) {

    // 入力値の範囲 ( 最小値、最大値のペア )
    let domainValues = [xMin, xMax];

    // 出力値の範囲 ( 最小位置、最大位置のペア )
    let rangeValues = [
      this.margin.left,
      this.width - this.margin.right,
    ];

    // x の最小値が日付オブジェクトの場合
    let x = null;
    if (this.xIsDate) {
      x = d3.scaleTime()
        .domain(domainValues)
        .range(rangeValues);
    } else if (Grid.isNumeric(xMin)) {
      // x の最小値が数値の場合
      x = d3.scaleLinear()
        .domain(domainValues)
        .range(rangeValues);
    }

    return x;
  }

  /* y 方向のスケールを作成する */
  createYScale(yMin, yMax) {

    // 入力値の範囲
    let domainValues = [yMin, yMax];

    // 出力値の範囲
    let rangeValues = [
      this.height - this.margin.bottom,
      this.margin.top
    ];

    return d3.scaleLinear().domain(domainValues)
      .range(rangeValues); 
  }

  /* x 軸の目盛りの表示をフォーマットする */
  formatTickX(d) {
    return d;
  }

  /* x 軸と目盛りを作成する */
  setXAxis() {

    let xAxis = this.svg.append("g")
      .attr("class", "x-axis")
      .attr(
        "transform",
        "translate(" + [
          0,
          this.height - this.margin.bottom
        ].join(",") + ")"
      )
      .call(
        d3.axisBottom(this.x)
          .ticks(10)
          .tickSize(-this.height + this.margin.bottom +
            this.margin.top)
          .tickFormat(this.formatTickX)
      )

    // 罫線のスタイルを設定する
    xAxis.selectAll("line")
      .style("stroke", "lightgray")
      .style("stroke-opacity", 0.7)
      .style("shape-rendering", "crispEdges");

    // 軸のスタイルを設定する
    xAxis.selectAll("path")
      .style("stroke", "lightgray")
      .style("stroke-width", "1px");

    return xAxis;
  }

  /* y 軸の目盛りの表示をフォーマットする */
  formatTickY(d) {
    return d;
  }

  /* y 軸と目盛りを作成する */
  setYAxis() {

    let yAxis = this.svg.append("g")
      .attr("class", "y-axis")
      .attr(
        "transform",
        "translate(" + [
          this.margin.left,
          0
        ].join(",") + ")"
      )
      .call(
        d3.axisLeft(this.y)
          .ticks(10)
          .tickSize(-this.width + this.margin.left + 
            this.margin.right
          )
          .tickFormat(this.formatTickY)
      )

    // 罫線のスタイルを設定する
    yAxis.selectAll("line")
      .style("stroke", "lightgray")
      .style("stroke-opacity", 0.7)
      .style("shape-rendering", "crispEdges");

    // y 軸のスタイルを設定する
    yAxis.selectAll("path")
      .style("stroke", "lightgray")
      .style("stroke-width", "1px");

    return yAxis;
  }

}


/* テスト */
// let svgId = "graphArea";
// let xMin = new Date("2018-07-17 00:00:00");
// let xMax = new Date("2018-07-19 12:00:00");
// let xMin = 2000;
// let xMax = 10000;
// let yMin = 10;
// let yMax = 110;
// let g = new Grid(svgId, xMin, xMax, yMin, yMax);
// console.dir(g);
// console.log(g.x(new Date("2018-07-18 00:00:00")));
// console.log(g.y(50));