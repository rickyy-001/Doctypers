(() => {
  // ADD LATER: fill these in once you have them. Leave a value empty ("") to switch that option off.
  // whatsapp: full international number, digits only, no + or spaces (example: "233201234567")
  const CONTACT = {
    teamName: "DOCTYPERS",
    email: "",
    whatsapp: "",
  };

  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  const links = document.querySelector(".contact__links");
  if (!form || !status) return;

  const whatsappNumber = CONTACT.whatsapp.replace(/\D/g, "");

  if (links) {
    const addLink = (label, href) => {
      const item = document.createElement("li");
      const anchor = document.createElement("a");
      anchor.textContent = label;
      anchor.href = href;
      item.appendChild(anchor);
      links.appendChild(item);
    };
    if (CONTACT.email) addLink(CONTACT.email, `mailto:${CONTACT.email}`);
    if (whatsappNumber) addLink("Message us on WhatsApp", `https://wa.me/${whatsappNumber}`);
  }

  const setStatus = (message, type) => {
    status.textContent = message;
    status.classList.toggle("is-error", type === "error");
    status.classList.toggle("is-success", type === "success");
  };

  const fields = ["name", "project-type", "message"].map((id) => form.elements[id]);

  fields.forEach((input) => {
    input.addEventListener("input", () => {
      input.closest(".field").classList.remove("has-error");
      setStatus("", "");
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const invalid = fields.filter((input) => !input.value.trim());
    fields.forEach((input) => {
      input.closest(".field").classList.toggle("has-error", invalid.includes(input));
      input.toggleAttribute("aria-invalid", invalid.includes(input));
    });

    if (invalid.length) {
      setStatus("Please fill in the highlighted fields.", "error");
      invalid[0].focus();
      return;
    }

    if (!whatsappNumber && !CONTACT.email) {
      setStatus("Contact details are coming soon. Please check back shortly.", "error");
      return;
    }

    const name = form.elements.name.value.trim();
    const type = form.elements["project-type"].value;
    const message = form.elements.message.value.trim();
    const text = `Hi ${CONTACT.teamName}, my name is ${name}.\nI need: ${type}.\n\n${message}`;

    if (whatsappNumber) {
      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
      setStatus("Opening WhatsApp with your message ready to send.", "success");
    } else {
      const subject = encodeURIComponent(`New project enquiry: ${type}`);
      window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${encodeURIComponent(text)}`;
      setStatus("Opening your email app with your message ready to send.", "success");
    }

    form.reset();
  });
})();