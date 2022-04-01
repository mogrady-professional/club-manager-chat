// Import Constructors
import Search from "./modules/search";
import Chat from "./modules/chat";
import RegistrationForm from "./modules/registrationForm";

// Render only if the Registration form is on the Current Page
if (document.querySelector("#registration-form")) {
    // Call constructor
    new RegistrationForm();
}

// Chat feature only for logged in users -> if element exists
if (document.querySelector("#chat-wrapper")) {
    new Chat();
}

// Trigger constructor from class -> if the element is visible on the page.; person is logged in!
if (document.querySelector(".header-search-icon")) {
    new Search();
}