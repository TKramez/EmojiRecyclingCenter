"use strict";

/*

TODO:
need better name
  emoji destroyer?
need favicon
make acid effect by shrinking blocks instead of letting them rotate and drop
do something to make sure that the emoji exist. either pull from a pre-made image (could use other icons)
  or compare to what is drawn for \uffff
is there a better way to know what blocks are on edge? maybe compute the edge at 
  init and then when a block falls off mark its neighbors as on edge? this will
  save figuring it out every update
use currency to buy other emoji and upgrades
  use r to unlock g, g to unlock b, b to unlock r
  use black to unlock upgrades
    size, strength
make path through a branching tree
add touch controls
integrate into scene control system from retro incremental
have settings to turn off audio
indicate to player how to zoom back out (multi-touch) if they're on mobile

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

    this.mousex = -Infinity;
    this.mousey = -Infinity;
    this.canvas.onmousemove = (e) => this.onmousemove(e);
    this.canvas.ontouchmove = (e) => this.ontouchmove(e);
    this.mapCanvas.onclick = (e) => this.onMapClick(e);
    this.cursorSize = 25;
    this.score = 0;
    this.black = 0;
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.blockSize =  8;
    this.toolStrength = 2;
    this.maxStr = 100;
    this.canvasClientRect = this.canvas.getBoundingClientRect();    

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContext();
    this.audioElement = new Audio('./click.wav');
    //this.audioElement = new Audio('./blipSelect.wav');
    this.track = this.audioContext.createMediaElementSource(this.audioElement);
    this.track.connect(this.audioContext.destination);


    this.emojiList = ["\ud83d\ude04","\ud83d\ude03","\ud83d\ude00","\ud83d\ude0a","\ud83d\ude09","\ud83d\ude0d","\ud83d\ude18","\ud83d\ude1a","\ud83d\ude17","\ud83d\ude19","\ud83d\ude1c","\ud83d\ude1d","\ud83d\ude1b","\ud83d\ude33","\ud83d\ude01","\ud83d\ude14","\ud83d\ude0c","\ud83d\ude12","\ud83d\ude1e","\ud83d\ude23","\ud83d\ude22","\ud83d\ude02","\ud83d\ude2d","\ud83d\ude2a","\ud83d\ude25","\ud83d\ude30","\ud83d\ude05","\ud83d\ude13","\ud83d\ude29","\ud83d\ude2b","\ud83d\ude28","\ud83d\ude31","\ud83d\ude20","\ud83d\ude21","\ud83d\ude24","\ud83d\ude16","\ud83d\ude06","\ud83d\ude0b","\ud83d\ude37","\ud83d\ude0e","\ud83d\ude34","\ud83d\ude35","\ud83d\ude32","\ud83d\ude1f","\ud83d\ude26","\ud83d\ude27","\ud83d\ude08","\ud83d\udc7f","\ud83d\ude2e","\ud83d\ude2c","\ud83d\ude10","\ud83d\ude15","\ud83d\ude2f","\ud83d\ude36","\ud83d\ude07","\ud83d\ude0f","\ud83d\ude11","\ud83d\udc72","\ud83d\udc73","\ud83d\udc6e","\ud83d\udc77","\ud83d\udc82","\ud83d\udc76","\ud83d\udc66","\ud83d\udc67","\ud83d\udc68","\ud83d\udc69","\ud83d\udc74","\ud83d\udc75","\ud83d\udc71","\ud83d\udc7c","\ud83d\udc78","\ud83d\ude3a","\ud83d\ude38","\ud83d\ude3b","\ud83d\ude3d","\ud83d\ude3c","\ud83d\ude40","\ud83d\ude3f","\ud83d\ude39","\ud83d\ude3e","\ud83d\udc79","\ud83d\udc7a","\ud83d\ude48","\ud83d\ude49","\ud83d\ude4a","\ud83d\udc80","\ud83d\udc7d","\ud83d\udca9","\ud83d\udd25","\u2728","\ud83c\udf1f","\ud83d\udcab","\ud83d\udca5","\ud83d\udca2","\ud83d\udca6","\ud83d\udca7","\ud83d\udca4","\ud83d\udca8","\ud83d\udc42","\ud83d\udc40","\ud83d\udc43","\ud83d\udc45","\ud83d\udc44","\ud83d\udc4d","\ud83d\udc4e","\ud83d\udc4c","\ud83d\udc4a","\u270a","\u270c","\ud83d\udc4b","\u270b","\ud83d\udc50","\ud83d\udc46","\ud83d\udc47","\ud83d\udc49","\ud83d\udc48","\ud83d\ude4c","\ud83d\ude4f","\u261d","\ud83d\udc4f","\ud83d\udcaa","\ud83d\udeb6","\ud83c\udfc3","\ud83d\udc83","\ud83d\udc6b","\ud83d\udc6a","\ud83d\udc6c","\ud83d\udc6d","\ud83d\udc8f","\ud83d\udc91","\ud83d\udc6f","\ud83d\ude46","\ud83d\ude45","\ud83d\udc81","\ud83d\ude4b","\ud83d\udc86","\ud83d\udc87","\ud83d\udc85","\ud83d\udc70","\ud83d\ude4e","\ud83d\ude4d","\ud83d\ude47","\ud83c\udfa9","\ud83d\udc51","\ud83d\udc52","\ud83d\udc5f","\ud83d\udc5e","\ud83d\udc61","\ud83d\udc60","\ud83d\udc62","\ud83d\udc55","\ud83d\udc54","\ud83d\udc5a","\ud83d\udc57","\ud83c\udfbd","\ud83d\udc56","\ud83d\udc58","\ud83d\udc59","\ud83d\udcbc","\ud83d\udc5c","\ud83d\udc5d","\ud83d\udc5b","\ud83d\udc53","\ud83c\udf80","\ud83c\udf02","\ud83d\udc84","\ud83d\udc9b","\ud83d\udc99","\ud83d\udc9c","\ud83d\udc9a","\ud83d\udc94","\ud83d\udc97","\ud83d\udc93","\ud83d\udc95","\ud83d\udc96","\ud83d\udc9e","\ud83d\udc98","\ud83d\udc8c","\ud83d\udc8b","\ud83d\udc8d","\ud83d\udc8e","\ud83d\udc64","\ud83d\udc65","\ud83d\udcac","\ud83d\udc63","\ud83d\udcad","\ud83d\udc36","\ud83d\udc3a","\ud83d\udc31","\ud83d\udc2d","\ud83d\udc39","\ud83d\udc30","\ud83d\udc38","\ud83d\udc2f","\ud83d\udc28","\ud83d\udc3b","\ud83d\udc37","\ud83d\udc3d","\ud83d\udc2e","\ud83d\udc17","\ud83d\udc35","\ud83d\udc12","\ud83d\udc34","\ud83d\udc11","\ud83d\udc18","\ud83d\udc3c","\ud83d\udc27","\ud83d\udc26","\ud83d\udc24","\ud83d\udc25","\ud83d\udc23","\ud83d\udc14","\ud83d\udc0d","\ud83d\udc22","\ud83d\udc1b","\ud83d\udc1d","\ud83d\udc1c","\ud83d\udc1e","\ud83d\udc0c","\ud83d\udc19","\ud83d\udc1a","\ud83d\udc20","\ud83d\udc1f","\ud83d\udc2c","\ud83d\udc33","\ud83d\udc0b","\ud83d\udc04","\ud83d\udc0f","\ud83d\udc00","\ud83d\udc03","\ud83d\udc05","\ud83d\udc07","\ud83d\udc09","\ud83d\udc0e","\ud83d\udc10","\ud83d\udc13","\ud83d\udc15","\ud83d\udc16","\ud83d\udc01","\ud83d\udc02","\ud83d\udc32","\ud83d\udc21","\ud83d\udc0a","\ud83d\udc2b","\ud83d\udc2a","\ud83d\udc06","\ud83d\udc08","\ud83d\udc29","\ud83d\udc3e","\ud83d\udc90","\ud83c\udf38","\ud83c\udf37","\ud83c\udf40","\ud83c\udf39","\ud83c\udf3b","\ud83c\udf3a","\ud83c\udf41","\ud83c\udf43","\ud83c\udf42","\ud83c\udf3f","\ud83c\udf3e","\ud83c\udf44","\ud83c\udf35","\ud83c\udf34","\ud83c\udf32","\ud83c\udf33","\ud83c\udf30","\ud83c\udf31","\ud83c\udf3c","\ud83c\udf10","\ud83c\udf1e","\ud83c\udf1d","\ud83c\udf1a","\ud83c\udf11","\ud83c\udf12","\ud83c\udf13","\ud83c\udf14","\ud83c\udf15","\ud83c\udf16","\ud83c\udf17","\ud83c\udf18","\ud83c\udf1c","\ud83c\udf1b","\ud83c\udf19","\ud83c\udf0d","\ud83c\udf0e","\ud83c\udf0f","\ud83c\udf0b","\ud83c\udf0c","\ud83c\udf20","\u2b50","\u26c5","\u26a1","\u2614","\u26c4","\ud83c\udf00","\ud83c\udf01","\ud83c\udf08","\ud83c\udf0a","\ud83c\udf8d","\ud83d\udc9d","\ud83c\udf8e","\ud83c\udf92","\ud83c\udf93","\ud83c\udf8f","\ud83c\udf86","\ud83c\udf87","\ud83c\udf90","\ud83c\udf91","\ud83c\udf83","\ud83d\udc7b","\ud83c\udf85","\ud83c\udf84","\ud83c\udf81","\ud83c\udf8b","\ud83c\udf89","\ud83c\udf8a","\ud83c\udf88","\ud83c\udf8c","\ud83d\udd2e","\ud83c\udfa5","\ud83d\udcf7","\ud83d\udcf9","\ud83d\udcfc","\ud83d\udcbf","\ud83d\udcc0","\ud83d\udcbd","\ud83d\udcbe","\ud83d\udcbb","\ud83d\udcf1","\ud83d\udcde","\ud83d\udcdf","\ud83d\udce0","\ud83d\udce1","\ud83d\udcfa","\ud83d\udcfb","\ud83d\udd0a","\ud83d\udd09","\ud83d\udd08","\ud83d\udd07","\ud83d\udd14","\ud83d\udd15","\ud83d\udce2","\ud83d\udce3","\u23f3","\u231b","\u23f0","\u231a","\ud83d\udd13","\ud83d\udd12","\ud83d\udd0f","\ud83d\udd10","\ud83d\udd11","\ud83d\udd0e","\ud83d\udca1","\ud83d\udd26","\ud83d\udd06","\ud83d\udd05","\ud83d\udd0c","\ud83d\udd0b","\ud83d\udd0d","\ud83d\udec1","\ud83d\udec0","\ud83d\udebf","\ud83d\udebd","\ud83d\udd27","\ud83d\udd29","\ud83d\udd28","\ud83d\udeaa","\ud83d\udeac","\ud83d\udca3","\ud83d\udd2b","\ud83d\udd2a","\ud83d\udc8a","\ud83d\udc89","\ud83d\udcb0","\ud83d\udcb4","\ud83d\udcb5","\ud83d\udcb7","\ud83d\udcb6","\ud83d\udcb3","\ud83d\udcb8","\ud83d\udcf2","\ud83d\udce7","\ud83d\udce5","\ud83d\udce4","\ud83d\udce9","\ud83d\udce8","\ud83d\udcef","\ud83d\udceb","\ud83d\udcea","\ud83d\udcec","\ud83d\udced","\ud83d\udcee","\ud83d\udce6","\ud83d\udcdd","\ud83d\udcc4","\ud83d\udcc3","\ud83d\udcd1","\ud83d\udcca","\ud83d\udcc8","\ud83d\udcc9","\ud83d\udcdc","\ud83d\udccb","\ud83d\udcc5","\ud83d\udcc6","\ud83d\udcc7","\ud83d\udcc1","\ud83d\udcc2","\ud83d\udccc","\ud83d\udcce","\ud83d\udccf","\ud83d\udcd0","\ud83d\udcd5","\ud83d\udcd7","\ud83d\udcd8","\ud83d\udcd9","\ud83d\udcd3","\ud83d\udcd4","\ud83d\udcd2","\ud83d\udcda","\ud83d\udcd6","\ud83d\udd16","\ud83d\udcdb","\ud83d\udd2c","\ud83d\udd2d","\ud83d\udcf0","\ud83c\udfa8","\ud83c\udfac","\ud83c\udfa4","\ud83c\udfa7","\ud83c\udfbc","\ud83c\udfb5","\ud83c\udfb6","\ud83c\udfb9","\ud83c\udfbb","\ud83c\udfba","\ud83c\udfb7","\ud83c\udfb8","\ud83d\udc7e","\ud83c\udfae","\ud83c\udccf","\ud83c\udfb4","\ud83c\udc04","\ud83c\udfb2","\ud83c\udfaf","\ud83c\udfc8","\ud83c\udfc0","\u26bd","\u26be","\ud83c\udfbe","\ud83c\udfb1","\ud83c\udfc9","\ud83c\udfb3","\u26f3","\ud83d\udeb5","\ud83d\udeb4","\ud83c\udfc1","\ud83c\udfc7","\ud83c\udfc6","\ud83c\udfbf","\ud83c\udfc2","\ud83c\udfca","\ud83c\udfc4","\ud83c\udfa3","\u2615","\ud83c\udf75","\ud83c\udf76","\ud83c\udf7c","\ud83c\udf7a","\ud83c\udf7b","\ud83c\udf78","\ud83c\udf79","\ud83c\udf77","\ud83c\udf74","\ud83c\udf55","\ud83c\udf54","\ud83c\udf5f","\ud83c\udf57","\ud83c\udf56","\ud83c\udf5d","\ud83c\udf5b","\ud83c\udf64","\ud83c\udf71","\ud83c\udf63","\ud83c\udf65","\ud83c\udf59","\ud83c\udf58","\ud83c\udf5a","\ud83c\udf5c","\ud83c\udf72","\ud83c\udf62","\ud83c\udf61","\ud83c\udf73","\ud83c\udf5e","\ud83c\udf69","\ud83c\udf6e","\ud83c\udf66","\ud83c\udf68","\ud83c\udf67","\ud83c\udf82","\ud83c\udf70","\ud83c\udf6a","\ud83c\udf6b","\ud83c\udf6c","\ud83c\udf6d","\ud83c\udf6f","\ud83c\udf4e","\ud83c\udf4f","\ud83c\udf4a","\ud83c\udf4b","\ud83c\udf52","\ud83c\udf47","\ud83c\udf49","\ud83c\udf53","\ud83c\udf51","\ud83c\udf48","\ud83c\udf4c","\ud83c\udf50","\ud83c\udf4d","\ud83c\udf60","\ud83c\udf46","\ud83c\udf45","\ud83c\udf3d","\ud83c\udfe0","\ud83c\udfe1","\ud83c\udfeb","\ud83c\udfe2","\ud83c\udfe3","\ud83c\udfe5","\ud83c\udfe6","\ud83c\udfea","\ud83c\udfe9","\ud83c\udfe8","\ud83d\udc92","\u26ea","\ud83c\udfec","\ud83c\udfe4","\ud83c\udf07","\ud83c\udf06","\ud83c\udfef","\ud83c\udff0","\u26fa","\ud83c\udfed","\ud83d\uddfc","\ud83d\uddfe","\ud83d\uddfb","\ud83c\udf04","\ud83c\udf05","\ud83c\udf03","\ud83d\uddfd","\ud83c\udf09","\ud83c\udfa0","\ud83c\udfa1","\u26f2","\ud83c\udfa2","\ud83d\udea2","\u26f5","\ud83d\udea4","\ud83d\udea3","\u2693","\ud83d\ude80","\ud83d\udcba","\ud83d\ude81","\ud83d\ude82","\ud83d\ude8a","\ud83d\ude89","\ud83d\ude9e","\ud83d\ude86","\ud83d\ude84","\ud83d\ude85","\ud83d\ude88","\ud83d\ude87","\ud83d\ude9d","\ud83d\ude8b","\ud83d\ude83","\ud83d\ude8e","\ud83d\ude8c","\ud83d\ude8d","\ud83d\ude99","\ud83d\ude98","\ud83d\ude97","\ud83d\ude95","\ud83d\ude96","\ud83d\ude9b","\ud83d\ude9a","\ud83d\udea8","\ud83d\ude93","\ud83d\ude94","\ud83d\ude92","\ud83d\ude91","\ud83d\ude90","\ud83d\udeb2","\ud83d\udea1","\ud83d\ude9f","\ud83d\udea0","\ud83d\ude9c","\ud83d\udc88","\ud83d\ude8f","\ud83c\udfab","\ud83d\udea6","\ud83d\udea5","\ud83d\udea7","\ud83d\udd30","\u26fd","\ud83c\udfee","\ud83c\udfb0","\ud83d\uddff","\ud83c\udfaa","\ud83c\udfad","\ud83d\udccd","\ud83d\udea9","\ud83d\udd20","\ud83d\udd21","\ud83d\udd24","\ud83d\udd04","\u23ea","\u23e9","\u23eb","\u23ec","\ud83c\udd97","\ud83d\udd00","\ud83d\udd01","\ud83d\udd02","\ud83c\udd95","\ud83c\udd99","\ud83c\udd92","\ud83c\udd93","\ud83c\udd96","\ud83d\udcf6","\ud83c\udfa6","\ud83c\ude01","\ud83c\ude2f","\ud83c\ude33","\ud83c\ude35","\ud83c\ude34","\ud83c\ude32","\ud83c\ude50","\ud83c\ude39","\ud83c\ude3a","\ud83c\ude36","\ud83c\ude1a","\ud83d\udebb","\ud83d\udeb9","\ud83d\udeba","\ud83d\udebc","\ud83d\udebe","\ud83d\udeb0","\ud83d\udeae","\ud83c\udd7f","\u267f","\ud83d\udead","\ud83c\ude38","\ud83d\udec2","\ud83d\udec4","\ud83d\udec5","\ud83d\udec3","\ud83c\ude51","\ud83c\udd91","\ud83c\udd98","\ud83c\udd94","\ud83d\udeab","\ud83d\udd1e","\ud83d\udcf5","\ud83d\udeaf","\ud83d\udeb1","\ud83d\udeb3","\ud83d\udeb7","\ud83d\udeb8","\u26d4","\u274e","\u2705","\ud83d\udc9f","\ud83c\udd9a","\ud83d\udcf3","\ud83d\udcf4","\ud83c\udd70","\ud83c\udd71","\ud83c\udd8e","\ud83c\udd7e","\ud83d\udca0","\u27bf","\u2648","\u2649","\u264a","\u264b","\u264c","\u264d","\u264e","\u264f","\u2650","\u2651","\u2652","\u2653","\u26ce","\ud83d\udd2f","\ud83c\udfe7","\ud83d\udcb9","\ud83d\udcb2","\ud83d\udcb1","\ud83d\udd1d","\ud83d\udd1a","\ud83d\udd19","\ud83d\udd1b","\ud83d\udd1c","\u274c","\u2b55","\u2757","\u2753","\u2755","\u2754","\ud83d\udd03","\ud83d\udd5b","\ud83d\udd67","\ud83d\udd50","\ud83d\udd5c","\ud83d\udd51","\ud83d\udd5d","\ud83d\udd52","\ud83d\udd5e","\ud83d\udd53","\ud83d\udd5f","\ud83d\udd54","\ud83d\udd60","\ud83d\udd55","\ud83d\udd56","\ud83d\udd57","\ud83d\udd58","\ud83d\udd59","\ud83d\udd5a","\ud83d\udd61","\ud83d\udd62","\ud83d\udd63","\ud83d\udd64","\ud83d\udd65","\ud83d\udd66","\u2795","\u2796","\u2797","\ud83d\udcae","\ud83d\udcaf","\ud83d\udd18","\ud83d\udd17","\u27b0","\ud83d\udd31","\ud83d\udd32","\ud83d\udd33","\ud83d\udd3a","\u2b1c","\u2b1b","\u26ab","\u26aa","\ud83d\udd3b","\ud83d\udd36","\ud83d\udd37","\ud83d\udd38","\ud83d\udd39"];
    this.init();

    this.startEmoji = 0;
    
    setInterval(() => this.update(), 1000 / 60);
    window.requestAnimationFrame( d => this.draw(d) );
    this.drawEmojiMap(this.mapCtx);
    
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
    return{h: h * 60, s: s * 100, l: l * 100};
  }

  filterEmoji() {
    function ctoe(c) {
      return c.split``.map(s => '\\u' + s.charCodeAt(0).toString(16).padStart(4, '0')).join``;
    }
    const emojiList = ["\ud83d\ude04","\ud83d\ude03","\ud83d\ude00","\ud83d\ude0a","\u263a","\ud83d\ude09","\ud83d\ude0d","\ud83d\ude18","\ud83d\ude1a","\ud83d\ude17","\ud83d\ude19","\ud83d\ude1c","\ud83d\ude1d","\ud83d\ude1b","\ud83d\ude33","\ud83d\ude01","\ud83d\ude14","\ud83d\ude0c","\ud83d\ude12","\ud83d\ude1e","\ud83d\ude23","\ud83d\ude22","\ud83d\ude02","\ud83d\ude2d","\ud83d\ude2a","\ud83d\ude25","\ud83d\ude30","\ud83d\ude05","\ud83d\ude13","\ud83d\ude29","\ud83d\ude2b","\ud83d\ude28","\ud83d\ude31","\ud83d\ude20","\ud83d\ude21","\ud83d\ude24","\ud83d\ude16","\ud83d\ude06","\ud83d\ude0b","\ud83d\ude37","\ud83d\ude0e","\ud83d\ude34","\ud83d\ude35","\ud83d\ude32","\ud83d\ude1f","\ud83d\ude26","\ud83d\ude27","\ud83d\ude08","\ud83d\udc7f","\ud83d\ude2e","\ud83d\ude2c","\ud83d\ude10","\ud83d\ude15","\ud83d\ude2f","\ud83d\ude36","\ud83d\ude07","\ud83d\ude0f","\ud83d\ude11","\ud83d\udc72","\ud83d\udc73","\ud83d\udc6e","\ud83d\udc77","\ud83d\udc82","\ud83d\udc76","\ud83d\udc66","\ud83d\udc67","\ud83d\udc68","\ud83d\udc69","\ud83d\udc74","\ud83d\udc75","\ud83d\udc71","\ud83d\udc7c","\ud83d\udc78","\ud83d\ude3a","\ud83d\ude38","\ud83d\ude3b","\ud83d\ude3d","\ud83d\ude3c","\ud83d\ude40","\ud83d\ude3f","\ud83d\ude39","\ud83d\ude3e","\ud83d\udc79","\ud83d\udc7a","\ud83d\ude48","\ud83d\ude49","\ud83d\ude4a","\ud83d\udc80","\ud83d\udc7d","\ud83d\udca9","\ud83d\udd25","\u2728","\ud83c\udf1f","\ud83d\udcab","\ud83d\udca5","\ud83d\udca2","\ud83d\udca6","\ud83d\udca7","\ud83d\udca4","\ud83d\udca8","\ud83d\udc42","\ud83d\udc40","\ud83d\udc43","\ud83d\udc45","\ud83d\udc44","\ud83d\udc4d","\ud83d\udc4e","\ud83d\udc4c","\ud83d\udc4a","\u270a","\u270c","\ud83d\udc4b","\u270b","\ud83d\udc50","\ud83d\udc46","\ud83d\udc47","\ud83d\udc49","\ud83d\udc48","\ud83d\ude4c","\ud83d\ude4f","\u261d","\ud83d\udc4f","\ud83d\udcaa","\ud83d\udeb6","\ud83c\udfc3","\ud83d\udc83","\ud83d\udc6b","\ud83d\udc6a","\ud83d\udc6c","\ud83d\udc6d","\ud83d\udc8f","\ud83d\udc91","\ud83d\udc6f","\ud83d\ude46","\ud83d\ude45","\ud83d\udc81","\ud83d\ude4b","\ud83d\udc86","\ud83d\udc87","\ud83d\udc85","\ud83d\udc70","\ud83d\ude4e","\ud83d\ude4d","\ud83d\ude47","\ud83c\udfa9","\ud83d\udc51","\ud83d\udc52","\ud83d\udc5f","\ud83d\udc5e","\ud83d\udc61","\ud83d\udc60","\ud83d\udc62","\ud83d\udc55","\ud83d\udc54","\ud83d\udc5a","\ud83d\udc57","\ud83c\udfbd","\ud83d\udc56","\ud83d\udc58","\ud83d\udc59","\ud83d\udcbc","\ud83d\udc5c","\ud83d\udc5d","\ud83d\udc5b","\ud83d\udc53","\ud83c\udf80","\ud83c\udf02","\ud83d\udc84","\ud83d\udc9b","\ud83d\udc99","\ud83d\udc9c","\ud83d\udc9a","\u2764","\ud83d\udc94","\ud83d\udc97","\ud83d\udc93","\ud83d\udc95","\ud83d\udc96","\ud83d\udc9e","\ud83d\udc98","\ud83d\udc8c","\ud83d\udc8b","\ud83d\udc8d","\ud83d\udc8e","\ud83d\udc64","\ud83d\udc65","\ud83d\udcac","\ud83d\udc63","\ud83d\udcad","\ud83d\udc36","\ud83d\udc3a","\ud83d\udc31","\ud83d\udc2d","\ud83d\udc39","\ud83d\udc30","\ud83d\udc38","\ud83d\udc2f","\ud83d\udc28","\ud83d\udc3b","\ud83d\udc37","\ud83d\udc3d","\ud83d\udc2e","\ud83d\udc17","\ud83d\udc35","\ud83d\udc12","\ud83d\udc34","\ud83d\udc11","\ud83d\udc18","\ud83d\udc3c","\ud83d\udc27","\ud83d\udc26","\ud83d\udc24","\ud83d\udc25","\ud83d\udc23","\ud83d\udc14","\ud83d\udc0d","\ud83d\udc22","\ud83d\udc1b","\ud83d\udc1d","\ud83d\udc1c","\ud83d\udc1e","\ud83d\udc0c","\ud83d\udc19","\ud83d\udc1a","\ud83d\udc20","\ud83d\udc1f","\ud83d\udc2c","\ud83d\udc33","\ud83d\udc0b","\ud83d\udc04","\ud83d\udc0f","\ud83d\udc00","\ud83d\udc03","\ud83d\udc05","\ud83d\udc07","\ud83d\udc09","\ud83d\udc0e","\ud83d\udc10","\ud83d\udc13","\ud83d\udc15","\ud83d\udc16","\ud83d\udc01","\ud83d\udc02","\ud83d\udc32","\ud83d\udc21","\ud83d\udc0a","\ud83d\udc2b","\ud83d\udc2a","\ud83d\udc06","\ud83d\udc08","\ud83d\udc29","\ud83d\udc3e","\ud83d\udc90","\ud83c\udf38","\ud83c\udf37","\ud83c\udf40","\ud83c\udf39","\ud83c\udf3b","\ud83c\udf3a","\ud83c\udf41","\ud83c\udf43","\ud83c\udf42","\ud83c\udf3f","\ud83c\udf3e","\ud83c\udf44","\ud83c\udf35","\ud83c\udf34","\ud83c\udf32","\ud83c\udf33","\ud83c\udf30","\ud83c\udf31","\ud83c\udf3c","\ud83c\udf10","\ud83c\udf1e","\ud83c\udf1d","\ud83c\udf1a","\ud83c\udf11","\ud83c\udf12","\ud83c\udf13","\ud83c\udf14","\ud83c\udf15","\ud83c\udf16","\ud83c\udf17","\ud83c\udf18","\ud83c\udf1c","\ud83c\udf1b","\ud83c\udf19","\ud83c\udf0d","\ud83c\udf0e","\ud83c\udf0f","\ud83c\udf0b","\ud83c\udf0c","\ud83c\udf20","\u2b50","\u2600","\u26c5","\u2601","\u26a1","\u2614","\u2744","\u26c4","\ud83c\udf00","\ud83c\udf01","\ud83c\udf08","\ud83c\udf0a","\ud83c\udf8d","\ud83d\udc9d","\ud83c\udf8e","\ud83c\udf92","\ud83c\udf93","\ud83c\udf8f","\ud83c\udf86","\ud83c\udf87","\ud83c\udf90","\ud83c\udf91","\ud83c\udf83","\ud83d\udc7b","\ud83c\udf85","\ud83c\udf84","\ud83c\udf81","\ud83c\udf8b","\ud83c\udf89","\ud83c\udf8a","\ud83c\udf88","\ud83c\udf8c","\ud83d\udd2e","\ud83c\udfa5","\ud83d\udcf7","\ud83d\udcf9","\ud83d\udcfc","\ud83d\udcbf","\ud83d\udcc0","\ud83d\udcbd","\ud83d\udcbe","\ud83d\udcbb","\ud83d\udcf1","\u260e","\ud83d\udcde","\ud83d\udcdf","\ud83d\udce0","\ud83d\udce1","\ud83d\udcfa","\ud83d\udcfb","\ud83d\udd0a","\ud83d\udd09","\ud83d\udd08","\ud83d\udd07","\ud83d\udd14","\ud83d\udd15","\ud83d\udce2","\ud83d\udce3","\u23f3","\u231b","\u23f0","\u231a","\ud83d\udd13","\ud83d\udd12","\ud83d\udd0f","\ud83d\udd10","\ud83d\udd11","\ud83d\udd0e","\ud83d\udca1","\ud83d\udd26","\ud83d\udd06","\ud83d\udd05","\ud83d\udd0c","\ud83d\udd0b","\ud83d\udd0d","\ud83d\udec1","\ud83d\udec0","\ud83d\udebf","\ud83d\udebd","\ud83d\udd27","\ud83d\udd29","\ud83d\udd28","\ud83d\udeaa","\ud83d\udeac","\ud83d\udca3","\ud83d\udd2b","\ud83d\udd2a","\ud83d\udc8a","\ud83d\udc89","\ud83d\udcb0","\ud83d\udcb4","\ud83d\udcb5","\ud83d\udcb7","\ud83d\udcb6","\ud83d\udcb3","\ud83d\udcb8","\ud83d\udcf2","\ud83d\udce7","\ud83d\udce5","\ud83d\udce4","\u2709","\ud83d\udce9","\ud83d\udce8","\ud83d\udcef","\ud83d\udceb","\ud83d\udcea","\ud83d\udcec","\ud83d\udced","\ud83d\udcee","\ud83d\udce6","\ud83d\udcdd","\ud83d\udcc4","\ud83d\udcc3","\ud83d\udcd1","\ud83d\udcca","\ud83d\udcc8","\ud83d\udcc9","\ud83d\udcdc","\ud83d\udccb","\ud83d\udcc5","\ud83d\udcc6","\ud83d\udcc7","\ud83d\udcc1","\ud83d\udcc2","\u2702","\ud83d\udccc","\ud83d\udcce","\u2712","\u270f","\ud83d\udccf","\ud83d\udcd0","\ud83d\udcd5","\ud83d\udcd7","\ud83d\udcd8","\ud83d\udcd9","\ud83d\udcd3","\ud83d\udcd4","\ud83d\udcd2","\ud83d\udcda","\ud83d\udcd6","\ud83d\udd16","\ud83d\udcdb","\ud83d\udd2c","\ud83d\udd2d","\ud83d\udcf0","\ud83c\udfa8","\ud83c\udfac","\ud83c\udfa4","\ud83c\udfa7","\ud83c\udfbc","\ud83c\udfb5","\ud83c\udfb6","\ud83c\udfb9","\ud83c\udfbb","\ud83c\udfba","\ud83c\udfb7","\ud83c\udfb8","\ud83d\udc7e","\ud83c\udfae","\ud83c\udccf","\ud83c\udfb4","\ud83c\udc04","\ud83c\udfb2","\ud83c\udfaf","\ud83c\udfc8","\ud83c\udfc0","\u26bd","\u26be","\ud83c\udfbe","\ud83c\udfb1","\ud83c\udfc9","\ud83c\udfb3","\u26f3","\ud83d\udeb5","\ud83d\udeb4","\ud83c\udfc1","\ud83c\udfc7","\ud83c\udfc6","\ud83c\udfbf","\ud83c\udfc2","\ud83c\udfca","\ud83c\udfc4","\ud83c\udfa3","\u2615","\ud83c\udf75","\ud83c\udf76","\ud83c\udf7c","\ud83c\udf7a","\ud83c\udf7b","\ud83c\udf78","\ud83c\udf79","\ud83c\udf77","\ud83c\udf74","\ud83c\udf55","\ud83c\udf54","\ud83c\udf5f","\ud83c\udf57","\ud83c\udf56","\ud83c\udf5d","\ud83c\udf5b","\ud83c\udf64","\ud83c\udf71","\ud83c\udf63","\ud83c\udf65","\ud83c\udf59","\ud83c\udf58","\ud83c\udf5a","\ud83c\udf5c","\ud83c\udf72","\ud83c\udf62","\ud83c\udf61","\ud83c\udf73","\ud83c\udf5e","\ud83c\udf69","\ud83c\udf6e","\ud83c\udf66","\ud83c\udf68","\ud83c\udf67","\ud83c\udf82","\ud83c\udf70","\ud83c\udf6a","\ud83c\udf6b","\ud83c\udf6c","\ud83c\udf6d","\ud83c\udf6f","\ud83c\udf4e","\ud83c\udf4f","\ud83c\udf4a","\ud83c\udf4b","\ud83c\udf52","\ud83c\udf47","\ud83c\udf49","\ud83c\udf53","\ud83c\udf51","\ud83c\udf48","\ud83c\udf4c","\ud83c\udf50","\ud83c\udf4d","\ud83c\udf60","\ud83c\udf46","\ud83c\udf45","\ud83c\udf3d","\ud83c\udfe0","\ud83c\udfe1","\ud83c\udfeb","\ud83c\udfe2","\ud83c\udfe3","\ud83c\udfe5","\ud83c\udfe6","\ud83c\udfea","\ud83c\udfe9","\ud83c\udfe8","\ud83d\udc92","\u26ea","\ud83c\udfec","\ud83c\udfe4","\ud83c\udf07","\ud83c\udf06","\ud83c\udfef","\ud83c\udff0","\u26fa","\ud83c\udfed","\ud83d\uddfc","\ud83d\uddfe","\ud83d\uddfb","\ud83c\udf04","\ud83c\udf05","\ud83c\udf03","\ud83d\uddfd","\ud83c\udf09","\ud83c\udfa0","\ud83c\udfa1","\u26f2","\ud83c\udfa2","\ud83d\udea2","\u26f5","\ud83d\udea4","\ud83d\udea3","\u2693","\ud83d\ude80","\u2708","\ud83d\udcba","\ud83d\ude81","\ud83d\ude82","\ud83d\ude8a","\ud83d\ude89","\ud83d\ude9e","\ud83d\ude86","\ud83d\ude84","\ud83d\ude85","\ud83d\ude88","\ud83d\ude87","\ud83d\ude9d","\ud83d\ude8b","\ud83d\ude83","\ud83d\ude8e","\ud83d\ude8c","\ud83d\ude8d","\ud83d\ude99","\ud83d\ude98","\ud83d\ude97","\ud83d\ude95","\ud83d\ude96","\ud83d\ude9b","\ud83d\ude9a","\ud83d\udea8","\ud83d\ude93","\ud83d\ude94","\ud83d\ude92","\ud83d\ude91","\ud83d\ude90","\ud83d\udeb2","\ud83d\udea1","\ud83d\ude9f","\ud83d\udea0","\ud83d\ude9c","\ud83d\udc88","\ud83d\ude8f","\ud83c\udfab","\ud83d\udea6","\ud83d\udea5","\u26a0","\ud83d\udea7","\ud83d\udd30","\u26fd","\ud83c\udfee","\ud83c\udfb0","\u2668","\ud83d\uddff","\ud83c\udfaa","\ud83c\udfad","\ud83d\udccd","\ud83d\udea9","\u2b06","\u2b07","\u2b05","\u27a1","\ud83d\udd20","\ud83d\udd21","\ud83d\udd24","\u2197","\u2196","\u2198","\u2199","\u2194","\u2195","\ud83d\udd04","\u25c0","\u25b6","\ud83d\udd3c","\ud83d\udd3d","\u21a9","\u21aa","\u2139","\u23ea","\u23e9","\u23eb","\u23ec","\u2935","\u2934","\ud83c\udd97","\ud83d\udd00","\ud83d\udd01","\ud83d\udd02","\ud83c\udd95","\ud83c\udd99","\ud83c\udd92","\ud83c\udd93","\ud83c\udd96","\ud83d\udcf6","\ud83c\udfa6","\ud83c\ude01","\ud83c\ude2f","\ud83c\ude33","\ud83c\ude35","\ud83c\ude34","\ud83c\ude32","\ud83c\ude50","\ud83c\ude39","\ud83c\ude3a","\ud83c\ude36","\ud83c\ude1a","\ud83d\udebb","\ud83d\udeb9","\ud83d\udeba","\ud83d\udebc","\ud83d\udebe","\ud83d\udeb0","\ud83d\udeae","\ud83c\udd7f","\u267f","\ud83d\udead","\ud83c\ude37","\ud83c\ude38","\ud83c\ude02","\u24c2","\ud83d\udec2","\ud83d\udec4","\ud83d\udec5","\ud83d\udec3","\ud83c\ude51","\u3299","\u3297","\ud83c\udd91","\ud83c\udd98","\ud83c\udd94","\ud83d\udeab","\ud83d\udd1e","\ud83d\udcf5","\ud83d\udeaf","\ud83d\udeb1","\ud83d\udeb3","\ud83d\udeb7","\ud83d\udeb8","\u26d4","\u2733","\u2747","\u274e","\u2705","\u2734","\ud83d\udc9f","\ud83c\udd9a","\ud83d\udcf3","\ud83d\udcf4","\ud83c\udd70","\ud83c\udd71","\ud83c\udd8e","\ud83c\udd7e","\ud83d\udca0","\u27bf","\u267b","\u2648","\u2649","\u264a","\u264b","\u264c","\u264d","\u264e","\u264f","\u2650","\u2651","\u2652","\u2653","\u26ce","\ud83d\udd2f","\ud83c\udfe7","\ud83d\udcb9","\ud83d\udcb2","\ud83d\udcb1","\u00a9","\u00ae","\u2122","\u303d","\u3030","\ud83d\udd1d","\ud83d\udd1a","\ud83d\udd19","\ud83d\udd1b","\ud83d\udd1c","\u274c","\u2b55","\u2757","\u2753","\u2755","\u2754","\ud83d\udd03","\ud83d\udd5b","\ud83d\udd67","\ud83d\udd50","\ud83d\udd5c","\ud83d\udd51","\ud83d\udd5d","\ud83d\udd52","\ud83d\udd5e","\ud83d\udd53","\ud83d\udd5f","\ud83d\udd54","\ud83d\udd60","\ud83d\udd55","\ud83d\udd56","\ud83d\udd57","\ud83d\udd58","\ud83d\udd59","\ud83d\udd5a","\ud83d\udd61","\ud83d\udd62","\ud83d\udd63","\ud83d\udd64","\ud83d\udd65","\ud83d\udd66","\u2716","\u2795","\u2796","\u2797","\u2660","\u2665","\u2663","\u2666","\ud83d\udcae","\ud83d\udcaf","\u2714","\u2611","\ud83d\udd18","\ud83d\udd17","\u27b0","\ud83d\udd31","\ud83d\udd32","\ud83d\udd33","\u25fc","\u25fb","\u25fe","\u25fd","\u25aa","\u25ab","\ud83d\udd3a","\u2b1c","\u2b1b","\u26ab","\u26aa","\ud83d\udd34","\ud83d\udd35","\ud83d\udd3b","\ud83d\udd36","\ud83d\udd37","\ud83d\udd38","\ud83d\udd39"];
    console.log('original length', emojiList.length);

    //create canvas
    const fCanvas = document.createElement('canvas');
    fCanvas.width = this.canvas.width;
    fCanvas.height = this.canvas.height;
    const ctx = fCanvas.getContext('2d');

    const fList = emojiList.filter( e => {

      ctx.clearRect(0, 0, fCanvas.width, fCanvas.height);

      ctx.fillStyle = 'black';
      ctx.font = '300px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      ctx.fillText(e, 250, 250);
      const imageData = ctx.getImageData(0, 0, fCanvas.width, fCanvas.height);
      const data = imageData.data;
      const step = 1;

      for (let x = 0; x < fCanvas.width; x += step) {
        for (let y = 0; y < fCanvas.height; y += step) {
          const i = x + y * fCanvas.width;
          let r = data[i * 4 + 0];
          let g = data[i * 4 + 1];
          let b = data[i * 4 + 2];
          let a = data[i * 4 + 3];

          if (a === 255) {
            if (r > 5 || g > 5 || b > 5) {
              return true;
            }
          }
        }
      }

      return false;
    });


    console.log('filtered length', fList.length);
    console.log('["' + fList.map(e => ctoe(e)).join`","` + '"];');
  }
  
  init(emojiIndexForce) {
  
    this.blocks = [];
    this.blockLookup = {};
    this.gridLookup = {};
  
    const ctx = this.ctx;
    
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = 'black';
    ctx.font = '300px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const emojiIndex = emojiIndexForce ?? Math.floor(Math.random() * this.emojiList.length);
    this.curIndex = emojiIndex;
    //const emojiIndex = 0;
    console.log(emojiIndex);
    const emoji = this.emojiList[emojiIndex];
    ctx.fillText(emoji, 250, 250);
    
    const imageData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    const size = this.blockSize;
    const colorShake = 15;
    //const colorShake = 0;
    const wiggle = 0.5;        
    this.colors = [];
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
          const wx =  wiggle * Math.sin(Math.random() * 10);
          const wy =  wiggle * Math.sin(Math.random() * 10);
          const newr = r + colorShake * Math.sin(Math.random() * 10);
          const newg = g + colorShake * Math.sin(Math.random() * 10);
          const newb = b + colorShake * Math.sin(Math.random() * 10);

          
          //const hsl = this.rgbToHsl(newr, newg, newb);
          const hsl = this.rgbToHsl(r, g, b);
          hsl.h = hsl.h + 5 * Math.sin(Math.random() * 10);
          hsl.l = hsl.l + 5 * Math.sin(Math.random() * 10);
          this.colors.push(hsl);
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


    //add funnel walls
    for (let x = 0; x < this.canvas.width / 2 - size; x += size) {
      for (let ydepth = 0; ydepth < 2; ydepth++) {
        const y = x + 55 * size + ydepth * size;
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

  
  update() {
    let landedCount = 0;
    let moveCount = 0;
    const halfBlock = this.blockSize / 2;
    const activeCursorDist = (this.cursorSize + halfBlock) * (this.cursorSize + halfBlock);
    let nonWallCount = 0;

    //sort so that lower landed blocks are first
    this.blocks = this.blocks.sort( (a, b) => {
      if (!a.landed && !b.landed) { return 0; }
      if (a.landed && b.landed) {return b.y - a.y;}
      if (a.landed) {return 1;}
      if (b.landed) {return -1;}
    });
    //TODO: don't do this every update
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }


    let playTick = false;
    this.blocks.forEach( b => {
      
      if (b.wall) {return;}
      nonWallCount++;
        
      if (!b.landed && !b.loose) {
        //in the original image

        //check if cursor is close enough
        const dx = this.mousex - (b.x + halfBlock);
        const dy = this.mousey - (b.y + halfBlock);
        const d2 = dx * dx + dy * dy;

        if (d2 < activeCursorDist) {        
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
            b.strength -= this.toolStrength;
            if (b.strength <= 0) {
              b.loose = true;
              b.strength = 0;
              this.lastDropTime = (new Date()).getTime();
              
              playTick = true;
            }
          }
        }
      }

      const curTime = (new Date()).getTime();
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
              //this.score += b.baseStr;
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
            //this.score += b.baseStr;
          } else {              
            b.y = newy;
          }
        }
          
      }
      
      if (b.landed) {
        landedCount++;
        //don't do sand physics every time
        if (Math.random > 0.25) {return;}

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
        //this.score += b.baseStr;
        //b.y = maxY;
        b.x = this.roundToGrid(b.x);      
      }
    });

    if (playTick) {
      this.audioElement.play();
    }

    this.blocks = this.blocks.filter( b => {
      if (!b.alive) {
        this.score += b.baseStr;
        if (b.black) {
          this.black += 1;
        } else {
          this.r += b.rgb.r / 255;
          this.g += b.rgb.g / 255;
          this.b += b.rgb.b / 255;
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
    //if (landedCount >= this.blocks.length && moveCount === 0) {
    if (nonWallCount === 0) {
      this.init();
    }
    
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
    for (let x = 0; x < this.canvas.width / 2 - this.blockSize; x += this.blockSize) {
      for (let ydepth = 0; ydepth < 40; ydepth++) {
        const y = x + 55 * this.blockSize + ydepth * this.blockSize;
        for (let i = 0; i < 2; i++) {
          const thisX = i === 0 ? x : this.roundToGrid(this.canvas.width) - x;

          const newr = 128 + 15 * Math.sin(Math.random() * 10);
          const newg = 128 + 15 * Math.sin(Math.random() * 10);
          const newb = 128 + 15 * Math.sin(Math.random() * 10);

          //ctx.fillStyle = `rgb(${newr},${newg},${newb})`;
          ctx.fillStyle = `hsl(0, 0%, ${50 + 5 * Math.sin(Math.random() * 10)}%)`;
          const wx = 0.5 * Math.sin(Math.random() * 10);
          const wy = 0.5 * Math.sin(Math.random() * 10);
          ctx.fillRect(thisX + wx, y + wy, this.blockSize, this.blockSize);
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
    ctx.fillStyle = 'white';
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

  drawEmojiGrid(ctx) {
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    const gridSize = 64;
    const startEmoji = this.startEmoji;

    const width = Math.floor(this.canvas.width / gridSize);
    const height = Math.floor(this.canvas.height / gridSize);
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const emojiIndex = startEmoji + x + y * width;
        ctx.fillStyle = 'black';
        ctx.fillStyle = 'black';
        ctx.font = '18px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(emojiIndex, x * gridSize, y * gridSize);

        ctx.textAlign = 'center';
        ctx.textAlign = 'middle';
        ctx.fillText(this.emojiList[emojiIndex], x * gridSize + gridSize / 2, y * gridSize + gridSize / 2);
       }
    }
  }

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

  drawEmojiMap(ctx) {
    const canvas = ctx.canvas;
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    if (this.emojiValues === undefined) {
      //this.emojiValues = [{"r":230970,"g":182167,"b":64285,"black":458},{"r":226117,"g":178362,"b":63122,"black":476},{"r":219648,"g":177850,"b":72212,"black":496},{"r":245328,"g":187597,"b":59952,"black":406},{"r":246201,"g":191565,"b":55933,"black":396},{"r":240796,"g":147405,"b":55415,"black":421},{"r":261895,"g":189154,"b":54397,"black":364},{"r":256118,"g":193122,"b":58042,"black":349},{"r":258836,"g":201984,"b":59938,"black":351},{"r":258688,"g":201869,"b":59905,"black":353},{"r":239852,"g":173152,"b":67559,"black":418},{"r":230600,"g":161490,"b":49806,"black":456},{"r":240551,"g":169292,"b":52185,"black":419},{"r":246509,"g":195780,"b":87711,"black":381},{"r":219893,"g":178038,"b":72271,"black":493},{"r":250078,"g":194607,"b":56863,"black":383},{"r":245145,"g":190735,"b":55671,"black":399},{"r":242540,"g":188822,"b":55311,"black":401},{"r":248194,"g":193395,"b":56925,"black":391},{"r":237357,"g":184834,"b":54205,"black":430},{"r":234529,"g":193367,"b":67207,"black":386},{"r":201091,"g":179865,"b":83392,"black":466},{"r":180750,"g":189738,"b":105376,"black":448},{"r":224743,"g":191749,"b":72749,"black":428},{"r":229165,"g":198607,"b":78145,"black":393},{"r":171479,"g":187870,"b":141478,"black":420},{"r":220957,"g":185368,"b":76118,"black":476},{"r":233399,"g":199040,"b":76406,"black":409},{"r":221983,"g":171463,"b":53085,"black":490},{"r":211663,"g":165831,"b":52550,"black":526},{"r":189143,"g":188714,"b":146865,"black":416},{"r":202186,"g":182102,"b":111275,"black":471},{"r":242531,"g":190218,"b":58016,"black":417},{"r":222570,"g":51247,"b":22130,"black":418},{"r":262461,"g":216033,"b":100850,"black":390},{"r":226766,"g":176346,"b":51325,"black":469},{"r":220970,"g":174325,"b":61894,"black":495},{"r":246300,"g":183438,"b":56233,"black":428},{"r":247141,"g":216679,"b":128333,"black":352},{"r":182002,"g":144060,"b":48173,"black":647},{"r":212666,"g":193664,"b":85456,"black":398},{"r":218969,"g":170254,"b":49511,"black":494},{"r":231942,"g":190119,"b":86799,"black":437},{"r":247779,"g":192875,"b":56454,"black":390},{"r":242599,"g":190272,"b":58031,"black":421},{"r":240387,"g":187185,"b":54891,"black":421},{"r":234808,"g":55076,"b":23028,"black":481},{"r":237568,"g":55742,"b":23292,"black":471},{"r":245372,"g":192448,"b":58694,"black":410},{"r":215888,"g":172535,"b":62994,"black":504},{"r":244866,"g":192051,"b":58574,"black":411},{"r":248893,"g":195209,"b":59537,"black":395},{"r":246091,"g":191533,"b":56012,"black":397},{"r":260514,"g":204324,"b":62317,"black":351},{"r":227401,"g":206334,"b":90410,"black":430},{"r":240049,"g":186685,"b":54359,"black":419},{"r":246976,"g":193705,"b":59082,"black":401},{"r":171622,"g":125276,"b":38813,"black":387},{"r":228358,"g":188461,"b":128358,"black":370},{"r":86681,"g":115210,"b":109872,"black":400},{"r":150638,"g":129412,"b":50470,"black":378},{"r":94823,"g":55313,"b":31341,"black":394},{"r":186551,"g":159215,"b":62085,"black":339},{"r":204856,"g":153403,"b":52001,"black":391},{"r":208529,"g":150140,"b":59803,"black":427},{"r":185519,"g":137748,"b":47917,"black":366},{"r":226895,"g":159220,"b":60354,"black":398},{"r":220248,"g":180776,"b":80946,"black":333},{"r":249607,"g":220436,"b":163633,"black":347},{"r":237490,"g":191518,"b":40155,"black":376},{"r":215256,"g":210015,"b":94616,"black":477},{"r":218271,"g":168986,"b":86040,"black":399},{"r":198522,"g":159099,"b":75818,"black":469},{"r":197958,"g":158657,"b":75684,"black":470},{"r":208662,"g":133035,"b":66535,"black":430},{"r":215906,"g":179868,"b":97385,"black":390},{"r":210650,"g":173323,"b":87138,"black":411},{"r":240397,"g":190611,"b":84260,"black":461},{"r":202272,"g":176244,"b":95206,"black":392},{"r":171580,"g":160154,"b":97923,"black":469},{"r":210892,"g":173565,"b":87380,"black":411},{"r":147559,"g":65034,"b":44029,"black":444},{"r":167465,"g":63043,"b":43180,"black":553},{"r":175640,"g":111817,"b":80026,"black":412},{"r":181045,"g":122009,"b":93198,"black":477},{"r":157979,"g":102107,"b":73937,"black":389},{"r":170889,"g":170889,"b":170889,"black":438},{"r":75651,"g":135898,"b":76397,"black":497},{"r":88654,"g":57700,"b":39968,"black":390},{"r":167869,"g":90017,"b":14004,"black":316},{"r":63141,"g":63622,"b":19615,"black":518},{"r":78988,"g":79217,"b":11188,"black":574},{"r":30044,"g":60129,"b":42867,"black":550},{"r":134431,"g":52910,"b":33195,"black":416},{"r":50042,"g":3884,"b":7764,"black":562},{"r":31921,"g":116740,"b":135957,"black":440},{"r":0,"g":82598,"b":106321,"black":223},{"r":0,"g":57860,"b":74479,"black":455},{"r":126890,"g":126890,"b":126890,"black":367},{"r":148107,"g":108813,"b":23834,"black":284},{"r":154273,"g":154273,"b":154273,"black":684},{"r":189044,"g":146441,"b":41693,"black":312},{"r":172807,"g":73256,"b":57499,"black":281},{"r":167694,"g":54072,"b":44512,"black":279},{"r":156094,"g":120438,"b":33500,"black":317},{"r":151304,"g":116651,"b":32299,"black":323},{"r":112805,"g":87256,"b":24632,"black":367},{"r":183751,"g":139764,"b":35547,"black":289},{"r":163511,"g":125933,"b":34647,"black":250},{"r":0,"g":0,"b":0,"black":252},{"r":171944,"g":142162,"b":49979,"black":475},{"r":167550,"g":129490,"b":36371,"black":309},{"r":110645,"g":84487,"b":22033,"black":322},{"r":124850,"g":96706,"b":27516,"black":297},{"r":125978,"g":97432,"b":27484,"black":294},{"r":126313,"g":97835,"b":27833,"black":289},{"r":126848,"g":98190,"b":27840,"black":291},{"r":152898,"g":110261,"b":19932,"black":599},{"r":107145,"g":107160,"b":71570,"black":350},{"r":0,"g":0,"b":0,"black":121},{"r":197483,"g":145127,"b":35273,"black":420},{"r":180954,"g":141008,"b":41507,"black":385},{"r":40355,"g":32208,"b":24259,"black":342},{"r":49980,"g":38739,"b":28546,"black":409},{"r":131133,"g":52546,"b":19582,"black":413},{"r":115133,"g":79126,"b":49398,"black":617},{"r":199481,"g":143026,"b":89646,"black":610},{"r":91805,"g":76703,"b":57108,"black":622},{"r":129059,"g":78128,"b":62175,"black":610},{"r":181231,"g":105042,"b":38077,"black":443},{"r":175931,"g":100017,"b":37250,"black":463},{"r":105403,"g":82335,"b":37241,"black":577},{"r":178001,"g":134369,"b":153835,"black":349},{"r":155894,"g":122423,"b":131302,"black":341},{"r":170354,"g":128985,"b":131626,"black":356},{"r":172425,"g":128336,"b":127605,"black":426},{"r":160377,"g":120060,"b":103827,"black":364},{"r":159833,"g":119381,"b":113739,"black":422},{"r":135858,"g":101228,"b":47975,"black":465},{"r":243742,"g":216377,"b":174855,"black":355},{"r":144596,"g":106218,"b":101163,"black":329},{"r":141412,"g":103209,"b":112137,"black":325},{"r":91888,"g":99179,"b":81658,"black":440},{"r":94721,"g":86328,"b":64598,"black":335},{"r":202322,"g":163842,"b":2030,"black":323},{"r":132010,"g":88869,"b":1176,"black":283},{"r":69880,"g":120927,"b":111291,"black":294},{"r":90173,"g":40038,"b":14571,"black":274},{"r":85941,"g":52203,"b":40557,"black":301},{"r":137898,"g":56957,"b":37514,"black":376},{"r":116707,"g":49831,"b":15239,"black":353},{"r":213217,"g":129368,"b":113242,"black":368},{"r":129181,"g":163320,"b":216164,"black":346},{"r":189674,"g":89008,"b":98813,"black":332},{"r":122805,"g":29100,"b":13873,"black":330},{"r":87471,"g":174032,"b":145425,"black":300},{"r":10074,"g":85712,"b":164027,"black":461},{"r":76020,"g":128649,"b":169011,"black":358},{"r":112787,"g":38901,"b":24693,"black":450},{"r":131877,"g":81505,"b":49836,"black":389},{"r":165166,"g":116041,"b":68652,"black":405},{"r":201729,"g":172119,"b":142274,"black":345},{"r":221604,"g":84968,"b":67770,"black":318},{"r":19624,"g":58728,"b":73590,"black":423},{"r":187585,"g":53124,"b":108369,"black":405},{"r":89282,"g":30649,"b":12312,"black":377},{"r":171524,"g":80648,"b":20771,"black":268},{"r":193052,"g":141987,"b":8049,"black":291},{"r":3258,"g":143791,"b":183545,"black":291},{"r":104289,"g":83692,"b":172946,"black":291},{"r":23243,"g":151299,"b":16074,"black":291},{"r":161592,"g":17551,"b":27560,"black":350},{"r":174880,"g":68469,"b":78563,"black":291},{"r":122851,"g":16468,"b":25499,"black":349},{"r":146709,"g":38645,"b":48089,"black":267},{"r":182901,"g":34183,"b":28523,"black":330},{"r":118297,"g":23433,"b":31597,"black":487},{"r":166082,"g":30559,"b":42844,"black":359},{"r":234127,"g":209668,"b":225059,"black":381},{"r":166726,"g":40292,"b":15979,"black":538},{"r":58995,"g":78669,"b":84194,"black":426},{"r":47399,"g":127252,"b":156736,"black":283},{"r":71545,"g":71545,"b":71545,"black":399},{"r":66962,"g":66962,"b":66962,"black":468},{"r":191590,"g":191590,"b":191590,"black":361},{"r":115655,"g":27950,"b":11084,"black":525},{"r":175081,"g":175081,"b":175081,"black":329},{"r":184905,"g":149675,"b":130418,"black":419},{"r":113364,"g":113364,"b":113364,"black":436},{"r":218775,"g":172936,"b":77132,"black":390},{"r":167011,"g":155030,"b":152941,"black":479},{"r":236179,"g":196094,"b":139462,"black":454},{"r":133664,"g":122446,"b":120487,"black":467},{"r":124551,"g":156268,"b":20647,"black":386},{"r":205096,"g":130010,"b":87166,"black":403},{"r":192649,"g":189143,"b":188532,"black":441},{"r":160129,"g":101206,"b":64021,"black":405},{"r":241564,"g":148883,"b":133456,"black":447},{"r":169526,"g":92492,"b":85657,"black":266},{"r":166590,"g":125841,"b":95466,"black":454},{"r":149473,"g":97088,"b":77724,"black":447},{"r":149294,"g":101698,"b":78385,"black":388},{"r":116427,"g":77606,"b":60436,"black":581},{"r":183773,"g":125431,"b":94376,"black":425},{"r":131336,"g":131336,"b":131336,"black":355},{"r":154292,"g":154292,"b":154292,"black":492},{"r":177608,"g":176479,"b":176282,"black":406},{"r":99505,"g":90163,"b":71296,"black":384},{"r":97553,"g":24695,"b":17223,"black":442},{"r":147865,"g":106112,"b":21763,"black":398},{"r":148474,"g":106356,"b":24403,"black":395},{"r":186977,"g":165076,"b":113204,"black":411},{"r":177680,"g":133178,"b":112565,"black":388},{"r":106804,"g":129324,"b":12010,"black":500},{"r":83481,"g":110075,"b":8671,"black":357},{"r":83227,"g":83994,"b":20829,"black":385},{"r":121419,"g":102959,"b":59577,"black":464},{"r":123874,"g":49564,"b":6567,"black":471},{"r":124211,"g":49397,"b":35009,"black":534},{"r":166639,"g":113861,"b":84465,"black":437},{"r":152844,"g":61921,"b":8488,"black":625},{"r":174080,"g":112320,"b":77619,"black":286},{"r":244209,"g":141055,"b":79083,"black":481},{"r":38886,"g":132692,"b":162423,"black":397},{"r":18504,"g":90372,"b":108243,"black":399},{"r":13752,"g":150619,"b":187828,"black":555},{"r":35542,"g":160621,"b":192162,"black":419},{"r":104487,"g":99956,"b":99166,"black":376},{"r":146493,"g":136599,"b":120274,"black":385},{"r":94672,"g":77691,"b":74737,"black":486},{"r":64207,"g":64207,"b":64207,"black":374},{"r":100509,"g":46881,"b":16695,"black":375},{"r":161244,"g":158234,"b":157709,"black":447},{"r":102678,"g":112802,"b":19610,"black":524},{"r":146332,"g":81296,"b":43624,"black":623},{"r":127678,"g":126388,"b":122978,"black":466},{"r":139747,"g":127656,"b":115683,"black":506},{"r":145302,"g":119257,"b":63717,"black":531},{"r":133765,"g":86549,"b":78364,"black":374},{"r":148451,"g":126905,"b":123124,"black":464},{"r":78027,"g":48451,"b":25282,"black":404},{"r":142224,"g":145997,"b":23835,"black":459},{"r":116380,"g":92242,"b":74559,"black":343},{"r":72434,"g":96898,"b":17466,"black":483},{"r":150443,"g":81642,"b":42570,"black":506},{"r":151165,"g":117076,"b":33306,"black":493},{"r":103927,"g":76615,"b":7321,"black":404},{"r":152432,"g":119754,"b":37359,"black":572},{"r":90362,"g":89115,"b":89220,"black":459},{"r":90330,"g":36205,"b":4388,"black":472},{"r":110768,"g":120279,"b":46040,"black":366},{"r":207939,"g":122257,"b":159334,"black":394},{"r":112634,"g":99041,"b":83318,"black":479},{"r":27504,"g":143820,"b":23344,"black":450},{"r":89788,"g":36582,"b":10887,"black":300},{"r":91676,"g":93876,"b":24215,"black":464},{"r":228319,"g":132365,"b":158055,"black":362},{"r":148578,"g":35596,"b":17687,"black":414},{"r":51773,"g":88280,"b":29230,"black":398},{"r":174669,"g":73760,"b":9491,"black":338},{"r":36082,"g":86351,"b":6089,"black":544},{"r":51466,"g":75523,"b":14587,"black":638},{"r":199480,"g":105948,"b":101071,"black":352},{"r":92592,"g":119809,"b":6125,"black":348},{"r":60434,"g":70754,"b":20500,"black":417},{"r":17840,"g":82162,"b":8482,"black":335},{"r":20010,"g":119939,"b":11003,"black":316},{"r":238265,"g":109057,"b":35714,"black":304},{"r":84216,"g":82392,"b":11541,"black":386},{"r":97846,"g":111675,"b":76727,"black":491},{"r":71004,"g":187318,"b":220734,"black":292},{"r":177034,"g":143904,"b":0,"black":517},{"r":244282,"g":188065,"b":49348,"black":397},{"r":104047,"g":104047,"b":104047,"black":395},{"r":109601,"g":109601,"b":109601,"black":310},{"r":139865,"g":128873,"b":101744,"black":311},{"r":187080,"g":157293,"b":83336,"black":310},{"r":237742,"g":187681,"b":63769,"black":311},{"r":267022,"g":204111,"b":49851,"black":310},{"r":240194,"g":189122,"b":63230,"black":311},{"r":193319,"g":160994,"b":81827,"black":311},{"r":142304,"g":130322,"b":101273,"black":312},{"r":141115,"g":109205,"b":29866,"black":395},{"r":141235,"g":109280,"b":29859,"black":387},{"r":127412,"g":98433,"b":26527,"black":329},{"r":8288,"g":139563,"b":120925,"black":292},{"r":6046,"g":131630,"b":141635,"black":292},{"r":7139,"g":135542,"b":131607,"black":292},{"r":162794,"g":69891,"b":48710,"black":370},{"r":61250,"g":151416,"b":238774,"black":384},{"r":26392,"g":61782,"b":81159,"black":312},{"r":108258,"g":84909,"b":25898,"black":345},{"r":144179,"g":137800,"b":114484,"black":340},{"r":84157,"g":66005,"b":20132,"black":322},{"r":44282,"g":46571,"b":73556,"black":474},{"r":114199,"g":101901,"b":101181,"black":368},{"r":50266,"g":114881,"b":164061,"black":319},{"r":117859,"g":201227,"b":243993,"black":525},{"r":148520,"g":96405,"b":65250,"black":308},{"r":93791,"g":176466,"b":197049,"black":457},{"r":86866,"g":106685,"b":5368,"black":422},{"r":179861,"g":44978,"b":20923,"black":306},{"r":119440,"g":92849,"b":108808,"black":508},{"r":220967,"g":83988,"b":48086,"black":482},{"r":58692,"g":55845,"b":49401,"black":263},{"r":84361,"g":86405,"b":87044,"black":693},{"r":54637,"g":40803,"b":53010,"black":920},{"r":44981,"g":42653,"b":2561,"black":914},{"r":54557,"g":80560,"b":87039,"black":290},{"r":114380,"g":109505,"b":30760,"black":470},{"r":177681,"g":87243,"b":11132,"black":563},{"r":160712,"g":151895,"b":150199,"black":463},{"r":241174,"g":178918,"b":140425,"black":401},{"r":34620,"g":88468,"b":9554,"black":335},{"r":231338,"g":138979,"b":5543,"black":323},{"r":32392,"g":53804,"b":14897,"black":352},{"r":84068,"g":68884,"b":32120,"black":574},{"r":96169,"g":83971,"b":45217,"black":686},{"r":86780,"g":29123,"b":18084,"black":327},{"r":103619,"g":89583,"b":90765,"black":496},{"r":130682,"g":105930,"b":173638,"black":333},{"r":81632,"g":80613,"b":80417,"black":430},{"r":93202,"g":91657,"b":91360,"black":370},{"r":145102,"g":144374,"b":144234,"black":308},{"r":75004,"g":70902,"b":71246,"black":441},{"r":188822,"g":188822,"b":188822,"black":312},{"r":204328,"g":175948,"b":0,"black":312},{"r":188264,"g":169600,"b":57494,"black":422},{"r":214057,"g":201673,"b":206647,"black":399},{"r":79371,"g":79371,"b":79371,"black":292},{"r":20376,"g":74598,"b":90166,"black":309},{"r":73036,"g":10136,"b":9371,"black":339},{"r":167402,"g":173980,"b":107911,"black":357},{"r":257145,"g":260007,"b":243046,"black":379},{"r":102822,"g":102505,"b":97081,"black":448},{"r":129121,"g":125020,"b":124231,"black":438},{"r":173219,"g":172035,"b":171339,"black":418},{"r":77176,"g":101781,"b":107435,"black":504},{"r":69863,"g":74349,"b":75379,"black":309},{"r":71245,"g":71245,"b":71245,"black":243},{"r":222613,"g":154396,"b":141275,"black":433},{"r":185702,"g":143115,"b":39377,"black":303},{"r":207614,"g":139397,"b":126276,"black":498},{"r":125540,"g":94660,"b":97235,"black":307},{"r":116071,"g":106969,"b":107735,"black":311},{"r":149036,"g":105209,"b":69323,"black":336},{"r":149551,"g":105130,"b":68931,"black":336},{"r":214425,"g":170265,"b":161772,"black":412},{"r":146815,"g":144500,"b":144054,"black":295},{"r":159726,"g":128767,"b":51442,"black":576},{"r":162559,"g":131600,"b":54275,"black":557},{"r":171976,"g":141301,"b":79498,"black":568},{"r":208910,"g":161310,"b":47284,"black":556},{"r":113308,"g":78203,"b":0,"black":362},{"r":84666,"g":104552,"b":118182,"black":340},{"r":136655,"g":116299,"b":69526,"black":276},{"r":47041,"g":44826,"b":41511,"black":255},{"r":65135,"g":61556,"b":0,"black":694},{"r":53227,"g":50304,"b":0,"black":603},{"r":23006,"g":23006,"b":23006,"black":355},{"r":47289,"g":149949,"b":41547,"black":292},{"r":87898,"g":107875,"b":121444,"black":306},{"r":122090,"g":122090,"b":122090,"black":408},{"r":136329,"g":132019,"b":123828,"black":459},{"r":54426,"g":80796,"b":88365,"black":720},{"r":159441,"g":159441,"b":159441,"black":368},{"r":58386,"g":58386,"b":58386,"black":340},{"r":135407,"g":135407,"b":135407,"black":417},{"r":57993,"g":46675,"b":21056,"black":357},{"r":118759,"g":85225,"b":59483,"black":327},{"r":66146,"g":61281,"b":50931,"black":380},{"r":53082,"g":45990,"b":45044,"black":337},{"r":73241,"g":88187,"b":8247,"black":418},{"r":64776,"g":59901,"b":56416,"black":308},{"r":182854,"g":90346,"b":37431,"black":315},{"r":91383,"g":62452,"b":64885,"black":358},{"r":172773,"g":137183,"b":3277,"black":314},{"r":207394,"g":179713,"b":159785,"black":335},{"r":181065,"g":188406,"b":149154,"black":335},{"r":186951,"g":180269,"b":212547,"black":335},{"r":191426,"g":208872,"b":192635,"black":335},{"r":187638,"g":140959,"b":33220,"black":345},{"r":139500,"g":143578,"b":108434,"black":358},{"r":28549,"g":74143,"b":87942,"black":356},{"r":209302,"g":198995,"b":197012,"black":330},{"r":87517,"g":101762,"b":121838,"black":309},{"r":85858,"g":101507,"b":121396,"black":336},{"r":217720,"g":202954,"b":204196,"black":390},{"r":209467,"g":223003,"b":226891,"black":474},{"r":116209,"g":81979,"b":25247,"black":590},{"r":167024,"g":157882,"b":155247,"black":423},{"r":166377,"g":155354,"b":152354,"black":417},{"r":147601,"g":138459,"b":135824,"black":423},{"r":131806,"g":120783,"b":117783,"black":417},{"r":41915,"g":151677,"b":237698,"black":391},{"r":253277,"g":204602,"b":166100,"black":372},{"r":245593,"g":239300,"b":225510,"black":376},{"r":233300,"g":233300,"b":233300,"black":337},{"r":238114,"g":238114,"b":238114,"black":367},{"r":238601,"g":225583,"b":233612,"black":379},{"r":215682,"g":239382,"b":227168,"black":404},{"r":274177,"g":250518,"b":245968,"black":404},{"r":241576,"g":257896,"b":270816,"black":404},{"r":224111,"g":191080,"b":168416,"black":371},{"r":211933,"g":199386,"b":186859,"black":316},{"r":278103,"g":225384,"b":215246,"black":375},{"r":274035,"g":225987,"b":216747,"black":375},{"r":166208,"g":169088,"b":170744,"black":315},{"r":176347,"g":147410,"b":78687,"black":336},{"r":181445,"g":143227,"b":67391,"black":317},{"r":92649,"g":29616,"b":13990,"black":326},{"r":31198,"g":31198,"b":31198,"black":442},{"r":68938,"g":50401,"b":1410,"black":295},{"r":114159,"g":83359,"b":1960,"black":414},{"r":235888,"g":45789,"b":61663,"black":357},{"r":49343,"g":201075,"b":41843,"black":357},{"r":73418,"g":160507,"b":228009,"black":357},{"r":252074,"g":118784,"b":41841,"black":357},{"r":170114,"g":170114,"b":170114,"black":350},{"r":252797,"g":221409,"b":188963,"black":357},{"r":270607,"g":201153,"b":22912,"black":351},{"r":165954,"g":166510,"b":129657,"black":394},{"r":218446,"g":232962,"b":244205,"black":355},{"r":109405,"g":105299,"b":104686,"black":352},{"r":192923,"g":94102,"b":75097,"black":304},{"r":97560,"g":99366,"b":99660,"black":488},{"r":60994,"g":61528,"b":61615,"black":625},{"r":264347,"g":279191,"b":283454,"black":390},{"r":221668,"g":168065,"b":14602,"black":328},{"r":95740,"g":95740,"b":95740,"black":424},{"r":69504,"g":69504,"b":69504,"black":291},{"r":77489,"g":77489,"b":77489,"black":534},{"r":18163,"g":56634,"b":67682,"black":879},{"r":64445,"g":50988,"b":108146,"black":533},{"r":89664,"g":72744,"b":145843,"black":663},{"r":208726,"g":208726,"b":208726,"black":643},{"r":85678,"g":39970,"b":15990,"black":307},{"r":90365,"g":65192,"b":10277,"black":438},{"r":92862,"g":67732,"b":10838,"black":372},{"r":76877,"g":49755,"b":39859,"black":343},{"r":80634,"g":76829,"b":147504,"black":719},{"r":38285,"g":38660,"b":37264,"black":313},{"r":221636,"g":215801,"b":214099,"black":299},{"r":171148,"g":110920,"b":99340,"black":295},{"r":231633,"g":205311,"b":207525,"black":295},{"r":173349,"g":170665,"b":170880,"black":273},{"r":222812,"g":139312,"b":127815,"black":343},{"r":151033,"g":116134,"b":92112,"black":314},{"r":238527,"g":75698,"b":17682,"black":310},{"r":177885,"g":177885,"b":177885,"black":310},{"r":182594,"g":155350,"b":157644,"black":270},{"r":91626,"g":98959,"b":125069,"black":362},{"r":106065,"g":106065,"b":106065,"black":310},{"r":228961,"g":120833,"b":60648,"black":306},{"r":153127,"g":142794,"b":140807,"black":456},{"r":58164,"g":114971,"b":12965,"black":361},{"r":88292,"g":162297,"b":72823,"black":499},{"r":82467,"g":79414,"b":69845,"black":575},{"r":97460,"g":97460,"b":97460,"black":395},{"r":111501,"g":81187,"b":50957,"black":653},{"r":172817,"g":124914,"b":10333,"black":521},{"r":53436,"g":69272,"b":91975,"black":469},{"r":94809,"g":126336,"b":124054,"black":584},{"r":126521,"g":187358,"b":164103,"black":480},{"r":119327,"g":110149,"b":65445,"black":464},{"r":67245,"g":76332,"b":78113,"black":567},{"r":144775,"g":169154,"b":183766,"black":358},{"r":212430,"g":211838,"b":131654,"black":319},{"r":168435,"g":151394,"b":140943,"black":354},{"r":88725,"g":99740,"b":97754,"black":229},{"r":210370,"g":190187,"b":141776,"black":327},{"r":219060,"g":190048,"b":125141,"black":340},{"r":132767,"g":136190,"b":103654,"black":351},{"r":135750,"g":116003,"b":66598,"black":389},{"r":98778,"g":50892,"b":71463,"black":297},{"r":64635,"g":70098,"b":73239,"black":469},{"r":126540,"g":81411,"b":30078,"black":328},{"r":179055,"g":124111,"b":12909,"black":304},{"r":197976,"g":92596,"b":43169,"black":322},{"r":105083,"g":53624,"b":20485,"black":309},{"r":165896,"g":75246,"b":47600,"black":341},{"r":217949,"g":163005,"b":102462,"black":442},{"r":202176,"g":165021,"b":138597,"black":296},{"r":225633,"g":138394,"b":19670,"black":457},{"r":237747,"g":171103,"b":116655,"black":379},{"r":200620,"g":140081,"b":125304,"black":346},{"r":180041,"g":169396,"b":171583,"black":289},{"r":146577,"g":146577,"b":146577,"black":286},{"r":175501,"g":82020,"b":27347,"black":299},{"r":219857,"g":120531,"b":106269,"black":307},{"r":163240,"g":143592,"b":137509,"black":590},{"r":202136,"g":179326,"b":129245,"black":288},{"r":84912,"g":74163,"b":52831,"black":310},{"r":72705,"g":66519,"b":50493,"black":307},{"r":109307,"g":106900,"b":100536,"black":327},{"r":239067,"g":180767,"b":50296,"black":322},{"r":167631,"g":111803,"b":44664,"black":300},{"r":152140,"g":122530,"b":68753,"black":280},{"r":135917,"g":121894,"b":85595,"black":266},{"r":195045,"g":169246,"b":165194,"black":381},{"r":108514,"g":94222,"b":122655,"black":279},{"r":165014,"g":124674,"b":91674,"black":330},{"r":271695,"g":212415,"b":122105,"black":338},{"r":214386,"g":154358,"b":6016,"black":291},{"r":147755,"g":56083,"b":56433,"black":298},{"r":143612,"g":89085,"b":79244,"black":367},{"r":93850,"g":87407,"b":84453,"black":313},{"r":198744,"g":142547,"b":12974,"black":351},{"r":199650,"g":68385,"b":26241,"black":346},{"r":159982,"g":194722,"b":20347,"black":339},{"r":190192,"g":89893,"b":11132,"black":336},{"r":218124,"g":206484,"b":2464,"black":316},{"r":87951,"g":50907,"b":19344,"black":497},{"r":70285,"g":44556,"b":106358,"black":354},{"r":118699,"g":79280,"b":12245,"black":359},{"r":174787,"g":63655,"b":20429,"black":331},{"r":207116,"g":140344,"b":61258,"black":363},{"r":174877,"g":184902,"b":79635,"black":377},{"r":164540,"g":123401,"b":25452,"black":433},{"r":140617,"g":171118,"b":10779,"black":339},{"r":132551,"g":118383,"b":5863,"black":403},{"r":196461,"g":118251,"b":25722,"black":321},{"r":70334,"g":62888,"b":97641,"black":333},{"r":184531,"g":67780,"b":24742,"black":307},{"r":148463,"g":145194,"b":28303,"black":403},{"r":160674,"g":163777,"b":149226,"black":321},{"r":166432,"g":200048,"b":145218,"black":335},{"r":134214,"g":65802,"b":62658,"black":367},{"r":243805,"g":308260,"b":329385,"black":395},{"r":235430,"g":229832,"b":229398,"black":397},{"r":198980,"g":190874,"b":201928,"black":609},{"r":190391,"g":236414,"b":223254,"black":520},{"r":219303,"g":220893,"b":232430,"black":387},{"r":259551,"g":110216,"b":179151,"black":485},{"r":224511,"g":238283,"b":250273,"black":439},{"r":204089,"g":169749,"b":175926,"black":434},{"r":175301,"g":158437,"b":161257,"black":361},{"r":251205,"g":262211,"b":245431,"black":439},{"r":231961,"g":211142,"b":198162,"black":416},{"r":128845,"g":114152,"b":77165,"black":357},{"r":174236,"g":123889,"b":87573,"black":395},{"r":161698,"g":168795,"b":149825,"black":361},{"r":172899,"g":128657,"b":119096,"black":477},{"r":106852,"g":174979,"b":18791,"black":433},{"r":202166,"g":145323,"b":59200,"black":477},{"r":65171,"g":22357,"b":14122,"black":412},{"r":5250,"g":47239,"b":2864,"black":368},{"r":91640,"g":91640,"b":91640,"black":302},{"r":93015,"g":178905,"b":27763,"black":333},{"r":124261,"g":203683,"b":166745,"black":375},{"r":27519,"g":146954,"b":199059,"black":449},{"r":16536,"g":62247,"b":50463,"black":426},{"r":76080,"g":97711,"b":103420,"black":718},{"r":108327,"g":105142,"b":86584,"black":523},{"r":97270,"g":78667,"b":67749,"black":731},{"r":121856,"g":165216,"b":175181,"black":528},{"r":90581,"g":49287,"b":50963,"black":602},{"r":123845,"g":161293,"b":173566,"black":424},{"r":103370,"g":100940,"b":60409,"black":433},{"r":62416,"g":104425,"b":94131,"black":354},{"r":108519,"g":161757,"b":146994,"black":388},{"r":66768,"g":66768,"b":66768,"black":609},{"r":135333,"g":119175,"b":123526,"black":350},{"r":109260,"g":146176,"b":174812,"black":427},{"r":100523,"g":108489,"b":77087,"black":431},{"r":140487,"g":101993,"b":76252,"black":449},{"r":81716,"g":116279,"b":104620,"black":500},{"r":101016,"g":137683,"b":123800,"black":582},{"r":146673,"g":218878,"b":146348,"black":350},{"r":127538,"g":147472,"b":128994,"black":429},{"r":119330,"g":159240,"b":186270,"black":299},{"r":134678,"g":166554,"b":185693,"black":314},{"r":136367,"g":186810,"b":202176,"black":314},{"r":101374,"g":113574,"b":113772,"black":440},{"r":110269,"g":151330,"b":171676,"black":415},{"r":174187,"g":115922,"b":112001,"black":399},{"r":145014,"g":198889,"b":171842,"black":375},{"r":149317,"g":199437,"b":178865,"black":422},{"r":176991,"g":194192,"b":180129,"black":346},{"r":158590,"g":201615,"b":179983,"black":418},{"r":24725,"g":95156,"b":50975,"black":278},{"r":42069,"g":124379,"b":167495,"black":343},{"r":76729,"g":46140,"b":43481,"black":296},{"r":86221,"g":85543,"b":40514,"black":300},{"r":148406,"g":153474,"b":84202,"black":351},{"r":84232,"g":144015,"b":54710,"black":328},{"r":172579,"g":86207,"b":53599,"black":346},{"r":148097,"g":54798,"b":56763,"black":297},{"r":50357,"g":66611,"b":68321,"black":294},{"r":105444,"g":134607,"b":146373,"black":367},{"r":201349,"g":116638,"b":125350,"black":368},{"r":171831,"g":137956,"b":141063,"black":350},{"r":130934,"g":154794,"b":159697,"black":295},{"r":48471,"g":51783,"b":34577,"black":581},{"r":124825,"g":118770,"b":68939,"black":373},{"r":195841,"g":219922,"b":212157,"black":499},{"r":173480,"g":145247,"b":145080,"black":443},{"r":46535,"g":99298,"b":52878,"black":331},{"r":114801,"g":107382,"b":119885,"black":283},{"r":44417,"g":39054,"b":43462,"black":333},{"r":80160,"g":182480,"b":209522,"black":342},{"r":48471,"g":45823,"b":26802,"black":241},{"r":47476,"g":44684,"b":25434,"black":279},{"r":118674,"g":107396,"b":33177,"black":477},{"r":73440,"g":105660,"b":57535,"black":319},{"r":166702,"g":82503,"b":65691,"black":349},{"r":172701,"g":25047,"b":37344,"black":320},{"r":231993,"g":220097,"b":215383,"black":380},{"r":108300,"g":108300,"b":108300,"black":289},{"r":190603,"g":121188,"b":128428,"black":392},{"r":115821,"g":136754,"b":92877,"black":518},{"r":61087,"g":25776,"b":18985,"black":256},{"r":87972,"g":14998,"b":21136,"black":356},{"r":31381,"g":179765,"b":297233,"black":395},{"r":23677,"g":175920,"b":296447,"black":395},{"r":16727,"g":172524,"b":295865,"black":395},{"r":48327,"g":188097,"b":298745,"black":395},{"r":39348,"g":183680,"b":297941,"black":395},{"r":35195,"g":181530,"b":297378,"black":395},{"r":36566,"g":182198,"b":297490,"black":395},{"r":38357,"g":183071,"b":297637,"black":395},{"r":62545,"g":194973,"b":299813,"black":395},{"r":38983,"g":183507,"b":297919,"black":395},{"r":40800,"g":184281,"b":297868,"black":395},{"r":49434,"g":188531,"b":298647,"black":395},{"r":27895,"g":177976,"b":296789,"black":395},{"r":16724,"g":172561,"b":295929,"black":395},{"r":29545,"g":178831,"b":297015,"black":395},{"r":28630,"g":178290,"b":296770,"black":395},{"r":53765,"g":190717,"b":299142,"black":395},{"r":64549,"g":195902,"b":299890,"black":395},{"r":108148,"g":217381,"b":303859,"black":395},{"r":53881,"g":190814,"b":299210,"black":395},{"r":84716,"g":280704,"b":73580,"black":395},{"r":182248,"g":136463,"b":244470,"black":395},{"r":327201,"g":134541,"b":97488,"black":395},{"r":327822,"g":108314,"b":66100,"black":395},{"r":327505,"g":127416,"b":88939,"black":395},{"r":254806,"g":111698,"b":84178,"black":310},{"r":321013,"g":74937,"b":173788,"black":395},{"r":335424,"g":168375,"b":70184,"black":395},{"r":335586,"g":164839,"b":64467,"black":395},{"r":334922,"g":178278,"b":86187,"black":395},{"r":100528,"g":166542,"b":340995,"black":395},{"r":45465,"g":127789,"b":345355,"black":395},{"r":52488,"g":132718,"b":344755,"black":395},{"r":327909,"g":104866,"b":61969,"black":395},{"r":51572,"g":132098,"b":344915,"black":395},{"r":29487,"g":116542,"b":346615,"black":395},{"r":61119,"g":138760,"b":343955,"black":395},{"r":0,"g":0,"b":0,"black":537},{"r":58974,"g":137287,"b":344255,"black":395},{"r":235568,"g":167351,"b":154230,"black":381},{"r":336130,"g":159557,"b":55759,"black":395},{"r":53370,"g":133358,"b":344755,"black":395},{"r":57986,"g":136551,"b":344195,"black":395},{"r":63877,"g":140732,"b":343835,"black":395},{"r":54622,"g":134199,"b":344515,"black":395},{"r":261551,"g":130092,"b":52818,"black":310},{"r":327877,"g":109954,"b":68044,"black":395},{"r":328240,"g":95347,"b":50560,"black":395},{"r":205963,"g":173193,"b":313635,"black":395},{"r":252625,"g":184408,"b":171287,"black":310},{"r":214905,"g":146755,"b":133649,"black":465},{"r":224455,"g":156238,"b":143117,"black":429},{"r":216872,"g":148651,"b":135530,"black":455},{"r":226115,"g":157898,"b":144777,"black":422},{"r":221650,"g":153433,"b":140312,"black":432},{"r":241487,"g":173270,"b":160149,"black":356},{"r":122043,"g":115347,"b":0,"black":381},{"r":255683,"g":88677,"b":56563,"black":310},{"r":69948,"g":277996,"b":58126,"black":395},{"r":55232,"g":275469,"b":42717,"black":395},{"r":250209,"g":106139,"b":123295,"black":399},{"r":335790,"g":165119,"b":64784,"black":395},{"r":37554,"g":82800,"b":95791,"black":386},{"r":34378,"g":64804,"b":73542,"black":497},{"r":0,"g":0,"b":0,"black":528},{"r":0,"g":0,"b":0,"black":515},{"r":327440,"g":125833,"b":87060,"black":395},{"r":0,"g":0,"b":0,"black":505},{"r":5430,"g":88895,"b":108189,"black":397},{"r":54188,"g":133942,"b":344715,"black":395},{"r":205913,"g":173130,"b":313624,"black":395},{"r":204237,"g":170955,"b":313584,"black":395},{"r":206720,"g":174160,"b":313716,"black":395},{"r":210582,"g":179099,"b":314034,"black":395},{"r":206672,"g":174085,"b":313734,"black":395},{"r":212167,"g":181120,"b":314177,"black":395},{"r":210081,"g":178455,"b":313996,"black":395},{"r":206627,"g":174028,"b":313724,"black":395},{"r":201384,"g":167269,"b":313478,"black":395},{"r":206711,"g":174062,"b":313974,"black":395},{"r":205688,"g":172822,"b":313682,"black":395},{"r":202971,"g":169350,"b":313457,"black":395},{"r":205205,"g":172229,"b":313555,"black":395},{"r":220053,"g":191249,"b":314699,"black":395},{"r":138630,"g":134189,"b":139047,"black":319},{"r":61458,"g":235239,"b":51586,"black":404},{"r":6790,"g":61113,"b":3704,"black":360},{"r":52683,"g":63172,"b":46402,"black":609},{"r":33137,"g":180630,"b":297389,"black":395},{"r":43714,"g":185758,"b":298209,"black":395},{"r":49920,"g":188761,"b":298675,"black":395},{"r":43564,"g":185656,"b":298150,"black":395},{"r":56398,"g":192011,"b":299368,"black":395},{"r":103680,"g":25056,"b":9936,"black":366},{"r":125619,"g":30357,"b":12037,"black":498},{"r":41048,"g":9920,"b":3934,"black":254},{"r":61353,"g":14826,"b":5878,"black":346},{"r":41390,"g":41390,"b":41390,"black":254},{"r":61863,"g":61863,"b":61863,"black":346},{"r":36661,"g":182239,"b":297488,"black":395},{"r":235340,"g":230730,"b":231117,"black":316},{"r":231915,"g":227304,"b":227691,"black":332},{"r":232025,"g":227415,"b":227802,"black":330},{"r":232011,"g":227400,"b":227788,"black":332},{"r":231549,"g":226939,"b":227326,"black":332},{"r":232230,"g":227619,"b":228007,"black":332},{"r":232534,"g":227924,"b":228311,"black":332},{"r":231942,"g":227331,"b":227719,"black":332},{"r":232122,"g":227512,"b":227899,"black":332},{"r":232310,"g":227699,"b":228087,"black":331},{"r":231584,"g":226974,"b":227361,"black":332},{"r":234117,"g":229506,"b":229894,"black":324},{"r":231794,"g":227184,"b":227570,"black":332},{"r":231561,"g":226951,"b":227338,"black":332},{"r":231671,"g":227061,"b":227449,"black":332},{"r":232644,"g":228034,"b":228421,"black":332},{"r":231513,"g":226903,"b":227290,"black":332},{"r":231984,"g":227374,"b":227761,"black":329},{"r":234516,"g":229906,"b":230293,"black":323},{"r":232039,"g":227429,"b":227817,"black":332},{"r":232098,"g":227487,"b":227876,"black":332},{"r":232303,"g":227692,"b":228080,"black":332},{"r":231589,"g":226978,"b":227366,"black":332},{"r":232110,"g":227499,"b":227886,"black":332},{"r":60886,"g":60886,"b":60886,"black":395},{"r":34743,"g":34743,"b":34743,"black":198},{"r":52548,"g":52548,"b":52548,"black":343},{"r":237389,"g":181541,"b":170803,"black":361},{"r":109838,"g":26543,"b":10525,"black":786},{"r":224521,"g":224521,"b":224521,"black":310},{"r":74080,"g":74080,"b":74080,"black":674},{"r":0,"g":51495,"b":66286,"black":480},{"r":73140,"g":53060,"b":0,"black":523},{"r":204220,"g":204220,"b":204220,"black":395},{"r":203742,"g":203742,"b":203742,"black":395},{"r":97509,"g":23563,"b":9345,"black":283},{"r":137688,"g":137688,"b":137688,"black":265},{"r":31872,"g":31872,"b":31872,"black":265},{"r":36883,"g":36883,"b":36883,"black":247},{"r":159382,"g":159382,"b":159382,"black":247},{"r":99840,"g":24128,"b":9568,"black":291},{"r":143140,"g":57375,"b":6953,"black":287},{"r":0,"g":108936,"b":140233,"black":287},{"r":84786,"g":33983,"b":4118,"black":227},{"r":0,"g":64535,"b":83071,"black":227}];
      
      let maxr = 0;
      let maxg = 0;
      let maxb = 0;
      let maxblack = 0;
      let minr = Infinity;
      let ming = Infinity;
      let minb = Infinity;
      let minblack = Infinity;
      this.emojiValues = this.emojiList.map( (e, i) => {
        const value = this.getEmojiTotalValue(i);
        maxr = Math.max(value.r, maxr);
        maxg = Math.max(value.g, maxg);
        maxb = Math.max(value.b, maxb);
        maxblack = Math.max(value.black, maxblack);
        minr = Math.min(value.r, minr);
        ming = Math.min(value.g, ming);
        minb = Math.min(value.b, minb);
        minblack = Math.min(value.black, minblack);
        return value;
      });
      /*
      console.log(minr, maxr);
      console.log(ming, maxg);
      console.log(minb, maxb);
      console.log(minblack, maxblack);
      */
    }

    //rgb in [0,350000]
    //black in [0, 1000]

    const gridSize = 32;
    ctx.font = '18px Arial';
    ctx.textAlign = 'center';
    ctx.textAlign = 'middle';
    ctx.fillStyle = 'black';
    const size = 32;
    this.mapLocations = [];
    this.emojiList.forEach( (e, i) => {
      const value = this.emojiValues[i]; 
      const cx = 0;// (this.mousex - width / 2) * size;
      const cy = 0; //(this.mousey - width / 2) * size;
      //const cx = 0;
      //const cy = 0;
      //const hsl = this.rgbToHsl(value.r * 255 / 350000, value.g * 255 / 350000, value.b * 255 / 350000);
      const hsl = this.rgbToHsl(value.r ,value.g, value.b);
      const r = hsl.s / 100; 
      //const r = (value.r + value.g + value.b);// / (350000 * 3);
      const x = cx + (width / 2) + (size * 10) * Math.cos(hsl.h * Math.PI * 2 / 360) * r;
      const y = cy + (width / 2) + (size * 10) * Math.sin(hsl.h * Math.PI * 2 / 360) * r;
      this.mapLocations.push({
        x0: x - 9,
        y0: y - 9,
        x1: x + 9,
        y1: y + 9,
        i
      });
      //const x = 50 + 400 * value.b / 350000;
      //const y = 50 + 400 * value.g / 350000;
      //const y = 50 + 400 * value.black / 1000;
      ctx.fillText(this.emojiList[i], x, y);
    });

    ctx.fillStyle = 'rgba(38,38,38,0.2)';
    ctx.beginPath();
    ctx.arc(this.mousex, this.mousey, this.cursorSize, 0, Math.PI * 2);
    ctx.fill();

  }
  
  draw() {
    const ctx = this.ctx;
   
    //this.drawEmojiGrid();
    //this.drawEmojiRank(this.mapCtx);
    //window.requestAnimationFrame( d => this.draw(d) );
    //return;
   
    //ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.drawImage(this.bgCanvas, 0, 0);
    
    ctx.fillStyle = 'black';
    const scoreX = 0;
    const scoreY = 618;
    //ctx.fillText(this.score.toFixed(0), 68, 25);
    ctx.fillText(this.black, scoreX + 30, scoreY + 20);
    ctx.fillText(Math.floor(this.r), scoreX + 30, scoreY + 35);
    ctx.fillText(Math.floor(this.g), scoreX + 30, scoreY + 50);
    ctx.fillText(Math.floor(this.b), scoreX + 30, scoreY + 65);

    const shadowOffset = 4;
    const shadowColor = 'rgba(40,40,40,0.4)';

       
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
        }
        ctx.fillRect(b.x, b.y, this.blockSize, this.blockSize);
      }
    });
    
    //cursor
    ctx.fillStyle = 'rgba(38,38,38,0.2)';
    ctx.beginPath();
    ctx.arc(this.mousex, this.mousey, this.cursorSize, 0, Math.PI * 2);
    ctx.fill();
    
    //setTimeout(() => window.requestAnimationFrame( d => this.draw(d) ), 1000/60);
    window.requestAnimationFrame( d => this.draw(d) );
  }
  
  onmousemove(e) {    
    this.canvasClientRect = this.canvas.getBoundingClientRect();    
    this.mousex = e.clientX - this.canvasClientRect.left;
    this.mousey = e.clientY - this.canvasClientRect.top;    
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

    e.clientX = e.targetTouches[0].clientX;
    e.clientY = e.targetTouches[0].clientY - 75;
    this.onmousemove(e);
    e.preventDefault();
    return false;
  }

  onMapClick(e) {
    const canvasClientRect = this.mapCanvas.getBoundingClientRect();
    const x = e.clientX - canvasClientRect.left;
    const y = e.clientY - canvasClientRect.top;

    for (let i = this.mapLocations.length - 1; i >= 0; i--) {
      const box = this.mapLocations[i];
      if (x >= box.x0 && x <= box.x1 && y >= box.y0 && y <= box.y1) {
        this.init(i);
        break;
      }
    }

  }
}

const app = new App();
