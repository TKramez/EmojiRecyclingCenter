"use strict";

/*

TODO:
when the game is over, unlock "creative mode" which brings back all emoji
  and allows the user to select tool strength & size at will
ideally, click pitch should be related to block base strength
*/

/*
  constructionFade.mp3 faded in/out based on https://pixabay.com/sound-effects/construction-amb-58116/
  assemblyFade.mp3 looped based on https://pixabay.com/sound-effects/assembly-line-factory-atmo-field-recording-29423/
*/

class App {
  constructor() {
    this.canvas = document.getElementById('cmain');
    this.ctx = this.canvas.getContext('2d');
    this.bgCanvas = document.createElement('canvas');
    this.bgCtx = this.bgCanvas.getContext('2d');
    this.bgCanvas.width = this.canvas.width;
    this.bgCanvas.height = this.canvas.height;
    this.mapCanvas = document.getElementById('cmap');
    this.mapCtx = this.mapCanvas.getContext('2d');
    this.emojiCount = 758;
    this.emojiList = ["\ud83d\ude04","\ud83d\ude03","\ud83d\ude00","\ud83d\ude0a","\ud83d\ude09","\ud83d\ude0d","\ud83d\ude18","\ud83d\ude1a","\ud83d\ude17","\ud83d\ude19","\ud83d\ude1c","\ud83d\ude1d","\ud83d\ude1b","\ud83d\ude33","\ud83d\ude01","\ud83d\ude14","\ud83d\ude0c","\ud83d\ude12","\ud83d\ude1e","\ud83d\ude23","\ud83d\ude22","\ud83d\ude02","\ud83d\ude2d","\ud83d\ude2a","\ud83d\ude25","\ud83d\ude30","\ud83d\ude05","\ud83d\ude13","\ud83d\ude29","\ud83d\ude2b","\ud83d\ude28","\ud83d\ude31","\ud83d\ude20","\ud83d\ude21","\ud83d\ude24","\ud83d\ude16","\ud83d\ude06","\ud83d\ude0b","\ud83d\ude37","\ud83d\ude0e","\ud83d\ude34","\ud83d\ude35","\ud83d\ude32","\ud83d\ude1f","\ud83d\ude26","\ud83d\ude27","\ud83d\ude08","\ud83d\udc7f","\ud83d\ude2e","\ud83d\ude2c","\ud83d\ude10","\ud83d\ude15","\ud83d\ude2f","\ud83d\ude36","\ud83d\ude07","\ud83d\ude0f","\ud83d\ude11","\ud83d\udc72","\ud83d\udc73","\ud83d\udc6e","\ud83d\udc77","\ud83d\udc82","\ud83d\udc76","\ud83d\udc66","\ud83d\udc67","\ud83d\udc68","\ud83d\udc69","\ud83d\udc74","\ud83d\udc75","\ud83d\udc71","\ud83d\udc7c","\ud83d\udc78","\ud83d\ude3a","\ud83d\ude38","\ud83d\ude3b","\ud83d\ude3d","\ud83d\ude3c","\ud83d\ude40","\ud83d\ude3f","\ud83d\ude39","\ud83d\ude3e","\ud83d\udc79","\ud83d\udc7a","\ud83d\ude48","\ud83d\ude49","\ud83d\ude4a","\ud83d\udc80","\ud83d\udc7d","\ud83d\udca9","\ud83d\udd25","\u2728","\ud83c\udf1f","\ud83d\udcab","\ud83d\udca5","\ud83d\udca2","\ud83d\udca6","\ud83d\udca7","\ud83d\udca4","\ud83d\udca8","\ud83d\udc42","\ud83d\udc40","\ud83d\udc43","\ud83d\udc45","\ud83d\udc44","\ud83d\udc4d","\ud83d\udc4e","\ud83d\udc4c","\ud83d\udc4a","\u270a","\u270c","\ud83d\udc4b","\u270b","\ud83d\udc50","\ud83d\udc46","\ud83d\udc47","\ud83d\udc49","\ud83d\udc48","\ud83d\ude4c","\ud83d\ude4f","\u261d","\ud83d\udc4f","\ud83d\udcaa","\ud83d\udeb6","\ud83c\udfc3","\ud83d\udc83","\ud83d\udc6b","\ud83d\udc6a","\ud83d\udc6c","\ud83d\udc6d","\ud83d\udc8f","\ud83d\udc91","\ud83d\udc6f","\ud83d\ude46","\ud83d\ude45","\ud83d\udc81","\ud83d\ude4b","\ud83d\udc86","\ud83d\udc87","\ud83d\udc85","\ud83d\udc70","\ud83d\ude4e","\ud83d\ude4d","\ud83d\ude47","\ud83c\udfa9","\ud83d\udc51","\ud83d\udc52","\ud83d\udc5f","\ud83d\udc5e","\ud83d\udc61","\ud83d\udc60","\ud83d\udc62","\ud83d\udc55","\ud83d\udc54","\ud83d\udc5a","\ud83d\udc57","\ud83c\udfbd","\ud83d\udc56","\ud83d\udc58","\ud83d\udc59","\ud83d\udcbc","\ud83d\udc5c","\ud83d\udc5d","\ud83d\udc5b","\ud83d\udc53","\ud83c\udf80","\ud83c\udf02","\ud83d\udc84","\ud83d\udc9b","\ud83d\udc99","\ud83d\udc9c","\ud83d\udc9a","\ud83d\udc94","\ud83d\udc97","\ud83d\udc93","\ud83d\udc95","\ud83d\udc96","\ud83d\udc9e","\ud83d\udc98","\ud83d\udc8c","\ud83d\udc8b","\ud83d\udc8d","\ud83d\udc8e","\ud83d\udc64","\ud83d\udc65","\ud83d\udcac","\ud83d\udc63","\ud83d\udcad","\ud83d\udc36","\ud83d\udc3a","\ud83d\udc31","\ud83d\udc2d","\ud83d\udc39","\ud83d\udc30","\ud83d\udc38","\ud83d\udc2f","\ud83d\udc28","\ud83d\udc3b","\ud83d\udc37","\ud83d\udc3d","\ud83d\udc2e","\ud83d\udc17","\ud83d\udc35","\ud83d\udc12","\ud83d\udc34","\ud83d\udc11","\ud83d\udc18","\ud83d\udc3c","\ud83d\udc27","\ud83d\udc26","\ud83d\udc24","\ud83d\udc25","\ud83d\udc23","\ud83d\udc14","\ud83d\udc0d","\ud83d\udc22","\ud83d\udc1b","\ud83d\udc1d","\ud83d\udc1c","\ud83d\udc1e","\ud83d\udc0c","\ud83d\udc19","\ud83d\udc1a","\ud83d\udc20","\ud83d\udc1f","\ud83d\udc2c","\ud83d\udc33","\ud83d\udc0b","\ud83d\udc04","\ud83d\udc0f","\ud83d\udc00","\ud83d\udc03","\ud83d\udc05","\ud83d\udc07","\ud83d\udc09","\ud83d\udc0e","\ud83d\udc10","\ud83d\udc13","\ud83d\udc15","\ud83d\udc16","\ud83d\udc01","\ud83d\udc02","\ud83d\udc32","\ud83d\udc21","\ud83d\udc0a","\ud83d\udc2b","\ud83d\udc2a","\ud83d\udc06","\ud83d\udc08","\ud83d\udc29","\ud83d\udc3e","\ud83d\udc90","\ud83c\udf38","\ud83c\udf37","\ud83c\udf40","\ud83c\udf39","\ud83c\udf3b","\ud83c\udf3a","\ud83c\udf41","\ud83c\udf43","\ud83c\udf42","\ud83c\udf3f","\ud83c\udf3e","\ud83c\udf44","\ud83c\udf35","\ud83c\udf34","\ud83c\udf32","\ud83c\udf33","\ud83c\udf30","\ud83c\udf31","\ud83c\udf3c","\ud83c\udf10","\ud83c\udf1e","\ud83c\udf1d","\ud83c\udf1a","\ud83c\udf11","\ud83c\udf12","\ud83c\udf13","\ud83c\udf14","\ud83c\udf15","\ud83c\udf16","\ud83c\udf17","\ud83c\udf18","\ud83c\udf1c","\ud83c\udf1b","\ud83c\udf19","\ud83c\udf0d","\ud83c\udf0e","\ud83c\udf0f","\ud83c\udf0b","\ud83c\udf0c","\ud83c\udf20","\u2b50","\u26c5","\u26a1","\u2614","\u26c4","\ud83c\udf00","\ud83c\udf01","\ud83c\udf08","\ud83c\udf0a","\ud83c\udf8d","\ud83d\udc9d","\ud83c\udf8e","\ud83c\udf92","\ud83c\udf93","\ud83c\udf8f","\ud83c\udf86","\ud83c\udf87","\ud83c\udf90","\ud83c\udf91","\ud83c\udf83","\ud83d\udc7b","\ud83c\udf85","\ud83c\udf84","\ud83c\udf81","\ud83c\udf8b","\ud83c\udf89","\ud83c\udf8a","\ud83c\udf88","\ud83c\udf8c","\ud83d\udd2e","\ud83c\udfa5","\ud83d\udcf7","\ud83d\udcf9","\ud83d\udcfc","\ud83d\udcbf","\ud83d\udcc0","\ud83d\udcbd","\ud83d\udcbe","\ud83d\udcbb","\ud83d\udcf1","\ud83d\udcde","\ud83d\udcdf","\ud83d\udce0","\ud83d\udce1","\ud83d\udcfa","\ud83d\udcfb","\ud83d\udd0a","\ud83d\udd09","\ud83d\udd08","\ud83d\udd07","\ud83d\udd14","\ud83d\udd15","\ud83d\udce2","\ud83d\udce3","\u23f3","\u231b","\u23f0","\u231a","\ud83d\udd13","\ud83d\udd12","\ud83d\udd0f","\ud83d\udd10","\ud83d\udd11","\ud83d\udd0e","\ud83d\udca1","\ud83d\udd26","\ud83d\udd06","\ud83d\udd05","\ud83d\udd0c","\ud83d\udd0b","\ud83d\udd0d","\ud83d\udec1","\ud83d\udec0","\ud83d\udebf","\ud83d\udebd","\ud83d\udd27","\ud83d\udd29","\ud83d\udd28","\ud83d\udeaa","\ud83d\udeac","\ud83d\udca3","\ud83d\udd2b","\ud83d\udd2a","\ud83d\udc8a","\ud83d\udc89","\ud83d\udcb0","\ud83d\udcb4","\ud83d\udcb5","\ud83d\udcb7","\ud83d\udcb6","\ud83d\udcb3","\ud83d\udcb8","\ud83d\udcf2","\ud83d\udce7","\ud83d\udce5","\ud83d\udce4","\ud83d\udce9","\ud83d\udce8","\ud83d\udcef","\ud83d\udceb","\ud83d\udcea","\ud83d\udcec","\ud83d\udced","\ud83d\udcee","\ud83d\udce6","\ud83d\udcdd","\ud83d\udcc4","\ud83d\udcc3","\ud83d\udcd1","\ud83d\udcca","\ud83d\udcc8","\ud83d\udcc9","\ud83d\udcdc","\ud83d\udccb","\ud83d\udcc5","\ud83d\udcc6","\ud83d\udcc7","\ud83d\udcc1","\ud83d\udcc2","\ud83d\udccc","\ud83d\udcce","\ud83d\udccf","\ud83d\udcd0","\ud83d\udcd5","\ud83d\udcd7","\ud83d\udcd8","\ud83d\udcd9","\ud83d\udcd3","\ud83d\udcd4","\ud83d\udcd2","\ud83d\udcda","\ud83d\udcd6","\ud83d\udd16","\ud83d\udcdb","\ud83d\udd2c","\ud83d\udd2d","\ud83d\udcf0","\ud83c\udfa8","\ud83c\udfac","\ud83c\udfa4","\ud83c\udfa7","\ud83c\udfbc","\ud83c\udfb5","\ud83c\udfb6","\ud83c\udfb9","\ud83c\udfbb","\ud83c\udfba","\ud83c\udfb7","\ud83c\udfb8","\ud83d\udc7e","\ud83c\udfae","\ud83c\udccf","\ud83c\udfb4","\ud83c\udc04","\ud83c\udfb2","\ud83c\udfaf","\ud83c\udfc8","\ud83c\udfc0","\u26bd","\u26be","\ud83c\udfbe","\ud83c\udfb1","\ud83c\udfc9","\ud83c\udfb3","\u26f3","\ud83d\udeb5","\ud83d\udeb4","\ud83c\udfc1","\ud83c\udfc7","\ud83c\udfc6","\ud83c\udfbf","\ud83c\udfc2","\ud83c\udfca","\ud83c\udfc4","\ud83c\udfa3","\u2615","\ud83c\udf75","\ud83c\udf76","\ud83c\udf7c","\ud83c\udf7a","\ud83c\udf7b","\ud83c\udf78","\ud83c\udf79","\ud83c\udf77","\ud83c\udf74","\ud83c\udf55","\ud83c\udf54","\ud83c\udf5f","\ud83c\udf57","\ud83c\udf56","\ud83c\udf5d","\ud83c\udf5b","\ud83c\udf64","\ud83c\udf71","\ud83c\udf63","\ud83c\udf65","\ud83c\udf59","\ud83c\udf58","\ud83c\udf5a","\ud83c\udf5c","\ud83c\udf72","\ud83c\udf62","\ud83c\udf61","\ud83c\udf73","\ud83c\udf5e","\ud83c\udf69","\ud83c\udf6e","\ud83c\udf66","\ud83c\udf68","\ud83c\udf67","\ud83c\udf82","\ud83c\udf70","\ud83c\udf6a","\ud83c\udf6b","\ud83c\udf6c","\ud83c\udf6d","\ud83c\udf6f","\ud83c\udf4e","\ud83c\udf4f","\ud83c\udf4a","\ud83c\udf4b","\ud83c\udf52","\ud83c\udf47","\ud83c\udf49","\ud83c\udf53","\ud83c\udf51","\ud83c\udf48","\ud83c\udf4c","\ud83c\udf50","\ud83c\udf4d","\ud83c\udf60","\ud83c\udf46","\ud83c\udf45","\ud83c\udf3d","\ud83c\udfe0","\ud83c\udfe1","\ud83c\udfeb","\ud83c\udfe2","\ud83c\udfe3","\ud83c\udfe5","\ud83c\udfe6","\ud83c\udfea","\ud83c\udfe9","\ud83c\udfe8","\ud83d\udc92","\u26ea","\ud83c\udfec","\ud83c\udfe4","\ud83c\udf07","\ud83c\udf06","\ud83c\udfef","\ud83c\udff0","\u26fa","\ud83c\udfed","\ud83d\uddfc","\ud83d\uddfe","\ud83d\uddfb","\ud83c\udf04","\ud83c\udf05","\ud83c\udf03","\ud83d\uddfd","\ud83c\udf09","\ud83c\udfa0","\ud83c\udfa1","\u26f2","\ud83c\udfa2","\ud83d\udea2","\u26f5","\ud83d\udea4","\ud83d\udea3","\u2693","\ud83d\ude80","\ud83d\udcba","\ud83d\ude81","\ud83d\ude82","\ud83d\ude8a","\ud83d\ude89","\ud83d\ude9e","\ud83d\ude86","\ud83d\ude84","\ud83d\ude85","\ud83d\ude88","\ud83d\ude87","\ud83d\ude9d","\ud83d\ude8b","\ud83d\ude83","\ud83d\ude8e","\ud83d\ude8c","\ud83d\ude8d","\ud83d\ude99","\ud83d\ude98","\ud83d\ude97","\ud83d\ude95","\ud83d\ude96","\ud83d\ude9b","\ud83d\ude9a","\ud83d\udea8","\ud83d\ude93","\ud83d\ude94","\ud83d\ude92","\ud83d\ude91","\ud83d\ude90","\ud83d\udeb2","\ud83d\udea1","\ud83d\ude9f","\ud83d\udea0","\ud83d\ude9c","\ud83d\udc88","\ud83d\ude8f","\ud83c\udfab","\ud83d\udea6","\ud83d\udea5","\ud83d\udea7","\ud83d\udd30","\u26fd","\ud83c\udfee","\ud83c\udfb0","\ud83d\uddff","\ud83c\udfaa","\ud83c\udfad","\ud83d\udccd","\ud83d\udea9","\ud83d\udd20","\ud83d\udd21","\ud83d\udd24","\ud83d\udd04","\u23ea","\u23e9","\u23eb","\u23ec","\ud83c\udd97","\ud83d\udd00","\ud83d\udd01","\ud83d\udd02","\ud83c\udd95","\ud83c\udd99","\ud83c\udd92","\ud83c\udd93","\ud83c\udd96","\ud83d\udcf6","\ud83c\udfa6","\ud83c\ude01","\ud83c\ude2f","\ud83c\ude33","\ud83c\ude35","\ud83c\ude34","\ud83c\ude32","\ud83c\ude50","\ud83c\ude39","\ud83c\ude3a","\ud83c\ude36","\ud83c\ude1a","\ud83d\udebb","\ud83d\udeb9","\ud83d\udeba","\ud83d\udebc","\ud83d\udebe","\ud83d\udeb0","\ud83d\udeae","\ud83c\udd7f","\u267f","\ud83d\udead","\ud83c\ude38","\ud83d\udec2","\ud83d\udec4","\ud83d\udec5","\ud83d\udec3","\ud83c\ude51","\ud83c\udd91","\ud83c\udd98","\ud83c\udd94","\ud83d\udeab","\ud83d\udd1e","\ud83d\udcf5","\ud83d\udeaf","\ud83d\udeb1","\ud83d\udeb3","\ud83d\udeb7","\ud83d\udeb8","\u26d4","\u274e","\u2705","\ud83d\udc9f","\ud83c\udd9a","\ud83d\udcf3","\ud83d\udcf4","\ud83c\udd70","\ud83c\udd71","\ud83c\udd8e","\ud83c\udd7e","\ud83d\udca0","\u27bf","\u2648","\u2649","\u264a","\u264b","\u264c","\u264d","\u264e","\u264f","\u2650","\u2651","\u2652","\u2653","\u26ce","\ud83d\udd2f","\ud83c\udfe7","\ud83d\udcb9","\ud83d\udcb2","\ud83d\udcb1","\ud83d\udd1d","\ud83d\udd1a","\ud83d\udd19","\ud83d\udd1b","\ud83d\udd1c","\u274c","\u2b55","\u2757","\u2753","\u2755","\u2754","\ud83d\udd03","\ud83d\udd5b","\ud83d\udd67","\ud83d\udd50","\ud83d\udd5c","\ud83d\udd51","\ud83d\udd5d","\ud83d\udd52","\ud83d\udd5e","\ud83d\udd53","\ud83d\udd5f","\ud83d\udd54","\ud83d\udd60","\ud83d\udd55","\ud83d\udd56","\ud83d\udd57","\ud83d\udd58","\ud83d\udd59","\ud83d\udd5a","\ud83d\udd61","\ud83d\udd62","\ud83d\udd63","\ud83d\udd64","\ud83d\udd65","\ud83d\udd66","\u2795","\u2796","\u2797","\ud83d\udcae","\ud83d\udcaf","\ud83d\udd18","\ud83d\udd17","\u27b0","\ud83d\udd31","\ud83d\udd32","\ud83d\udd33","\ud83d\udd3a","\u2b1c","\u2b1b","\u26ab","\u26aa","\ud83d\udd3b","\ud83d\udd36","\ud83d\udd37","\ud83d\udd38","\ud83d\udd39"];
 
    this.upgrades = {
      str:   {base: 0.1, factor: 2,  costBase: 10,   costFactor: 3},
      tSize: {base: 4,   factor: 2,  costBase: 100,  costFactor: 5},
      oSize: {base: 2,   factor: 1,  costBase: 10,   costFactor: 3}
    };

    this.milestones = {
      Auto: 100,
      Opening: 200,
      Laser: 300,
      Furnace: 400
    };

    this.completeBlocks = [
      '1110011001101101110010001110111011101',
      '1000100101010101001010001000010010001',
      '1000100101010101110010001100010011001',
      '1000100101010101000010001000010010000',
      '1110011001010101000011101110010011101'
    ];

    this.loadFromStorage();

    this.initUI();

    this.mousex = -Infinity;
    this.mousey = -Infinity;
    this.canvas.onmousemove = (e) => this.onmousemove(e);
    this.canvas.ontouchmove = (e) => this.ontouchmove(e);
    this.mapCanvas.onclick = (e) => this.onMapClick(e);
    this.blockSize =  8;
    this.maxStr = 100;
    this.canvasClientRect = this.canvas.getBoundingClientRect();    
    this.shakeMag = 0;
    this.progress = 0;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContext();
    this.audioElements = [];
    'click,clickLow,clickHigh'.split(',').forEach( audioName => {
      const audioElement = new Audio(`./${audioName}.wav`);
      const track = this.audioContext.createMediaElementSource(audioElement);
      track.connect(this.audioContext.destination);
      this.audioElements.push(audioElement);
    });

    this.ambientTracks = [];
    const vol = {
      assemblyFade: 0.05,
      constructionFade: 0.75,
    };
    'assemblyFade,constructionFade'.split(',').forEach( audioName => { 
    //'constructionFade'.split(',').forEach( audioName => { 
      const audioElement = new Audio(`./${audioName}.mp3`);
      const track = this.audioContext.createMediaElementSource(audioElement);
      track.connect(this.audioContext.destination);
      audioElement.loop = true;
      audioElement.volume = vol[audioName];
      this.ambientTracks.push(audioElement);
    });


    this.blocks = [];
    this.importEmojiData();

    this.startEmoji = 0;
    this.loading = true;
    this.draw();
    
    this.tryAudio = false;
    this.UI.btnHelp.click();
  }

  roundToVal(value, roundType, roundVal) {
    return Math[roundType](value / roundVal) * roundVal;
  }

  roundExp(val, roundType) {
    if (Math.abs(val) === Infinity) {return val.toString();}
    const e = Math.floor(Math.log10(val));
    const m = val / Math.pow(10.0, e);
    const roundm = this.roundToVal(m, roundType, 0.1);
    const result = `${roundm.toFixed(1)}e+${e}`;
    return result;
  }

  formatCurrency(value, roundType) {
    return this.formatValue(value, roundType, '\u25A0');
  }

  formatValue(value, roundType, prefix = '', suffix = '') {
    if (value < 1000) {
      return `${prefix}${this.roundToVal(value, roundType, 0.1).toFixed(1)}${suffix}`;
    } else {
      //return `${prefix}${value.toExponential(3)}${suffix}`;
      return `${prefix}${this.roundExp(value, roundType)}${suffix}`;
    }
  }

  updateMilestoneUI() {
    'Auto,Opening,Laser,Furnace'.split(',').forEach( ms => {
      const enabled = this.progress >= this.milestones[ms];
      this.UI[`ms${ms}Row`].style.color = enabled ? 'black' : 'hsl(0, 0%, 80%)';
      this.UI[`ms${ms}Enable`].disabled = !enabled;
    });
  }

  initUI() {
    this.UI = {};

    const UIIDs = 'crage,ccannon,chkAudioBkg,chkAmbient,msAutoRow,msOpeningRow,msLaserRow,msFurnaceRow,msOpeningMs,msOpeningEnable,msFurnaceMs,msFurnaceEnable,msLaserMs,msLaserEnable,msAutoMs,msAutoEnable,emojiLink,blackCount,btnSize,btnStr,btnOpen,openVal,openNext,openCost,sizeVal,sizeNext,sizeCost,strCost,strNext,strVal,cwin,spanWinTime,winBtnClose,winContainer,spanProgress,spanPlayTime,chkAudio,chkShake,helpContainer,resetContainer,exportContainer,importContainer,helpClose,importText,btnHelp,btnImport,btnExport,btnSave,btnReset,resetYes,resetNo,exportText,exportBtnClose,importBtnImport,importBtnClose'.split(',');

    UIIDs.forEach( id => {
      this.UI[id] = document.getElementById(id);
    });

    this.updateUpgradeUI();

    'Auto,Opening,Laser,Furnace'.split(',').forEach( ms => {
      this.UI[`ms${ms}Ms`].innerText = `${this.milestones[ms]} emojis recycled`;
    });

    this.UI.msAutoEnable.checked = this.state.autoAdvance;
    this.UI.msAutoEnable.onchange = () => this.state.autoAdvance = this.UI.msAutoEnable.checked;
    this.UI.msOpeningEnable.checked = this.state.maxOpen;
    this.UI.msOpeningEnable.onchange = () => {
      this.state.maxOpen = this.UI.msOpeningEnable.checked;
      this.init(this.curIndex);
    };
    this.UI.msLaserEnable.checked = this.state.lasersOn;
    this.UI.msLaserEnable.onchange = () => this.state.lasersOn = this.UI.msLaserEnable.checked;
    this.UI.msFurnaceEnable.checked = this.state.furnaceOn;
    this.UI.msFurnaceEnable.onchange = () => {
      this.state.furnaceOn = this.UI.msFurnaceEnable.checked;
      //this.createBackground(); 
    };

    this.progress = this.state.completeEmoji.reduce( (acc, e) => acc + e );
    this.updateMilestoneUI();

    this.UI.btnSize.onclick = () => this.buyUpgrade('tSize');
    this.UI.btnStr.onclick = () => this.buyUpgrade('str');
    this.UI.btnOpen.onclick = () => {
      this.buyUpgrade('oSize');
      this.createBackground();
      this.initFunnelBlocks();
    };

    this.UI.resetYes.onclick = () => {
      app.reset();
    };


    this.UI.chkAudio.checked = this.state.sfx;
    this.UI.chkAudio.onchange = () => this.state.sfx = this.UI.chkAudio.checked;

    this.UI.chkShake.checked = this.state.shake;
    this.UI.chkShake.onchange = () => this.state.shake = this.UI.chkShake.checked;

    this.UI.chkAmbient.checked = this.state.ambient;
    this.UI.chkAmbient.onchange = () => {
      this.state.ambient = this.UI.chkAmbient.checked;
      if (this.tryAudio) {
        if (this.state.ambient) {
          this.ambientTracks.forEach( t => t.play() );
        } else {
          this.ambientTracks.forEach( t => t.pause() );
        }
      }
    };

    this.UI.chkAudioBkg.checked = this.state.bgAudio;
    this.UI.chkAudioBkg.onchange = () => this.state.bgAudio = this.UI.chkAudioBkg.checked;

    document.onvisibilitychange = () => {
      if (!this.state.bgAudio) {
        app.ambientTracks.forEach( t => {
          if (document.hidden) {
            t.pause();
          } else {
            t.play();
          }
        });
      }
    };


    this.UI.winBtnClose.onclick = () => {
      document.querySelector('body').classList.remove('blur2px');
      this.UI.winContainer.close();
    };

    this.UI.helpClose.onclick = () => {
      document.querySelector('body').classList.remove('blur2px');
      this.UI.helpContainer.close();
      this.tryAudio = true;
    };

    this.UI.btnHelp.onclick = () => {
      document.querySelector('body').classList.add('blur2px');
      this.UI.helpContainer.showModal();
    };


    this.UI.resetNo.onclick = () => {
      document.querySelector('body').classList.remove('blur2px');
      this.UI.resetContainer.close();
    };

    this.UI.btnReset.onclick = () => {
      document.querySelector('body').classList.add('blur2px');
      this.UI.resetContainer.showModal();
    };
   
    this.UI.exportBtnClose.onclick = () => {
      document.querySelector('body').classList.remove('blur2px');
      this.UI.exportContainer.close();
    };

    this.UI.btnExport.onclick = () => {
      document.querySelector('body').classList.add('blur2px');
      this.UI.exportText.value = this.getExportString();
      this.UI.exportContainer.showModal();      
    };
    
    
    this.UI.importBtnClose.onclick = () => {
      document.querySelector('body').classList.remove('blur2px');
      this.UI.importContainer.close();
    };

    this.UI.importBtnImport.onclick = () => {
      const importString = this.UI.importText.value;
      this.importFromString(importString.trim());
    };

    this.UI.btnImport.onclick = () => {
      document.querySelector('body').classList.add('blur2px');
      this.UI.importContainer.showModal();      
    };

    this.UI.btnSave.onclick = () => {
      this.saveToStorage();
      document.querySelector('body').style.cursor = 'progress';
      setTimeout(() => {
        document.querySelector('body').style.cursor = '';
      }, 1000);
    };
  }

  getExportString() {
    this.saveToStorage();
    const saveString = localStorage.getItem('EmojiRecyclingCenter');
    const compressArray = LZString.compressToUint8Array(saveString);
    const words = [ ':)', ':(', ':D', ';)', ':P', 'BP', ':|', ':O', 'B)', 'B(', 'BD', ':{', 'XD', ':x', ':[', ':*' ];
    const result = new Array(compressArray.length * 2);
    for (let i = 0; i < compressArray.length; i++) {
      const val = compressArray[i];
      const wordI0 = val & 0x0f;
      const wordI1 = (val >> 4) & 0x0f;
      const word0 = ((i % 2 === 0) ? words[wordI0][0].toUpperCase() : words[wordI0][0]) + words[wordI0][1];
      const word1 = words[wordI1];
      result[i * 2] = word0;
      result[i * 2 + 1] = word1;
    }
    return result.join('');
  }

  importFromString(str) {
    const arraySize = Math.round(str.length / 2);
    const compressArray = new Uint8Array(arraySize);
    const wordMap = { ':)': 0, ':(': 1, ':d': 2, ';)': 3, ':p': 4, 'bp': 5, ':|': 6, ':o': 7, 'b)': 8, 'b(': 9, 'bd': 10, ':{': 11, 'xd': 12, ':x': 13, ':[': 14, ':*': 15 };

    for (let i = 0; i < arraySize; i++) {
      const word0 = str.substr(i * 4, 2).toLowerCase();
      const word1 = str.substr(i * 4 + 2, 2).toLowerCase();
      const val1 = wordMap[word0];
      const val2 = wordMap[word1];
      const val = (val2 << 4) | val1;
      compressArray[i] = val;
    }

    const saveString = LZString.decompressFromUint8Array(compressArray);

    let state;
    try {
      state = JSON.parse(saveString);
    } catch (error) {
      console.error("Corrupted import string. JSON.parse check failed." + error);
      return;
    }

    this.disableSaves = true;
    localStorage.setItem('EmojiRecyclingCenter', saveString);
    window.location.reload();
  }

  loadFromStorage() {
    const rawState = localStorage.getItem('EmojiRecyclingCenter');

    this.state = {
      r: 0,
      g: 0,
      b: 0,
      black: 0,
      completeEmoji: (new Array(this.emojiCount)).fill(0),
      ambient: true,
      sfx: true,
      bgAudio: true,
      shake: true,
      str: 0,
      tSize: 0,
      oSize: 0,
      autoAdvance: false,
      lasersOn: false,
      furnaceOn: false,
      maxOpen: false
    };

    if (rawState !== null) {
      const loadedState = JSON.parse(rawState);
      this.state = {...this.state, ...loadedState};
    } else {
      this.state.gameStart = (new Date()).getTime();
    }

    this.saveToStorage();
  }

  saveToStorage() {
    if (this.disableSaves) {return;}

    const saveString = JSON.stringify(this.state);
    localStorage.setItem('EmojiRecyclingCenter', saveString);
  }

  reset() {
    this.disableSaves = true;
    localStorage.removeItem('EmojiRecyclingCenter');
    window.location.reload();
  }  


  //modified from https://gist.github.com/vahidk/05184faf3d92a0aa1b46aeaa93b07786
  //s and l from 0 to 100
  rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let d = max - min;
    let h;
    if (d === 0) h = 0;
    else if (max === r) h = (g - b) / d % 6;
    else if (max === g) h = (b - r) / d + 2;
    else if (max === b) h = (r - g) / d + 4;
    let l = (min + max) / 2;
    let s = d === 0 ? 0 :  d / (1 - Math.abs(2 * l - 1));
    h = h * 60;
    if (h < 0) {h = h + 360;}
    return{h: h, s: s * 100, l: l * 100};
  }

  getRandomIncompleteEmojiIndex() {
    const incompleteEmoji = [];
    this.state.completeEmoji.forEach( (complete, i) => {
      if (complete === 0) {
        incompleteEmoji.push(i);
      }
    });

    if (incompleteEmoji.length > 0) {
      return incompleteEmoji[Math.floor(Math.random() * incompleteEmoji.length)];
    } else {
      return undefined;
    }
  }

  init(emojiIndexForce) {
  
    this.blocks = [];
    this.blockLookup = {};
    this.gridLookup = {};
    this.curComplete = false;
    this.mousex = -Infinity;
    this.mousey = -Infinity;

  
    const ctx = this.ctx;
    
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = 'black';
    ctx.font = '300px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    let emojiIndex;
    if (emojiIndexForce !== undefined) {
      emojiIndex = emojiIndexForce;
    } else {
      emojiIndex = this.getRandomIncompleteEmojiIndex();
    }

    this.curIndex = emojiIndex;
    this.UI.emojiLink.href = `https://emojipedia.org/search?q=${encodeURI(this.emojiList[emojiIndex])}`;
    
    //const emojiIndex = 0;
    //console.log(emojiIndex);
    //const emoji = this.emojiList[emojiIndex];
    //ctx.fillText(emoji, 250, 250);
    
    //const imageData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    //const data = imageData.data;
    //ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const data = this.fullPixelData;
    
    const size = this.blockSize;
    const colorShake = 15;
    //const colorShake = 0;
    const wiggle = 0.5;        
    this.colors = [];
    const emojiDataSize = Math.floor(this.canvas.width / this.blockSize) * Math.floor(this.canvas.height / this.blockSize) * 4;
    const emojiDataOffset = emojiDataSize * emojiIndex;
    //for (let x = 0; x < this.canvas.width; x += size) {
      //for (let y = 0; y < this.canvas.height; y += size) {
    for (let xi = 0; xi < Math.floor(this.canvas.width / this.blockSize); xi++) {
      for (let yi = 0; yi < Math.floor(this.canvas.height / this.blockSize); yi++) {
        const i = xi + yi * Math.floor(this.canvas.width / this.blockSize);
        const x = xi * this.blockSize;
        const y = yi * this.blockSize;
        let r = data[emojiDataOffset + i * 4 + 0];
        let g = data[emojiDataOffset + i * 4 + 1];
        let b = data[emojiDataOffset + i * 4 + 2];
        let a = data[emojiDataOffset + i * 4 + 3];
        
        /*
        if (r > 245 && g > 245 && b > 245) {
          r -= 20;
          g -= 20;
          b -= 20;
        }
        */


        if (a === 255) {
          const wx =  wiggle * Math.sin(Math.random() * 10);
          const wy =  wiggle * Math.sin(Math.random() * 10);
          const newr = Math.max(0, Math.min(255, r + colorShake * Math.sin(Math.random() * 10)));
          const newg = Math.max(0, Math.min(255, g + colorShake * Math.sin(Math.random() * 10)));
          const newb = Math.max(0, Math.min(255, b + colorShake * Math.sin(Math.random() * 10)));

          
          //const hsl = this.rgbToHsl(newr, newg, newb);
          const hsl = this.rgbToHsl(r, g, b);
          hsl.h = Math.max(0, Math.min(360, hsl.h + 2 * Math.sin(Math.random() * 10)));
          hsl.l = Math.max(0, Math.min(100, hsl.l + 2 * Math.sin(Math.random() * 10)));
          this.colors.push(hsl);
          let rgbSum = r + g + b;
          if (rgbSum === 0) {rgbSum = 1;}

          const black = r < 5 && g < 5 && b < 5; 
          
          //const strength = Math.max(1, Math.pow(1.1, this.maxStr * hsl.l) );
          const strength = Math.max(1, this.maxStr * hsl.l * 0.01);
          
          
          const newBlock = {
            wx,
            wy,
            x: x + wx,
            y: y + wy,
            xs: x,
            ys: y,
            //c: `rgb(${newr},${newg},${newb})`,
            c: `hsl(${hsl.h},${hsl.s}%,${hsl.l}%)`,
            hsl: hsl,
            rgb: {r, g, b},
            rgbSum,
            rgbf: {r: r / rgbSum, g: g / rgbSum, b: b / rgbSum},
            loose: false,
            strength,
            baseStr: strength,
            alive: true,
            landed: false,
            wall: false,
            black,
            vx: 0,
            vy: 0,
            ax: 0,
            ay: 0.5
          };
          this.blockLookup[`${x},${y}`] = newBlock;
          this.blocks.push(newBlock);
        }
      }
    }    

    //rnd shuffle colors to be used in background
    for (let i = this.colors.length - 1; i > 0; i--) {
      const n = Math.floor(Math.random() * (i + 1));
      [this.colors[i], this.colors[n]] = [this.colors[n], this.colors[i]];
    }

    this.createBackground();

    ctx.font = '18px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    this.lastDropTime = Infinity;
    this.highlightTime = false;

    this.initFunnelBlocks();


  }

  initFunnelBlocks() {
    if (this.state.maxOpen) {return;}
    //remove any old funnel
    //funnel is any block with wall = true
    this.blocks = this.blocks.filter( b => {
      if (b.wall) {
        this.gridLookup[`${b.x},${b.y}`] = undefined;
        return false;
      }
      return true;
    });

    //add funnel walls
    const oSize = this.getUpgradeStrength('oSize');
    const oSizeHalf = oSize / 2;
    for (let x = 0; x < this.canvas.width / 2 - (this.blockSize * oSizeHalf); x += this.blockSize) {
      for (let ydepth = 0; ydepth < 2; ydepth++) {
        const y = x + 55 * this.blockSize + ydepth * this.blockSize;
        for (let i = 0; i < 2; i++) {
          const thisX = i === 0 ? x : this.roundToGrid(this.canvas.width) - x;
          const newBlock = {
            x: thisX,
            y: y,
            xs: thisX,
            ys: y,
            c: `hsl(0, 0%, 50%)`,
            hsl: {h: 0, s: 0, l:50},
            alive: true,
            landed: true,
            wall: true,
            invisible: true 
          };
          this.gridLookup[`${thisX},${y}`] = newBlock;
          this.blocks.push(newBlock);
        }
      }
    }
  }
  
  roundToMultiple(f, m) {
    return Math.round(f / m) * m;
  }

  roundToGrid(f) {
    return this.roundToMultiple(f, this.blockSize);
  }

  getUpgradeStrength(name, next) {
    if (name === 'oSize') {
      return this.upgrades[name].base + (this.state[name] + (next ? 1 : 0)) * 2;
    }
    return this.upgrades[name].base * Math.pow(this.upgrades[name].factor, this.state[name] + (next ? 1 : 0));
  }

  getUpgradeCost(name) {
    return this.upgrades[name].costBase * Math.pow(this.upgrades[name].costFactor, this.state[name]);
  }

  buyUpgrade(name) {
    const upgradeCost = this.getUpgradeCost(name);
    if (this.state.black >= upgradeCost) {
      this.state.black -= upgradeCost;
      this.state[name] += 1;
    }
    this.updateUpgradeUI();
  }

  updateUpgradeUI() {
    this.UI.strVal.innerText = this.formatValue(this.getUpgradeStrength('str').toFixed(1), 'round');
    this.UI.strNext.innerText = this.formatValue(this.getUpgradeStrength('str', true).toFixed(1), 'round');
    this.UI.strCost.innerText = this.formatCurrency(this.getUpgradeCost('str'), 'ceil');

    this.UI.sizeVal.innerText = this.formatValue(this.getUpgradeStrength('tSize').toFixed(1), 'round');
    this.UI.sizeNext.innerText = this.formatValue(this.getUpgradeStrength('tSize', true).toFixed(1), 'round');
    this.UI.sizeCost.innerText = this.formatCurrency(this.getUpgradeCost('tSize'), 'ceil');

    this.UI.openVal.innerText = this.formatValue(this.getUpgradeStrength('oSize').toFixed(1), 'round');
    this.UI.openNext.innerText = this.formatValue(this.getUpgradeStrength('oSize', true).toFixed(1), 'round');
    this.UI.openCost.innerText = this.formatCurrency(this.getUpgradeCost('oSize'), 'ceil');

    this.updateUpgradeEnables();
  }
  
  updateUpgradeEnables() {
    this.UI.btnOpen.disabled = this.state.black < this.getUpgradeCost('oSize');
    this.UI.btnSize.disabled = this.state.black < this.getUpgradeCost('tSize');
    this.UI.btnStr.disabled = this.state.black < this.getUpgradeCost('str');
  }

  calcBlockStrength(block) {
    //gain 1 this.r/g/b for every 255 of r/g/b in block down the hole
    const colorPow = 0.5;
    //const rs = (Math.pow(this.state.b, colorPow) + 1) / (block.rgb.r + 1);
    //const gs = (Math.pow(this.state.r, colorPow) + 1) / (block.rgb.g + 1);
    //const bs = (Math.pow(this.state.g, colorPow) + 1) / (block.rgb.b + 1);
    //https://www.desmos.com/calculator/04zbvsi39s
    const w = 0.3; //controls sharpness of increase at high values
    const v = 735; //contols how early the increase starts
    //these values should make 128 => 140, 250 => 470 255 => 1026
    const whiteScale = block.rgbSum >= v ? 100 : (1 - v * w / (block.rgbSum - v));
      
    const br = block.rgb.r * whiteScale;
    const bg = block.rgb.g * whiteScale;
    const bb = block.rgb.b * whiteScale;
    const rs = block.rgbf.r * (Math.pow(this.state.b, colorPow) + 1) / (br + 1);
    const gs = block.rgbf.g * (Math.pow(this.state.r, colorPow) + 1) / (bg + 1);
    const bs = block.rgbf.b * (Math.pow(this.state.g, colorPow) + 1) / (bb + 1);
    const blacks = 0.1;
    const totals = block.black ? blacks : (rs + gs + bs) * 8;
    return totals * this.getUpgradeStrength('str');
  }

  getLaserHeight() {
    const height = 430;
    const base = 20;
    //return (this.curTime * 0.1) % height + base;
    const T = 1000 * 5;
    return 2 * Math.abs(this.curTime / T - Math.floor(this.curTime / T + 1/2)) * height + base;
  }

  update() {
    let landedCount = 0;
    let moveCount = 0;
    const halfBlock = this.blockSize / 2;
    const cursorSize = this.getUpgradeStrength('tSize');
    const activeCursorDist = (cursorSize + halfBlock) * (cursorSize + halfBlock);
    let nonWallCount = 0;

    //sort so that lower landed blocks are first
    this.blocks = this.blocks.sort( (a, b) => {
      if (!a.landed && !b.landed) { return 0; }
      if (a.landed && b.landed) {return b.y - a.y;}
      if (a.landed) {return 1;}
      if (b.landed) {return -1;}
    });

    if (this.audioContext.state === 'suspended' && this.tryAudio) {
      this.audioContext.resume();

      if (this.state.ambient) {
        this.ambientTracks.forEach( t => t.play() );
      }
    }


    let playTick = false;
    const curTime = (new Date()).getTime();
    this.curTime = curTime;
    const laserHeight = this.getLaserHeight();

    this.blocks.forEach( b => {
      
      if (b.wall) {return;}
      nonWallCount++;
        
      if (!b.landed && !b.loose) {
        //in the original image

        //check if cursor is close enough
        const dx = this.mousex - (b.x + halfBlock);
        const dy = this.mousey - (b.y + halfBlock);
        const d2 = dx * dx + dy * dy;
        const cursorInRange = d2 < activeCursorDist;

        const furnaceActive = this.state.furnaceOn;

        const laserHit = this.state.lasersOn &&
          (laserHeight >= b.y && laserHeight <= (b.y + this.blockSize));

        if (cursorInRange || furnaceActive || laserHit) {
          let onEdge = false;
          for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
              if (dx === 0 && dy === 0) {
                continue;
              }

              const nx = b.xs + dx * this.blockSize;
              const ny = b.ys + dy * this.blockSize;            
              const n = this.blockLookup[`${nx},${ny}`];

              if (n === undefined || n.loose) {
                onEdge = true;
                break;
              }

            }
            if (onEdge) {
              break;
            }
          }
          if (onEdge) {
            if (cursorInRange) {
              const effectiveStrength = this.calcBlockStrength(b);
              b.strength -= effectiveStrength;
            }

            if (furnaceActive) {
              b.strength -= this.getUpgradeStrength('str') / 10.0;
            }

            if (laserHit) {
              b.strength -= this.getUpgradeStrength('str');
            }

            if (b.strength <= 0) {
              b.loose = true;
              b.strength = 0;
              this.lastDropTime = (new Date()).getTime();
              
              playTick = true;
              this.shakeMag = 2;
            }
          }
        }
      }

      if ((curTime - this.lastDropTime) > (1000 * 20)) {
        this.highlightTime = true;
      }
    
      const maxY = this.canvas.height - this.blockSize;

      if (b.loose && !b.landed) {
        //falling physics
        b.vx += b.ax + 1 * (Math.random() - 0.5);
        b.vy += b.ay;
        b.x += b.vx;
        const newy = b.y + b.vy;
        
        let collision = false;
        this.blocks.some( bc => {
          if (bc.landed) {
            const xoverlap = (b.x + this.blockSize >= bc.x) && (b.x <= bc.x + this.blockSize);
            if (!xoverlap) {return;}            
            const yoverlap = (bc.y > b.y + this.blockSize) && (bc.y <= newy + this.blockSize);      

            if (yoverlap) {
              collision = true;
              b.landed = true;
              b.x = this.roundToGrid(b.x);
              b.y = bc.y - this.blockSize;
              while (this.gridLookup[`${b.x},${b.y}`]) {
                b.y -= this.blockSize;
              }
              this.gridLookup[`${b.x},${b.y}`] = b;
              return true;
            }
          }
        });
          
        if (!collision) {
          if ((newy + this.blockSize) >= maxY) {
            //past the bottom of the screen
            b.y = this.canvas.height - this.blockSize;
            b.x = this.roundToGrid(b.x);            
            while (this.gridLookup[`${b.x},${b.y}`]) {
              b.y -= this.blockSize;
            }
            this.gridLookup[`${b.x},${b.y}`] = b;
            b.landed = true;
          } else {              
            b.y = newy;
          }
        }
          
      }
      
      if (b.landed) {
        landedCount++;
        //don't do sand physics every time
        if (Math.random > 0.95) {return;}

        //do the sand dance        
        if (this.gridLookup[`${b.x},${b.y+this.blockSize}`] || b.y > maxY) {
          //block below
          //try to fall left or right
          const dir = Math.random() > 0.5 ? -1 : 1;
          if (!this.gridLookup[`${b.x + dir * this.blockSize},${b.y+this.blockSize}`] && b.y < maxY) {
            this.gridLookup[`${b.x},${b.y}`] = undefined;
            b.y += this.blockSize;
            b.x += dir * this.blockSize;
            this.gridLookup[`${b.x},${b.y}`] = b;
            moveCount++;
          }
        } else {
          //no block below so fall
          this.gridLookup[`${b.x},${b.y}`] = undefined;
          b.y += this.blockSize;
          this.gridLookup[`${b.x},${b.y}`] = b;
          moveCount++;
        }
      }
      
      if (b.y > maxY) {
        b.alive = false;
        b.landed = true;
        //b.y = maxY;
        b.x = this.roundToGrid(b.x);      
      }
    });

    this.shakeMag = Math.max(0, this.shakeMag - 0.5);
    if (playTick && this.UI.chkAudio.checked) {
      //this causes a pause in chrome dev tools even with a try...catch or
      //catching the promise rejction
      const audioIndex = Math.floor(Math.random() * this.audioElements.length);
      this.audioElements[audioIndex].play();
    }

    this.blocks = this.blocks.filter( b => {
      if (!b.alive) {
        if (b.black) {
          this.state.black += 0.1;
        } else {
          this.state.r += b.rgb.r / 255;
          this.state.g += b.rgb.g / 255;
          this.state.b += b.rgb.b / 255;
        }
        this.gridLookup[`${b.x},${b.y}`] = undefined;
        return false;
      }
      return true;
    });
    
    //sort so loose blocks are on top when drawing
    this.blocks = this.blocks.sort( (a, b) => {
      if (a.loose != b.loose) {
        return a.loose ? 1 : -1;
      } else {
        return 0;
      }
    });
    
    //restart when all blocks are dead
    if (nonWallCount === 0) {
      this.state.completeEmoji[this.curIndex] = 1; 
      this.drawEmojiMap(this.mapCtx);
      this.curComplete = true;
      const remaining = this.state.completeEmoji.reduce( (acc, e) => acc + (e === 0 ? 1 : 0), 0);
      this.progress += 1;
      this.updateMilestoneUI();

      if (remaining === 0 && this.state.gameEnd === undefined) {
        this.showWin();
      } else {
        if (this.state.autoAdvance) {
          this.init();
        }
      }
    }

    this.progress = this.state.completeEmoji.reduce( (acc, e) => acc + e );
    
  }

  createBackground() {
    const ctx = this.bgCtx;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);
    
    //background tiles
    const tileSize = 32;
    for (let x = 0; x < this.bgCanvas.width / tileSize; x++) {
      for (let y = 0; y < this.bgCanvas.height / tileSize; y++) {
        const ci = (x + y * 777) % this.colors.length;
        const c = this.colors[ci];
        ctx.fillStyle = `hsl(${c.h}, ${c.s * 0.3}%, ${c.l}%)`;
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
      }
    }

    //funnel
    if (!this.state.maxOpen) {
      const oSize = this.getUpgradeStrength('oSize');
      const oSizeHalf = oSize / 2;
      for (let x = 0; x < this.canvas.width / 2 - (this.blockSize * oSizeHalf); x += this.blockSize) {
        for (let ydepth = 0; ydepth < 40; ydepth++) {
          const y = x + 55 * this.blockSize + ydepth * this.blockSize;
          for (let i = 0; i < 2; i++) {
            const thisX = i === 0 ? x : this.roundToGrid(this.canvas.width) - x;

            const newr = 128 + 15 * Math.sin(Math.random() * 10);
            const newg = 128 + 15 * Math.sin(Math.random() * 10);
            const newb = 128 + 15 * Math.sin(Math.random() * 10);

            ctx.fillStyle = `hsl(0, 0%, ${50 + 5 * Math.sin(Math.random() * 10)}%)`;
            const wx = 0.5 * Math.sin(Math.random() * 10);
            const wy = 0.5 * Math.sin(Math.random() * 10);
            ctx.fillRect(thisX + wx, y + wy, this.blockSize, this.blockSize);
          }
        }
      }
    }
    


    //draw canvas
    const sideBorder = 40;
    const topBorder = 20;
    const height = this.bgCanvas.height - (topBorder + 250);
    const width = this.bgCanvas.width - sideBorder * 2;
    const shadowOffset = 10;
    const frameSize = 10;

    //frame shadow
    ctx.fillStyle = 'hsla(0, 0%, 0%, 0.4)';
    ctx.fillRect(sideBorder -frameSize + shadowOffset, topBorder -frameSize + shadowOffset, width + 2 * frameSize, height + 2 * frameSize);

    //frame border
    ctx.fillStyle = 'gray';
    ctx.fillRect(sideBorder - frameSize, topBorder - frameSize, width + 2 * frameSize, height + 2 * frameSize);

    //canvas
    ctx.fillStyle = this.state.furnaceOn ? 'hsl(0, 75%, 67%)' : 'white';
    ctx.fillRect(sideBorder, topBorder, width, height);

    //score canvas
    const scoreWidth = 120;
    const scoreHeight = 62;
    const scoreX = 0;
    const scoreY = this.canvas.height - scoreHeight - 2 * frameSize;
    ctx.fillStyle = 'hsla(0, 0%, 0%, 0.4)';
    ctx.fillRect(scoreX + shadowOffset * 0.5, scoreY + shadowOffset * 0.5, scoreWidth + frameSize * 2, scoreHeight + frameSize * 2);
    ctx.fillStyle = 'gray';
    ctx.fillRect(scoreX, scoreY, scoreWidth + frameSize * 2, scoreHeight + frameSize * 2);

    ctx.fillStyle = 'white';
    ctx.fillRect(scoreX + frameSize, scoreY + frameSize, scoreWidth, scoreHeight);

    ctx.font = '18px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'black';

    ['#000000', '#FF0000', '#00FF00', '#0000FF'].forEach( (c, i) => {
      ctx.fillStyle = c;
      ctx.fillRect(scoreX + 15, scoreY + i * 15 + 14, 10, 10);
    });

    

  }

  /*
  getEmojiTotalValue(emojiIndex) {
    const ctx = this.mapCtx;
    
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = 'black';
    ctx.font = '300px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const emoji = this.emojiList[emojiIndex];
    ctx.fillText(emoji, 250, 250);
    
    const imageData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    const size = this.blockSize;
    const value = {r: 0, g: 0, b: 0, black: 0, hx: 0, hy: 0};
    let count = 0;
    for (let x = 0; x < this.canvas.width; x += size) {
      for (let y = 0; y < this.canvas.height; y += size) {
        const i = x + y * this.canvas.width;
        let r = data[i * 4 + 0];
        let g = data[i * 4 + 1];
        let b = data[i * 4 + 2];
        let a = data[i * 4 + 3];
        
        if (r > 245 && g > 245 && b > 245) {
          r -= 20;
          g -= 20;
          b -= 20;
        }       


        if (a === 255) {
          const black = r < 5 && g < 5 && b < 5; 
          value.r += r;
          value.g += g;
          value.b += b;
          const hsl = this.rgbToHsl(r, g, b);
          value.hx += Math.cos(hsl.h);
          value.hy += Math.sin(hsl.h);
          value.black += black ? 1 : 0;
          count++;
        }
      }
    }
    value.hx = value.hx / count;
    value.hy = value.hy / count;
    value.h = ((Math.atan2(value.hy, value.hx) + 2 * Math.PI) * 180 / Math.PI) % 360;
    value.r = value.r / count;
    value.g = value.g / count;
    value.b = value.b / count;
    return value;
  }
  */

  getEmojiTotalValueFromData(emojiIndex) {
    //const ctx = this.mapCtx;
    
    const value = {r: 0, g: 0, b: 0, black: 0, hx: 0, hy: 0, l: 0};
    let count = 0;
    const data = this.fullPixelData;
    const emojiDataSize = Math.floor(this.canvas.width / this.blockSize) * Math.floor(this.canvas.height / this.blockSize) * 4;
    this.emojiDataSize = emojiDataSize;
    let minx = Infinity;
    let maxx = -Infinity;
    let miny = Infinity;
    let maxy = -Infinity;
    for (let x = 0; x < 62; x++) {
      for (let y = 0; y < 87; y++) {
        const i = emojiDataSize * emojiIndex + (x + y * 62) * 4;
        let r = data[i + 0];
        let g = data[i + 1];
        let b = data[i + 2];
        let a = data[i + 3];
        
        /*
        if (r > 245 && g > 245 && b > 245) {
          r -= 20;
          g -= 20;
          b -= 20;
        } 
        */


        if (a === 255) {
          const black = r < 5 && g < 5 && b < 5; 
          value.r += r;
          value.g += g;
          value.b += b;
          const hsl = this.rgbToHsl(r, g, b);
          value.hx += Math.cos(hsl.h);
          value.hy += Math.sin(hsl.h);
          value.l += hsl.l;
          value.black += black ? 1 : 0;
          count++;
          minx = Math.min(minx, x);
          maxx = Math.max(maxx, x);
          miny = Math.min(miny, y);
          maxy = Math.max(maxy, y);
        }
      }
    }
    value.hx = value.hx / count;
    value.hy = value.hy / count;
    value.h = ((Math.atan2(value.hy, value.hx) + 2 * Math.PI) * 180 / Math.PI) % 360;
    value.l = value.l / count;
    value.r = value.r / count;
    value.g = value.g / count;
    value.b = value.b / count;
    value.minx = minx;
    value.maxx = maxx;
    value.miny = miny;
    value.maxy = maxy;
    return value;
  }

  genMapLocations() {
    this.emojiPositions = new Array(this.emojiCount);
    for (let emojiIndex = 0; emojiIndex < this.emojiCount; emojiIndex++) {
      const value = this.getEmojiTotalValueFromData(emojiIndex);
      const hsl = this.rgbToHsl(value.r, value.g, value.b);
      //const r = hsl.s / 100;
      const r = ((100-hsl.l) / 100 - 0.3)*1.6;
      //const r = (255 * 3 - (value.r + value.g + value.b)) / (255 * 3);
      //const r = 300 / (255 * 3 - (value.r + value.g + value.b)) - 0.4;

      const a = hsl.h * Math.PI * 2 / 360;
      this.emojiPositions[emojiIndex] = {r, a, minx: value.minx, maxx: value.maxx, miny: value.miny, maxy: value.maxy};
    }
  }

  buildMapImgCanvas() {
    const imgCanvas = document.createElement('canvas');
    //const imgCanvas = document.querySelector('#cimg');
    this.imgCanvas = imgCanvas;
    const maxCanvasWidth = 32767;
    const w = Math.floor(maxCanvasWidth / 62);
    this.imgCanvasEmojiWidth = w;
    const h = 2;
    imgCanvas.width = 62 * w;
    imgCanvas.height = 62 * h;
    const ctx = imgCanvas.getContext('2d');
    const imageData = ctx.createImageData(imgCanvas.width, imgCanvas.height);
    const data = imageData.data;

    this.emojiBounds = [];
    for (let emojiIndex = 0; emojiIndex < this.emojiCount; emojiIndex++) {
      const baseX = emojiIndex < w ? emojiIndex * 62 : (emojiIndex - w) * 62;
      const baseY = emojiIndex < w ? 0 : 62;
      let minx = Infinity;
      let maxx = -Infinity;
      let miny = Infinity;
      let maxy = -Infinity;
      for (let x = 0; x < 62; x++) {
        const px = baseX + x;
        for (let y = 0; y < 62; y++) {
          const py = baseY + y;
          const dsti = (px + py * imgCanvas.width) * 4;

          data[dsti + 0] = this.fullPixelData[emojiIndex * this.emojiDataSize + (x + y * 62) * 4 + 0];
          data[dsti + 1] = this.fullPixelData[emojiIndex * this.emojiDataSize + (x + y * 62) * 4 + 1];
          data[dsti + 2] = this.fullPixelData[emojiIndex * this.emojiDataSize + (x + y * 62) * 4 + 2];
          data[dsti + 3] = this.fullPixelData[emojiIndex * this.emojiDataSize + (x + y * 62) * 4 + 3];

          if (data[dsti + 3] === 255) {
            minx = Math.min(minx, x);
            maxx = Math.max(maxx, x);
            miny = Math.min(miny, y);
            maxy = Math.max(maxy, y);
          }
        }
      }
      this.emojiBounds.push({minx, maxx, miny, maxy, w: maxx - minx + 1, h: maxy - miny + 1});
    }
    ctx.putImageData(imageData, 0, 0);

    //copy the gun emoji backwards for use as laser
    ctx.scale(-1, 1);
    ctx.drawImage(ctx.canvas, 372 * 62, 0, 62, 62, -(this.emojiCount - w + 1) * 62, 62, 62, 62);


  }


  drawEmojiMap(ctx) {
    if (this.curComplete) {return;}
    
    const canvas = ctx.canvas;
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    //rgb in [0,350000]
    //black in [0, 1000]

    ctx.save();

    //set rscale so that the emoji are all on the map
    let minx = Infinity;
    let maxx = -Infinity;
    let miny = Infinity;
    let maxy = -Infinity;
    for (let i = 0; i < this.emojiCount; i++) {
      if (this.state.completeEmoji[i] === 1) { continue; }

      const r = this.emojiPositions[i].r;
      const a = this.emojiPositions[i].a;
      minx = Math.min(minx, r * Math.cos(a));
      miny = Math.min(miny, r * Math.sin(a));
      maxx = Math.max(maxx, r * Math.cos(a));
      maxy = Math.max(maxy, r * Math.sin(a));
    }

    const rscaleMinX = Math.abs((width / 2) / minx) - 32;
    const rscaleMaxX = Math.abs((width / 2) / maxx) - 32;
    const rscaleMinY = Math.abs((height / 2) / miny) + 32;
    const rscaleMaxY = Math.abs((height / 2) / maxy) + 32;
    let rscale = 0.9 * Math.min(rscaleMinX, rscaleMaxX, rscaleMinY, rscaleMaxY);
    //let rscale = 1.0 * Math.min(rscaleMinX, rscaleMaxX, rscaleMinY, rscaleMaxY);
    if (rscale === Infinity) {rscale = 800;}
    //console.log(minx, maxx, miny, maxy, rscale);
    //ctx.strokeRect(minx * rscale + width / 2, miny * rscale + height / 2, (maxx - minx) * rscale, (maxy - miny) * rscale);

    this.mapLocations = [];
    for (let i = 0; i < this.emojiCount; i++) {
      if (this.state.completeEmoji[i] === 1) { continue; }

      let a = this.emojiPositions[i].a;

      const x = (width / 2) + rscale * Math.cos(a) * this.emojiPositions[i].r;
      const y = (height / 2) + rscale * Math.sin(a) * this.emojiPositions[i].r;
      const emojiBounds = this.emojiBounds[i];
      const cx = Math.floor(emojiBounds.w / 2);
      const cy = Math.floor(emojiBounds.h / 2);
      this.mapLocations.push({
        x0: x + emojiBounds.minx - cx,
        y0: y + emojiBounds.miny - cy,
        x1: x + emojiBounds.maxx - cx,
        y1: y + emojiBounds.maxy - cy,
        i
      });

      const srcx = i < this.imgCanvasEmojiWidth ? i * 62 : (i - this.imgCanvasEmojiWidth) * 62;
      const srcy = i < this.imgCanvasEmojiWidth ? 0 : 62;
      ctx.drawImage(this.imgCanvas, srcx, srcy, 62, 62, x - cx, y - cy, 62, 62);
      //ctx.strokeRect(x + emojiBounds.minx - cx, y + emojiBounds.miny - cy, 2 * Math.floor(emojiBounds.w/2), 2 * Math.floor(emojiBounds.h/2));
    }
    ctx.restore();

  }
  
  draw() {
    const ctx = this.ctx;
    ctx.save();
   
    if (this.loading) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.font = '40px Arial';
      ctx.fillText('LOADING', this.canvas.width / 2, 100);
      ctx.restore();
      return;
    }

    //if (this.blocks === undefined || this.blocks.length === 0) {
    if (this.blocks === undefined) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.fillStyle = 'black';
      ctx.font = '20px Arial';
      ctx.fillText('No emoji left. Maybe you won?', 100, 100);
      window.requestAnimationFrame( d => this.draw(d) );
      ctx.restore();
      return;
    }

    ctx.drawImage(this.bgCanvas, 0, 0);
    const sideBorder = 40;
    const topBorder = 20;
    const height = this.bgCanvas.height - (topBorder + 250);
    const width = this.bgCanvas.width - sideBorder * 2;
    const furnaceL = 4 * Math.sin(this.curTime / 1000) + 1 * Math.sin(this.curTime / 77 + 7 * Math.sin(this.curTime / 888)) + 70;
    ctx.fillStyle = this.state.furnaceOn ? `hsl(0, 75%, ${furnaceL}%)` : 'white';
    ctx.fillRect(sideBorder, topBorder, width, height);

    
    ctx.fillStyle = 'black';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    const scoreX = 0;
    const scoreY = 618;
    ctx.fillText(this.formatValue(this.state.black, 'floor'), scoreX + 30, scoreY + 20);
    ctx.fillText(this.formatValue(this.state.r, 'floor'), scoreX + 30, scoreY + 35);
    ctx.fillText(this.formatValue(this.state.g, 'floor'), scoreX + 30, scoreY + 50);
    ctx.fillText(this.formatValue(this.state.b, 'floor'), scoreX + 30, scoreY + 65);
    this.UI.blackCount.innerText = this.formatValue(this.state.black, 'floor');

    if (this.curComplete) {
      ctx.save();
      this.completeBlocks.forEach( (row, y) => {
        row.split('').forEach( (block, x) => {
          if (block === '0') {return;}
          ctx.fillStyle = `rgb(${15 * Math.sin(234 * x + 8695 * y)}, ${15 * Math.sin(x * 712 + y * 813)}, ${15 * Math.sin(x * 2144 + y * 32)})`;
          const cx = 100 + x * this.blockSize + 0.5 * Math.sin(x * 453 + y * 53.2 + this.curIndex);
          const cy = 400 + y * this.blockSize + 0.5 * Math.sin(x * 121 + y * 4932 + this.curIndex);
          ctx.fillRect(cx, cy, this.blockSize, this.blockSize);
        });
      });
      ctx.restore();
    }

    const shadowOffset = 4;
    const shadowColor = 'rgba(40,40,40,0.4)';

    //draw lasers
    if (this.state.lasersOn) {
      //ctx.globalCompositionOperation = 'lighter';
      const laserHeight = this.getLaserHeight();
      ctx.strokeStyle = 'hsl(195, 75%, 48%)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, laserHeight);
      ctx.lineTo(this.canvas.width, laserHeight);
      ctx.stroke();
      //ctx.globalCompositionOperation = 'source-over';
      const gunEmojiIndex = 372;
      ctx.drawImage(this.imgCanvas, gunEmojiIndex * 62, 0, 62, 62, this.canvas.width - 50, laserHeight - 27, 62, 62);
      ctx.drawImage(this.imgCanvas, (this.emojiCount - Math.floor(32767 / 62)) * 62, 62, 62, 62, -10, laserHeight - 27, 62, 62);
    }



    if (this.blocks !== undefined) {

      ctx.fillStyle = 'hsla(0, 0%, 0%, 0.2)';
      ctx.font = '20px Arial';
      ctx.fillText(`#${this.curIndex + 1}`, 45, 35); 

      if (this.state.shake) {
        ctx.translate(this.shakeMag * Math.sin(this.curTime), this.shakeMag * Math.sin(this.curTime + 33)); 
      }

      this.blocks.forEach( b => {
        if (b.invisible) {return;}
        //if (b.strength < this.maxStr) {
        if (b.strength < b.baseStr) {
          if (b.landed) {
            //on pile
            ctx.fillStyle = b.c;
            ctx.fillRect(b.x + b.wx, b.y + b.wy, this.blockSize, this.blockSize);
          } else {
            const size = this.blockSize;
            if (b.loose) {
              //falling
              ctx.fillStyle = shadowColor;
              ctx.fillRect(b.x + shadowOffset, b.y + shadowOffset, size, size);
              ctx.fillStyle = b.c;
              ctx.fillRect(b.x, b.y, size, size);
            } else {
              const fraction = (b.baseStr - b.strength) / b.baseStr;
              const rotation = fraction * Math.PI / 2;
              //trying to fall
              if (this.highlightTime) {
                ctx.fillStyle = `hsl(${b.hsl.h}, ${b.hsl.s}%, ${b.hsl.l * 0.9}%)`;
              } else {
                ctx.fillStyle = b.c;
              }
              ctx.save();
              ctx.translate(b.x + size / 2, b.y + size / 2);        
              ctx.rotate(rotation);
              ctx.fillRect(-size / 2, -size / 2, size, size);
              ctx.restore();
            }
          }
        } else {
          //untouched on canvas
          if (this.highlightTime) {
            ctx.fillStyle = `hsl(${b.hsl.h}, ${b.hsl.s}%, ${b.hsl.l * 0.9}%)`;
          } else {
            ctx.fillStyle = b.c;
            //ctx.fillStyle = `hsl(${this.lmap(b.strength, 0, this.maxStr, 0, 270)}, 100%, 50%)`;
          }
          ctx.fillRect(b.x, b.y, this.blockSize, this.blockSize);
        }
      });
    }

    //cursor
    ctx.fillStyle = 'rgba(38,38,38,0.2)';
    ctx.beginPath();
    const cursorSize = this.getUpgradeStrength('tSize');

    ctx.arc(this.mousex, this.mousey, cursorSize, 0, Math.PI * 2);
    ctx.fill();

    //const progress = this.state.completeEmoji.reduce( (acc, e) => acc + e );
    this.UI.spanProgress.innerText = this.progress;

    const curTime = this.state.gameEnd ?? (new Date()).getTime();

    const playTime = curTime - this.state.gameStart;
    this.UI.spanPlayTime.innerText = this.remainingToStr(playTime, true);

    this.updateUpgradeEnables();

    ctx.restore();
    window.requestAnimationFrame( d => this.draw(d) );
  }

  timeToObj(t) {
    const result = {};

    result.y = Math.floor(t / (365 * 24 * 60 * 60));
    t = t % (365 * 24 * 60 * 60);
    result.d = Math.floor(t / (24 * 60 * 60));
    t = t % (24 * 60 * 60);
    result.h = Math.floor(t / (60 * 60));
    t = t % (60 * 60);
    result.m = Math.floor(t / 60);
    t = t % 60;
    result.s = t;

    return result;
  }

  remainingToStr(ms, full) {
    if (ms === Infinity) {
      return 'Infinity';
    }

    const timeObj = this.timeToObj(ms / 1000);

    if (full) {
      return `${timeObj.y}:${timeObj.d.toString().padStart(3,0)}:${timeObj.h.toString().padStart(2,0)}:${timeObj.m.toString().padStart(2,0)}:${timeObj.s.toFixed(1).padStart(4,0)}`;
    }

    if (timeObj.y > 0 || timeObj.d > 0 || timeObj.h > 0) {
      return `${timeObj.y}:${timeObj.d.toString().padStart(3,0)}:${timeObj.h.toString().padStart(2,0)}:${timeObj.m.toString().padStart(2,0)}`;
    } else {
      return `${timeObj.m.toString().padStart(2,0)}:${timeObj.s.toFixed(1).padStart(4,0)}`;
    }

  }

  
  onmousemove(e) {    
    this.canvasClientRect = this.canvas.getBoundingClientRect();
    if (e.buttons !== 1) {
      this.mousex = e.clientX - this.canvasClientRect.left - 4;
      this.mousey = e.clientY - this.canvasClientRect.top - 4;
    }
  }


  ontouchmove(e) {
    if (e.targetTouches.length > 1) {

      const viewport = document.querySelector('meta[name="viewport"]');

      if ( viewport ) {
        viewport.content = 'initial-scale=1';
        viewport.content = 'width=device-width';
      }

      return true;
    }

    const fingerOffset = 75 + this.getUpgradeStrength('tSize');
    e.clientX = e.targetTouches[0].clientX - 4;
    e.clientY = e.targetTouches[0].clientY - fingerOffset - 4;
    this.onmousemove(e);
    e.preventDefault();
    return false;
  }

  onMapClick(e) {
    const canvasClientRect = this.mapCanvas.getBoundingClientRect();
    const x = e.clientX - canvasClientRect.left - 4;
    const y = e.clientY - canvasClientRect.top - 4;

    for (let i = this.mapLocations.length - 1; i >= 0; i--) {
      const box = this.mapLocations[i];
      if (x >= box.x0 && x <= box.x1 && y >= box.y0 && y <= box.y1) {
        this.init(box.i);
        //this.state.completeEmoji[box.i] = 1;
        //this.drawEmojiMap(this.mapCtx);
        break;
      }
    }

  }

  /*
  exportEmojiData() {
    const emojiList = ["\ud83d\ude04","\ud83d\ude03","\ud83d\ude00","\ud83d\ude0a","\ud83d\ude09","\ud83d\ude0d","\ud83d\ude18","\ud83d\ude1a","\ud83d\ude17","\ud83d\ude19","\ud83d\ude1c","\ud83d\ude1d","\ud83d\ude1b","\ud83d\ude33","\ud83d\ude01","\ud83d\ude14","\ud83d\ude0c","\ud83d\ude12","\ud83d\ude1e","\ud83d\ude23","\ud83d\ude22","\ud83d\ude02","\ud83d\ude2d","\ud83d\ude2a","\ud83d\ude25","\ud83d\ude30","\ud83d\ude05","\ud83d\ude13","\ud83d\ude29","\ud83d\ude2b","\ud83d\ude28","\ud83d\ude31","\ud83d\ude20","\ud83d\ude21","\ud83d\ude24","\ud83d\ude16","\ud83d\ude06","\ud83d\ude0b","\ud83d\ude37","\ud83d\ude0e","\ud83d\ude34","\ud83d\ude35","\ud83d\ude32","\ud83d\ude1f","\ud83d\ude26","\ud83d\ude27","\ud83d\ude08","\ud83d\udc7f","\ud83d\ude2e","\ud83d\ude2c","\ud83d\ude10","\ud83d\ude15","\ud83d\ude2f","\ud83d\ude36","\ud83d\ude07","\ud83d\ude0f","\ud83d\ude11","\ud83d\udc72","\ud83d\udc73","\ud83d\udc6e","\ud83d\udc77","\ud83d\udc82","\ud83d\udc76","\ud83d\udc66","\ud83d\udc67","\ud83d\udc68","\ud83d\udc69","\ud83d\udc74","\ud83d\udc75","\ud83d\udc71","\ud83d\udc7c","\ud83d\udc78","\ud83d\ude3a","\ud83d\ude38","\ud83d\ude3b","\ud83d\ude3d","\ud83d\ude3c","\ud83d\ude40","\ud83d\ude3f","\ud83d\ude39","\ud83d\ude3e","\ud83d\udc79","\ud83d\udc7a","\ud83d\ude48","\ud83d\ude49","\ud83d\ude4a","\ud83d\udc80","\ud83d\udc7d","\ud83d\udca9","\ud83d\udd25","\u2728","\ud83c\udf1f","\ud83d\udcab","\ud83d\udca5","\ud83d\udca2","\ud83d\udca6","\ud83d\udca7","\ud83d\udca4","\ud83d\udca8","\ud83d\udc42","\ud83d\udc40","\ud83d\udc43","\ud83d\udc45","\ud83d\udc44","\ud83d\udc4d","\ud83d\udc4e","\ud83d\udc4c","\ud83d\udc4a","\u270a","\u270c","\ud83d\udc4b","\u270b","\ud83d\udc50","\ud83d\udc46","\ud83d\udc47","\ud83d\udc49","\ud83d\udc48","\ud83d\ude4c","\ud83d\ude4f","\u261d","\ud83d\udc4f","\ud83d\udcaa","\ud83d\udeb6","\ud83c\udfc3","\ud83d\udc83","\ud83d\udc6b","\ud83d\udc6a","\ud83d\udc6c","\ud83d\udc6d","\ud83d\udc8f","\ud83d\udc91","\ud83d\udc6f","\ud83d\ude46","\ud83d\ude45","\ud83d\udc81","\ud83d\ude4b","\ud83d\udc86","\ud83d\udc87","\ud83d\udc85","\ud83d\udc70","\ud83d\ude4e","\ud83d\ude4d","\ud83d\ude47","\ud83c\udfa9","\ud83d\udc51","\ud83d\udc52","\ud83d\udc5f","\ud83d\udc5e","\ud83d\udc61","\ud83d\udc60","\ud83d\udc62","\ud83d\udc55","\ud83d\udc54","\ud83d\udc5a","\ud83d\udc57","\ud83c\udfbd","\ud83d\udc56","\ud83d\udc58","\ud83d\udc59","\ud83d\udcbc","\ud83d\udc5c","\ud83d\udc5d","\ud83d\udc5b","\ud83d\udc53","\ud83c\udf80","\ud83c\udf02","\ud83d\udc84","\ud83d\udc9b","\ud83d\udc99","\ud83d\udc9c","\ud83d\udc9a","\ud83d\udc94","\ud83d\udc97","\ud83d\udc93","\ud83d\udc95","\ud83d\udc96","\ud83d\udc9e","\ud83d\udc98","\ud83d\udc8c","\ud83d\udc8b","\ud83d\udc8d","\ud83d\udc8e","\ud83d\udc64","\ud83d\udc65","\ud83d\udcac","\ud83d\udc63","\ud83d\udcad","\ud83d\udc36","\ud83d\udc3a","\ud83d\udc31","\ud83d\udc2d","\ud83d\udc39","\ud83d\udc30","\ud83d\udc38","\ud83d\udc2f","\ud83d\udc28","\ud83d\udc3b","\ud83d\udc37","\ud83d\udc3d","\ud83d\udc2e","\ud83d\udc17","\ud83d\udc35","\ud83d\udc12","\ud83d\udc34","\ud83d\udc11","\ud83d\udc18","\ud83d\udc3c","\ud83d\udc27","\ud83d\udc26","\ud83d\udc24","\ud83d\udc25","\ud83d\udc23","\ud83d\udc14","\ud83d\udc0d","\ud83d\udc22","\ud83d\udc1b","\ud83d\udc1d","\ud83d\udc1c","\ud83d\udc1e","\ud83d\udc0c","\ud83d\udc19","\ud83d\udc1a","\ud83d\udc20","\ud83d\udc1f","\ud83d\udc2c","\ud83d\udc33","\ud83d\udc0b","\ud83d\udc04","\ud83d\udc0f","\ud83d\udc00","\ud83d\udc03","\ud83d\udc05","\ud83d\udc07","\ud83d\udc09","\ud83d\udc0e","\ud83d\udc10","\ud83d\udc13","\ud83d\udc15","\ud83d\udc16","\ud83d\udc01","\ud83d\udc02","\ud83d\udc32","\ud83d\udc21","\ud83d\udc0a","\ud83d\udc2b","\ud83d\udc2a","\ud83d\udc06","\ud83d\udc08","\ud83d\udc29","\ud83d\udc3e","\ud83d\udc90","\ud83c\udf38","\ud83c\udf37","\ud83c\udf40","\ud83c\udf39","\ud83c\udf3b","\ud83c\udf3a","\ud83c\udf41","\ud83c\udf43","\ud83c\udf42","\ud83c\udf3f","\ud83c\udf3e","\ud83c\udf44","\ud83c\udf35","\ud83c\udf34","\ud83c\udf32","\ud83c\udf33","\ud83c\udf30","\ud83c\udf31","\ud83c\udf3c","\ud83c\udf10","\ud83c\udf1e","\ud83c\udf1d","\ud83c\udf1a","\ud83c\udf11","\ud83c\udf12","\ud83c\udf13","\ud83c\udf14","\ud83c\udf15","\ud83c\udf16","\ud83c\udf17","\ud83c\udf18","\ud83c\udf1c","\ud83c\udf1b","\ud83c\udf19","\ud83c\udf0d","\ud83c\udf0e","\ud83c\udf0f","\ud83c\udf0b","\ud83c\udf0c","\ud83c\udf20","\u2b50","\u26c5","\u26a1","\u2614","\u26c4","\ud83c\udf00","\ud83c\udf01","\ud83c\udf08","\ud83c\udf0a","\ud83c\udf8d","\ud83d\udc9d","\ud83c\udf8e","\ud83c\udf92","\ud83c\udf93","\ud83c\udf8f","\ud83c\udf86","\ud83c\udf87","\ud83c\udf90","\ud83c\udf91","\ud83c\udf83","\ud83d\udc7b","\ud83c\udf85","\ud83c\udf84","\ud83c\udf81","\ud83c\udf8b","\ud83c\udf89","\ud83c\udf8a","\ud83c\udf88","\ud83c\udf8c","\ud83d\udd2e","\ud83c\udfa5","\ud83d\udcf7","\ud83d\udcf9","\ud83d\udcfc","\ud83d\udcbf","\ud83d\udcc0","\ud83d\udcbd","\ud83d\udcbe","\ud83d\udcbb","\ud83d\udcf1","\ud83d\udcde","\ud83d\udcdf","\ud83d\udce0","\ud83d\udce1","\ud83d\udcfa","\ud83d\udcfb","\ud83d\udd0a","\ud83d\udd09","\ud83d\udd08","\ud83d\udd07","\ud83d\udd14","\ud83d\udd15","\ud83d\udce2","\ud83d\udce3","\u23f3","\u231b","\u23f0","\u231a","\ud83d\udd13","\ud83d\udd12","\ud83d\udd0f","\ud83d\udd10","\ud83d\udd11","\ud83d\udd0e","\ud83d\udca1","\ud83d\udd26","\ud83d\udd06","\ud83d\udd05","\ud83d\udd0c","\ud83d\udd0b","\ud83d\udd0d","\ud83d\udec1","\ud83d\udec0","\ud83d\udebf","\ud83d\udebd","\ud83d\udd27","\ud83d\udd29","\ud83d\udd28","\ud83d\udeaa","\ud83d\udeac","\ud83d\udca3","\ud83d\udd2b","\ud83d\udd2a","\ud83d\udc8a","\ud83d\udc89","\ud83d\udcb0","\ud83d\udcb4","\ud83d\udcb5","\ud83d\udcb7","\ud83d\udcb6","\ud83d\udcb3","\ud83d\udcb8","\ud83d\udcf2","\ud83d\udce7","\ud83d\udce5","\ud83d\udce4","\ud83d\udce9","\ud83d\udce8","\ud83d\udcef","\ud83d\udceb","\ud83d\udcea","\ud83d\udcec","\ud83d\udced","\ud83d\udcee","\ud83d\udce6","\ud83d\udcdd","\ud83d\udcc4","\ud83d\udcc3","\ud83d\udcd1","\ud83d\udcca","\ud83d\udcc8","\ud83d\udcc9","\ud83d\udcdc","\ud83d\udccb","\ud83d\udcc5","\ud83d\udcc6","\ud83d\udcc7","\ud83d\udcc1","\ud83d\udcc2","\ud83d\udccc","\ud83d\udcce","\ud83d\udccf","\ud83d\udcd0","\ud83d\udcd5","\ud83d\udcd7","\ud83d\udcd8","\ud83d\udcd9","\ud83d\udcd3","\ud83d\udcd4","\ud83d\udcd2","\ud83d\udcda","\ud83d\udcd6","\ud83d\udd16","\ud83d\udcdb","\ud83d\udd2c","\ud83d\udd2d","\ud83d\udcf0","\ud83c\udfa8","\ud83c\udfac","\ud83c\udfa4","\ud83c\udfa7","\ud83c\udfbc","\ud83c\udfb5","\ud83c\udfb6","\ud83c\udfb9","\ud83c\udfbb","\ud83c\udfba","\ud83c\udfb7","\ud83c\udfb8","\ud83d\udc7e","\ud83c\udfae","\ud83c\udccf","\ud83c\udfb4","\ud83c\udc04","\ud83c\udfb2","\ud83c\udfaf","\ud83c\udfc8","\ud83c\udfc0","\u26bd","\u26be","\ud83c\udfbe","\ud83c\udfb1","\ud83c\udfc9","\ud83c\udfb3","\u26f3","\ud83d\udeb5","\ud83d\udeb4","\ud83c\udfc1","\ud83c\udfc7","\ud83c\udfc6","\ud83c\udfbf","\ud83c\udfc2","\ud83c\udfca","\ud83c\udfc4","\ud83c\udfa3","\u2615","\ud83c\udf75","\ud83c\udf76","\ud83c\udf7c","\ud83c\udf7a","\ud83c\udf7b","\ud83c\udf78","\ud83c\udf79","\ud83c\udf77","\ud83c\udf74","\ud83c\udf55","\ud83c\udf54","\ud83c\udf5f","\ud83c\udf57","\ud83c\udf56","\ud83c\udf5d","\ud83c\udf5b","\ud83c\udf64","\ud83c\udf71","\ud83c\udf63","\ud83c\udf65","\ud83c\udf59","\ud83c\udf58","\ud83c\udf5a","\ud83c\udf5c","\ud83c\udf72","\ud83c\udf62","\ud83c\udf61","\ud83c\udf73","\ud83c\udf5e","\ud83c\udf69","\ud83c\udf6e","\ud83c\udf66","\ud83c\udf68","\ud83c\udf67","\ud83c\udf82","\ud83c\udf70","\ud83c\udf6a","\ud83c\udf6b","\ud83c\udf6c","\ud83c\udf6d","\ud83c\udf6f","\ud83c\udf4e","\ud83c\udf4f","\ud83c\udf4a","\ud83c\udf4b","\ud83c\udf52","\ud83c\udf47","\ud83c\udf49","\ud83c\udf53","\ud83c\udf51","\ud83c\udf48","\ud83c\udf4c","\ud83c\udf50","\ud83c\udf4d","\ud83c\udf60","\ud83c\udf46","\ud83c\udf45","\ud83c\udf3d","\ud83c\udfe0","\ud83c\udfe1","\ud83c\udfeb","\ud83c\udfe2","\ud83c\udfe3","\ud83c\udfe5","\ud83c\udfe6","\ud83c\udfea","\ud83c\udfe9","\ud83c\udfe8","\ud83d\udc92","\u26ea","\ud83c\udfec","\ud83c\udfe4","\ud83c\udf07","\ud83c\udf06","\ud83c\udfef","\ud83c\udff0","\u26fa","\ud83c\udfed","\ud83d\uddfc","\ud83d\uddfe","\ud83d\uddfb","\ud83c\udf04","\ud83c\udf05","\ud83c\udf03","\ud83d\uddfd","\ud83c\udf09","\ud83c\udfa0","\ud83c\udfa1","\u26f2","\ud83c\udfa2","\ud83d\udea2","\u26f5","\ud83d\udea4","\ud83d\udea3","\u2693","\ud83d\ude80","\ud83d\udcba","\ud83d\ude81","\ud83d\ude82","\ud83d\ude8a","\ud83d\ude89","\ud83d\ude9e","\ud83d\ude86","\ud83d\ude84","\ud83d\ude85","\ud83d\ude88","\ud83d\ude87","\ud83d\ude9d","\ud83d\ude8b","\ud83d\ude83","\ud83d\ude8e","\ud83d\ude8c","\ud83d\ude8d","\ud83d\ude99","\ud83d\ude98","\ud83d\ude97","\ud83d\ude95","\ud83d\ude96","\ud83d\ude9b","\ud83d\ude9a","\ud83d\udea8","\ud83d\ude93","\ud83d\ude94","\ud83d\ude92","\ud83d\ude91","\ud83d\ude90","\ud83d\udeb2","\ud83d\udea1","\ud83d\ude9f","\ud83d\udea0","\ud83d\ude9c","\ud83d\udc88","\ud83d\ude8f","\ud83c\udfab","\ud83d\udea6","\ud83d\udea5","\ud83d\udea7","\ud83d\udd30","\u26fd","\ud83c\udfee","\ud83c\udfb0","\ud83d\uddff","\ud83c\udfaa","\ud83c\udfad","\ud83d\udccd","\ud83d\udea9","\ud83d\udd20","\ud83d\udd21","\ud83d\udd24","\ud83d\udd04","\u23ea","\u23e9","\u23eb","\u23ec","\ud83c\udd97","\ud83d\udd00","\ud83d\udd01","\ud83d\udd02","\ud83c\udd95","\ud83c\udd99","\ud83c\udd92","\ud83c\udd93","\ud83c\udd96","\ud83d\udcf6","\ud83c\udfa6","\ud83c\ude01","\ud83c\ude2f","\ud83c\ude33","\ud83c\ude35","\ud83c\ude34","\ud83c\ude32","\ud83c\ude50","\ud83c\ude39","\ud83c\ude3a","\ud83c\ude36","\ud83c\ude1a","\ud83d\udebb","\ud83d\udeb9","\ud83d\udeba","\ud83d\udebc","\ud83d\udebe","\ud83d\udeb0","\ud83d\udeae","\ud83c\udd7f","\u267f","\ud83d\udead","\ud83c\ude38","\ud83d\udec2","\ud83d\udec4","\ud83d\udec5","\ud83d\udec3","\ud83c\ude51","\ud83c\udd91","\ud83c\udd98","\ud83c\udd94","\ud83d\udeab","\ud83d\udd1e","\ud83d\udcf5","\ud83d\udeaf","\ud83d\udeb1","\ud83d\udeb3","\ud83d\udeb7","\ud83d\udeb8","\u26d4","\u274e","\u2705","\ud83d\udc9f","\ud83c\udd9a","\ud83d\udcf3","\ud83d\udcf4","\ud83c\udd70","\ud83c\udd71","\ud83c\udd8e","\ud83c\udd7e","\ud83d\udca0","\u27bf","\u2648","\u2649","\u264a","\u264b","\u264c","\u264d","\u264e","\u264f","\u2650","\u2651","\u2652","\u2653","\u26ce","\ud83d\udd2f","\ud83c\udfe7","\ud83d\udcb9","\ud83d\udcb2","\ud83d\udcb1","\ud83d\udd1d","\ud83d\udd1a","\ud83d\udd19","\ud83d\udd1b","\ud83d\udd1c","\u274c","\u2b55","\u2757","\u2753","\u2755","\u2754","\ud83d\udd03","\ud83d\udd5b","\ud83d\udd67","\ud83d\udd50","\ud83d\udd5c","\ud83d\udd51","\ud83d\udd5d","\ud83d\udd52","\ud83d\udd5e","\ud83d\udd53","\ud83d\udd5f","\ud83d\udd54","\ud83d\udd60","\ud83d\udd55","\ud83d\udd56","\ud83d\udd57","\ud83d\udd58","\ud83d\udd59","\ud83d\udd5a","\ud83d\udd61","\ud83d\udd62","\ud83d\udd63","\ud83d\udd64","\ud83d\udd65","\ud83d\udd66","\u2795","\u2796","\u2797","\ud83d\udcae","\ud83d\udcaf","\ud83d\udd18","\ud83d\udd17","\u27b0","\ud83d\udd31","\ud83d\udd32","\ud83d\udd33","\ud83d\udd3a","\u2b1c","\u2b1b","\u26ab","\u26aa","\ud83d\udd3b","\ud83d\udd36","\ud83d\udd37","\ud83d\udd38","\ud83d\udd39"];

    const canvas = document.createElement('canvas');
    canvas.width = this.canvas.width;
    canvas.height = this.canvas.height;
    const ctx = canvas.getContext('2d');
    
    const emojiDataSize = Math.floor(canvas.width / this.blockSize) * Math.floor(canvas.height / this.blockSize) * 4;
    this.emojiDataSize = emojiDataSize;
    const fullPixelSize = emojiList.length * Math.floor(canvas.width / this.blockSize) * Math.floor(canvas.height / this.blockSize) * 4;
    const fullPixelData = new Uint8Array(fullPixelSize);
    emojiList.forEach( (emoji, emojiIndex) => {
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.fillStyle = 'black';
      ctx.font = '300px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(emoji, 250, 250);
      const imageData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      const data = imageData.data;
      
      const size = this.blockSize;
      for (let x = 0; x < this.canvas.width; x += size) {
        const xi = x / size;
        for (let y = 0; y < this.canvas.height; y += size) {
          const yi = y / size;
          const i = x + y * this.canvas.width;
          let r = data[i * 4 + 0];
          let g = data[i * 4 + 1];
          let b = data[i * 4 + 2];
          let a = data[i * 4 + 3];
          
          if (r > 245 && g > 245 && b > 245) {
            r -= 20;
            g -= 20;
            b -= 20;
          }

          const outputIndex = emojiDataSize * emojiIndex + (xi + yi * Math.floor(this.canvas.width / this.blockSize)) * 4;
          //fullPixelData[outputIndex + 0] = Math.floor(xi * 255 / (this.canvas.width / this.blockSize)); //r;
          fullPixelData[outputIndex + 0] = r;
          fullPixelData[outputIndex + 1] = g;
          fullPixelData[outputIndex + 2] = b;
          fullPixelData[outputIndex + 3] = a;
        }
      }
      this.fullPixelData = fullPixelData;
    });


  }
  */

  /*
  pixelDataToFile() {
    const file = new Blob([this.fullPixelData], {type: 'application/octet-stream'});
    const filename = "pixelData.raw";
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
  }
  */

  drawMilestoneEmoji() {
    const cannonCtx = this.UI.ccannon.getContext('2d');
    cannonCtx.drawImage(this.imgCanvas, 22 * 62, 0, 62, 62, -5, -3, 31, 31);

    const rageCtx = this.UI.crage.getContext('2d');
    rageCtx.drawImage(this.imgCanvas, 33 * 62, 0, 62, 62, -5, -3, 31, 31);
  }

  async importEmojiData() {
    const importStartTime = (new Date()).getTime();
    const response = await fetch('./pixelData.raw');
    const blob = await response.blob();
    this.blob = blob;
    this.fullPixelData = new Uint8Array(await blob.arrayBuffer());
    const importEndTime = (new Date()).getTime();
    const importDeltaTime = (importEndTime - importStartTime) / 1000;
    const rate = this.fullPixelData.length / importDeltaTime;
    console.log(`PIXEL IMPORT COMPLETE (${importDeltaTime.toFixed(1)} seconds = ${rate.toFixed(1)} Bps)`);

    this.loading = false;
    this.genMapLocations();
    this.buildMapImgCanvas();
    //this.drawMilestoneEmoji();

    if (this.state.completeEmoji[0] == 1) {
      this.init();
    } else {
      this.init(0);
    }
    this.drawEmojiMap(this.mapCtx);
    
    setInterval(() => this.update(), 1000 / 60);
    setInterval(() => this.saveToStorage(), 1000 * 5);
    this.draw();

  }

  lmap(value, inmin, inmax, outmin, outmax) {
    const inSize = inmax - inmin;
    const position = (value - inmin) / inSize;
    const outSize = outmax - outmin;
    return outmin + outSize * position;
  }

  showWin() {
    document.querySelector('body').classList.add('blur2px');
    if (this.state.gameEnd === undefined) {
      this.state.gameEnd = (new Date()).getTime();
    }
    const totalPlayTime = this.state.gameEnd - this.state.gameStart;
    this.UI.spanWinTime.innerText = this.remainingToStr(totalPlayTime, true);
    const imgScale = 4;
    this.UI.cwin.width = 62 * imgScale;
    this.UI.cwin.height = 62 * imgScale;
    const ctx = this.UI.cwin.getContext('2d');
    ctx.drawImage(this.imgCanvas, 0, 0, 62, 62, 0, 0, this.UI.cwin.width, this.UI.cwin.height);
    this.UI.winContainer.showModal();
  }
}

const app = new App();

/* jshint ignore:start */
/*
Below is pieroxy's LZString and license
*/

/*
MIT License

Copyright (c) 2013 pieroxy

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

var LZString=function(){var r=String.fromCharCode,o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",e={};function t(r,o){if(!e[r]){e[r]={};for(var n=0;n<r.length;n++)e[r][r.charAt(n)]=n}return e[r][o]}var i={compressToBase64:function(r){if(null==r)return"";var n=i._compress(r,6,function(r){return o.charAt(r)});switch(n.length%4){default:case 0:return n;case 1:return n+"===";case 2:return n+"==";case 3:return n+"="}},decompressFromBase64:function(r){return null==r?"":""==r?null:i._decompress(r.length,32,function(n){return t(o,r.charAt(n))})},compressToUTF16:function(o){return null==o?"":i._compress(o,15,function(o){return r(o+32)})+" "},decompressFromUTF16:function(r){return null==r?"":""==r?null:i._decompress(r.length,16384,function(o){return r.charCodeAt(o)-32})},compressToUint8Array:function(r){for(var o=i.compress(r),n=new Uint8Array(2*o.length),e=0,t=o.length;e<t;e++){var s=o.charCodeAt(e);n[2*e]=s>>>8,n[2*e+1]=s%256}return n},decompressFromUint8Array:function(o){if(null==o)return i.decompress(o);for(var n=new Array(o.length/2),e=0,t=n.length;e<t;e++)n[e]=256*o[2*e]+o[2*e+1];var s=[];return n.forEach(function(o){s.push(r(o))}),i.decompress(s.join(""))},compressToEncodedURIComponent:function(r){return null==r?"":i._compress(r,6,function(r){return n.charAt(r)})},decompressFromEncodedURIComponent:function(r){return null==r?"":""==r?null:(r=r.replace(/ /g,"+"),i._decompress(r.length,32,function(o){return t(n,r.charAt(o))}))},compress:function(o){return i._compress(o,16,function(o){return r(o)})},_compress:function(r,o,n){if(null==r)return"";var e,t,i,s={},u={},a="",p="",c="",l=2,f=3,h=2,d=[],m=0,v=0;for(i=0;i<r.length;i+=1)if(a=r.charAt(i),Object.prototype.hasOwnProperty.call(s,a)||(s[a]=f++,u[a]=!0),p=c+a,Object.prototype.hasOwnProperty.call(s,p))c=p;else{if(Object.prototype.hasOwnProperty.call(u,c)){if(c.charCodeAt(0)<256){for(e=0;e<h;e++)m<<=1,v==o-1?(v=0,d.push(n(m)),m=0):v++;for(t=c.charCodeAt(0),e=0;e<8;e++)m=m<<1|1&t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}else{for(t=1,e=0;e<h;e++)m=m<<1|t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t=0;for(t=c.charCodeAt(0),e=0;e<16;e++)m=m<<1|1&t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}0==--l&&(l=Math.pow(2,h),h++),delete u[c]}else for(t=s[c],e=0;e<h;e++)m=m<<1|1&t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;0==--l&&(l=Math.pow(2,h),h++),s[p]=f++,c=String(a)}if(""!==c){if(Object.prototype.hasOwnProperty.call(u,c)){if(c.charCodeAt(0)<256){for(e=0;e<h;e++)m<<=1,v==o-1?(v=0,d.push(n(m)),m=0):v++;for(t=c.charCodeAt(0),e=0;e<8;e++)m=m<<1|1&t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}else{for(t=1,e=0;e<h;e++)m=m<<1|t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t=0;for(t=c.charCodeAt(0),e=0;e<16;e++)m=m<<1|1&t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}0==--l&&(l=Math.pow(2,h),h++),delete u[c]}else for(t=s[c],e=0;e<h;e++)m=m<<1|1&t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;0==--l&&(l=Math.pow(2,h),h++)}for(t=2,e=0;e<h;e++)m=m<<1|1&t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;for(;;){if(m<<=1,v==o-1){d.push(n(m));break}v++}return d.join("")},decompress:function(r){return null==r?"":""==r?null:i._decompress(r.length,32768,function(o){return r.charCodeAt(o)})},_decompress:function(o,n,e){var t,i,s,u,a,p,c,l=[],f=4,h=4,d=3,m="",v=[],g={val:e(0),position:n,index:1};for(t=0;t<3;t+=1)l[t]=t;for(s=0,a=Math.pow(2,2),p=1;p!=a;)u=g.val&g.position,g.position>>=1,0==g.position&&(g.position=n,g.val=e(g.index++)),s|=(u>0?1:0)*p,p<<=1;switch(s){case 0:for(s=0,a=Math.pow(2,8),p=1;p!=a;)u=g.val&g.position,g.position>>=1,0==g.position&&(g.position=n,g.val=e(g.index++)),s|=(u>0?1:0)*p,p<<=1;c=r(s);break;case 1:for(s=0,a=Math.pow(2,16),p=1;p!=a;)u=g.val&g.position,g.position>>=1,0==g.position&&(g.position=n,g.val=e(g.index++)),s|=(u>0?1:0)*p,p<<=1;c=r(s);break;case 2:return""}for(l[3]=c,i=c,v.push(c);;){if(g.index>o)return"";for(s=0,a=Math.pow(2,d),p=1;p!=a;)u=g.val&g.position,g.position>>=1,0==g.position&&(g.position=n,g.val=e(g.index++)),s|=(u>0?1:0)*p,p<<=1;switch(c=s){case 0:for(s=0,a=Math.pow(2,8),p=1;p!=a;)u=g.val&g.position,g.position>>=1,0==g.position&&(g.position=n,g.val=e(g.index++)),s|=(u>0?1:0)*p,p<<=1;l[h++]=r(s),c=h-1,f--;break;case 1:for(s=0,a=Math.pow(2,16),p=1;p!=a;)u=g.val&g.position,g.position>>=1,0==g.position&&(g.position=n,g.val=e(g.index++)),s|=(u>0?1:0)*p,p<<=1;l[h++]=r(s),c=h-1,f--;break;case 2:return v.join("")}if(0==f&&(f=Math.pow(2,d),d++),l[c])m=l[c];else{if(c!==h)return null;m=i+i.charAt(0)}v.push(m),l[h++]=i+m.charAt(0),i=m,0==--f&&(f=Math.pow(2,d),d++)}}};return i}();"function"==typeof define&&define.amd?define(function(){return LZString}):"undefined"!=typeof module&&null!=module?module.exports=LZString:"undefined"!=typeof angular&&null!=angular&&angular.module("LZString",[]).factory("LZString",function(){return LZString});

/* jshint ignore:end */
