document.addEventListener("DOMContentLoaded", ()=>{
    const button = document.getElementById("addToCart");
    if (!button) return;

    const cartId = button.dataset.cartid;
    const productId = button.dataset.productid;

    button.addEventListener("click", async () =>{
        try{
            const res = await fetch(`/api/carts/${cartId}/product/${productId}`, {
                method: "POST",
                headers: {"content-Type": "application/json"},
                body: JSON.stringify({quantity: 1}),
            });

            const data = await res.json();
            if(res.ok){
                alert("Agregado al carrito");
            }else{
                alert ("Error: " + data.message);
            }

        }catch(error){
            alert("Error al procesar el pedido")

        }
    });
});