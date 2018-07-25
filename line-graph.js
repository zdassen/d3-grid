/**
 *
 * line-graph.js
 *
 */
class LineGraph extends Grid {

  /* コンストラクタ */
  constructor(svgId, 
    margin={top: 30, right: 30, bottom: 50, left: 30,
      xPercentage: 10, yPercentage: 10}) {
    super(svgId, margin);

    // 折れ線描画用の関数
    this.lineFunc = null;

    // データを格納しておく
    // 次回以降の drawLine() 呼び出しでは、最大値、最小値を
    // 更新しないと軸が対応できないので、データをすべてマージする
    this.allDataFlattened = [];

    // データを格納しておく ( 2 )
    // 次回以降の drawLine() 呼び出し時にも、
    // すべてのデータセットをプロットする必要があるので
    // flatten() せずにデータを保持しておく
    this.allData = [];

    // 描画色を格納しておく
    this.colors = [];

    // クラスを格納しておく
    this.targetClassSuffixes = [];
  }

  /* x 軸の目盛りの形式を設定する */
  formatTickX(d) {
    // let format = d3.timeFormat("%m/%d %p");
    let format = d3.timeFormat("%m/%d");
    return format(d);
  }

  /* 折れ線の描画用の関数を作成する */
  createLineFunc() {
    return d3.line()
      .x(d => this.x(this.getX(d)))
      .y(d => this.y(this.getY(d)));
  }

  /* 折れ線を描画する */
  drawLine(data, color, targetClassSuffix) {
   
    // データを追加する ( flatten() する )
    data.forEach(record => this.allDataFlattened.push(record));

    // データを追加する ( drawLine() 呼び出しごとのデータ単位で追加 )
    this.allData.push(data);

    // 線の色を追加する
    this.colors.push(color);

    // 既に描画した折れ線を削除する
    // この時点ではまだ折れ線のクラスが新たに追加されていないので、
    // 今存在するクラスに相当する折れ線をすべて消去すれば足りる
    // ( 直後でクラス値 ( 今回のプロット相当の ) クラスを追加する
    // ようにしている )
    this.targetClassSuffixes.forEach(tcls => {
      let cls = `path.graph-${tcls}`;
      d3.select(cls).remove();
    });

    // クラスを追加する
    this.targetClassSuffixes.push(targetClassSuffix);

    // 既存の軸と罫線を削除する
    [".x-axis", ".y-axis"].forEach(
      cls => d3.selectAll(cls).remove()
    );

    // ( Grid クラスのメソッド )
    // スケールと軸を更新する
    this.setupScalesAndAxes(this.allDataFlattened); 

    // 折れ線の描画用の関数を作成する
    this.lineFunc = this.createLineFunc();

    // 折れ線を描画する
    this.allData.forEach((data, i) => {
      this.plot(data, this.colors[i], this.targetClassSuffixes[i]);
    });
  }

  /* 折れ線を描画する */
  plot(data, color, targetClassSuffix) {
    return this.svg.append("path")
      .data([data])
      .attr("class", `graph-${targetClassSuffix}`)
      .attr("d", this.lineFunc)
      .style("fill", "none")
      .style("stroke", color)
      .style("stroke-width", "1.5px");
  }

}


/* テスト */
/*
let svgId = "graphArea";
SVG.setupFullSize(svgId);

let dType = "a";
let data = null;
if (dType == "a") {
  data = [
    [new Date("2018-07-16 00:01:01"), 250],
    [new Date("2018-07-17 00:00:00"), 10],
    [new Date("2018-07-17 05:15:14"), 190],
    [new Date("2018-07-19 12:00:00"), 110]
  ];
} else if (dType == "b") {
  data = [
    [2000, 10],
    [10000, 110],
  ];
}
let lg = new LineGraph(svgId, data);
console.dir(lg);
lg.drawLine(data, "crimson", "sample1");

// 新しいデータ
let data2 = [
  [new Date("2018-06-16 00:01:01"), 450],
  [new Date("2018-06-17 00:00:00"), 210],
  [new Date("2018-06-17 05:15:14"), 390],
  [new Date("2018-06-19 12:00:00"), 310]
];
lg.drawLine(data2, "springgreen", "sample2");
//console.dir(lg);
*/