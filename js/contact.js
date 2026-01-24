document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#contactForm");
    const submitBtn = form.querySelector(".submit-btn");

    const fields = {
        name: form.querySelector("#name"),
        email: form.querySelector("#email"),
        phone: form.querySelector("#phone"),
        message: form.querySelector("textarea"),
    };

    const validators = {
        name: value => value.length >= 2,
        email: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        phone: value => /^[0-9]{10}$/.test(value),
        message: value => value.length >= 10,
    };

    function showError(input, message) {
        input.classList.add("error");
        let error = input.nextElementSibling;
        if (!error || !error.classList.contains("error-text")) {
            error = document.createElement("small");
            error.className = "error-text";
            input.after(error);
        }
        error.textContent = message;
        error.style.marginTop = "5px";
        error.style.color = "red";
    }

    function clearError(input) {
        input.classList.remove("error");
        const error = input.nextElementSibling;
        if (error && error.classList.contains("error-text")) {
            error.remove();
        }
    }

    function validateField(name, input) {
        const value = input.value.trim();

        if (!value) {
            showError(input, "This field is required");
            return false;
        }

        if (!validators[name](value)) {
            const messages = {
                name: "Enter a valid name",
                email: "Enter a valid email",
                phone: "Enter 10-digit phone number",
                message: "Message must be at least 10 characters",
            };
            showError(input, messages[name]);
            return false;
        }

        clearError(input);
        return true;
    }

    form.addEventListener("input", e => {
        const fieldName = Object.keys(fields).find(
            key => fields[key] === e.target
        );
        if (fieldName) {
            validateField(fieldName, e.target);
        }
    });

    form.addEventListener("submit", async e => {
        e.preventDefault();

        let isFormValid = true;
        const payload = {};

        for (const key in fields) {
            const input = fields[key];
            const valid = validateField(key, input);
            if (!valid) isFormValid = false;
            payload[key] = input.value.trim();
        }

        if (!isFormValid) return;

        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";

        try {
            const res = await fetch("contact.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Failed");

            alert(data.message || "Message sent successfully!");
            form.reset();

        } catch (err) {
            alert("Server error. Try again later.");
            console.error(err);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = "Send Message";
        }
    });
});
