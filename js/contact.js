(() => {
  // Leave a value empty ("") to switch that option off.
  // whatsapp: a WhatsApp username (with or without @) or a full international number, digits only.
  const CONTACT = {
    teamName: "DOCTYPERS",
    email: "contact.doctypers@gmail.com",
    whatsapp: "Doctypers",
  };

  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  const links = document.querySelector(".contact__links");
  if (!form || !status) return;

  const raw = CONTACT.whatsapp.trim();
  const digits = raw.replace(/\D/g, "");
  const isNumber = /^[+\d\s()-]+$/.test(raw) && digits.length >= 7;
  const whatsappTarget = isNumber ? digits : raw.replace(/^@/, "");
  const channels = { whatsapp: Boolean(whatsappTarget), email: Boolean(CONTACT.email) };

  if (links) {
    const addLink = (label, href) => {
      const item = document.createElement("li");
      const anchor = document.createElement("a");
      anchor.textContent = label;
      anchor.href = href;
      item.appendChild(anchor);
      links.appendChild(item);
    };
    if (channels.email) addLink(CONTACT.email, `mailto:${CONTACT.email}`);
    if (channels.whatsapp) addLink("Message us on WhatsApp", `https://wa.me/${whatsappTarget}`);
  }

  if (channels.whatsapp || channels.email) {
    form.querySelectorAll("[type=submit]").forEach((button) => {
      if (!channels[button.value]) button.remove();
    });
    const left = form.querySelectorAll("[type=submit]");
    if (left.length === 1) {
      left[0].textContent = "Send message";
      left[0].className = "btn btn--primary";
    }
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

    if (!channels.whatsapp && !channels.email) {
      setStatus("Contact details are coming soon. Please check back shortly.", "error");
      return;
    }

    const requested = event.submitter && event.submitter.value;
    const channel = channels[requested] ? requested : channels.whatsapp ? "whatsapp" : "email";

    const name = form.elements.name.value.trim();
    const type = form.elements["project-type"].value;
    const message = form.elements.message.value.trim();
    const text = `Hi ${CONTACT.teamName}, my name is ${name}.\nI need: ${type}.\n\n${message}`;

    const copied = navigator.clipboard
      ? navigator.clipboard.writeText(text).then(() => true, () => false)
      : Promise.resolve(false);

    if (channel === "whatsapp") {
      window.open(`https://wa.me/${whatsappTarget}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
      copied.then((ok) =>
        setStatus(
          ok
            ? "Opening WhatsApp. If your message isn't filled in, paste it into the chat. We've copied it for you."
            : "Opening WhatsApp. If your message isn't filled in, please type it into the chat.",
          "success"
        )
      );
    } else {
      const subject = encodeURIComponent(`New project enquiry: ${type}`);
      window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${encodeURIComponent(text)}`;
      copied.then((ok) =>
        setStatus(
          `Opening your email app. If nothing opens, ${ok ? "paste your copied message into an email" : "send your message"} to ${CONTACT.email}.`,
          "success"
        )
      );
    }

    form.reset();
  });
})();