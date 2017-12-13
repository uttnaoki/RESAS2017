const region = ['全国', '東北', '関東', '中部', '近畿', '中国', '四国', '九州'];
const request_set = {
  'popDencity': '人口密度',
  'areaFee': '土地代',
  'salary': '賃金',
  'tempAverage': '気候',
  'jobOffers': '有効求人倍率'
}
for (const r in request_set) {
  $('#request').append('<div id="' + r + '"></div>')
}

const region_color = {
  'area': "aaaaaa"
};

const DEF_map_style = function() {
  const dms = {
    // エリアの背景色
    "area": {
      "default": "d0f4c9"
    },
    // テキスト(岡山県,岡山市,....)の色
    "label": {
      "default": "696969",
      "state": "000"
    },
    // エリアの境界線の色
    "border": {
      "default": "aaa",
      "state": "555"
    },
    // バックグラウンド(海)の色
    "bg": "5ab4e6"
  };
  return dms;
}

var region_style = {
  "lat": 37,
  "lng": 135.2,
  "zoom_level": 6
};
var select_area = '全国';
var select_region = '全国';
var request = {};
var result = {};

function editRequestView(req_type, degree_text, action) {
  switch (action) {
    case '追加':
      $('#' + req_type).addClass(degree_text + ' active')
        .text(request_set[req_type] + '=' + degree_text);
      break;
    case '修正':
      $('#' + req_type).attr('class', degree_text + ' active')
        .text(request_set[req_type] + '=' + degree_text);
      break;
    case '削除':
      $('#' + req_type).removeClass().text("");
      break;
    default:
  }
}

function listenRequest(req_type, degree, degree_text) {
  let request_view = $('#' + req_type);
  if (degree == 0) {
    delete request[req_type];
    // リクエストビューに指定要素があれば中身を削除
    if (request_view.hasClass('active')) {
      editRequestView(req_type, degree_text, '削除')
    }
  } else {
    request[req_type] = degree;
    if (!request_view.text()) {// 指定要素が空なら追加
      editRequestView(req_type, degree_text, '追加')
    }　else {
      if (!request_view.hasClass(degree_text)) {
        editRequestView(req_type, degree_text, '修正')
      }
    }
  }
  for (let r in request_set) {
    if (!(r === 'popDencity' || r === 'areaFee')) {
      if (region.indexOf(select_area) >= 0){
        $('#' + r).removeClass('unuse')
      } else {
        $('#' + r).addClass('unuse')
      }
    }
  }
  makeHeatLayer();
}

// 希望値に対する地域のマッチ度を返却(正規化処理)
function normalization(req, value, degree, region_flag){
  let norm_val = 0;
  if (value == 0) {
    return -1;
  }
  if(region_flag == 0){ // 都道府県別の基準
    switch (req) {
      case 'areaFee':
               if (value > 53943) norm_val = Math.abs(0.2-degree*0.2);
          else if (value > 31733) norm_val = Math.abs(0.4-degree*0.2);
          else if (value > 27472) norm_val = Math.abs(0.6-degree*0.2);
          else if (value > 23349) norm_val = Math.abs(0.8-degree*0.2);
          else if (value >     0) norm_val = Math.abs(1.0-degree*0.2);
          break;
      case 'popDencity':
               if (value >   521) norm_val = Math.abs(0.2-degree*0.2);
          else if (value >   311) norm_val = Math.abs(0.4-degree*0.2);
          else if (value >   192) norm_val = Math.abs(0.6-degree*0.2);
          else if (value >   143) norm_val = Math.abs(0.8-degree*0.2);
          else if (value >     0) norm_val = Math.abs(1.0-degree*0.2);
          break;
      case 'tempAverage':
               if (value > 17.43) norm_val = Math.abs(0.2-degree*0.2);
          else if (value > 16.21) norm_val = Math.abs(0.4-degree*0.2);
          else if (value > 15.52) norm_val = Math.abs(0.6-degree*0.2);
          else if (value > 13.40) norm_val = Math.abs(0.8-degree*0.2);
          else if (value >  0.00) norm_val = Math.abs(1.0-degree*0.2);
                    console.log(value, norm_val)
          break;
      case 'salary':
               if (value >   436) norm_val = Math.abs(0.2-degree*0.2);
          else if (value >   417) norm_val = Math.abs(0.4-degree*0.2);
          else if (value >   388) norm_val = Math.abs(0.6-degree*0.2);
          else if (value >   361) norm_val = Math.abs(0.8-degree*0.2);
          else if (value >     0) norm_val = Math.abs(1.0-degree*0.2);
          break;
      case 'jobOffers':
               if (value >  1.26) norm_val = Math.abs(0.2-degree*0.2);
          else if (value >  1.12) norm_val = Math.abs(0.4-degree*0.2);
          else if (value >  0.99) norm_val = Math.abs(0.6-degree*0.2);
          else if (value >  0.95) norm_val = Math.abs(0.8-degree*0.2);
          else if (value >     0) norm_val = Math.abs(1.0-degree*0.2);
          break;
      default:
          console.log('"' + req + '"に対する正規化処理は定義されていません.');
          break;
    }
  } else { // 市区町村別の基準
    switch (req) {
      case 'areaFee':
               if (value > 42803) norm_val = Math.abs(0.2-degree*0.2);
          else if (value > 21212) norm_val = Math.abs(0.4-degree*0.2);
          else if (value > 13101) norm_val = Math.abs(0.6-degree*0.2);
          else if (value >  7163) norm_val = Math.abs(0.8-degree*0.2);
          else if (value >     0) norm_val = Math.abs(1.0-degree*0.2);
          break;
      case 'popDencity':
               if (value >  2522) norm_val = Math.abs(0.2-degree*0.2);
          else if (value >   748) norm_val = Math.abs(0.4-degree*0.2);
          else if (value > 281.3) norm_val = Math.abs(0.6-degree*0.2);
          else if (value >   129) norm_val = Math.abs(0.8-degree*0.2);
          else if (value >     0) norm_val = Math.abs(1.0-degree*0.2);
          break;
      case 'tempAverage': console.log('no data');break;
      case 'salary': console.log('no data');break;
      case 'jobOffers': console.log('no data'); break;
      default:
         console.log('"' + req + '"に対する正規化処理は定義されていません.');
         break;
    }
  }
  return norm_val;
}

function setNormParam(request_name, request_degree) {
  let dataset;
  let region_flag; // region_flag = 0...都道府県, 1...市区町村
  if (region_flag = region.indexOf(select_area) < 0) {
    dataset = dataset_shikuchoson[select_region];
  } else {
    dataset = dataset_todofuken;
  }
  result[request_name] = {};
  for (let d of dataset){
    result[request_name][d.areaCode] = normalization(request_name, d[request_name], request_degree, region_flag);
  }
}

// 最終的な正規化処理を実行し，カラーコードを返却
function setColorCode(city_code) {
  let match_value = 0;　
  let k = 0; // 係数（比重）
  let divisor = 0; // 各比重kの合計値でmatch_valueを除算（正規化）

  for (const req in result) {
    if (result[req][city_code] == -1) {
      return 0;
    }
    if (!(req === 'popDencity' || req === 'areaFee') && (region.indexOf(select_area) < 0)) {
      continue;
    }
    switch(req){
      case 'areaFee'    : k = 1; break;
      case 'popDencity' : k = 1; break;
      case 'tempAverage': k = 1; break;
      case 'salary'     : k = 1; break;
      case 'jobOffers'  : k = 1; break;
    }
    match_value += result[req][city_code] * k;
    divisor     += k;
  }
  //console.log(match_value, match_value/divisor, divisor);
  const gb = ('0' + Math.round((255*match_value)/divisor).toString(16)).slice(-2);
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
      const cc = setColorCode(i, len);
      if (cc) {
        area_color[i] = cc;
      }
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
function goToSelectArea(area_heat, area_zoom) {
  // lat, lng, zoom_level の取得
  const view_area = setViewArea(area_zoom);
  for (let key in view_area) {
    region_style[key] = view_area[key]
  }
  select_region = area_heat;
  select_area = area_zoom;
  for (let r in request_set) {
    if (!(r === 'popDencity' || r === 'areaFee')) {
      if (region.indexOf(select_area) >= 0){
        $('#' + r).removeClass('unuse')
      } else {
        $('#' + r).addClass('unuse')
      }
    }
  }
  $('#request_area').text('地域＝' + area_zoom)

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
        let city_name = data.match(/<mname>(.*?)<\/mname>/g)[0].slice(7,-8);
        city_name = city_name.split(' ')
        // xx郡 yy市 の yy市のみを取得
        city_name = city_name.pop();
        const LI = dataset_LocalInformation[city_name];
        let info_areaFee, info_popDencity, info_hp;
        if (LI.areaFee !== ' ') {
          info_areaFee = '<p>' + LI.areaFee
            + ' (円/平方メートル)</p>'
            + '<p>(' + LI.areaFee_rank + '位/1648中)</p>';
        } else {
          info_areaFee = 'データがありません。'
        }
        if (LI.popDencity !== ' ') {
          info_popDencity = '<p>' + Math.round(LI.popDencity*100)/100
            + ' (人/平方キロメートル)</p>'
            + '<p>(' + LI.popDencity_rank + '位/822中)</p>';
        } else {
          info_popDencity = 'データがありません。'
        }
        info_hp = '<a href="' + LI.hp + '"><p>' + LI.hp + '</p></a>'
        $('#LI_cityName').text(city_name);
        $('#LI_areaFee').html(info_areaFee)
        $('#LI_popDencity').html(info_popDencity);
        $('#LI_hp').html(info_hp);
      }
    )
	});
}
