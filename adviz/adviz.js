var welcomeDivTransition = 0;
var normalo = {
    username : "normalo",
    password : "123",
    admin : false

}
var admina = {
    username : "admina",
    password : "123",
    admin : true
}
var contact1 = new Contact("Johanna", "Rueda", "Müllerstraße 151", "13353", "Berlin", "Berlin", "Deutschland", true, admina);
var contact2 = new Contact("Daniel", "Sight", "kantstraße 104", "10627", "Berlin", "Berlin", "Deutschland", false, admina);
var contact3 = new Contact("Megan Thee", "Stallion", "schillerstraße 10", "10625", "Berlin", "Berlin", "Deutschland", true, normalo);
var contact4 = new Contact("Alexander", "Sanchez", "paracelsusstraße 13", "13187", "Berlin", "Berlin", "Deutschland", false, normalo);
var contactList = [contact1, contact2, contact3, contact4];
var currentUser;
var currentUserContacts;
userList = [admina, normalo];

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
var geocoder = new google.maps.Geocoder();
var options = {
    zoom:11,
    center: {lat:52.520008,lng: 13.404954}
}
var map = new google.maps.Map(mapDiv, options);
const showMyContactsBtn = document.getElementById("show-my-contacts").addEventListener("click", ()=> {
    showContacts(myContacts)
});
const showAllContactsBtn = document.getElementById("show-all-contacts").addEventListener("click", ()=> {
    showContacts(allContacts)
});

//Contact Constructor
function Contact(firstName, lastName, streetAndNumber, zipCode, city, state, country, private, owner){
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
    this.sidebarElem = null;
}


//
//START OF THE SCRIPT---------------------------------------------------------------------------------------------------------
//
function initMap(){
currentUserContacts.forEach((contact) => {
    console.log("setting marker");
    let mapMarker = new google.maps.Marker({
        position: getCoordinates(contact.streetAndNumber),
        map,
        text: 'Paco',
    })

}
    
)
}
function getCoordinates(address) {
    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == 'OK') {
            console.log(results);
            console.log({lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng()});
          return {lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng()}
        } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
      });
}




//Test display
html.addEventListener("click", (e) => {
    console.log("login Screen display: " + getComputedStyle(loginScreen).getPropertyValue('display'));
    console.log("Welcome Div display: " + getComputedStyle(welcomeDiv).getPropertyValue('display'));
})

//FUNCTIONS------------------------------------
loginCredentials = () => {
    errorMessages[1].style.display = "none";
    errorMessages[0].style.display = "none";
    if (usernameField.value == "admina" || usernameField.value == "normalo") {
        if (passwordField.value == "123") {
            console.log("Login Successful " + usernameField.value);
            currentUser = userList.filter((user) => {
                return user.username == usernameField.value;
            })
            currentUser = currentUser[0];
            welcomeUser();
            console.log(currentUser);
            showContacts(myContacts);
            initMap();
            loginScreen.classList.toggle("fade");
            //Animation from Login Screen to Main Screen
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
            //END OF THE ANIMATION  
        }

        else errorMessages[1].style.display = "block";
    } else {
        errorMessages[0].style.display = "block";
    }
    
}
/*
Sets the currentUser contacts on the left part of the screen as inputs:buttons.
Adds each contact to owner.sidebarEle
*/
myContacts= () => {
    adresses.innerHTML = ""; 
    const tempcurrentUserContacts = contactList.filter((contact) => {
        return contact.owner == currentUser;
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
            if (currentUser == contact.owner) return contact;
            return contact.private == false;
        }
    })
    return tempcurrentUserContacts;
}
showContacts = (contactListType) => {
        currentUserContacts = contactListType();
        currentUserContacts.forEach((contact) => {
        const contactOnLeft = document.createElement('input');
        contactOnLeft.setAttribute("type", "button");
        contactOnLeft.setAttribute("class", "contact-btn");
        contactOnLeft.setAttribute("name", contact.firstName + " " + contact.lastName);
        contactOnLeft.setAttribute("value", contact.firstName + " " + contact.lastName);
        adresses.appendChild(contactOnLeft);
        contact.sidebarElem = contactOnLeft;
        console.log(adresses);
    })
}
/*
Logs out the currentUser, bringing the screen back to the login Screen and
setting the currentUser to null and the currentUserContacts to null
*/

logOut = () =>{
    mainScreen.style.opacity = '0';
    setTimeout(() => {
        mainScreen.style.display = 'none'
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
/*--------------EVENT LISTENERS------------------------------------*/

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
   loginCredentials();

});

logOutButton.addEventListener("click", logOut);