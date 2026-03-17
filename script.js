let cart = [];

/* ================= CART ================= */

function addToCart(name, price) {
  let item = cart.find(i => i.name === name);
  if (item) item.qty++;
  else cart.push({ name, price, qty: 1 });
  updateCart();
}

function increaseQty(index) {
  cart[index].qty++;
  updateCart();
}

function decreaseQty(index) {
  if (cart[index].qty > 1) cart[index].qty--;
  else cart.splice(index, 1);
  updateCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  updateCart();
}

/* ================= MAIN ================= */

function updateCart() {
  let cartDiv = document.getElementById("cartItems");
  cartDiv.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.qty;

    cartDiv.innerHTML += `
      <div class="cart-item">
        <b>${item.name}</b><br>
        ₹${item.price} × ${item.qty}<br>
        <button class="qty-btn" onclick="decreaseQty(${index})">−</button>
        <button class="qty-btn" onclick="increaseQty(${index})">+</button>
        <button class="remove" onclick="removeItem(${index})">Remove</button>
      </div>
    `;
  });

  /* ================= DELIVERY ================= */

  let deliveryType = document.getElementById("deliveryType")?.value || "";
  let deliveryCharge = 0;

  if (total >= 500) {
    deliveryCharge = 0; // Free delivery
  } else {
    if (deliveryType === "local") deliveryCharge = 20;
    if (deliveryType === "outside") deliveryCharge = 50;
  }

  let finalTotal = total + deliveryCharge;

  document.getElementById("total").innerText = finalTotal;

  /* ================= INPUT ================= */

  let name = custName.value.trim();
  let phone = custPhone.value.trim();
  let address = custAddress.value.trim();
  let txnId = txnIdInput.value.trim();
  let paymentDone = paymentDoneCheckbox.checked;

  let orderBtn = document.getElementById("orderBtn");

  /* ================= TXN VALIDATION ================= */

  let validTxn = /^[A-Za-z0-9]{12,35}$/.test(txnId);

  if (!validTxn && txnId.length > 0) {
    txnIdInput.style.border = "2px solid red";
  } else {
    txnIdInput.style.border = "1px solid #e5b100";
  }

  /* ================= BLOCK ================= */

  if (
    !cart.length ||
    !name ||
    !phone ||
    !address ||
    !txnId ||
    !paymentDone ||
    !validTxn ||
    !deliveryType
  ) {
    orderBtn.href = "#";
    orderBtn.style.opacity = "0.6";
    orderBtn.style.pointerEvents = "none";
    orderBtn.onclick = null;
    return;
  }

  /* ================= ENABLE ================= */

  orderBtn.style.opacity = "1";
  orderBtn.style.pointerEvents = "auto";

  /* ================= MESSAGE ================= */

  let msg = "KobitarjhuriBookShopingCorner থেকে PAID ORDER\n\n";

  cart.forEach(i => {
    msg += `${i.name} × ${i.qty} = ₹${i.price * i.qty}\n`;
  });

  msg += `\nDelivery: ${deliveryType}\n`;
  msg += `Delivery Charge: ₹${deliveryCharge}\n`;

  if (deliveryCharge === 0 && total >= 500) {
    msg += `🎉 Free Delivery Applied\n`;
  }

  msg += `Final Total: ₹${finalTotal}\n`;
  msg += `Transaction ID: ${txnId}\n\n`;
  msg += `Customer Name: ${name}\n`;
  msg += `Phone: ${phone}\n`;
  msg += `Address: ${address}`;

  /* ================= CLICK EVENT ================= */

  orderBtn.onclick = function () {

    // Google Sheet Save
    fetch("https://script.google.com/macros/s/AKfycbxnSdIT2N8IUnwwDZ_gv3bZp9edrAsSCgmwlDDhzdNTTHvmuMK_Z9iado12Dh0K5DrkPg/exec", {
      method: "POST",
      body: JSON.stringify({
        name: name,
        phone: phone,
        address: address,
        books: cart.map(i => i.name + " x" + i.qty).join(", "),
        total: finalTotal,
        txnId: txnId,
        delivery: deliveryType,
        status: "Pending"
      })
    });

    // 🎉 Popup
    showPopup();
  };

  orderBtn.href =
    "https://wa.me/919679154520?text=" + encodeURIComponent(msg);
}

/* ================= POPUP ================= */

function showPopup() {
  document.getElementById("successPopup").style.display = "flex";
}

function closePopup() {
  document.getElementById("successPopup").style.display = "none";
}

/* ================= SHORTCUT ================= */

const custName = document.getElementById("custName");
const custPhone = document.getElementById("custPhone");
const custAddress = document.getElementById("custAddress");
const txnIdInput = document.getElementById("txnId");
const paymentDoneCheckbox = document.getElementById("paymentDone");