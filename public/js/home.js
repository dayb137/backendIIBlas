document.addEventListener("DOMContentLoaded", ()=>{
    document.querySelectorAll(".addToCart").forEach(button =>{
        button.addEventListener("click", async ()=>{
            const cartId = button.dataset.cartid;
            const productId = button.dataset.productid;

            try{
                const res = await fetch(`/api/carts/${cartId}/product/${productId}`, {
                    method: "POST",
                    headers: {"content-Type": "application/json"},
                    body: JSON.stringify({quantity: 1}),
                });

                const data = await res.json();
                if (res.ok){
                    alert("Producto agregado con exito");
                }else{
                    alert(data.message);
                }

            }catch(error){
                alert("Error al agregar el producto")

            }
        });
    });

});