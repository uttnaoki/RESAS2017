var region = ['北海道', '東北', '関東', '中部', '近畿', '中国', '四国', '九州'];
for (var r of region) {
  $("#button").append('<button type="button" '
    + 'value="' + r + '" '
    + 'onClick="goToRegion(this)">'
    + r + '</button>')
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
    "default": "aaa"
  },
  // バックグラウンド(海)の色
  "bg": "b0c4de"
}

function setRegionStyle(r) {
  let map_style = DEF_map_style;
  let s,f;
  switch (r) {
    case '北海道':
      s=1; f=1;
      break;
    case '東北':
      s=2; f=7;
      break;
    case '関東':
      s=8; f=14;
      break;
    case '中部':
      s=15; f=23;
      break;
    case '近畿':
      s=24; f=30;
      break;
    case '中国':
      s=31; f=35;
      break;
    case '四国':
      s=36; f=39
      break;
    case '九州':
      s=40; f=47;
      break;
    default:
  }
  let area_color = {
    "default": DEF_map_style.area.default
  }
  for (let i=s; i<=f; i++) {
    const key = ("0" + i).slice(-2);
    area_color[key] = region_color.area;
  }
  map_style.area = area_color;

  return map_style;
}

function goToRegion(button) {
  const r = button.value;
  const map_style = setRegionStyle(r);

  blankmap.setStyle(map_style)
  map.setLayerSet("blankmap")
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
  var layerset = new Y.LayerSet("白地図", [blankmap], {
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
}
