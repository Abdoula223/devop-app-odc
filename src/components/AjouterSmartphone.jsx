// src/components/AjouterSmartphone.jsx
import { useState } from "react";
import smartphoneImg from "./images/imgform2.jpg"; // notre image fixe

function AjouterSmartphone({ ajouterSmartphone, onCancel }) {
  const [form, setForm] = useState({
    nom: "",
    marque: "",
    prix: "",
    description: "",
    ram: "",
    rom: "",
    ecran: "",
    photo: null,
    couleurs: []
  });

  const handleChange = e => {
    const { name, type, files, value } = e.target;
    if (type === "file") {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleColors = e => {
    const options = Array.from(e.target.selectedOptions).map(o => o.value);
    setForm({ ...form, couleurs: options });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.photo) {
      alert("Veuillez sélectionner une image !");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const nouveauSmartphone = {
        id: Date.now(),
        nom: form.nom,
        marque: form.marque,
        prix: Number(form.prix),
        description: form.description,
        caracteristiques: {
          ram: form.ram,
          rom: form.rom,
          ecran: form.ecran
        },
        photos: [reader.result],
        couleurs: form.couleurs
      };

      ajouterSmartphone(nouveauSmartphone);

      setForm({
        nom: "",
        marque: "",
        prix: "",
        description: "",
        ram: "",
        rom: "",
        ecran: "",
        photo: null,
        couleurs: []
      });
    };
    reader.readAsDataURL(form.photo);
  };

  return (
    <div className="max-w-4xl p-6 mx-auto mt-6 bg-white rounded-lg shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Formulaire à gauche */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-1 font-medium">Nom</label>
              <input
                name="nom"
                value={form.nom}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Marque</label>
              <input
                name="marque"
                value={form.marque}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-1 font-medium">Prix</label>
              <input
                type="number"
                name="prix"
                value={form.prix}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Photo</label>
              <input
                name="photo"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-1 font-medium">RAM (Go)</label>
              <input
                name="ram"
                value={form.ram}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">ROM (Go)</label>
              <input
                name="rom"
                value={form.rom}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-1 font-medium">Écran</label>
              <input
                name="ecran"
                value={form.ecran}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Couleurs</label>
              <select
                multiple
                value={form.couleurs}
                onChange={handleColors}
                className="w-full p-2 border rounded"
              >
                <option value="#FF0000">Rouge</option>
                <option value="#00FF00">Vert</option>
                <option value="#0000FF">Bleu</option>
                <option value="#FFFF00">Jaune</option>
                <option value="#000000">Noir</option>
                <option value="#FFFFFF">Blanc</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-white bg-gray-400 rounded hover:bg-gray-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Ajouter
            </button>
          </div>
        </form>

        {/*  Image fixe à droite */}
        <div className="flex items-center justify-center">
           <img
               src={smartphoneImg}
               alt="Smartphone fixe"
               className="object-contain w-80 h-[600px] rounded-lg shadow-md"
          />

        </div>
      </div>
    </div>
  );
}

export default AjouterSmartphone;
