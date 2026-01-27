function calculatePercentage() {
  let value = document.getElementById("value").value;
  let percent = document.getElementById("percent").value;

  if (value === "" || percent === "") {
    document.getElementById("result").innerText = "Please enter both values";
    return;
  }

  let result = (value * percent) / 100;
  document.getElementById("result").innerText =
    percent + "% of " + value + " = " + result;
}
function calculateGST() {
  let price = document.getElementById("gstPrice").value;
  let gst = document.getElementById("gstPercent").value;

  if(price === "" || gst === "") {
    document.getElementById("gstResult").innerText = "Please enter both values";
    return;
  }

  let gstAmount = (price * gst) / 100;
  let total = parseFloat(price) + parseFloat(gstAmount);

  document.getElementById("gstResult").innerText =
    "GST: " + gstAmount + " | Total Price: " + total
    ;
}
