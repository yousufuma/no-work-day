console.clear();


const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 300;
const FRAME_TIME = 1000 / 16;
const LIGHT_ROWS = 20;
const LIGHT_ROW_DEPTH = 2;
const LIGHT_SPACING = 0.6;
const LIGHT_SIZE = 0.1;
const LIGHT_SCATTER = 0.4;
const BUILDING_ROWS = 38;
const BUILDING_ROW_DEPTH = 1;
const BUILDING_ROW_WIDTH = 60;
const BUILDING_MIN_HEIGHT = 1.5;
const BUILDING_MAX_HEIGHT = 3;
const STACK_HEIGHT = 9;
const STACK_THRESHOLD = 0.87;
const STACK_LIGHT_CHANCE = 0.95;
const STACK_LIGHT_SIZE = 0.13;
const FADE_GRAY_VALUE = 25;
const FADE_OFFSET = 0.35;


const CAMERA = {
  x: 0,
  y: 10,
  z: 0,
  fov: 170,
  dist: 30,
  zSpeed: 0.003



};
const VP_OFS = {
  x: 0.5,
  y: 0.27


};
let c, ctx, output_c, output_ctx;
let _t, _dt, _ft;

const RNG = {
  seed: 1,
  random() {
    const x = Math.sin(RNG.seed++) * 10000;
    return x - (x << 0);
  },
  randomInRange(min, max) {
    return (RNG.random() * (max - min + 1) << 0) + min;
  }
};



const Palette = (() => {
  const PAL = ['black', '#111', '#113', 'white', 'sliver', '#f88', 'orange', 'oldlace', '#569'];
  const lastIndex = PAL.length - 1;

  function getRandomFromPalette() {
    return PAL[RNG.randomInRange(0, lastIndex)];
  }

  return {
    getRandom: getRandomFromPalette
  };

})();

function ceil(n) {
  var f = n << 0,
    f = f == n ? f : f + 1;
  return f;
}


function update() {

  _t = Date.now() * 0.001;

  CAMERA.z += CAMERA.zSpeed;
}

let _$ = {
  vPointX: 0,
  vPointY: 0,
  rowScreenX: 0,
  MAX_LIGHTS: 0,
  closestLightRow: 0,
  rowZ: 0,
  rowRelativeZ: 0,
  scalingFactor: 0,
  rowScreenWidth: 0,
  rowScreenHeight: 0,
  rowScreenY: 0,
  rowScreenLightSpacing: 0,
  rowLightCount: 0,
  lightSize: 0,
  lightHalfSize: 0,
  lightScreenX: 0,
  lightScreenY: 0,
  closestBuildingRow: 0,
  rowBuildingCount: 0,
  rowBuildingScreenWidth: 0,
  rowShade: 0,
  rowStyleString: '',
  lightData: [],
  isStack: false,
  buildingHeight: 0,
  buildingScreenHeight: 0,
  buildingScreenX: 0,
  buildingScreenY: 0,
  lightSize: 0,
  lightHalfSize: 0,
  lightColor: 0
};

function render() {

  _$.vPointX = c.width * VP_OFS.x >> 0;
  _$.vPointY = c.height * VP_OFS.y >> 0;

  _$.rowScreenX = CAMERA.x + _$.vPointX;


  ctx.clearRect(0, 0, c.width, c.height);
  output_ctx.clearRect(0, 0, output_c.width, output_c.height);

  _$.closestLightRow = Math.floor(CAMERA.z / LIGHT_ROW_DEPTH);


  for (let i = 0; i < LIGHT_ROWS; i++) {

    _$.rowZ = _$.closestLightRow * LIGHT_ROW_DEPTH + LIGHT_ROW_DEPTH * i;
    _$.rowRelativeZ = _$.rowZ - CAMERA.z;

    if (_$.rowRelativeZ <= 0 || _$.rowRelativeZ > CAMERA.dist) {
      continue;
    }

    _$.scalingFactor = CAMERA.fov / _$.rowRelativeZ;
    _$.rowScreenY = CAMERA.y * _$.scalingFactor + _$.vPointY;


    if (_$.rowScreenY > c.height) {
      continue;
    }


    _$.rowScreenLightSpacing = LIGHT_SPACING * _$.scalingFactor;
    _$.rowLightCount = c.width / _$.rowScreenLightSpacing;

    RNG.seed = _$.rowZ * 0.573;

    for (let j = 0; j < _$.rowLightCount; j++) {


      _$.lightSize = RNG.random() * (LIGHT_SIZE * _$.scalingFactor);
      _$.lightHalfSize = _$.lightSize * 0.5;


      _$.lightScreenX = j * _$.rowScreenLightSpacing +
        RNG.random() * LIGHT_SCATTER * _$.scalingFactor - _$.lightHalfSize;
      _$.lightScreenY = _$.rowScreenY + RNG.random() * LIGHT_SCATTER * _$.scalingFactor - _$.lightHalfSize;


      if (_$.lightScreenX < 0 || _$.lightScreenX > c.width ||
        _$.lightScreenY > c.height) {

        Palette.getRandom();
        continue;
      }


      ctx.fillStyle = Palette.getRandom();


      ctx.fillRect(_$.rowScreenX + _$.lightScreenX,
        _$.lightScreenY, _$.lightSize, _$.lightSize);
      ctx.fillRect(_$.rowScreenX - _$.lightScreenX,
        _$.lightScreenY, _$.lightSize, _$.lightSize);
    }
  }

  _$.closestBuildingRow = Math.floor(CAMERA.z / BUILDING_ROW_DEPTH);


  for (let i = BUILDING_ROWS; i > 0; i--) {

    _$.rowZ = _$.closestBuildingRow * BUILDING_ROW_DEPTH + BUILDING_ROW_DEPTH * i;
    _$.rowRelativeZ = _$.rowZ - CAMERA.z;


    if (_$.rowRelativeZ <= 0 || _$.rowRelativeZ > CAMERA.dist) {
      continue;
    }


    _$.scalingFactor = CAMERA.fov / _$.rowRelativeZ;

    _$.rowScreenWidth = BUILDING_ROW_WIDTH * _$.scalingFactor;
    _$.rowScreenHeight = BUILDING_MAX_HEIGHT * _$.scalingFactor;
    _$.rowScreenX = CAMERA.x * _$.scalingFactor + _$.vPointX - _$.rowScreenWidth * 0.5;
    _$.rowScreenY = CAMERA.y * _$.scalingFactor + _$.vPointY - _$.rowScreenHeight;

    RNG.seed = _$.rowZ;


    _$.rowBuildingCount = RNG.randomInRange(20, 70);
    _$.rowBuildingScreenWidth = _$.rowScreenWidth / _$.rowBuildingCount;

    _$.rowShade = Math.round(FADE_GRAY_VALUE * (_$.rowRelativeZ / CAMERA.dist - FADE_OFFSET));
    _$.rowStyleString = 'rgb(' + _$.rowShade + ',' + _$.rowShade + ',' + _$.rowShade + ')';


    _$.lightData.length = 0;
    ctx.fillStyle = _$.rowStyleString;
    for (let j = 0; j < _$.rowBuildingCount; j++) {

      _$.isStack = false;
      _$.buildingHeight = Math.max(BUILDING_MIN_HEIGHT, RNG.random() * BUILDING_MAX_HEIGHT);

      if (_$.buildingHeight > BUILDING_MAX_HEIGHT * STACK_THRESHOLD) {
        _$.isStack = true;

        _$.buildingHeight = STACK_HEIGHT * 0.6 + RNG.random() * 0.4;
      }

      _$.buildingScreenHeight = _$.buildingHeight * _$.scalingFactor;
      _$.buildingScreenX = _$.rowScreenX + j * _$.rowBuildingScreenWidth;
      _$.buildingScreenY = _$.rowScreenY + _$.rowScreenHeight - _$.buildingScreenHeight;


      ctx.fillRect(_$.buildingScreenX, _$.buildingScreenY, Math.ceil(_$.rowBuildingScreenWidth), _$.buildingScreenHeight);


      RNG.seed = _$.buildingHeight + j;


      if (_$.isStack && RNG.random() < STACK_LIGHT_CHANCE) {

        _$.lightSize = RNG.random() * (STACK_LIGHT_SIZE * _$.scalingFactor);
        _$.lightColor = RNG.random() > 0.6 ? 'white' : 'red';

        _$.lightData.push(_$.buildingScreenX);
        _$.lightData.push(_$.buildingScreenY);
        _$.lightData.push(_$.lightSize);
        _$.lightData.push(_$.lightColor);
      }
    }


    for (let j = 0; j < _$.lightData.length; j += 4) {
      _$.buildingScreenX = _$.lightData[j];
      _$.buildingScreenY = _$.lightData[j + 1];
      _$.lightSize = _$.lightData[j + 2];
      _$.lightHalfSize = _$.lightSize * 0.5;
      _$.lightColor = _$.lightData[j + 3];


      ctx.fillStyle = _$.lightColor;
      ctx.fillRect(_$.buildingScreenX - _$.lightHalfSize,
        _$.buildingScreenY - _$.lightHalfSize, _$.lightSize, _$.lightSize);
      ctx.fillRect(_$.buildingScreenX + _$.rowBuildingScreenWidth - _$.lightHalfSize,
        _$.buildingScreenY - _$.lightHalfSize, _$.lightSize, _$.lightSize);
    }
  }

  output_ctx.drawImage(c, 0, 0);
}

function frame() {
  requestAnimationFrame(frame);
  _ft = Date.now();
  update();
  if (_ft - _dt > FRAME_TIME) {
    render();
    _dt = _ft;
  }

}


function start() {

  _dt = _ft = Date.now();

  c = document.createElement('canvas');
  ctx = c.getContext('2d');

  output_c = document.createElement('canvas');
  output_ctx = output_c.getContext('2d');

  output_c.width = c.width = CANVAS_WIDTH;
  output_c.height = c.height = CANVAS_HEIGHT;
  document.body.appendChild(output_c);

  frame();
}

start();