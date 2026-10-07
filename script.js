const form = document.getElementById("contact-form");
const successMessage = document.getElementById("success-message");

const validateText = (input, errorElement, requiredMessage) => {
  const value = input.value.trim();

  if (!value) {
    markInvalid(input, errorElement, requiredMessage);
    return false;
  }

  clearInvalid(input, errorElement);
  return true;
};

const validateEmail = (input, errorElement) => {
  const value = input.value.trim();

  if (!value) {
    markInvalid(input, errorElement, "This field is required");
    return false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(value)) {
    markInvalid(input, errorElement, "Please enter a valid email address");
    return false;
  }

  clearInvalid(input, errorElement);
  return true;
};

const validateRadioGroup = (radioInputs, errorElement) => {
  const selectedRadio = [...radioInputs].some((radio) => radio.checked);

  if (!selectedRadio) {
    radioInputs.forEach((radio) => {
      radio.setAttribute("aria-invalid", "true");
    });
    errorElement.parentElement.classList.add("has-error");
    errorElement.style.display = "block";
    return false;
  }

  radioInputs.forEach((radio) => {
    radio.setAttribute("aria-invalid", "false");
  });
  errorElement.parentElement.classList.remove("has-error");
  errorElement.style.display = "none";
  return true;
};

const validateCheckbox = (checkbox, errorElement) => {
  if (!checkbox.checked) {
    checkbox.setAttribute("aria-invalid", "true");
    checkbox.closest(".consent-field").classList.add("has-error");
    errorElement.style.display = "block";
    return false;
  }

  checkbox.setAttribute("aria-invalid", "false");
  checkbox.closest(".consent-field").classList.remove("has-error");
  errorElement.style.display = "none";
  return true;
};

const markInvalid = (input, errorElement, message) => {
  input.setAttribute("aria-invalid", "true");
  input.closest(".field").classList.add("has-error");
  errorElement.textContent = message;
  errorElement.style.display = "block";
};

const clearInvalid = (input, errorElement) => {
  input.setAttribute("aria-invalid", "false");
  input.closest(".field").classList.remove("has-error");
  errorElement.style.display = "none";
};

const validateField = (input) => {
  const field = input.closest(".field");
  const errorElement = field?.querySelector(".error-message");

  if (!field || !errorElement) return true;

  successMessage.hidden = true;

  if (input.name === "firstName") {
    return validateText(input, errorElement, "This field is required");
  }

  if (input.name === "lastName") {
    return validateText(input, errorElement, "This field is required");
  }

  if (input.name === "email") {
    return validateEmail(input, errorElement);
  }

  if (input.name === "message") {
    return validateText(input, errorElement, "This field is required");
  }

  return true;
};

const textInputs = document.querySelectorAll(
  'input[type="text"], input[type="email"], textarea',
);
textInputs.forEach((input) => {
  input.addEventListener("input", () => validateField(input));
  input.addEventListener("blur", () => validateField(input));
});

const radioInputs = document.querySelectorAll('input[name="queryType"]');
const queryError = document.getElementById("query-type-error");

radioInputs.forEach((radio) => {
  radio.addEventListener("change", () => {
    successMessage.hidden = true;
    validateRadioGroup(radioInputs, queryError);
  });
});

const consentCheckbox = document.getElementById("consent");
const consentError = document.getElementById("consent-error");

consentCheckbox.addEventListener("change", () => {
  successMessage.hidden = true;
  validateCheckbox(consentCheckbox, consentError);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const firstName = document.getElementById("first-name");
  const lastName = document.getElementById("last-name");
  const email = document.getElementById("email");
  const message = document.getElementById("message");

  const isFirstNameValid = validateField(firstName);
  const isLastNameValid = validateField(lastName);
  const isEmailValid = validateField(email);
  const isQueryTypeValid = validateRadioGroup(radioInputs, queryError);
  const isMessageValid = validateField(message);
  const isConsentValid = validateCheckbox(consentCheckbox, consentError);

  if (
    isFirstNameValid &&
    isLastNameValid &&
    isEmailValid &&
    isQueryTypeValid &&
    isMessageValid &&
    isConsentValid
  ) {
    form.reset();
    successMessage.hidden = false;
    document
      .querySelectorAll(".field")
      .forEach((field) => field.classList.remove("has-error"));
    document.querySelectorAll(".error-message").forEach((element) => {
      element.style.display = "none";
    });
  }
});
