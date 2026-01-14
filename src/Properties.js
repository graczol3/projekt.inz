import React, { useState } from "react";
import "./Properties.css";

export default function Properties() {
  const [properties, setProperties] = useState([
    {
      id: 1,
      name: "Apartament Centrum",
      address: "ul. Główna 15, Warszawa",
      type: "Mieszkanie",
      rooms: 3,
      area: 65,
      price: 3500,
      status: "Dostępne"
    },
    {
      id: 2,
      name: "Dom Rodzinny",
      address: "ul. Leśna 8, Kraków",
      type: "Dom",
      rooms: 5,
      area: 120,
      price: 6000,
      status: "Wynajęte"
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    type: "Mieszkanie",
    rooms: "",
    area: "",
    price: "",
    status: "Dostępne"
  });

  // Obsługa zmian w formularzu
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Dodawanie nowej nieruchomości
  const handleAddProperty = (e) => {
    e.preventDefault();
    const newProperty = {
      id: Date.now(),
      ...formData,
      rooms: parseInt(formData.rooms),
      area: parseFloat(formData.area),
      price: parseFloat(formData.price)
    };
    setProperties([...properties, newProperty]);
    resetForm();
  };

  // Edycja nieruchomości
  const handleEditProperty = (e) => {
    e.preventDefault();
    setProperties(
      properties.map((prop) =>
        prop.id === editingId
          ? {
              ...formData,
              id: editingId,
              rooms: parseInt(formData.rooms),
              area: parseFloat(formData.area),
              price: parseFloat(formData.price)
            }
          : prop
      )
    );
    resetForm();
  };

  // Usuwanie nieruchomości
  const handleDeleteProperty = (id) => {
    if (window.confirm("Czy na pewno chcesz usunąć tę nieruchomość?")) {
      setProperties(properties.filter((prop) => prop.id !== id));
    }
  };

  // Rozpoczęcie edycji
  const startEdit = (property) => {
    setEditingId(property.id);
    setFormData({
      name: property.name,
      address: property.address,
      type: property.type,
      rooms: property.rooms,
      area: property.area,
      price: property.price,
      status: property.status
    });
    setShowForm(true);
  };

  // Resetowanie formularza
  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      type: "Mieszkanie",
      rooms: "",
      area: "",
      price: "",
      status: "Dostępne"
    });
    setShowForm(false);
    setEditingId(null);
  };

  return (
    <div className="properties-container">
      <div className="properties-header">
        <h2>🏢 Zarządzanie Nieruchomościami</h2>
        <button
          className="btn-add"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "❌ Anuluj" : "➕ Dodaj nieruchomość"}
        </button>
      </div>

      {/* Formularz dodawania/edycji */}
      {showForm && (
        <div className="property-form">
          <h3>{editingId ? "✏️ Edytuj nieruchomość" : "➕ Nowa nieruchomość"}</h3>
          <form onSubmit={editingId ? handleEditProperty : handleAddProperty}>
            <div className="form-row">
              <div className="form-group">
                <label>Nazwa:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Adres:</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Typ:</label>
                <select name="type" value={formData.type} onChange={handleInputChange}>
                  <option value="Mieszkanie">Mieszkanie</option>
                  <option value="Dom">Dom</option>
                  <option value="Kawalerka">Kawalerka</option>
                  <option value="Apartament">Apartament</option>
                </select>
              </div>
              <div className="form-group">
                <label>Liczba pokoi:</label>
                <input
                  type="number"
                  name="rooms"
                  value={formData.rooms}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Powierzchnia (m²):</label>
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  min="1"
                  step="0.1"
                  required
                />
              </div>
              <div className="form-group">
                <label>Cena (zł/mies):</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Status:</label>
                <select name="status" value={formData.status} onChange={handleInputChange}>
                  <option value="Dostępne">Dostępne</option>
                  <option value="Wynajęte">Wynajęte</option>
                  <option value="Rezerwacja">Rezerwacja</option>
                  <option value="Niedostępne">Niedostępne</option>
                </select>
              </div>
            </div>

            <div className="form-buttons">
              <button type="submit" className="btn-save">
                {editingId ? "💾 Zapisz zmiany" : "➕ Dodaj"}
              </button>
              <button type="button" className="btn-cancel" onClick={resetForm}>
                ❌ Anuluj
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista nieruchomości */}
      <div className="properties-list">
        <h3>📋 Lista nieruchomości ({properties.length})</h3>
        {properties.length === 0 ? (
          <p className="no-properties">Brak nieruchomości. Dodaj pierwszą!</p>
        ) : (
          <div className="properties-grid">
            {properties.map((property) => (
              <div key={property.id} className="property-card">
                <div className="property-header">
                  <h4>{property.name}</h4>
                  <span className={`status-badge status-${property.status.toLowerCase()}`}>
                    {property.status}
                  </span>
                </div>
                <div className="property-details">
                  <p>📍 {property.address}</p>
                  <p>🏠 {property.type}</p>
                  <p>🚪 {property.rooms} pokoi</p>
                  <p>📐 {property.area} m²</p>
                  <p className="property-price">💰 {property.price} zł/mies</p>
                </div>
                <div className="property-actions">
                  <button
                    className="btn-edit"
                    onClick={() => startEdit(property)}
                  >
                    ✏️ Edytuj
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteProperty(property.id)}
                  >
                    🗑️ Usuń
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}