let cart = [];

function addToCart(name, price) {
  let item = cart.find(i => i.name === name);

  if (item) {
    item.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  updateCart();
}

function increaseQty(index) {
  cart[index].qty += 1;
  updateCart();
}

function decreaseQty(index) {
  if (cart[index].qty > 1) {
    cart[index].qty -= 1;
  } else {
    cart.splice(index, 1);
  }
  updateCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  updateCart();
}

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

  // 🔹 Total
  document.getElementById("total").innerText = total;

  // 🔹 Customer Details
  let name = document.getElementById("custName").value.trim();
  let phone = document.getElementById("custPhone").value.trim();
  let address = document.getElementById("custAddress").value.trim();

  // 🔹 Payment Confirmation
  let txnId = document.getElementById("txnId").value.trim();
  let paymentDone = document.getElementById("paymentDone").checked;

  let orderBtn = document.getElementById("orderBtn");

  // 🚫 HARD BLOCK: payment ছাড়া order যাবে না
  if (
    !cart.length ||
    !name ||
    !phone ||
    !address ||
    !txnId ||
    !paymentDone
  ) {
    orderBtn.href = "#";
    orderBtn.style.opacity = "0.6";
    orderBtn.style.pointerEvents = "none";
    return;
  }

  // ✅ সব ঠিক থাকলে order enable
  orderBtn.style.opacity = "1";
  orderBtn.style.pointerEvents = "auto";

  // 🔹 WhatsApp Message (PAID ORDER)
  let msg = "KobitarjhuriBookShopingCorner থেকে PAID ORDER\n\n";

  cart.forEach(i => {
    msg += `${i.name} × ${i.qty} = ₹${i.price * i.qty}\n`;
  });

  msg += `\nTotal Paid: ₹${total}\n`;
  msg += `Transaction ID: ${txnId}\n\n`;
  msg += `Customer Name: ${name}\n`;
  msg += `Phone: ${phone}\n`;
  msg += `Address: ${address}`;

  orderBtn.href =
    "https://wa.me/919679154520?text=" + encodeURIComponent(msg);
}