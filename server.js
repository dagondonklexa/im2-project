const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

const contactPath = path.join(__dirname, "contact.json");
let contact = require(contactPath); // load contacts

app.use(express.json());

// GET all contacts
app.get("/api/contact", function (req, res) {
  res.json(contact);
});

// POST add new contact
app.post("/api/add-contact", function (req, res) {
  const newContact = req.body;

  if (!newContact.name || !newContact.email) {
    return res.status(400).json({ message: "Name and email are required." });
  }

  newContact.id = Date.now();
  contact.push(newContact);

  fs.writeFileSync(contactPath, JSON.stringify(contact, null, 2));

  res.status(201).json({ message: "Contact added", data: newContact });
});

// PUT update contact by id
app.put("/api/update-contact/:id", function (req, res) {
  const contactId = Number(req.params.id);
  const updateData = req.body;

  const index = contact.findIndex(c => c.id === contactId);
  if (index === -1) {
    return res.status(404).json({ message: "Contact not found." });
  }

  contact[index] = { ...contact[index], ...updateData };

  fs.writeFileSync(contactPath, JSON.stringify(contact, null, 2));
  res.json({ message: "Contact updated", data: contact[index] });
});

// DELETE contact by id
app.delete("/api/delete-contact/:id", function (req, res) {
  const contactId = Number(req.params.id);
  const index = contact.findIndex(c => c.id === contactId);

  if (index === -1) {
    return res.status(404).json({ message: "Contact not found." });
  }

  const deleted = contact.splice(index, 1);

  fs.writeFileSync(contactPath, JSON.stringify(contact, null, 2));
  res.json({ message: "Contact deleted", data: deleted[0] });
});

app.listen(5000, function () {
  console.log(`http://localhost:5000`);
});
