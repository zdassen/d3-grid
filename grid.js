/**
 *
 * Grid.js
 *
 */


class Grid {

  /* コンストラクタ */
  constructor(svgId, 
    margin={top: 30, right: 30, bottom: 50, left: 30,
      xPercentage: 10, yPercentage: 10}) {

    // マージンの値をチェック & セットする
    Grid.checkMargin(margin);
    this.margin = margin;

    // SVG 要素 ( とそのサイズ ) を取得する
    this.svg = d3.select(`#${svgId}`);
    this.width = parseInt(
      this.svg.style("width").replace("px", ""));
    this.height = parseInt(
      this.svg.style("height").replace("px", ""));

    // x、y 方向のスケールと軸を設定する
    // this.setupScalesAndAxes(data);
  }

  /*数値であることの確認を行う */
  static isNumeric(n) { 
    return !isNaN(parseFloat(n)) && isFinite(n);
  };

  /* マージンの値をチェックする ( ※気休め程度でしかないが.. )*/
  static checkMargin(margin) {    

    let validNames = ["top", "right", "bottom", "left",
      "xPercentage", "yPercentage"];
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

  /* x、y 方向の最小値、最大値を取得する */
  getMinMax(data) {

    // x 方向の最小値、最大値
    let xs = data.map(record => this.getX(record));
    let xMin = d3.min(xs);
    let xMax = d3.max(xs);

    // y 方向の最小値、最大値
    let ys = data.map(record => this.getY(record));
    let yMin = d3.min(ys);
    let yMax = d3.max(ys);

    return [xMin, xMax, yMin, yMax];
  }

  /* 最小値、最大値に幅を持たせて調整する ( 日付オブジェクトの場合 ) */
  adjustMinMaxDate(min, max, percentage) {
    let milliSecondsSpan = max - min;
    let delta = milliSecondsSpan * percentage / 100;
    let newMin = new Date(min.getTime() - delta);
    let newMax = new Date(max.getTime() + delta);
    return [newMin, newMax];
  }

  /* 最小値に幅を持たせて調整する */
  adjustMinMax(min, max, percentage) {
    let r = percentage / 100;
    let span = max - min;
    let delta = span * r;
    return [min - delta, max + delta];
  }

  /* x 方向に相当する値を取り出す ( データへのアクセサ ) */
  getX(record) {
    return record[0];
  }

  /* y 方向に相当する値を取り出す ( データへのアクセサ ) */
  getY(record) {
    return record[1];
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

  /* 縦方向の罫線のスタイルを設定する */
  setGridColorV(d, i) {
    if (d === 0) return "darkgray";
    else return "lightgray";
  }

  /* x 軸と目盛りを作成する */
  setXAxis() {

    // x 方向の目盛りを描画する
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
      .style("stroke", this.setGridColorV)
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

  /* 横方向の罫線の色を設定する */
  setGridColorH(d, i) {
    if (d === 0) return "darkgray";
    else return "lightgray";
  }

  /* y 軸と目盛りを作成する */
  setYAxis() {

    // y 方向の目盛りを描画する
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
      .style("stroke", this.setGridColorH)
      .style("stroke-opacity", 0.7)
      .style("shape-rendering", "crispEdges");

    // y 軸のスタイルを設定する
    yAxis.selectAll("path")
      .style("stroke", "lightgray")
      .style("stroke-width", "1px");

    return yAxis;
  }

  /* x、y 方向のスケールと軸を設定する */
  setupScalesAndAxes(data) {

    // x、y 値の最小値、最大値を取得する
    let [xMin, xMax, yMin, yMax] = this.getMinMax(data);

    // x 方向の入力値が日付オブジェクトかどうか
    this.xIsDate = xMin instanceof Date;

    if (this.xIsDate) {

      // x 値の最小値、最大値を調整する ( 日付オブジェクトの場合 )
      [xMin, xMax] = this.adjustMinMaxDate(xMin, xMax, 
        this.margin["xPercentage"]);

    } else {

      // x 値の最小値、最大値を調整する ( 余裕を持たせる )
      [xMin, xMax] = this.adjustMinMax(xMin, xMax,
        this.margin["xPercentage"]);
      
    }

    // y 値の最小値、最大値を調整する ( 余裕を持たせる )
    [yMin, yMax] = this.adjustMinMax(yMin, yMax,
        this.margin["yPercentage"]);

    // x 方向のスケールを作成する
    this.x = this.createXScale(xMin, xMax);

    // y 方向のスケールを作成する
    this.y = this.createYScale(yMin, yMax);

    // x 軸と目盛りを作成する
    this.xAxis = this.setXAxis();

    // y 軸と目盛りを作成する
    this.yAxis = this.setYAxis();

  }

}