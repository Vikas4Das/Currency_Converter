const BASE_URL = "https://api.exchangerate-api.com/v4/latest/";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const swapBtn = document.querySelector(".fa-arrow-right-arrow-left"); 

const populateDropdowns = () => {
  dropdowns.forEach((select) => {
    select.innerHTML = ""; 

    Object.keys(countryList).forEach((currCode) => {
      let newOption = document.createElement("option");
      newOption.innerText = currCode;
      newOption.value = currCode;
      if (select.name === "from" && currCode === "USD") {
        newOption.selected = true;
      } else if (select.name === "to" && currCode === "INR") {
        newOption.selected = true;
      }
      select.appendChild(newOption);
    });

    select.addEventListener("change", (evt) => updateFlag(evt.target));
  });

  updateFlag(fromCurr);
  updateFlag(toCurr);
};

const updateExchangeRate = async () => {
  let amountInput = document.querySelector(".amount input");
  let amtVal = parseFloat(amountInput.value);
  if (isNaN(amtVal) || amtVal < 1) {
    amtVal = 1;
    amountInput.value = "1";
  }

  if (fromCurr.value === toCurr.value) {
    msg.innerText = `${amtVal} ${fromCurr.value} = ${amtVal.toFixed(2)} ${toCurr.value} ✅`;
    return;
  }

  msg.innerText = "Fetching exchange rate... ⏳";

  const URL = `${BASE_URL}${fromCurr.value}`;
  console.log("Fetching URL:", URL);

  try {
    let response = await fetch(URL);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    let data = await response.json();
    console.log("API Response:", data);

    let rate = data.rates[toCurr.value]; 
    if (!rate) {
      throw new Error("Exchange rate not found in the response.");
    }

    let finalAmount = amtVal * rate;
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value} 🔄`;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    msg.innerText = "⚠️ Error fetching exchange rate. Please try again later.";
  }
};

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let img = element.parentElement.querySelector("img");
  img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
};

swapBtn.addEventListener("click", () => {
  [fromCurr.value, toCurr.value] = [toCurr.value, fromCurr.value];
  updateFlag(fromCurr);
  updateFlag(toCurr);
  updateExchangeRate();
});

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  populateDropdowns();
  updateExchangeRate();
});
