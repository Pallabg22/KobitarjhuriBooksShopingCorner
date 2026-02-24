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

  // 🔹 Total দেখানো
  document.getElementById("total").innerText = total;

  // 🔹 Customer Details
  let name = document.getElementById("custName").value.trim();
  let phone = document.getElementById("custPhone").value.trim();
  let address = document.getElementById("custAddress").value.trim();

  // 🔹 Validation
  let orderBtn = document.getElementById("orderBtn");
  if (!cart.length || !name || !phone || !address) {
    orderBtn.href = "#";
    return;
  }

  // 🔹 WhatsApp Message
  let msg = "KobitarjhuriBookShopingCorner থেকে অর্ডার\n\n";

  cart.forEach(i => {
    msg += `${i.name} × ${i.qty} = ₹${i.price * i.qty}\n`;
  });

  msg += `\nTotal Amount: ₹${total}\n\n`;
  msg += `Customer Name: ${name}\n`;
  msg += `Phone: ${phone}\n`;
  msg += `Address: ${address}\n\n`;
  msg += `UPI Payment Done via QR (Txn ID will be shared)`;

  orderBtn.href =
    "https://wa.me/919679154520?text=" + encodeURIComponent(msg);
}