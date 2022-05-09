// Initialisation du localStorage
let productInCart = JSON.parse(localStorage.getItem("products"));
const cartItems = document.getElementById("cart__items");
 

// Récupération via l'API du produit dont nous avons besoin seulement


getCart();
getTotal();
modifyQuantity();
deleteProduct();
getform();
sendForm();



//Création du panier visible par le client
function getCart() {
  // S'il est vide
  if (productInCart === null || productInCart == 0) {
    const emptyCart = "<p>Votre panier est vide</p>";
    cartItems.innerHTML = emptyCart;

    //  Sinon création de la structure HTML et importation des produits du localStorage
  } else {
    for (let products in productInCart) {
      // Création de la balise article
      let productArticle = document.createElement("article");
      cartItems.appendChild(productArticle);
      productArticle.classList.add("cart__item");
      productArticle.setAttribute("data-id", productInCart[products]._id);
      productArticle.setAttribute("data-color", productInCart[products].color);

      //Création de la div image
      let cartItemImg = document.createElement("div");
      productArticle.appendChild(cartItemImg);
      cartItemImg.classList.add("cart__item__img");

      //Création de l'image
      let cartImg = document.createElement("img");
      cartItemImg.appendChild(cartImg);
      cartImg.src = productInCart[products].image;

      //Création de la div cart__item__content
      let cartItemContent = document.createElement("div");
      productArticle.appendChild(cartItemContent);
      cartItemContent.classList.add("cart__item__content");

      //Création de la div cart__item__content__description
      let cartItemContentDescription = document.createElement("div");
      cartItemContent.appendChild(cartItemContentDescription);
      cartItemContentDescription.classList.add(
        "cart__item__content__description"
      );

      //Création du titre h2
      let productName = document.createElement("h2");
      cartItemContentDescription.appendChild(productName);
      productName.innerHTML = productInCart[products].name;

      //Création de la couleur
      let productColor = document.createElement("p");
      cartItemContentDescription.appendChild(productColor);
      productColor.innerHTML = productInCart[products].color;

      //Création du prix
      let productPrice = document.createElement("p");
      cartItemContentDescription.appendChild(productPrice);
      fetch(`http://localhost:3000/api/products/${productInCart[products]._id}`)
        .then((response) => response.json())
        .catch((err) => console.log(err))
        .then((data) => {
          productPrice.innerHTML = `${data.price} €`;
        });

      //Création de la div cart__item__content__settings
      let cartItemContentSettings = document.createElement("div");
      cartItemContent.appendChild(cartItemContentSettings);
      cartItemContentSettings.classList.add("cart__item__content__settings");

      //Création de la div cart__item__content__settings__quantity
      let cartItemContentSettingsQuantity = document.createElement("div");
      cartItemContentSettings.appendChild(cartItemContentSettingsQuantity);
      cartItemContentSettingsQuantity.classList.add(
        "cart__item__content__settings__quantity"
      );

      //Création du paragraphe qté
      let quantityTxt = document.createElement("p");
      cartItemContentSettingsQuantity.appendChild(quantityTxt);
      quantityTxt.innerHTML = "Qté :";

      //Création de l'input qté
      let itemQuantity = document.createElement("input");
      cartItemContentSettingsQuantity.appendChild(itemQuantity);
      itemQuantity.classList.add("itemQuantity");
      itemQuantity.setAttribute("type", "number");
      itemQuantity.setAttribute("name", "itemQuantity");
      itemQuantity.setAttribute("min", "1");
      itemQuantity.setAttribute("max", "100");
      itemQuantity.value = productInCart[products].quantity;

      //Création de la div cart__item__content__settings__delete
      let cartItemContentSettingsDelete = document.createElement("div");
      cartItemContentSettings.appendChild(cartItemContentSettingsDelete);
      cartItemContentSettingsDelete.classList.add(
        "cart__item__content__settings__delete"
      );

      //Création du paragraphe delete item
      let deleteItem = document.createElement("p");
      cartItemContentSettingsDelete.appendChild(deleteItem);
      deleteItem.classList.add("deleteItem");
      deleteItem.innerHTML = "Supprimer";
    }
  }
}

// Total panier
function getTotal() {
  // Récupération du total des quantités

  let cartLines = document.getElementsByClassName("itemQuantity");

  let quantityTotal = 0;

  for (i = 0; i < cartLines.length; i++) {
    quantityTotal += Number(cartLines[i].value);
  }

  // Affichage de la quantité totale
  let totalQuantity = document.getElementById("totalQuantity");
  totalQuantity.innerHTML = quantityTotal;

  // Calcul de prix total

  let totalCart = 0;

  for (let i = 0; i < productInCart.length; i++)
    fetch(`http://localhost:3000/api/products/${productInCart[i]._id}`)
      .then((response) => response.json())
      .catch((err) => console.log(err))
      .then((data) => {
        totalCart += Number(cartLines[i].value) * Number(data.price);
        console.log(totalCart);
        let totalPrice = document.getElementById("totalPrice");
        totalPrice.innerHTML = totalCart;
      });
}

// Modifier quantité
function modifyQuantity() {
 
  let quantityModification = document.getElementsByClassName("itemQuantity");

  for (let j = 0; j < quantityModification.length; j++) {
    quantityModification[j].addEventListener("change", () => {
      /* Sélection de l'élement ayant un valeur quantité différente entre le l'écran 
      et le localStorage */

      let savedValue = productInCart[j].quantity;
      let modifiedValue = Number(quantityModification[j].value);

      const findModification = productInCart.find(
        (el) => el.modifiedValue !== savedValue
      );

      findModification.quantity = modifiedValue;
      productInCart[j].quantity = findModification.quantity;

      localStorage.setItem("products", JSON.stringify(productInCart));

      location.reload();
    });
  }
}

// Supprimer produit
function deleteProduct() {
  let buttonDelete = document.getElementsByClassName("deleteItem");

  for (let k = 0; k < buttonDelete.length; k++) {
    buttonDelete[k].addEventListener("click", () => {
      let idValue = productInCart[k]._id;
      let colorValue = productInCart[k].color;

      productInCart = productInCart.filter(
        (el) => el._id !== idValue || el.color !== colorValue
      );

      localStorage.setItem("products", JSON.stringify(productInCart));

      alert("Votre produit a bien été supprimé du panier");
      location.reload();
    });
  }
}


function getform() {
// Sélection du formulaire
let form = document.querySelector(".cart__order__form");


// Création des expressions régulières pour validation du formulaire
const regularRegExp = /^[a-zA-Z -]{2,}$/;
const addressRegExp = /^[0-9]{1,3}[\s]{1}[a-zA-Z\s,'-]*$/;
const cityRegExp = /^[0-9]{5,}[\s]{1}[a-zA-Z\s,'-]*$/;
const emailRegExp = /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/;

//Écoute de la modification de firstName
form.firstName.addEventListener("change", function () {
  validFirstName(this);
});

//Validation de  firstName
const validFirstName = function (inputFirstName) {
  let firstNameErrorMsg = document.querySelector("#firstNameErrorMsg");

  if (regularRegExp.test(inputFirstName.value)) {
    firstNameErrorMsg.innerHTML = "valide";
    firstNameErrorMsg.style.color = "green";
    
  } else {
    firstNameErrorMsg.innerHTML = "Veuillez renseignez votre prénom. <br> Chiffres et caractères spéciaux interdit.";
    firstNameErrorMsg.style.color = "red";
  }
};



//Écoute de la modification de lastName
form.lastName.addEventListener("change", function () {
  validLastName(this);
});

//Validation de  lastName
const validLastName = function (inputLastName) {
  let lastNameErrorMsg = document.querySelector("#lastNameErrorMsg");

  if (regularRegExp.test(inputLastName.value)) {
    lastNameErrorMsg.innerHTML = "valide";
    lastNameErrorMsg.style.color = "green";
    
  } else {
    lastNameErrorMsg.innerHTML = "Veuillez renseignez votre nom.  <br> Chiffres et caractères spéciaux interdit.";
    lastNameErrorMsg.style.color = "red";
    
  }
 
};



//Écoute de la modification d'address
form.address.addEventListener("change", function () {
  validAddress(this);
});

//Validation d'address
const validAddress = function validAddress (inputAddress) {
  let addressErrorMsg = document.querySelector("#addressErrorMsg");

  if (addressRegExp.test(inputAddress.value)) {
    addressErrorMsg.innerHTML = "valide";
    addressErrorMsg.style.color = "green";
    
  } else {
    addressErrorMsg.innerHTML = `Veuillez renseignez une adresse valide <br> Ex : 2 rue  Maurice Dupont `;
    addressErrorMsg.style.color = "red";
   
  }
};

//Écoute de la modification de city
form.city.addEventListener("change", function () {
  validCity(this);
});

// Validation de city
const validCity = function (inputCity) {
  let cityErrorMsg = document.querySelector("#cityErrorMsg");

  if (cityRegExp.test(inputCity.value)) {
    cityErrorMsg.innerHTML = "valide";
    cityErrorMsg.style.color = "green";
    
  } else {
    cityErrorMsg.innerHTML = `Veuillez renseigner votre code postal et votre ville. <br> Ex : 75000 Paris`;
    cityErrorMsg.style.color = "red";
    
  }
};

//Écoute de la modification d'email
form.email.addEventListener("change", function () {
  validEmail(this);
});

// Validation d'email
const validEmail = function (inputEmail) {
  let emailErrorMsg = document.querySelector("#emailErrorMsg");

  if (emailRegExp.test(inputEmail.value)) {
    emailErrorMsg.innerHTML = "valide";
    emailErrorMsg.style.color = "green";
   
  } else {
    emailErrorMsg.innerHTML = "Veuillez renseignez un email valide";
    emailErrorMsg.style.color = "red";
    console.log("false");
    
  }
};


};




function sendForm() {
  const orderButton = document.getElementById("order");
  
    //Ecoutes du panier
    orderButton.addEventListener("click", (event) => {

        //Récupération des informations du formulaire
        let inputFirstName = document.getElementById("firstName");
        let inputLastName = document.getElementById("lastName");
        let inputAdress = document.getElementById("address");
        let inputCity = document.getElementById("city");
        let inputEmail = document.getElementById("email");


        // Condition pour le déclenchement de l'envoi du formulaire
        if (
          inputFirstName.value !== "" &&
          inputLastName.value !== "" &&
          inputAdress.value !== "" &&
          inputCity.value !== "" &&
          inputEmail.value !== "" &&
          document.querySelector("#firstNameErrorMsg").innerHTML === "valide" &&
          document.querySelector("#lastNameErrorMsg").innerHTML === "valide" &&
          document.querySelector("#addressErrorMsg").innerHTML === "valide" &&
          document.querySelector("#cityErrorMsg").innerHTML === "valide" &&
          document.querySelector("#emailErrorMsg").innerHTML === "valide"
        ) {
          //Construction d'un array depuis le local storage
          let idProducts = [];
          for (let i = 0; i < productInCart.length; i++) {
            idProducts.push(productInCart[i]._id);
          }
          console.log(idProducts);

          const order = {
            contact: {
              firstName: inputFirstName.value,
              lastName: inputLastName.value,
              address: inputAdress.value,
              city: inputCity.value,
              email: inputEmail.value,
            },
            products: idProducts,
          };

          const options = {
            method: "POST",
            body: JSON.stringify(order),
            headers: {
              "Content-Type": "application/json",
            },
          };

          fetch("http://localhost:3000/api/products/order", options)
            .then((async (res) => {
              console.log(res);
              const data = await res.json();
              console.log(data);
              window.location.href = "confirmation.html?id=" + data.orderId;
             
            })) 
           
            .catch((err) => {
              console.log(err.message);
             
            });
        } else {
          event.preventDefault();

          function erreurMsg() {
            let btnSubmit = document.querySelector(
              ".cart__order__form__submit"
            );
            let erreurMsg = document.createElement("p");
            btnSubmit.style.display = "flex";
            btnSubmit.style.flexDirection = "column";
            btnSubmit.style.textAlign = "center";
            btnSubmit.style.fontSize = "0.8rem";
            btnSubmit.appendChild(erreurMsg);
            erreurMsg.innerHTML =
              "Veuiilez compléter tous les champs du formulaire";
            erreurMsg.style.color = "red";

            let timeOutMsg;
            timeOutMsg = window.setTimeout(alertRemove, 1500);
            function alertRemove() {
              erreurMsg.remove();
            }
          }

          erreurMsg();
        }
    
      });
  
  
}





