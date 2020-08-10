"use strict";
import { settingsObject } from "./modules/settings.js";
window.addEventListener("DOMContentLoaded", start);

let jsonData = [];
const settings = settingsObject();

let beerInOrder = [];
let order = [];
let showingBeers = true;

const orderItemTemplate = document.querySelector("#order_listItem");
const orderItemTable = document.querySelector("#order_items");

const orderNav = document.querySelector("#orderNav");
const orderBeer = document.querySelector("#orderBeer");
const orderPayment = document.querySelector("#payment");
const orderTotal = document.querySelector("#orderTotal");

function start() {
  getJsonData();
  orderNav.addEventListener("click", () => {
    if (showingBeers) {
      showingBeers = false;
      orderBeer.style.display = "none";
      orderPayment.style.display = "block";
      orderNav.querySelector("#orderNavPayment").style.display = "block";
      orderNav.querySelector("#orderNavBeer").style.display = "none";
      setupOrder();
    } else {
      showingBeers = true;
      orderBeer.style.display = "flex";
      orderPayment.style.display = "none";
      orderNav.querySelector("#orderNavPayment").style.display = "none";
      orderNav.querySelector("#orderNavBeer").style.display = "block";
    }
  });
}

function setupOrder() {
  UpdatePrice();
  console.log("generating order");
  orderItemTable.innerHTML = "";
  let temp = orderItemTemplate;
  let beerNamesInOrder = [];
  beerInOrder.forEach((beer) => {
    if (beerNamesInOrder.includes(beer)) {
      let orderItems = orderItemTable.querySelectorAll(".order_beer");
      orderItems.forEach((i) => {
        if (i.querySelector(".order_beerName").textContent == beer) {
          i.querySelector(".beerAmount").value++;
        }
      });
    } else {
      let clone = temp.cloneNode(true).content;
      let amount = clone.querySelector(".beerAmount");
      clone.querySelector(".order_beerName").textContent = beer;
      clone.querySelector(".beerAdd").addEventListener("click", () => {
        amount.value++;
        UpdateOrderInfo();
      });
      clone.querySelector(".beerSubtract").addEventListener("click", () => {
        if (amount.value > 1) {
          amount.value--;
          UpdateOrderInfo();
        }
      });
      beerNamesInOrder.push(beer);
      orderItemTable.appendChild(clone);
      orderItemTable.lastElementChild
        .querySelector(".beerRemove")
        .addEventListener("click", () => {
          orderItemTable.lastElementChild.remove();
          UpdateOrderInfo();
        });
    }
  });

  document.querySelector("#buy").addEventListener("click", () => {
    submitFormData();
  });
}

function submitFormData() {
  event.preventDefault();
  order.beerInOrder = beerInOrder;
  console.log(order);
  post(order);
}

function UpdateOrderInfo() {
  beerInOrder = [];
  let orderItems = orderItemTable.querySelectorAll(".order_beer");
  orderItems.forEach((i) => {
    let name = i.querySelector(".order_beerName").textContent;
    let val = i.querySelector(".beerAmount").value;
    let n = val;
    while (n > 0) {
      beerInOrder.push(name);
      n--;
    }
  });
  console.log(beerInOrder);
  UpdatePrice();
}

function UpdatePrice() {
  // each beer is just 5$ for now
  orderTotal.textContent = "Total: " + beerInOrder.length * 5 + ".00$";
}

function showBeers() {
  let temp = document.querySelector("template");
  let beerList = jsonData;
  beerList.forEach((beer) => {
    let clone = temp.cloneNode(true).content;
    let amount = clone.querySelector(".beerAmount");
    clone.querySelector(".beerName").textContent = beer.name;
    clone.querySelector(".beerAlc").textContent = "Alc. " + beer.alc + "% vol";
    clone.querySelector(".beerDesc").textContent =
      beer.description.overallImpression;
    clone.querySelector(".beerLabel").src = "/images/" + beer.label;
    clone.querySelector(".beerLabel").alt = beer.label;

    clone.querySelector(".beerAdd").addEventListener("click", () => {
      amount.value++;
    });
    clone.querySelector(".beerSubtract").addEventListener("click", () => {
      if (amount.value > 1) {
        amount.value--;
      }
    });
    clone.querySelector(".beerOrder").addEventListener("click", () => {
      let n = amount.value;
      while (n > 0) {
        beerInOrder.push(beer.name);
        n--;
      }
      amount.value = 1;
      console.log(beerInOrder);
      document.querySelector("#addedToOrder").classList.add("orderCheck");
      document
        .querySelector("#addedToOrder")
        .addEventListener("animationend", () => {
          document
            .querySelector("#addedToOrder")
            .classList.remove("orderCheck");
        });
    });
    document.querySelector("#beerList").appendChild(clone);
  });
}

function addToOrder() {}

async function getJsonData() {
  const response = await fetch(settings.beers + "?max=100", {
    method: "get",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
  jsonData = await response.json();
  console.log(jsonData);
  showBeers();
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
