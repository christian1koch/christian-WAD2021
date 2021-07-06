var userList;
var normalo;
var admina;
var contactList;
var myUrlUsers = 'http://localhost:8000/users'
var myUrlContacts = 'http://localhost:8000/contacts';
var currentId = -1;
httpGetAsync(myUrlUsers,users2UserList);
httpGetAsync(myUrlContacts, contacts2ContactList);

var currentUser;
var currentUserContacts;
var markersOnMap = [];

var currentUpdateElement;
//Login Screen Selectors
const loginScreen = document.querySelector('#login-screen');
const loginForm = document.querySelector('.login-form');
const usernameField = document.getElementById('username-field');
const passwordField = document.getElementById('password-field');
const errorMessages = document.querySelectorAll('.error-message');
const loginButton = document.getElementById('login-button');
const welcomeDiv = document.getElementById('welcome-div');
const html = document.querySelector("html");
const mainScreen = document.getElementById("main-screen");
const logOutButton = document.getElementById("log-out-button");
const greetText = document.getElementById("greet-text");
const adresses = document.querySelector(".adresses");
const mapDiv = document.getElementById('map');
const addNewAddressScreen = document.getElementById('add-new-address-screen');

//Form elements
const formContact = document.querySelector(".add-form");
const formElement = document.querySelectorAll(".add-form");
const formSexRadioBtns = document.querySelectorAll("#sex-radio-btns"); // index 1 = M, index 5 = F, index 9 = D
const formFirstName = document.getElementById("form-first-name");
const formLastName = document.getElementById("form-last-name");
const formStreet = document.getElementById("form-street");
const formStreetNumber = document.getElementById("street-number");
const formPostalCode = document.getElementById("form-plz");
const formCity = document.getElementById("form-city");
const formState = document.getElementById("form-state");
const formCountry = document.getElementById("form-country");
const formEmail = document.getElementById("form-email");
const formPrivacyCheckbox = document.getElementById("form-privacy");
const formSelectOwner = document.getElementById("form-owner");
const formAddButton = document.getElementById("form-add");
const formUpdateButton = document.getElementById("form-update");
const formDeleteButton = document.getElementById("form-delete");
const formPrivacyDiv = document.querySelector(".privacy");
const formErrorMsg = document.getElementById("wrong-address-div");
const updateDeleteButtonsDiv = document.querySelector(".update-delete-buttons");




addNewAddressScreen.style.display = "none";
var geocoder = new google.maps.Geocoder();
var options = {
    zoom:11,
    center: {lat:52.520008,lng: 13.404954}
}
var map = new google.maps.Map(mapDiv, options);
const showMyContactsBtn = document.getElementById("show-my-contacts").addEventListener("click", ()=> {
    //showContacts(myContacts)
    httpShowContacts();
});
const showAllContactsBtn = document.getElementById("show-all-contacts").addEventListener("click", ()=> {
    showContacts(allContacts)
});
const addNewContactBtn = document.getElementById('add-new-contact').addEventListener("click", () => {
    setFormButtons("add");
    clearForm();
    showHideAddressError("hide");
    openCloseForm();
    console.log(formElement);

})


//Contact Constructor
function Contact(sex, firstName, lastName, streetAndNumber, zipCode, city, state, country, email, private, owner){
    this.sex = sex;
    this.firstName = firstName;
    this.lastName = lastName;
    this.streetAndNumber = streetAndNumber;
    this.zipCode = zipCode;
    this.city = city;
    this.state = state;
    this.country = country;
    this.private = private;
    this.owner = owner;
    this.marker = null;
    this.email = email;
    this.sidebarElem = null;
}



//FUNCTIONS------------------------------------
function httpGetAsync(url, callback)
{
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
}
function httpDeleteAsync(url)
{
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open("DELETE", url + "/" + currentUpdateElement.ident, true); // true for asynchronous 
    xmlHttp.send();
}
function httpPostUserAsync(url, callback)
{
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", url, true); // true for asynchronous 
    xmlHttp.setRequestHeader('Content-Type', 'application/json');
    xmlHttp.send(JSON.stringify({
        "username" : usernameField.value,
        "password" : passwordField.value
    }));
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback;
    }
}
function httpPostContactAsync(url, callback, contact)
{
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", url, true); // true for asynchronous 
    xmlHttp.setRequestHeader('Content-Type', 'application/json');
    xmlHttp.send(JSON.stringify(contact));
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        httpGetAsync(myUrlUsers,users2UserList);
        callback;
    }
}


function users2UserList(res){
    userList  = JSON.parse(res);
    normalo = userList[1];
    admina = userList[0];
}

function contacts2ContactList(res){
    contactList = JSON.parse(res);
}
function contacts2ContactListWithShowContacts(res){
    contactList = JSON.parse(res);
    showContacts(myContacts);
}

function httpGetContactsFromDB(){
    httpGetAsync(myUrlContacts, contacts2ContactList);
    showContacts(myContacts);
}


function initMap(){
    for (let i = 0; i < markersOnMap.length; i++) {
        markersOnMap[i].setMap(null);
      }
currentUserContacts.forEach((contact) => {
    markOnMap(contact);
})

}


function markOnMap(contact) {
    geocoder.geocode( { 'address': contact.streetAndNumber + " " + contact.zipCode}, function(results, status) {
        if (status == 'OK') {
            console.log(results[0]);
            let mapMarker = new google.maps.Marker({
                position: {lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng()},
                map
            })
            const contentString = 
            "<div>" +
                "<p>Name:" + contact.firstName + " " + contact.lastName + "</p>"+
                "<p>Address:" + results[0].formatted_address +  "</p>"+
            "</div>"
            const infowindow = new google.maps.InfoWindow({
                content: contentString,
                maxWidth: 200,
                isOpen: false,
              });
              mapMarker.addListener("click", () => {
                infowindow.open(map, mapMarker);
              })
            contact.marker = mapMarker;
            markersOnMap.push(mapMarker);
        } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
      });
}

function setFormButtons(screenType){
    if (screenType == "update"){
        formUpdateButton.style.display = "inline";
        formDeleteButton.style.display = "inline";
        formAddButton.style.display = "none";
    }
    else if (screenType == "add"){
        formUpdateButton.style.display = "none";
        formDeleteButton.style.display = "none";
        formAddButton.style.display = "block";
    }
    if (currentUser.admin) {
        formSelectOwner.style.display = "block";
    }else {
        formSelectOwner.style.display = "none";
    }
}
function selectSexRadio(sex){
    if (sex == "M") {
        formSexRadioBtns[0].childNodes[1].checked = true;
    }else if (sex == "F"){
        formSexRadioBtns[0].childNodes[5].checked = true;
    }else if (sex == "D") {
        formSexRadioBtns[0].childNodes[9].checked = true;
    }
}
function selectOwnerInForm(owner){
    if (owner == "normalo"){
        formSelectOwner.childNodes[3].selected = "false";
        formSelectOwner.childNodes[1].selected = "true";
        console.log("owner Normalo");
    } else {
        formSelectOwner.childNodes[1].selected = "false";
        formSelectOwner.childNodes[3].selected = "true";
        console.log(formSelectOwner.childNodes);
        console.log("owner Admina");
    }
}
function openUpdateScreen(contact){
    console.log("opening Update")
    setFormButtons("update");
    showHideAddressError("hide");
    openCloseForm();
    selectSexRadio(contact.sex);
    formFirstName.value = contact.firstName;
    formLastName.value = contact.lastName;
    formStreet.value = questionText = (contact.streetAndNumber).replace(/\d+|^\s+|\s+$/g,'');
    let streetNum = contact.streetAndNumber.match(/\d/g);
    streetNum = streetNum.join("");
    formStreetNumber.value = streetNum;
    formPostalCode.value = contact.zipCode;
    formCity.value = contact.city;
    formState.value = contact.state;
    formCountry.value = contact.country;
    formEmail.value = contact.email;
    formPrivacyCheckbox.checked = contact.private;
    selectOwnerInForm(contact.owner);
    if (contact.owner != currentUser.username && !currentUser.admin){
        blockEditForm(true);
    } else {
        blockEditForm(false);
    }
}
function clearForm(){
    for (let i = 0; i < formSexRadioBtns[0].childNodes.length; i++) {
        formSexRadioBtns[0].childNodes[i].checked = false;
    }
    formSexRadioBtns[0].childNodes[9].checked = true;

    formFirstName.value = "";
    formLastName.value = "";
    formStreet.value = "";
    let streetNum = "";
    streetNum = "";
    formStreetNumber.value = "";
    formPostalCode.value = "";
    formCity.value = "";
    formState.value = "";
    formCountry.value = "";
    formEmail.value = "";
    formPrivacyCheckbox.checked = false;

}
function blockEditForm(block){
    if (block){
        for(let i = 0; i < formElement[0].length; i++){
            formElement[0][i].disabled = true;
            }
        updateDeleteButtonsDiv.style.display = "none";
        }else {
            for(let i = 0; i < formElement[0].length; i++){
                formElement[0][i].disabled = false;
            }
        updateDeleteButtonsDiv.style.display = "inline";
    }
}
function openCloseForm(){
    if (addNewAddressScreen.style.display === "none"){
        addNewAddressScreen.style.display = "block";
        console.log("open");
    }
    else {
        addNewAddressScreen.style.display = "none";
        console.log("close");
    }
}


//Test display
html.addEventListener("click", (e) => {
    console.log("login Screen display: " + getComputedStyle(loginScreen).getPropertyValue('display'));
    console.log("Welcome Div display: " + getComputedStyle(welcomeDiv).getPropertyValue('display'));
})


loginCredentials = () => {
        if (checkErrorMessages()) {
            console.log("Login Successful " + usernameField.value);
            currentUser = userList.filter((user) => {
                return user.username == usernameField.value;
            })
            currentUser = currentUser[0];
            welcomeUser();
            console.log(currentUser);
            showContacts(myContacts);
            showLogInAnimation();
        }

    
}

checkErrorMessages = () => {
    errorMessages[1].style.display = "none";
    errorMessages[0].style.display = "none";
    if (usernameField.value == "admina" || usernameField.value == "normalo") {
        if (passwordField.value == normalo.password) return true;
        else errorMessages[1].style.display = "block";
    } else errorMessages[0].style.display = "block";
}

showLogInAnimation = () => {
    loginScreen.classList.toggle("fade");
    setTimeout(() => {
        loginScreen.style.display = 'none';
        welcomeDiv.style.display = 'flex';
        welcomeDiv.style.opacity = '0';
        welcomeDiv.style.transition = 'all 1s ease-in';
        setTimeout(() => {
            welcomeDiv.style.opacity = '1';
            setTimeout(() => {
                 welcomeDiv.style.opacity = '0';
                 setTimeout(() => {
                    welcomeDiv.style.display = 'none';
                    mainScreen.style.display = "grid";
                    mainScreen.style.opacity = '0';
                    setTimeout(function(){
                        mainScreen.style.transition = 'all 1s ease-in';
                        mainScreen.style.opacity = '1';
                    }, 500);
                },1000);
             },2000);
        },500);
    },600);        
}


function sleep(milliSeconds) {
    var startTime = new Date().getTime();
    while (new Date().getTime() < startTime + milliSeconds);
  }
/*
Sets the currentUser contacts on the left part of the screen as inputs:buttons.
Adds each contact to owner.sidebarEle
*/
myContacts = () => {
    adresses.innerHTML = ""; 

    const tempcurrentUserContacts = contactList.filter((contact) => {
        return contact.owner == currentUser.username;
    })
    return tempcurrentUserContacts;
}
allContacts = () => {
    adresses.innerHTML = ""; 

    const tempcurrentUserContacts = contactList.filter((contact) => {
        if (currentUser.admin){
            return contactList;
        }
        else {
            if (currentUser.username == contact.owner) return contact;
            return contact.private == false;
        }
    })
    return tempcurrentUserContacts;
}
function httpShowContacts() {
    httpGetAsync(myUrlContacts, contacts2ContactListWithShowContacts);
}
showContacts = (contactListType) => {
        currentUserContacts = contactListType();
        currentUserContacts.forEach((contact) => {
        const contactOnLeft = document.createElement('input');
        contactOnLeft.ident = contact._id;
        
        contactOnLeft.setAttribute("type", "button");
        contactOnLeft.setAttribute("class", "contact-btn");
        contactOnLeft.setAttribute("name", contact.firstName + " " + contact.lastName);
        contactOnLeft.setAttribute("value", contact.firstName + " " + contact.lastName);
        contactOnLeft.onmouseover = () => {
            contactOnLeft.setAttribute("value", contact.streetAndNumber + " " + contact.zipCode + " " + contact.city + " - " + contact.country);
        }
        contactOnLeft.onmouseout = () => {
            contactOnLeft.setAttribute("value", contact.firstName + " " + contact.lastName);
        }
        contactOnLeft.addEventListener("click", () => {
            console.log("hi");
            openUpdateScreen(contact);
            currentUpdateElement = contactOnLeft;
            console.log("id = " + contactOnLeft.ident);
        });
        adresses.appendChild(contactOnLeft);
        contact.sidebarElem = contactOnLeft;
        console.log(adresses);
    })
    initMap();
}
/*
Logs out the currentUser, bringing the screen back to the login Screen and
setting the currentUser to null and the currentUserContacts to null
*/

logOut = () =>{
    mainScreen.style.opacity = '0';
    setTimeout(() => {
        mainScreen.style.display = 'none'
        addNewAddressScreen.style.display = 'none';
        loginScreen.style.display = "flex";
        setTimeout(function(){
            loginScreen.classList.toggle("fade");
        },500);
        
    },1000);
    currentUser = null;
    currentUserContacts = null;
    welcomeDiv.removeChild(welcomeDiv.lastChild);
    
}




/**
 * adds a h1 to the welcomeDiv with the text "Welcome " + the current user.
 **/

welcomeUser = () => {
    const welcomeh1 = document.createElement("h1");
    let welcomeInnerText = "Welcome " + currentUser.username;
    welcomeh1.innerText = welcomeInnerText;
    welcomeDiv.append(welcomeh1);
    greetText.innerText = welcomeInnerText.toUpperCase();
    
}
getSexInForm =() =>{

    if (formSexRadioBtns[0].childNodes[1].checked == true) return "M";
    else if (formSexRadioBtns[0].childNodes[5].checked == true) return "F";
    else if (formSexRadioBtns[0].childNodes[9].checked == true) return "D";
}
getOwnership = () => {
    if (currentUser == normalo) return normalo.username;
    else {
        let ownerName = formSelectOwner.options[formSelectOwner.selectedIndex].value;
        owner = userList.filter((user) => {
            return user.username == ownerName;
        })
        console.log("this new owner is...")
        console.log(owner)
        return owner[0].username;
    }
}
getContactInfoOnSubmit = () => {
    let contact = new Contact(getSexInForm(),formFirstName.value, formLastName.value, formStreet.value + " " + formStreetNumber.value,
     formPostalCode.value, formCity.value, formState.value, formCountry.value, formEmail.value, formPrivacyCheckbox.checked, getOwnership())
     console.log(contact);
     return contact;
}

checkAddressAndDo = (contact, toDo) => {
    geocoder.geocode( { 'address': contact.streetAndNumber + " " + contact.zipCode}, function(results, status) {
        if (status == 'OK') {
            let currentCoords = [results[0].geometry.location.lat(), results[0].geometry.location.lng()]
            contact.geoCoord = currentCoords;
            toDo(contact);
        } else {
            toDo(false);
        }
      });
}
todoAfterCheckAddress = (contact) =>{ // ACA HAGO EL HTERTETEHKEWWEUIBKWAEBZBZWABKNWNIL
    if (contact == false){
        
        showHideAddressError("show");
    }else {
        console.log('creating contact...');
        httpPostContactAsync(myUrlContacts, showContacts(myContacts), contact);
        
        openCloseForm();
    }
    
}


todoAfterCheckAddressUpdate = (contact) =>{
    if (contact == false){
        showHideAddressError("show");
    }else {
        let newContactList = contactList.filter((contact) => {
            return contact.sidebarElem != currentUpdateElement;
        })
        contactList = newContactList;
        contactList.push(contact);
        console.log(currentUserContacts);
        showContacts(myContacts);
        console.log(contactList);
        openCloseForm();
    }
    
}
showHideAddressError = (showHide) =>{
    if(showHide == "hide"){
        formErrorMsg.style.display = "none";
    } else formErrorMsg.style.display = "block";
}
/*--------------EVENT LISTENERS------------------------------------*/

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    httpPostUserAsync(myUrlUsers, loginCredentials());
   

});

formContact.addEventListener("submit",(e) => {
    e.preventDefault();
    showHideAddressError("hide");
    let contact = getContactInfoOnSubmit();
    checkAddressAndDo(contact, todoAfterCheckAddress);


})
formDeleteButton.addEventListener("click", () => {
    httpDeleteAsync(myUrlContacts)
    let newContactList = contactList.filter((contact) => {
        return contact.sidebarElem != currentUpdateElement;
    })
    contactList = newContactList;
    openCloseForm();
    //showContacts(myContacts);
    httpShowContacts();

})
formUpdateButton.addEventListener("click", () => {
    showHideAddressError("hide");
    let contact = getContactInfoOnSubmit();
    checkAddressAndDo(contact, todoAfterCheckAddressUpdate);
})


logOutButton.addEventListener("click", logOut);