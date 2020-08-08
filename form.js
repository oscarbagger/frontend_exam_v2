"use strict";
import { settingsObject } from "./modules/settings.js";
window.addEventListener("DOMContentLoaded", start);

let jsonData = [];
const settings = settingsObject();

let beerInOrder = [];

const orderNav = document.querySelector("#orderNav");
const orderBeer = document.querySelector("#orderBeer");
const orderPayment = document.querySelector("#payment");

/*
function BeerOrder(beerArr, id) {
  beerInOrder = beerArr;
  this.cardtext = text;
  this.points = points;
  this.id = id;
  amountOFType(type) {
    
  }
} */

function start() {
  getJsonData();
  orderNav.addEventListener("click", () => {
    if (orderBeer.style.display == "block") {
      orderBeer.style.display = "none";
      orderPayment.style.display = "block";
      orderNav.querySelector("#orderNavPayment").style.display = "block";
      orderNav.querySelector("#orderNavBeer").style.display = "none";
      setupOrder();
    } else {
      orderBeer.style.display = "block";
      orderPayment.style.display = "none";
      orderNav.querySelector("#orderNavPayment").style.display = "none";
      orderNav.querySelector("#orderNavBeer").style.display = "block";
    }
  });
}

function setupOrder() {
  console.log("generating order");
}

function submitFormData() {
  //event.preventDefault();
  /*const elements = HTML.form.elements;
    user.name = elements.name.value;
    user.email = elements.email.value;
    user.company = elements.company.value;
    order.beerInOrder = beerInOrder;
    console.log(user);
    post(order); */
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
