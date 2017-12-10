// 地域選択ボタンを作成

function listenRequest(con, value) {
  switch (con) {
    case '土地代':
      demand.areaFee = value;
      break;
    default:
  }
  makeHeatLayer();
}

const region_color = {
  'area': "aaaaaa"
};

const DEF_map_style = {
  // エリアの背景色
  "area": {
    "default": "dcdcdc"
  },
  // テキスト(岡山県,岡山市,....)の色
  "label": {
    "default": "696969"
  },
  // エリアの境界線の色
  "border": {
    "default": "aaa",
    "state": "555"
  },
  // バックグラウンド(海)の色
  "bg": "b0c4de"
}

var region_style = {
  "lat": 37,
  "lng": 135.2,
  "zoom_level": 6
};
var select_area = '全国';
var demand = {};
var result = {};

function calNormAreaFee(value){
  if (value>50000) return 1;
  else if (value <= 10000) return 0.2;
  else return Math.floor(value/10000)*0.2;
}

function normAreaFee() {
  let dataset;
  if (select_area == '全国') {
    dataset = dataset_todofuken;
    for (let i in dataset) {
      dataset[i].areaCode = ('0' + i).slice(-2)
    }
  } else {
    dataset = dataset_shikuchoson[select_area];
  }
  result.areaFee = {};
  for (let d of dataset){
    result.areaFee[d.areaCode] = calNormAreaFee(d.areaFee);
  }
}

// 地域選択後に描画するマップのスタイルを作成
function makeHeatLayer(zoom_flag) {
  let area_color = {
    "default": DEF_map_style.area.default
  }
  function defColorCode(match_value) {
    // const match_value = normAreaFee(value);
    const gb = ('0' + (1-match_value).toString(16)).slice(-2)
    return 'ff' + gb + gb;
  }
  for (let d in demand) {
    switch (d) {
      case 'areaFee':
        normAreaFee();
        break;
      default:
    }
  }
  if (Object.keys(result).length) {
    for (let i in result.areaFee){
      area_color[i] = defColorCode(result.areaFee[i]);
    }
    //
    let map_style = DEF_map_style;
    map_style.area = area_color;
    region_style.map = map_style;

    blankmap.setStyle(region_style.map)
    if(!zoom_flag)map.setLayerSet("blankmap");
  } else {
    region_style.map = DEF_map_style;
  }
}

// 選択地域の色変更と地域への画面遷移
function goToSelectArea(area) {
  // lat, lng, zoom_level の取得
  const view_area = setViewArea(area);
  for (let key in view_area) {
    region_style[key] = view_area[key]
  }
  select_area = area;

  makeHeatLayer(1);

  blankmap.setStyle(region_style.map)
  const p = new Y.LatLng(region_style.lat, region_style.lng);
  map.setZoom(region_style.zoom_level, true, p, true);
}

window.onload = function() {
  map = new Y.Map("map", {
    "configure": {
      "scrollWheelZoom": true
    }
  });
  map.addControl(new Y.LayerSetControl());
  map.addControl(new Y.SliderZoomControlHorizontal());

  //白地図レイヤーを作成
  blankmap = new Y.BlankMapLayer();
  let map_style = DEF_map_style;
  blankmap.setStyle(map_style)
  // レイヤーセットの作成
  const layerset = new Y.LayerSet("白地図", [blankmap], {
    "maxZoom": 20,
    "minZoom": 6
  });
  //Mapオブジェクトにレイヤーセットを追加
  map.addLayerSet("blankmap", layerset);
  //地図を描画
  map.drawMap(new Y.LatLng(37, 135.2), 6,
              Y.LayerSetId.NORMAL);
  // 白地図レイヤーを表示
  map.setLayerSet("blankmap");
  map.bind('click', function(latlng){
    query = '?lat=' + latlng.Lat + '&lon=' + latlng.Lon
    $.get('http://www.finds.jp/ws/rgeocode.php' + query,
      function (data) {
        // 都道府県名: pname
        // 市区町村名: mname
        console.log(data.match(/<pname>(.*?)<\/pname>/g)[0].slice(7,-8));
      }
    )
	});
}
