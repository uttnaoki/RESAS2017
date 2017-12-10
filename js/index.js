const region_color = {
  'area': "aaaaaa"
};

const DEF_map_style = function() {
  const dms = {
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
  };
  return dms;
}

var region_style = {
  "lat": 37,
  "lng": 135.2,
  "zoom_level": 6
};
var select_area = '全国';
var request = {};
var result = {};

function listenRequest(type, value) {
  if (value == 0) {
    delete request[type];
  } else {
    request[type] = value;
  }
  makeHeatLayer();
}

// 希望値に対する地域のマッチ度を返却(正規化処理)
function normalization(req, value, degree){
  let norm_val;
  switch (req) {
    case 'areaFee':
      if (value>50000) norm_val = 1;
      else if (value <= 10000) norm_val = 0.2;
      else norm_val = Math.floor(value/10000)*0.2;
      break;
    case 'popDencity':
      norm_val = 0.2;
      break;
    case 'tempAverage':
      norm_val = 0.4;
      break;
    case 'salary':
      norm_val = 0.6;
      break;
    default:
      console.log('"' + req + '"に対する正規化処理は定義されていません.');
  }
  return norm_val;
}

function setNormParam(request_name, request_degree) {
  let dataset;
  if (select_area == '全国') {
    dataset = dataset_todofuken;
  } else {
    dataset = dataset_shikuchoson[select_area];
  }

  result[request_name] = {};
  for (let d of dataset){
    result[request_name][d.areaCode] = normalization(request_name, d[request_name], request_degree);
  }
}

// 最終的な正規化処理を実行し，カラーコードを返却
function setColorCode(city_code, len) {
  let match_value = 0;
  for (const req in result) {
    match_value += result[req][city_code];
  }
  match_value /= len;
  const gb = ('0' + (1-match_value).toString(16)).slice(-2);
  return 'ff' + gb + gb;
}

// 地域選択後に描画するマップのスタイルを作成
function makeHeatLayer(zoom_flag) {
  let area_color = {
    "default": DEF_map_style().area.default
  }
  result = {};
  for (let r in request) {
    setNormParam(r, request[r]);
  }
  const key = Object.keys(result)[0];
  const len = Object.keys(result).length;
  if (key) {
    for (let i in result[key]){
      area_color[i] = setColorCode(i, len);
    }
    let map_style = DEF_map_style();
    map_style.area = area_color;
    region_style.map = map_style;
  } else {
    region_style.map = DEF_map_style();
  }
  blankmap.setStyle(region_style.map)
  if(!zoom_flag)map.setLayerSet("blankmap");
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
  let map_style = DEF_map_style();
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
