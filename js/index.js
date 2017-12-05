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
  let region_style = {};
  let s, f;
  switch (r) {
    case '北海道':
      s=1; f=1;
      region_style = {
        "lat": 43.568246,
        "lng": 142.740234,
        "zoom_level": 8
      };
      break;
    case '東北':
      s=2; f=7;
      region_style = {
        "lat": 39.338327,
        "lng": 140.916504,
        "zoom_level": 8
      };
      break;
    case '関東':
      s=8; f=14;
      region_style = {
        "lat": 35.764113,
        "lng": 139.823364,
        "zoom_level": 9
      };
      break;
    case '中部':
      s=15; f=23;
      region_style = {
        "lat": 35.968885,
        "lng": 137.373413,
        "zoom_level": 8
      };
      break;
    case '近畿':
      s=24; f=30;
      region_style = {
        "lat": 34.903720,
        "lng": 135.654053,
        "zoom_level": 9
      };
      break;
    case '中国':
      s=31; f=35;
      region_style = {
        "lat": 34.822590,
        "lng": 132.825073,
        "zoom_level": 9
      };
      break;
    case '四国':
      s=36; f=39;
      region_style = {
        "lat": 33.586931,
        "lng": 133.495239,
        "zoom_level": 9
      };
      break;
    case '九州':
      s=40; f=47;
      region_style = {
        "lat": 30.867987,
        "lng": 130.787109,
        "zoom_level": 7
      };
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
  let map_style = DEF_map_style;
  map_style.area = area_color;
  region_style.map = map_style;

  return region_style;
}

function goToRegion(button) {
  const r = button.value;
  const region_style = setRegionStyle(r);

  blankmap.setStyle(region_style.map)
  map.setLayerSet("blankmap")
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
