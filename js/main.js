document.addEventListener("DOMContentLoaded", () => {

//VARIABLES ++++++++++++++++++++++++++++++++++++++++++
//Capturas del DOM
const carTableBody = document.querySelector('#carTableBody');
const proCardArt = document.querySelector('#proCardArt');
const cardTableDiv = document.querySelector('#cardTableDiv');
// const carTable = document.querySelector('#carTable');

//var/const declaradas
const arrayData = JSON.parse(localStorage.getItem("arrayData")) || [];
const fragment = document.createDocumentFragment();
const stars = ['assets/star_yellow.png', 'assets/star_gray.png'];


//EVENTOS ++++++++++++++++++++++++++++++++++++++++++++
document.addEventListener('click', ({target}) => {
    if (target.matches('#img_carritoCompra')) {
        cardTableDiv.classList.toggle('hidden');
    }

    if (target.matches('.add2cart')) {
        const id = target.dataset.id;
        almacenar(id);
        paintPopTable();
    }

    if (target.matches('#prepurchaseBtn')) {
        location.assign('html/cart.html');
    }

    if (target.matches('#goBackBtn')) {
        location.assign('../index.html');
    }

    if (target.matches('.emptyCart')) {
        localStorage.removeItem('arrayData')
        location.assign('index.html');
    }

});

//FUNCIONES ++++++++++++++++++++++++++++++++++++++++++

//Realiza el fetch
const fetchProducts = async () => {  //
    try {
        let peticion;
        
        peticion = await fetch('https://dummyjson.com/products/category/mens-watches');

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

        proCard.append(cardImg, cardProName, cardPrice, paintStars(item.rating), cardAdd);
        proCardArt.append(proCard);
    }); 
}

//pintar productos a TABLA desde LocalStorage
const paintPopTable = () => {

    let cosa = getLocal();
    cosa.innerHTML= "";

    cosa.forEach((item) => {
        let cont = 0;
        const tableR = document.createElement('TR');

        const tableDataImg = document.createElement('TD');
            const tableImg = document.createElement('IMG');
            tableImg.src = item.image;
            tableImg.alt = item.title;
            tableDataImg.append(tableImg);

        const tableDataName = document.createElement('TD');
            tableDataName.classList.add('centerText');
            tableDataName.textContent = item.title;
        
        const tableDataPrice = document.createElement('TD');
            tableDataPrice.classList.add('centerText');
            tableDataPrice.textContent = item.price;
        
        const tableDataQty = document.createElement('TD');
            tableDataQty.classList.add('centerText');
            tableDataQty.textContent = cont+1;
            console.log(tableDataQty);

        const tableDataTotal = document.createElement('TD');
            tableDataTotal.classList.add('centerText');
            tableDataTotal.textContent = item.price;
        
            // const tableR2 = document.createElement('TR');
            
            
            const tableDelete = document.createElement('TD');
                const deleteBtn = document.createElement('BUTTON');
                    deleteBtn.classList.add('jumpBtn');
                    deleteBtn.textContent = "Delete product"
                    tableDelete.append(deleteBtn);
    
                // tableR2.append(tableDelete);
                // carTableBody.append(tableR2);

        tableR.append(tableDataImg, tableDataName, tableDataPrice, tableDataQty, tableDataTotal, tableDelete);
        fragment.append(tableR);
    });
        carTableBody.append(fragment);
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
            rating: arrayProducts.rating,
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

//funcion pintar ESTRELLAS
const paintStars = (rating) => {
    let divStars = document.createElement('DIV');
        divStars.classList.add('starImg');
    let yellowStars = Math.round(rating);
    let grayStars = 5 - yellowStars;

    for (let i = 0; i < yellowStars; i++) {
       let yellowRatingImg = document.createElement('IMG');
        yellowRatingImg.src = stars[0];
        yellowRatingImg.alt = "Yellow_Star"
        divStars.append(yellowRatingImg);
    }

    for(let i = 0; i < grayStars; i++) {
        let grayRatingImg = document.createElement('IMG');
            grayRatingImg.src = stars[1];
            grayRatingImg.alt = "Gray_Star"
            divStars.append(grayRatingImg);
    }
            return divStars;
}

const init = () => {
    let ruta = location.toString();

    if(ruta.includes('cart')) {
        fetchProducts();
        getLocal();
        paintPopTable();
    } else {
        fetchProducts();
        getLocal();
        paintPro();
        paintPopTable();
    }
}
init();
//CONTENT LOADED.
}); //todo LOAD +++++++++++++++++++++++++++++++++++++