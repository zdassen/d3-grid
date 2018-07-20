/**
 *
 * total-cost.js
 *
 */
$(function () {

  /* ログのタイトルでグループ分けする */
  function groupBy(data) {
    let d = {};
    Object.entries(data).forEach((kv) => {
      let [id, record] = kv;
      let title = record["title"];
      if (Object.keys(d).indexOf(title) === -1) {
        d[title] = [
          {
            start: new Date(record["start"]),    // 開始時刻
            finish: new Date(record["finish"]),    // 終了時刻
          }
        ];
      } else {
        d[title].push(
          {
            start: new Date(record["start"]),    // 開始時刻
            finish: new Date(record["finish"]),    // 終了時刻
          }
        )
      }
    });
    return d;
  }

  /* 
   * 指定された項目についてのレコードのみ集めて
   * 累積経過時間に変換する 
   */
  function accum(data, title) {
    let d = data[title];

    let ret = [];
    let accumMinutes = 0;
    Object.entries(d).forEach((kv) => {

      // レコード 1 件に相当
      let record = kv[1];

      // 開始時刻 ~ 終了時刻までを分で得る
      let spanMilliSeconds = record["finish"] - record["start"];
      let spanMinutes = spanMilliSeconds / 1000 / 60;

      // 経過時間 ( 分 ) を累積する + データを追加
      accumMinutes += spanMinutes;
      ret.push([
        new Date(record["finish"]),    // 終了時刻 ( 日付オブジェクト )
        accumMinutes
      ])
    });

    return ret;
  }

  /* グラフの描画領域のサイズを設定する */
  let svgId = "graphArea";
  let svg = SVG.setupFullSize(svgId);

  /* JSON データを取得する */
  let title = "all";
  let url = `/logs/logs.json/${title}/`;
  $.getJSON(url, (data) => {

    // タイトルごとに分類する
    let g = groupBy(data);

    // タイトルのデータのみで累積の経過時間のデータに変換する
    let css = accum(g, "CSS");
    let django = accum(g, "Django");
    let bs = accum(g, "Bootstrap");
    let js = accum(g, "JavaScript");
    let ml = accum(g, "機械学習");
    let blog = accum(g, "ブログを書く");
    let db = accum(g, "データベース");

    // グラフのグリッド部分を作成する
    let margin = {top: 30, right: 30, bottom: 90, left: 36,
      xPercentage: 10, yPercentage: 10};
    let lg = new LineGraph(svgId, css, margin);

    // 折れ線グラフをまとめて描画する
    let params = [
      [css, "orange", "css"],
      [django, "green", "django"],
      [bs, "blueviolet", "bootstrap"],
      [js, "springgreen", "javascript"],
      [ml, "hotpink", "machine-learning"],
      [blog, "gray", "blog"],
      [db, "olivedrab", "database"],
    ];
    params.forEach((param) => {
      lg.drawLine(...param);
    });

  });

}());