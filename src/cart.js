let label = document.getElementById('label')
let shoppingCart = document.getElementById('shopping-cart')

let basket = JSON.parse(localStorage.getItem("data")) || []

let calculation = () => {
    let cartAmount = document.getElementById("cartAmount")

    cartAmount.innerHTML = basket.map(x => x.item).reduce((x,y) => x+y, 0)
}

calculation()

console.log(shopItemsData); // shopItemsData se encuentra en data.js y se conecta mediante los <script></script> de cart.html (debajo del body)

let generateCartItems = () => {
    if(basket.length !== 0){
        return (shoppingCart.innerHTML = basket.map((x) => {
            console.log(x); // ver q me trae solo el id y el item
            let {id, item} = x
            let search = shopItemsData.find((y) => y.id === id) || [] 
            return `
                    <div class="cart-item">
                        <img width="100" src=${search.img}  alt=""/>
                        <div class="details">
                            <div class="title-price-x">
                                <h4 class="title-price">
                                    <p>${search.name}</p>
                                    <p class="cart-item-price">s/. ${search.price}</p>
                                </h4>
                                <i onclick="removeItem(${id})" class="fa-duotone fa-x"></i>
                            </div>
                            <div class="buttons">
                                <i onclick="decrement(${id})" class="fa-sharp fa-solid fa-minus"></i>
                                <div id="${id}" class="quantity">${item}</div>
                                <i onclick="increment(${id})" class="fa-sharp fa-solid fa-plus"></i>
                            </div>
                            <h3>s/. ${item * search.price}</h3>
                        </div>
                        
                    </div>
                   `
        }).join(""))
    }else{
        shoppingCart.innerHTML = ``
        label.innerHTML = `
            <h2>Carrito está vacío</h2>
            <a href="index.html">
                <button class="homeBtn">Regresar a Home</button>
            </a>
            `
    }
}

generateCartItems()

/**
 * ! Copiamos las funciones increment, decrement y update del main.js 
**/

let increment = (id) => {

    let selectedItem = id
    
    let search = basket.find((x) => x.id === selectedItem.id) // en search estoy almacenando el objeto basket que coincide, y si no se crea un nuevo objeto (search es un array puede almacenar varios objetos)
    if(search === undefined){
        basket.push({
            id: selectedItem.id, // le temenos que poner .id para que solo traiga el id y no la etiqueta completa
            item: 1
        })
    } else {
        search.item += 1
    }

    localStorage.setItem("data",JSON.stringify(basket)) // si solo enviamos el basket, el localstorage solo el tipo de valor(se muestra object en la consola)

    update(selectedItem.id)
    calculation()
}


let decrement = (id) => {

    let selectedItem = id
    
    let search = basket.find((x) => x.id === selectedItem.id)
    if(search === undefined) return; // si selecciona primero el menos que salga de proceso con el return
    else if(search.item === 0) return;  // al colocar solo return detiene completamente el proceso (para que no sea negativo)
    else {
        search.item -= 1
    }

    update(selectedItem.id)
    
    basket = basket.filter((x) => x.item !== 0) // para que en el localstorage de la solo se almacene los items diferentes a 0 | tiene que ir después de actualizar con el update
    
    generateCartItems() // llamar a la función Para poder renderizar en la vista el aumento o disminución de precio total del item
    
    calculation()
    
    localStorage.setItem("data",JSON.stringify(basket))
   
}

let update = (id) => {
    let search = basket.find((x) => x.id === id)

    document.getElementById(id).innerHTML = search.item
    
    generateCartItems() // llamar a la función Para poder renderizar en la vista el aumento o disminución de precio total del item

    totalAmount() // llamar a la función para renderizar y visualizar suma total de la compra
}

let removeItem = (id) => {
    let selectedItem = id;
    basket = basket.filter((x) => x.id !== selectedItem.id)
    generateCartItems()

    totalAmount() // para actualizar el monto total al momento de actualizar
    calculation()
    localStorage.setItem("data",JSON.stringify(basket))
}

let totalAmount = () => {
    if(basket.length !== 0) {
        let amount = basket.map((x) => {
            let {item,id} = x
            let search = shopItemsData.find((y) => y.id === id) || [] // shopItemsData es un array y está declarado dentro de data.js
            return item * search.price 
        }).reduce((x,y) => x+y, 0)
        // console.log(amount); -> para comprobar que está sumando el precio de los items
        label.innerHTML = `
                <h2>Cuenta Total: s/ ${amount}</h2>
                <button class="checkout">Checkout</button>
                <button onclick="clearCart()" class="removeAll">Limpiar Carrito</button>
                `
    }else return
}

let clearCart = () => {
    basket = []
    generateCartItems()
    calculation()
    localStorage.setItem("data",JSON.stringify(basket))
}

totalAmount()