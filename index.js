"use strict";

/*

TODO:
highlight light cells if time is long
make acid effect by shrinking blocks instead of letting them rotate and drop
do something to make sure that the emoji exist. either pull from a pre-made image (could use other icons)
  or compare to what is drawn for \uffff
remove all the plain black emoji
try a border around the canvas...not sure what color
maybe make a funnel at the bottom to allow blocks to go in to be removed?
create background and frame offscreen and copy in instead of drawing every frame

*/

class App {
  constructor() {
    this.canvas = document.getElementById('cmain');
    this.ctx = this.canvas.getContext('2d');
    this.mousex = -Infinity;
    this.mousey = -Infinity;
    this.canvas.onmousemove = (e) => this.onmousemove(e);
    this.cursorSize = 25;
    this.score = 0;
    this.blockSize = 8;
    this.toolStrength = 10;
    this.maxStr = 100;
    this.canvasClientRect = this.canvas.getBoundingClientRect();    
    
    this.init();
    
    setInterval(() => this.update(), 1000 / 60);
    window.requestAnimationFrame( d => this.draw(d) );
    
  }
  
  //from https://gist.github.com/vahidk/05184faf3d92a0aa1b46aeaa93b07786
  //s and l from 0 to 1
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
    return{h: h * 60, s, l};
  }
  
  init() {
  
    this.blocks = [];
    this.blockLookup = {};
    this.gridLookup = {};
  
    const ctx = this.ctx;
    
    const emojiList = ["\ud83d\ude04","\ud83d\ude03","\ud83d\ude00","\ud83d\ude0a","\u263a","\ud83d\ude09","\ud83d\ude0d","\ud83d\ude18","\ud83d\ude1a","\ud83d\ude17","\ud83d\ude19","\ud83d\ude1c","\ud83d\ude1d","\ud83d\ude1b","\ud83d\ude33","\ud83d\ude01","\ud83d\ude14","\ud83d\ude0c","\ud83d\ude12","\ud83d\ude1e","\ud83d\ude23","\ud83d\ude22","\ud83d\ude02","\ud83d\ude2d","\ud83d\ude2a","\ud83d\ude25","\ud83d\ude30","\ud83d\ude05","\ud83d\ude13","\ud83d\ude29","\ud83d\ude2b","\ud83d\ude28","\ud83d\ude31","\ud83d\ude20","\ud83d\ude21","\ud83d\ude24","\ud83d\ude16","\ud83d\ude06","\ud83d\ude0b","\ud83d\ude37","\ud83d\ude0e","\ud83d\ude34","\ud83d\ude35","\ud83d\ude32","\ud83d\ude1f","\ud83d\ude26","\ud83d\ude27","\ud83d\ude08","\ud83d\udc7f","\ud83d\ude2e","\ud83d\ude2c","\ud83d\ude10","\ud83d\ude15","\ud83d\ude2f","\ud83d\ude36","\ud83d\ude07","\ud83d\ude0f","\ud83d\ude11","\ud83d\udc72","\ud83d\udc73","\ud83d\udc6e","\ud83d\udc77","\ud83d\udc82","\ud83d\udc76","\ud83d\udc66","\ud83d\udc67","\ud83d\udc68","\ud83d\udc69","\ud83d\udc74","\ud83d\udc75","\ud83d\udc71","\ud83d\udc7c","\ud83d\udc78","\ud83d\ude3a","\ud83d\ude38","\ud83d\ude3b","\ud83d\ude3d","\ud83d\ude3c","\ud83d\ude40","\ud83d\ude3f","\ud83d\ude39","\ud83d\ude3e","\ud83d\udc79","\ud83d\udc7a","\ud83d\ude48","\ud83d\ude49","\ud83d\ude4a","\ud83d\udc80","\ud83d\udc7d","\ud83d\udca9","\ud83d\udd25","\u2728","\ud83c\udf1f","\ud83d\udcab","\ud83d\udca5","\ud83d\udca2","\ud83d\udca6","\ud83d\udca7","\ud83d\udca4","\ud83d\udca8","\ud83d\udc42","\ud83d\udc40","\ud83d\udc43","\ud83d\udc45","\ud83d\udc44","\ud83d\udc4d","\ud83d\udc4e","\ud83d\udc4c","\ud83d\udc4a","\u270a","\u270c","\ud83d\udc4b","\u270b","\ud83d\udc50","\ud83d\udc46","\ud83d\udc47","\ud83d\udc49","\ud83d\udc48","\ud83d\ude4c","\ud83d\ude4f","\u261d","\ud83d\udc4f","\ud83d\udcaa","\ud83d\udeb6","\ud83c\udfc3","\ud83d\udc83","\ud83d\udc6b","\ud83d\udc6a","\ud83d\udc6c","\ud83d\udc6d","\ud83d\udc8f","\ud83d\udc91","\ud83d\udc6f","\ud83d\ude46","\ud83d\ude45","\ud83d\udc81","\ud83d\ude4b","\ud83d\udc86","\ud83d\udc87","\ud83d\udc85","\ud83d\udc70","\ud83d\ude4e","\ud83d\ude4d","\ud83d\ude47","\ud83c\udfa9","\ud83d\udc51","\ud83d\udc52","\ud83d\udc5f","\ud83d\udc5e","\ud83d\udc61","\ud83d\udc60","\ud83d\udc62","\ud83d\udc55","\ud83d\udc54","\ud83d\udc5a","\ud83d\udc57","\ud83c\udfbd","\ud83d\udc56","\ud83d\udc58","\ud83d\udc59","\ud83d\udcbc","\ud83d\udc5c","\ud83d\udc5d","\ud83d\udc5b","\ud83d\udc53","\ud83c\udf80","\ud83c\udf02","\ud83d\udc84","\ud83d\udc9b","\ud83d\udc99","\ud83d\udc9c","\ud83d\udc9a","\u2764","\ud83d\udc94","\ud83d\udc97","\ud83d\udc93","\ud83d\udc95","\ud83d\udc96","\ud83d\udc9e","\ud83d\udc98","\ud83d\udc8c","\ud83d\udc8b","\ud83d\udc8d","\ud83d\udc8e","\ud83d\udc64","\ud83d\udc65","\ud83d\udcac","\ud83d\udc63","\ud83d\udcad","\ud83d\udc36","\ud83d\udc3a","\ud83d\udc31","\ud83d\udc2d","\ud83d\udc39","\ud83d\udc30","\ud83d\udc38","\ud83d\udc2f","\ud83d\udc28","\ud83d\udc3b","\ud83d\udc37","\ud83d\udc3d","\ud83d\udc2e","\ud83d\udc17","\ud83d\udc35","\ud83d\udc12","\ud83d\udc34","\ud83d\udc11","\ud83d\udc18","\ud83d\udc3c","\ud83d\udc27","\ud83d\udc26","\ud83d\udc24","\ud83d\udc25","\ud83d\udc23","\ud83d\udc14","\ud83d\udc0d","\ud83d\udc22","\ud83d\udc1b","\ud83d\udc1d","\ud83d\udc1c","\ud83d\udc1e","\ud83d\udc0c","\ud83d\udc19","\ud83d\udc1a","\ud83d\udc20","\ud83d\udc1f","\ud83d\udc2c","\ud83d\udc33","\ud83d\udc0b","\ud83d\udc04","\ud83d\udc0f","\ud83d\udc00","\ud83d\udc03","\ud83d\udc05","\ud83d\udc07","\ud83d\udc09","\ud83d\udc0e","\ud83d\udc10","\ud83d\udc13","\ud83d\udc15","\ud83d\udc16","\ud83d\udc01","\ud83d\udc02","\ud83d\udc32","\ud83d\udc21","\ud83d\udc0a","\ud83d\udc2b","\ud83d\udc2a","\ud83d\udc06","\ud83d\udc08","\ud83d\udc29","\ud83d\udc3e","\ud83d\udc90","\ud83c\udf38","\ud83c\udf37","\ud83c\udf40","\ud83c\udf39","\ud83c\udf3b","\ud83c\udf3a","\ud83c\udf41","\ud83c\udf43","\ud83c\udf42","\ud83c\udf3f","\ud83c\udf3e","\ud83c\udf44","\ud83c\udf35","\ud83c\udf34","\ud83c\udf32","\ud83c\udf33","\ud83c\udf30","\ud83c\udf31","\ud83c\udf3c","\ud83c\udf10","\ud83c\udf1e","\ud83c\udf1d","\ud83c\udf1a","\ud83c\udf11","\ud83c\udf12","\ud83c\udf13","\ud83c\udf14","\ud83c\udf15","\ud83c\udf16","\ud83c\udf17","\ud83c\udf18","\ud83c\udf1c","\ud83c\udf1b","\ud83c\udf19","\ud83c\udf0d","\ud83c\udf0e","\ud83c\udf0f","\ud83c\udf0b","\ud83c\udf0c","\ud83c\udf20","\u2b50","\u2600","\u26c5","\u2601","\u26a1","\u2614","\u2744","\u26c4","\ud83c\udf00","\ud83c\udf01","\ud83c\udf08","\ud83c\udf0a","\ud83c\udf8d","\ud83d\udc9d","\ud83c\udf8e","\ud83c\udf92","\ud83c\udf93","\ud83c\udf8f","\ud83c\udf86","\ud83c\udf87","\ud83c\udf90","\ud83c\udf91","\ud83c\udf83","\ud83d\udc7b","\ud83c\udf85","\ud83c\udf84","\ud83c\udf81","\ud83c\udf8b","\ud83c\udf89","\ud83c\udf8a","\ud83c\udf88","\ud83c\udf8c","\ud83d\udd2e","\ud83c\udfa5","\ud83d\udcf7","\ud83d\udcf9","\ud83d\udcfc","\ud83d\udcbf","\ud83d\udcc0","\ud83d\udcbd","\ud83d\udcbe","\ud83d\udcbb","\ud83d\udcf1","\u260e","\ud83d\udcde","\ud83d\udcdf","\ud83d\udce0","\ud83d\udce1","\ud83d\udcfa","\ud83d\udcfb","\ud83d\udd0a","\ud83d\udd09","\ud83d\udd08","\ud83d\udd07","\ud83d\udd14","\ud83d\udd15","\ud83d\udce2","\ud83d\udce3","\u23f3","\u231b","\u23f0","\u231a","\ud83d\udd13","\ud83d\udd12","\ud83d\udd0f","\ud83d\udd10","\ud83d\udd11","\ud83d\udd0e","\ud83d\udca1","\ud83d\udd26","\ud83d\udd06","\ud83d\udd05","\ud83d\udd0c","\ud83d\udd0b","\ud83d\udd0d","\ud83d\udec1","\ud83d\udec0","\ud83d\udebf","\ud83d\udebd","\ud83d\udd27","\ud83d\udd29","\ud83d\udd28","\ud83d\udeaa","\ud83d\udeac","\ud83d\udca3","\ud83d\udd2b","\ud83d\udd2a","\ud83d\udc8a","\ud83d\udc89","\ud83d\udcb0","\ud83d\udcb4","\ud83d\udcb5","\ud83d\udcb7","\ud83d\udcb6","\ud83d\udcb3","\ud83d\udcb8","\ud83d\udcf2","\ud83d\udce7","\ud83d\udce5","\ud83d\udce4","\u2709","\ud83d\udce9","\ud83d\udce8","\ud83d\udcef","\ud83d\udceb","\ud83d\udcea","\ud83d\udcec","\ud83d\udced","\ud83d\udcee","\ud83d\udce6","\ud83d\udcdd","\ud83d\udcc4","\ud83d\udcc3","\ud83d\udcd1","\ud83d\udcca","\ud83d\udcc8","\ud83d\udcc9","\ud83d\udcdc","\ud83d\udccb","\ud83d\udcc5","\ud83d\udcc6","\ud83d\udcc7","\ud83d\udcc1","\ud83d\udcc2","\u2702","\ud83d\udccc","\ud83d\udcce","\u2712","\u270f","\ud83d\udccf","\ud83d\udcd0","\ud83d\udcd5","\ud83d\udcd7","\ud83d\udcd8","\ud83d\udcd9","\ud83d\udcd3","\ud83d\udcd4","\ud83d\udcd2","\ud83d\udcda","\ud83d\udcd6","\ud83d\udd16","\ud83d\udcdb","\ud83d\udd2c","\ud83d\udd2d","\ud83d\udcf0","\ud83c\udfa8","\ud83c\udfac","\ud83c\udfa4","\ud83c\udfa7","\ud83c\udfbc","\ud83c\udfb5","\ud83c\udfb6","\ud83c\udfb9","\ud83c\udfbb","\ud83c\udfba","\ud83c\udfb7","\ud83c\udfb8","\ud83d\udc7e","\ud83c\udfae","\ud83c\udccf","\ud83c\udfb4","\ud83c\udc04","\ud83c\udfb2","\ud83c\udfaf","\ud83c\udfc8","\ud83c\udfc0","\u26bd","\u26be","\ud83c\udfbe","\ud83c\udfb1","\ud83c\udfc9","\ud83c\udfb3","\u26f3","\ud83d\udeb5","\ud83d\udeb4","\ud83c\udfc1","\ud83c\udfc7","\ud83c\udfc6","\ud83c\udfbf","\ud83c\udfc2","\ud83c\udfca","\ud83c\udfc4","\ud83c\udfa3","\u2615","\ud83c\udf75","\ud83c\udf76","\ud83c\udf7c","\ud83c\udf7a","\ud83c\udf7b","\ud83c\udf78","\ud83c\udf79","\ud83c\udf77","\ud83c\udf74","\ud83c\udf55","\ud83c\udf54","\ud83c\udf5f","\ud83c\udf57","\ud83c\udf56","\ud83c\udf5d","\ud83c\udf5b","\ud83c\udf64","\ud83c\udf71","\ud83c\udf63","\ud83c\udf65","\ud83c\udf59","\ud83c\udf58","\ud83c\udf5a","\ud83c\udf5c","\ud83c\udf72","\ud83c\udf62","\ud83c\udf61","\ud83c\udf73","\ud83c\udf5e","\ud83c\udf69","\ud83c\udf6e","\ud83c\udf66","\ud83c\udf68","\ud83c\udf67","\ud83c\udf82","\ud83c\udf70","\ud83c\udf6a","\ud83c\udf6b","\ud83c\udf6c","\ud83c\udf6d","\ud83c\udf6f","\ud83c\udf4e","\ud83c\udf4f","\ud83c\udf4a","\ud83c\udf4b","\ud83c\udf52","\ud83c\udf47","\ud83c\udf49","\ud83c\udf53","\ud83c\udf51","\ud83c\udf48","\ud83c\udf4c","\ud83c\udf50","\ud83c\udf4d","\ud83c\udf60","\ud83c\udf46","\ud83c\udf45","\ud83c\udf3d","\ud83c\udfe0","\ud83c\udfe1","\ud83c\udfeb","\ud83c\udfe2","\ud83c\udfe3","\ud83c\udfe5","\ud83c\udfe6","\ud83c\udfea","\ud83c\udfe9","\ud83c\udfe8","\ud83d\udc92","\u26ea","\ud83c\udfec","\ud83c\udfe4","\ud83c\udf07","\ud83c\udf06","\ud83c\udfef","\ud83c\udff0","\u26fa","\ud83c\udfed","\ud83d\uddfc","\ud83d\uddfe","\ud83d\uddfb","\ud83c\udf04","\ud83c\udf05","\ud83c\udf03","\ud83d\uddfd","\ud83c\udf09","\ud83c\udfa0","\ud83c\udfa1","\u26f2","\ud83c\udfa2","\ud83d\udea2","\u26f5","\ud83d\udea4","\ud83d\udea3","\u2693","\ud83d\ude80","\u2708","\ud83d\udcba","\ud83d\ude81","\ud83d\ude82","\ud83d\ude8a","\ud83d\ude89","\ud83d\ude9e","\ud83d\ude86","\ud83d\ude84","\ud83d\ude85","\ud83d\ude88","\ud83d\ude87","\ud83d\ude9d","\ud83d\ude8b","\ud83d\ude83","\ud83d\ude8e","\ud83d\ude8c","\ud83d\ude8d","\ud83d\ude99","\ud83d\ude98","\ud83d\ude97","\ud83d\ude95","\ud83d\ude96","\ud83d\ude9b","\ud83d\ude9a","\ud83d\udea8","\ud83d\ude93","\ud83d\ude94","\ud83d\ude92","\ud83d\ude91","\ud83d\ude90","\ud83d\udeb2","\ud83d\udea1","\ud83d\ude9f","\ud83d\udea0","\ud83d\ude9c","\ud83d\udc88","\ud83d\ude8f","\ud83c\udfab","\ud83d\udea6","\ud83d\udea5","\u26a0","\ud83d\udea7","\ud83d\udd30","\u26fd","\ud83c\udfee","\ud83c\udfb0","\u2668","\ud83d\uddff","\ud83c\udfaa","\ud83c\udfad","\ud83d\udccd","\ud83d\udea9","\u2b06","\u2b07","\u2b05","\u27a1","\ud83d\udd20","\ud83d\udd21","\ud83d\udd24","\u2197","\u2196","\u2198","\u2199","\u2194","\u2195","\ud83d\udd04","\u25c0","\u25b6","\ud83d\udd3c","\ud83d\udd3d","\u21a9","\u21aa","\u2139","\u23ea","\u23e9","\u23eb","\u23ec","\u2935","\u2934","\ud83c\udd97","\ud83d\udd00","\ud83d\udd01","\ud83d\udd02","\ud83c\udd95","\ud83c\udd99","\ud83c\udd92","\ud83c\udd93","\ud83c\udd96","\ud83d\udcf6","\ud83c\udfa6","\ud83c\ude01","\ud83c\ude2f","\ud83c\ude33","\ud83c\ude35","\ud83c\ude34","\ud83c\ude32","\ud83c\ude50","\ud83c\ude39","\ud83c\ude3a","\ud83c\ude36","\ud83c\ude1a","\ud83d\udebb","\ud83d\udeb9","\ud83d\udeba","\ud83d\udebc","\ud83d\udebe","\ud83d\udeb0","\ud83d\udeae","\ud83c\udd7f","\u267f","\ud83d\udead","\ud83c\ude37","\ud83c\ude38","\ud83c\ude02","\u24c2","\ud83d\udec2","\ud83d\udec4","\ud83d\udec5","\ud83d\udec3","\ud83c\ude51","\u3299","\u3297","\ud83c\udd91","\ud83c\udd98","\ud83c\udd94","\ud83d\udeab","\ud83d\udd1e","\ud83d\udcf5","\ud83d\udeaf","\ud83d\udeb1","\ud83d\udeb3","\ud83d\udeb7","\ud83d\udeb8","\u26d4","\u2733","\u2747","\u274e","\u2705","\u2734","\ud83d\udc9f","\ud83c\udd9a","\ud83d\udcf3","\ud83d\udcf4","\ud83c\udd70","\ud83c\udd71","\ud83c\udd8e","\ud83c\udd7e","\ud83d\udca0","\u27bf","\u267b","\u2648","\u2649","\u264a","\u264b","\u264c","\u264d","\u264e","\u264f","\u2650","\u2651","\u2652","\u2653","\u26ce","\ud83d\udd2f","\ud83c\udfe7","\ud83d\udcb9","\ud83d\udcb2","\ud83d\udcb1","\u00a9","\u00ae","\u2122","\u303d","\u3030","\ud83d\udd1d","\ud83d\udd1a","\ud83d\udd19","\ud83d\udd1b","\ud83d\udd1c","\u274c","\u2b55","\u2757","\u2753","\u2755","\u2754","\ud83d\udd03","\ud83d\udd5b","\ud83d\udd67","\ud83d\udd50","\ud83d\udd5c","\ud83d\udd51","\ud83d\udd5d","\ud83d\udd52","\ud83d\udd5e","\ud83d\udd53","\ud83d\udd5f","\ud83d\udd54","\ud83d\udd60","\ud83d\udd55","\ud83d\udd56","\ud83d\udd57","\ud83d\udd58","\ud83d\udd59","\ud83d\udd5a","\ud83d\udd61","\ud83d\udd62","\ud83d\udd63","\ud83d\udd64","\ud83d\udd65","\ud83d\udd66","\u2716","\u2795","\u2796","\u2797","\u2660","\u2665","\u2663","\u2666","\ud83d\udcae","\ud83d\udcaf","\u2714","\u2611","\ud83d\udd18","\ud83d\udd17","\u27b0","\ud83d\udd31","\ud83d\udd32","\ud83d\udd33","\u25fc","\u25fb","\u25fe","\u25fd","\u25aa","\u25ab","\ud83d\udd3a","\u2b1c","\u2b1b","\u26ab","\u26aa","\ud83d\udd34","\ud83d\udd35","\ud83d\udd3b","\ud83d\udd36","\ud83d\udd37","\ud83d\udd38","\ud83d\udd39"];
    
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = 'black';
    ctx.font = '300px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const emoji = emojiList[Math.floor(Math.random() * emojiList.length)];
    ctx.fillText(emoji, 250, 250);
    
    const imageData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    const size = this.blockSize;
    const shake = 15;
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


        if (a == 255) {
          const wx =  wiggle * Math.sin(Math.random() * 10);
          const wy =  wiggle * Math.sin(Math.random() * 10);
          const newr = r + shake * Math.sin(Math.random() * 10);
          const newg = g + shake * Math.sin(Math.random() * 10);
          const newb = b + shake * Math.sin(Math.random() * 10);
          
          const hsl = this.rgbToHsl(newr, newg, newb);
          //this.colors.push(this.rgbToHsl(r, g, b));
          this.colors.push(hsl);
          
          //const strength = Math.max(1, Math.pow(1.1, this.maxStr * hsl.l) );
          const strength = Math.max(1, this.maxStr * hsl.l );
          
          const newBlock = {
            wx,
            wy,
            x: x + wx,
            y: y + wy,
            xs: x,
            ys: y,
            c: `rgb(${newr},${newg},${newb})`,
            loose: false,
            strength,
            baseStr: strength,
            alive: true,
            landed: false,
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

    //rnd shuffle
    for (let i = this.colors.length - 1; i > 0; i--) {
      const n = Math.floor(Math.random() * (i + 1));
      [this.colors[i], this.colors[n]] = [this.colors[n], this.colors[i]];
    }

  }
  
  roundToGrid(f) {
    return Math.round(f / this.blockSize) * this.blockSize;
  }
  
  update() {
    let landedCount = 0;
    let moveCount = 0;
    this.blocks.forEach( b => {
        
      if (!b.landed && !b.loose) {
        const dx = this.mousex - (b.x + this.blockSize / 2);
        const dy = this.mousey - (b.y + this.blockSize / 2);
        const d2 = dx * dx + dy * dy;

        if (d2 < (this.cursorSize * this.cursorSize + this.blockSize)) {        
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
            }
          }
        }
      }
    
      if (b.loose && !b.landed) {
        b.vx += b.ax + Math.random() - 0.5;
        b.vy += b.ay;
        b.x += b.vx;
        const newy = b.y + b.vy;
        
        let collision = false;
        this.blocks.some( bc => {
          if (bc.landed) {
            const xoverlap = (b.x + this.blockSize >= bc.x) && (b.x <= bc.x + this.blockSize);
            if (!xoverlap) {return;}            
            const yoverlap = (bc.y > b.y + this.blockSize) && (bc.y <= newy + this.blockSize);      

            if (xoverlap && yoverlap) {
              collision = true;
              b.landed = true;
              this.score += b.baseStr;
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
          if ((newy + this.blockSize) >= this.canvas.height) {          
            b.y = this.canvas.height - this.blockSize;
            b.x = this.roundToGrid(b.x);            
            while (this.gridLookup[`${b.x},${b.y}`]) {
              b.y -= this.blockSize;
            }
            this.gridLookup[`${b.x},${b.y}`] = b;
            b.landed = true;
            this.score += b.baseStr;
          } else {              
            b.y = newy;
          }
        }
          
      }
      
      if (b.landed) {
        landedCount++;
        if (Math.random > 0.25) {return;}
        //do the sand dance
        
        if (this.gridLookup[`${b.x},${b.y+this.blockSize}`] || b.y >= (this.canvas.height - this.blockSize)) {
          //block below
          //try to fall left or right
          if (Math.random() > 0.5) {
            //try left
            if (!this.gridLookup[`${b.x-this.blockSize},${b.y+this.blockSize}`] && b.y < (this.canvas.height - this.blockSize)) {
              this.gridLookup[`${b.x},${b.y}`] = undefined;
              b.y += this.blockSize;
              b.x -= this.blockSize;
              this.gridLookup[`${b.x},${b.y}`] = b;
              moveCount++;
            }
          } else {
            //try right
               if (!this.gridLookup[`${b.x+this.blockSize},${b.y+this.blockSize}`] && b.y < (this.canvas.height - this.blockSize)) {
              this.gridLookup[`${b.x},${b.y}`] = undefined;
              b.y += this.blockSize;
              b.x += this.blockSize;
              this.gridLookup[`${b.x},${b.y}`] = b;
              moveCount++;
            }
          }
        } else {
          //no block below so fall
          this.gridLookup[`${b.x},${b.y}`] = undefined;
          b.y += this.blockSize;
          this.gridLookup[`${b.x},${b.y}`] = b;
          moveCount++;
        }
      }
      
      if (b.y > (this.canvas.height - this.blockSize)) {
        b.landed = true;
        this.score += b.baseStr;
        b.y = this.canvas.height - this.blockSize;
        b.x = this.roundToGrid(b.x);      
      }
    });
    
    //remove dead blocks
    //this.blocks = this.blocks.filter( b => b.alive );
    
    //sort so loose blocks are on top when drawing
    this.blocks = this.blocks.sort( (a, b) => {
      if (a.loose != b.loose) {
        return a.loose ? 1 : -1;
      } else {
        return 0;
      }
    });
    
    //restart when all blocks are dead
    if (landedCount >= this.blocks.length && moveCount === 0) {
      this.init();
    }
    
  }
  
  draw() {
    const ctx = this.ctx;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    
    //draw background
    const tileSize = 32;
    for (let x = 0; x < this.canvas.width / tileSize; x++) {
      for (let y = 0; y < this.canvas.height / tileSize; y++) {
        const ci = (x + y * 777) % this.colors.length;
        const c = this.colors[ci];
        ctx.fillStyle = `hsl(${c.h}, ${c.s * 100 * 0.3}%, ${c.l * 100}%)`;
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
      }
    }


    //draw canvas
    const sideBorder = 40;
    const topBorder = 20;
    const height = this.canvas.height - (topBorder + 250);
    const width = this.canvas.width - sideBorder * 2;
    const shadowOffset = 10;
    const frameSize = 10;

    ctx.fillStyle = 'hsla(0, 0%, 0%, 0.4)';
    ctx.fillRect(sideBorder -frameSize + shadowOffset, topBorder -frameSize + shadowOffset, width + 2 * frameSize, height + 2 * frameSize);

    ctx.fillStyle = 'gray';
    ctx.fillRect(sideBorder - frameSize, topBorder - frameSize, width + 2 * frameSize, height + 2 * frameSize);

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 150, 40);
    ctx.fillRect(sideBorder, topBorder, width, height);
    

    
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillStyle = 'black';
    ctx.fillText(`Score: ${this.score.toFixed(0)}`, 10, 10);
       
    this.blocks.forEach( b => {
      if (b.strength < this.maxStr) {
        if (b.landed) {
          //on pile
          ctx.fillStyle = b.c;
          ctx.fillRect(b.x + b.wx, b.y + b.wy, this.blockSize, this.blockSize);
        } else {
          const fraction = (b.baseStr - b.strength) / b.baseStr;
          const rotation = fraction * Math.PI / 2;
          const size = this.blockSize;
          if (b.loose) {
            //falling
            const offset = 4;
            ctx.fillStyle = 'rgba(40,40,40,0.4)';
            ctx.fillRect(b.x + offset, b.y + offset, size, size);
          }
          //falling or trying to fall
          ctx.fillStyle = b.c;
          ctx.save();
          ctx.translate(b.x + size / 2, b.y + size / 2);        
          ctx.rotate(rotation);
          ctx.fillRect(-size / 2, -size / 2, size, size);
          ctx.restore();
        }
      } else {
        //untouched on canvas
        ctx.fillStyle = b.c;
        ctx.fillRect(b.x, b.y, this.blockSize, this.blockSize);
      }
    });
    
    ctx.fillStyle = 'rgba(38,38,38,0.2)';
    ctx.beginPath();
    ctx.arc(this.mousex, this.mousey, this.cursorSize, 0, Math.PI * 2);
    ctx.fill();
    window.requestAnimationFrame( d => this.draw(d) );
  }
  
  onmousemove(e) {    
    this.canvasClientRect = this.canvas.getBoundingClientRect();    
    this.mousex = e.clientX - this.canvasClientRect.left;
    this.mousey = e.clientY - this.canvasClientRect.top;    
  }
}

const app = new App();
