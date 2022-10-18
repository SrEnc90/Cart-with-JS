let shop = document.getElementById('shop')

    //parse convierte un objeto json a javascript
    // si data está vacío entonces retorna un array vacío 
    let basket = JSON.parse(localStorage.getItem("data")) || [] // el jsnon.parse(localstorage) esta jalando la data desde el localstorage 

let generateShop = () => {
    //map es un método del array que te permite mapear los key-value del array
    return ( shop.innerHTML = shopItemsData.map((x) => {
        //con esto ya no necesito poner ${x.name} solamente necesito poner ${name} en el div de abajo
        let {id, name, price, description, img} = x 
       let search = basket.find((y) => y.id === id) || [] // con esto recargo los datos por más que refrezque la página
        //por alguna razón deben estar en la misma linea la sentencia return y ` (sin salto de línea)
        return `
            <div id="product-id-${id}" class="item">
                <img width="220" src= ${img} alt="">
                <div class="details">
                    <h3> ${name} </h3>
                    <p> ${description} </p>
                    <div class="price-quantity">
                        <h2>S/ ${price} </h2>
                        <div class="buttons">
                            <i onclick="decrement(${id})" class="fa-sharp fa-solid fa-minus"></i>
                            <div id="${id}" class="quantity">
                                ${search.item === undefined ? 0 : search.item}
                            </div>
                            <i onclick="increment(${id})" class="fa-sharp fa-solid fa-plus"></i>
                        </div>
                    </div>
                </div>
            </div>
        `
        }).join("") // el join es un método del array que especifica el separador entre cada objeto del array (puede ser coma, punto y coma, espacio en blanco, etc) 
    )
}

generateShop()

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

    calculation()
    
    localStorage.setItem("data",JSON.stringify(basket))

   
}

let update = (id) => {
    let search = basket.find((x) => x.id === id)

    document.getElementById(id).innerHTML = search.item
}

let calculation = () => {
    let cartAmount = document.getElementById("cartAmount")
    
    /* 
        const array1 = [1, 2, 3, 4];
         
        const initialValue = 0;
        const sumWithInitial = array1.reduce(
        (previousValue, currentValue) => previousValue + currentValue,initialValue);
        0 + 1 + 2 + 3 + 4
    */
    // console.log(basket.map((x) => x.item).reduce((x,y) => x+y, 0)); siempre itentando primero mostrar los datos obtenidos en consola
    cartAmount.innerHTML = basket.map((x) => x.item).reduce((x,y) => x+y, 0) // el 0 es el valor inicial (ver ejemplo de arriba)
}

calculation(); // con esto al refrescar la página permanece los datos en el carro de compras en el nav bar