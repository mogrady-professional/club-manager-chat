import axios from "axios"; // Used to check database for existing Username

export default class RegistrationForm {
    constructor() {
        //  Get  CSRF protection token for the Axios request (csurf package)
        this._csrf = document.querySelector('[name="_csrf"]').value;

        // Select HTML form element
        this.form = document.querySelector("#registration-form");

        // Return array of multiple elements-> .form-control elements on the #registration-form (username, email, password)
        this.allFields = document.querySelectorAll(
            "#registration-form .form-control"
        );

        this.insertValidationElements();
        // Username
        // Listen for each keystroke on this element
        this.username = document.querySelector("#username-register");
        // Placeholders for previous value to checks
        this.username.previousValue = "";
        // Email
        this.email = document.querySelector("#email-register");
        this.email.previousValue = "";
        // Password
        this.password = document.querySelector("#password-register");
        this.password.previousValue = "";

        // Set unique email and password false -> let the Axios request update these to true before form is aloud to be submitted
        this.username.isUnique = false;
        this.email.isUnique = false;
        this.events();
    }

    // Events
    events() {
        // Listen for form submission -> run function
        this.form.addEventListener("submit", (e) => {
            // Prevent form submission
            e.preventDefault();
            this.formSubmitHandler();
        });

        // alert("Registration form js is running.");

        // KEYUP listeners
        // Username -> validation
        // Listen for each keystroke on this element
        this.username.addEventListener("keyup", () => {
            // 1-> Give it the element in question
            // 2-> Function to run if the value of the field has actually changed
            this.isDifferent(this.username, this.usernameHandler);
        });

        // Email -> validation
        this.email.addEventListener("keyup", () => {
            // 1-> Give it the element in question
            // 2-> Function to run if the value of the field has actually changed
            this.isDifferent(this.email, this.emailHandler);
        });

        // Password -> validation
        this.password.addEventListener("keyup", () => {
            // 1-> Give it the element in question
            // 2-> Function to run if the value of the field has actually changed
            this.isDifferent(this.password, this.passwordHandler);
        });

        // BLUR listeners -> exit off of or loose focus
        // Username -> validation
        // Listen for each keystroke on this element
        this.username.addEventListener("blur", () => {
            // 1-> Give it the element in question
            // 2-> Function to run if the value of the field has actually changed
            this.isDifferent(this.username, this.usernameHandler);
        });

        // Email -> validation
        this.email.addEventListener("blur", () => {
            // 1-> Give it the element in question
            // 2-> Function to run if the value of the field has actually changed
            this.isDifferent(this.email, this.emailHandler);
        });

        // Password -> validation
        this.password.addEventListener("blur", () => {
            // 1-> Give it the element in question
            // 2-> Function to run if the value of the field has actually changed
            this.isDifferent(this.password, this.passwordHandler);
        });
    }

    // Methods

    formSubmitHandler() {
        // 1-> Run Validation Checks
        this.usernameImmediately();
        this.usernameAfterDelay();
        this.emailAfterDelay();
        this.passwordImmediately();
        this.passwordAfterDelay();
        // 2-> if there are no errors and all validation checks are passed
        if (
            this.username.isUnique &&
            !this.username.errors &&
            this.email.isUnique &&
            !this.email.errors &&
            !this.password.errors
        ) {
            this.form.submit();
            console.log("Success");
        } else {
            console.log("err");
        }
    }

    insertValidationElements() {
        // Array -> forEach -> element
        this.allFields.forEach(function(el) {
            el.insertAdjacentHTML(
                "afterend",
                '<div class="alert alert-danger small liveValidateMessage"></div>'
            );
        });
    }

    isDifferent(el, handler) {
        // 1-> See if the field's value has changed after each keypress
        if (el.previousValue != el.value) {
            // 2-> If value has changed from previous value -> Call handler
            handler.call(this); // 1-> call is available to functions -> this (pointer) keyword is set here -> calls the second parameter -> runs the 👇 usernameHandler method
        }
        // 3-> The previous value should now be set to the current value
        el.previousValue = el.value;
        // 4-> Next time this function runs -> values make sense -> while keeping track of the previous value each time
    }

    // Username Validation
    usernameHandler() {
        // alert("Username handler just ran.");

        // each time this runs the user is given a clean slate -> assuming there are no errors -> validation checks will be run each time
        this.username.errors = false;
        // -> Validation Checks that Run Immediately
        this.usernameImmediately();

        clearTimeout(this.username.timer); // -> Restart timer

        // Timeout run after 800ms -> only runs function if character is not typed after 800 m/s
        this.username.timer = setTimeout(() => this.usernameAfterDelay(), 800);
    }

    // Password Validation
    passwordHandler() {
        // alert("Username handler just ran.");

        // each time this runs the user is given a clean slate -> assuming there are no errors -> validation checks will be run each time
        this.password.errors = false;
        // -> Validation Checks that Run Immediately -> check max character length
        this.passwordImmediately();

        clearTimeout(this.password.timer); // -> Restart timer

        // Timeout run after 800ms -> only runs function if character is not typed after 800 m/s
        this.password.timer = setTimeout(() => this.passwordAfterDelay(), 800);
    }

    passwordImmediately() {
        if (this.password.value.length > 50) {
            //
            this.showValidationError(
                this.password,
                "Password cannot exceed 50 characters."
            );
        }
        // If there are no errors -> hide the validation message
        if (!this.password.errors) {
            this.hideValidationError(this.password);
        }
    }

    passwordAfterDelay() {
        if (this.password.value.length < 12) {
            this.showValidationError(
                this.password,
                "Password must be at least 12 characters."
            );
        }
    }

    // Email Validation
    emailHandler() {
        // alert("Username handler just ran.");

        // each time this runs the user is given a clean slate -> assuming there are no errors -> validation checks will be run each time
        this.email.errors = false;

        clearTimeout(this.email.timer); // -> Restart timer

        // Timeout run after 800ms -> only runs function if character is not typed after 800 m/s
        this.email.timer = setTimeout(() => this.emailAfterDelay(), 800);
    }

    // Email Validation
    emailAfterDelay() {
        // Ensure the email is in the correct format -> test against regex
        if (!/^\S+@\S+$/.test(this.email.value)) {
            // Incorrect email format
            this.showValidationError(
                this.email,
                "You must provide a valid email address."
            );
        }
        // Check if email is already registered -> only if the email address is valid
        if (!this.email.errors) {
            // Send request to server -> check if email is already in use
            // Parameters-> a) URL to send request to, b) object to send to server
            // Server will respond with true or false
            // CSRF Token included for Axios request
            axios
                .post("/doesEmailExist", { _csrf: this._csrf, email: this.email.value })
                .then((response) => {
                    if (response.data) {
                        //
                        this.email.isUnique = false;
                        this.showValidationError(
                            this.email,
                            "That email is already being used."
                        );
                    } else {
                        // False -> good response, email does not already exist in MongoDB
                        this.email.isUnique = true;
                        // Hide Error Message
                        this.hideValidationError(this.email);
                    }
                })
                .catch(() => {
                    // Unexpected technical difficulties
                    console.log("Please try again later");
                });
            // Add route on serverside for this.
        }
    }

    usernameImmediately() {
        // console.log("Immediate method just ran.");
        // 1-> Check if field contains any non alphanumeric characters
        // 2-> Server side, this is handled by leveraging the validator package by NPM
        // 3-> Validator package is +34kb unnecessary code visitors have to download
        // 4-> Functionality required as below
        // 4a-> Ensure username value is not empty or contains non alphanumeric value with regex in JS
        if (
            this.username.value != "" &&
            !/^([a-zA-Z0-9]+)$/.test(this.username.value)
        ) {
            // alert("Username can only contain letters and numbers.");
            // 1-> Show Validation Message
            // 2-> Reusable element so given 2 parameters to make dynamic; a) Field, b) Message to display
            this.showValidationError(
                this.username,
                "Username can only contain letters and numbers."
            );
        }
        // 4c -> Validation check to prevent Usernames longer than 30 characters
        if (this.username.value.length > 30) {
            this.showValidationError(
                this.username,
                "Username cannot exceed 30 characters."
            );
        }

        // 4b -> Remove error message when illegal character is removed  -> if there are no errors
        if (!this.username.errors) {
            // Hide error rectangle -> pass in the field
            this.hideValidationError(this.username);
        }
    }

    // Pass in the element as a parameter
    hideValidationError(el) {
        // 1-> Element in question
        // 2-> Next HTML element after it (red validation boxes) -> remove the error message from the DOM
        el.nextElementSibling.classList.remove("liveValidateMessage--visible");
    }

    // 2 Parameters: pass in -> a) element , b) message
    showValidationError(el, message) {
        // 1-> Element in question
        // 2-> Next HTML element after it (red validation boxes)
        el.nextElementSibling.innerHTML = message;
        el.nextElementSibling.classList.add("liveValidateMessage--visible");

        // 3-> After illegal character is removed -> remove error message
        el.errors = true; // -> If this is ever called, there's errors with this field
    }

    usernameAfterDelay() {
        // alert("After delay method finally ran.");
        // 1-> Minimum character length validation check -> run after 3000 m/s
        if (this.username.value.length < 3) {
            this.showValidationError(
                this.username,
                "Username must be at least 3 characters."
            );
        }
        // 2-> Send request to server to see if Username already exists -> if there are no errors
        if (!this.username.errors) {
            // a-> If there are no problems with the current value -> send axios request to see if Username is available
            // b-> give Axios 2 arguments: a) URL to send request to, b) Data to send to the server -> current value user is typing for Username
            // c-> Build Route on the server -> the server will either send back true or false -> based on the current Username
            // d-> Once response from server is recieved -> .then is run
            axios
                .post("/doesUsernameExist", {
                    _csrf: this._csrf,
                    username: this.username.value,
                })
                .then((response) => {
                    if (response.data) {
                        // Responds with true -> Username already exists
                        // Show red error validation message
                        this.showValidationError(
                            this.username,
                            "That username is already taken."
                        );
                        this.username.isUnique = false;
                    } else {
                        // Username is available
                        this.username.isUnique = true;
                    }
                })
                .catch(() => {
                    // Unexpected error with MongoDB database
                    console.log("Please try again later");
                });
            // Set up serverside route in express to match URL
        }
    }
}