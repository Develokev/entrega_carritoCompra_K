document.addEventListener("DOMContentLoaded", () => {
//VARIABLES ++++++++++++++++++++++++++++++++++++++++++
//Capturas del DOM
const carTable = document.querySelector('#carTable');
const carTableBody = document.querySelector('#carTableBody');

const proCardArt = document.querySelector('#proCardArt');
const arrayData = JSON.parse(localStorage.getItem("arrayData")) || [];

const emptyCart = document.querySelector('.emptyCart');


//var/const declaradas



//EVENTOS ++++++++++++++++++++++++++++++++++++++++++++
document.addEventListener('click', ({target}) => {
    if (target.matches('#img_carritoCompra')) {
        carTable.classList.toggle('hidden');
    }

    if (target.matches('.add2cart')) {
        const id = target.dataset.id;
        almacenar(id);
        paintPopTable();
    }

    if (target.matches('#prepurchaseBtn')) {
        location.assign('../html/cart.html');
    }

    if (target.matches('#goBackBtn')) {
        location.assign('../html/index.html');
    }

    if (target.matches('.emptyCart')) {
        localStorage.removeItem('arrayData')
        location.assign('../html/index.html');
    }
});

//FUNCIONES ++++++++++++++++++++++++++++++++++++++++++

//Realiza el fetch
const fetchProducts = async () => {  //
    try {
        let peticion;
        
        peticion = await fetch('https://dummyjson.com/products/category/mens-watches');
            (console.log(peticion));

        if (peticion.ok) {
            const resp = await peticion.json();
            return {
                ok: true,
                resp,
            };
        } else {
            throw {
                ok: false,
                respuesta: "error",
            };
            }
        
    }   catch (error) {
        console.log("Error en petición")
        return error;
    }};

//pintar productos de una categoría
const paintPro =async () => {
    const {ok, resp} = await fetchProducts();
    const {products} = resp;
    
    products.forEach((item) => {
        const proCard = document.createElement('ARTICLE');
        proCard.classList.add('gridCards');

        const cardImg = document.createElement('IMG');
        cardImg.classList.add('cardImg');
        cardImg.src = item.images[1];
        cardImg.alt = item.title;

        const cardProName = document.createElement('P');
        cardProName.textContent = item.title

        const cardPrice = document.createElement('P');
        cardPrice.textContent = `Price: ${item.price}€`;

        const cardAdd = document.createElement('BUTTON');
        cardAdd.classList.add('add2cart', 'tilt-n-move-shaking');
        cardAdd.textContent = "Add to cart"
        cardAdd.dataset['id'] = item.id

        proCard.append(cardImg, cardProName, cardPrice, cardAdd);
        proCardArt.append(proCard);
    });
}

//pintar productos a TABLA desde LocalStorage
const paintPopTable =async () => {

    let cosa = await getLocal();
    console.log(cosa);

    cosa.forEach((item) => {
        let cont = 0;
        const tableR = document.createElement('TR');

        const tableDataImg = document.createElement('TD');
            const tableImg = document.createElement('IMG');
            tableImg.src = item.image;
            tableImg.alt = item.title;
            tableDataImg.append(tableImg);

        const tableDataName = document.createElement('TD');
            tableDataName.textContent = item.title;
        
        const tableDataPrice = document.createElement('TD');
            tableDataPrice.textContent = item.price;
        
        const tableDataQty = document.createElement('TD');
            tableDataQty.textContent = cont++;

        const tableDataTotal = document.createElement('TD');
            tableDataTotal.textContent = item.price*tableDataQty;
        
        const tableR2 = document.createElement('TR');
        
        const tableEmptyBtn = document.createElement('TD');
            const emptyBtn = document.createElement('BUTTON');
            emptyBtn.classList.add('emptyCart');
            emptyBtn.textContent = "Empty Cart"
            tableEmptyBtn.append(emptyBtn);
        
        const tableErase = document.createElement('TD');
            const eraseBtn = document.createElement('BUTTON');
            eraseBtn.classList.add('eraseBtn');
            eraseBtn.textContent = "Go to purchase"
            tableErase.append(eraseBtn);

        tableR.append(tableDataImg, tableDataName, tableDataPrice, tableDataQty, tableDataTotal);

        tableR2.append(tableEmptyBtn, tableErase);
        
        carTableBody.append(tableR, tableR2);
    })
}

//GENERAL FUNCTIONS +++++++++++++++++++++++++++++++//
//Función Almacenar datos
const almacenar =async (id)=>{
    const {resp} = await fetchProducts();
    const {products} = resp;

    let arrayProducts = products.find((item) => item.id == id)
        let objProductos = {
            id: arrayProducts.id,
            title: arrayProducts.title,
            image: arrayProducts.images[0],
            price: arrayProducts.price,
        }

    arrayData.push(objProductos);
    setLocal();
}

//Setea al Local Storage
const getLocal = () => JSON.parse(localStorage.getItem("arrayData")) || [];


//Trae del Local Storage
const setLocal = () => {
    localStorage.setItem("arrayData", JSON.stringify(arrayData));
};

const init = () => {
    fetchProducts();
    getLocal();
    paintPopTable();
    paintPro();
}
init();
//CONTENT LOADED.
}); //todo LOAD +++++++++++++++++++++++++++++++++++++