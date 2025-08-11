const socket = io();

const addForm = document.getElementById("addForm");
const deleteForm = document.getElementById("deleteForm");
const productList = document.getElementById("productList");

addForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(addForm);
  const productData = {};

  formData.forEach((value, key) => {
    productData[key] = value;
  });

  console.log(productData);

  socket.emit("addProduct", productData);

  addForm.reset();
});


deleteForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const id = document.getElementById("id").value;

  socket.emit("deleteProduct", id);

  deleteForm.reset();
});

socket.on("productAdded", (newProduct) => {
    const li = document.createElement("li");

    li.innerHTML = `${newProduct.title} - $${newProduct.price} - ID: ${newProduct._id}`;
    li.id = `product-${newProduct._id}`;
    
    productList.appendChild(li);

});

socket.on("productsUpdated", (products) => {

    productList.innerHTML = "";
    products.forEach((p) => {
    const li = document.createElement("li");
    li.textContent = `${p.title} - $${p.price} - ID: ${p._id}`;
    li.id = `product-${p._id}`;
    productList.appendChild(li);
  });
});


