const billInput = document.getElementById("bill");
const tipInput = document.getElementById("tip");
const btnEl = document.getElementById("calculate");
const totalText = document.getElementById("total");

function calculateTotal() {
  const billValue = billInput.value;
  const tipValue = tipInput.value;
  const totalValue = (billValue * tipValue) / 100;
  totalText.textContent = totalValue.toFixed(1);
}

btnEl.addEventListener("click", calculateTotal);
