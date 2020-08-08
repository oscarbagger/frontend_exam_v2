"use strict";
import { settingsObject } from "./modules/settings.js";
window.addEventListener("DOMContentLoaded", start);

let updateTime = 5000;

let jsonData = [];
const settings = settingsObject();

const queueContainer = document.querySelector("#queueContainer");
const servContainer = document.querySelector("#servingContainer");
const tapsContainer = document.querySelector("#taps");

let tapArr = [];

class ProtoTap {
  constructor(id, lvl, cap, beer, use) {
    this.inUse = use;
    this.beerType = beer;
    this.tapId = id;
    this.level = lvl;
    this.capacity = cap;
    this.DOMContainer = "";
    this.beerImg = "";
  }
  get percentFilled() {
    return this.calcPercentFilled();
  }
  calcPercentFilled() {
    return (this.level / this.capacity) * 100 + "%";
  }

  updateDOM() {
    this.DOMContainer.querySelector(
      ".tapItem_beer"
    ).textContent = this.beerType;
    this.DOMContainer.querySelector(".tapItem_id").textContent = this.tapId;
    this.DOMContainer.querySelector(".tapItem_level").textContent =
      this.level + "/" + this.capacity;
    this.DOMContainer.querySelector(
      ".levelBar_level"
    ).style.height = this.percentFilled;
    if (this.inUse == true) {
      //this.DOMContainer.querySelector(".tapItem_inUse").textContent = "active";
      this.DOMContainer.style.border = " 2px solid #388C42";
    } else {
      //this.DOMContainer.querySelector(".tapItem_inUse").textContent =
      ("inactive");
      this.DOMContainer.style.border = " 1px solid #eeedef";
    }
  }
  updateClassData(lvl, cap, beer, use) {
    this.inUse = use;
    this.beerType = beer;
    this.level = lvl;
    this.capacity = cap;
  }
}

function start() {
  getJsonData();
}

function showQueue() {
  // empty the content of the queue
  queueContainer.innerHTML = "";
  // get the template for a queue item
  let temp = document.querySelector("#queue_temp");
  let qItemList = jsonData.queue;
  qItemList.forEach((q) => {
    let clone = temp.cloneNode(true).content;
    clone.querySelector(".queueItem_id").textContent = "#" + q.id;
    let beerArr = q.order;
    let beernamesInOrder = [];
    let pList = [];
    beerArr.forEach((b) => {
      if (beernamesInOrder.includes(b)) {
        // find p with same name
        let occurenceNumber = getOccurrence(beernamesInOrder, b);
        pList.forEach((p) => {
          if (b == p.textContent) {
            p.textContent = occurenceNumber + 1 + "x " + b;
          }
        });
      } else {
        let p = document.createElement("p");
        p.textContent = b;
        clone.querySelector(".queueItem").appendChild(p);
        pList.push(p);
      }
      beernamesInOrder.push(b);
    });
    queueContainer.appendChild(clone);
  });
}

function showServing() {
  // empty the content of the queue
  servContainer.innerHTML = "";
  // get the template for a queue item
  let temp = document.querySelector("#queue_temp");
  let servItemList = jsonData.serving;
  servItemList.forEach((q) => {
    let clone = temp.cloneNode(true).content;
    clone.querySelector(".queueItem_id").textContent = "#" + q.id;
    let beerArr = q.order;
    let beernamesInOrder = [];
    let pList = [];
    beerArr.forEach((b) => {
      if (beernamesInOrder.includes(b)) {
        // find p with same name
        let occurenceNumber = getOccurrence(beernamesInOrder, b);
        pList.forEach((p) => {
          if (b == p.textContent) {
            p.textContent = occurenceNumber + 1 + "x " + b;
          }
        });
      } else {
        let p = document.createElement("p");
        p.textContent = b;
        clone.querySelector(".queueItem").appendChild(p);
        pList.push(p);
      }
      beernamesInOrder.push(b);
    });
    servContainer.appendChild(clone);
  });
}

function getOccurrence(array, value) {
  return array.filter((v) => v === value).length;
}

function showTaps() {
  // empty the content of the queue
  tapsContainer.innerHTML = "";
  // get the template for a queue item
  let temp = document.querySelector("#tap_temp");
  tapArr.forEach((t) => {
    let clone = temp.cloneNode(true).content;
    tapsContainer.appendChild(clone);
    t.DOMContainer = tapsContainer.lastElementChild;
    t.updateDOM();
  });
}

function TapsToClass() {
  let tapsList = jsonData.taps;
  tapsList.forEach((t) => {
    let tap = new ProtoTap(t.id, t.level, t.capacity, t.beer, t.inUse);
    tapArr.push(tap);
  });
  showTaps();
}

function updateTaps() {
  let tdata = jsonData.taps;
  for (let i = 0; i < tapArr.length; i++) {
    tapArr[i].updateClassData(
      tdata[i].level,
      tdata[i].capacity,
      tdata[i].beer,
      tdata[i].inUse
    );
    tapArr[i].updateDOM();
  }
}

async function updateData() {
  console.log("updating data");
  const response = await fetch(settings.endpoint + "?max=100", {
    method: "get",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
  jsonData = await response.json();
  updateTaps();
  showQueue();
  showServing();
  setTimeout(() => {
    updateData();
  }, updateTime);
}

async function getJsonData() {
  const response = await fetch(settings.endpoint + "?max=100", {
    method: "get",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
  jsonData = await response.json();
  showQueue();
  showServing();
  TapsToClass();
  setTimeout(() => {
    updateData();
  }, updateTime);
}

async function post(data) {
  const postData = JSON.stringify(data);
  const response = await fetch(settings.endpoint, {
    method: "post",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": settings.apiKey,
      "cache-control": "no-cache",
    },
    body: postData,
  });
  console.log(await response.json());
}

async function deleteIt(id) {
  const response = await fetch(settings.endpoint + "/" + id, {
    method: "delete",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": settings.apiKey,
      "cache-control": "no-cache",
    },
  });
  console.log(await response.json());
}

async function put(id, data) {
  let postData = JSON.stringify(data);
  const response = await fetch(settings.endpoint + "/" + id, {
    method: "put",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": settings.apiKey,
      "cache-control": "no-cache",
    },
    body: postData,
  });
  console.log(await response.json());
}
