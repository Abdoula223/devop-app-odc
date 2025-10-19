//Src/components/Classe.jsx
import { useState, useEffect } from "react";
import SmartphoneList from "./SmartphoneList.jsx";
import AjouterSmartphone from "./AjouterSmartphone.jsx";
import DetaillerSmartphone from "./DetaillerSmartphone.jsx";
import EditerSmartphone from "./EditerSmartphone.jsx";

// Backend Express
const API_BASE = import.meta.env.VITE_API_BASE;

function Classe() {
  const [smartphones, setSmartphones] = useState([]);
  const [section, setSection] = useState("list"); // list | add | detail | edit
  const [selectedPhone, setSelectedPhone] = useState(null);
  const [editingPhone, setEditingPhone] = useState(null);
  const [search, setSearch] = useState(""); // état pour la recherche

  // Fonction pour charger les smartphones depuis le backend
  const getSmartphones = async () => {
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();
      setSmartphones(data);
    } catch (err) {
      console.error("Erreur fetch:", err);
    }
  };

  // Charger au démarrage
  useEffect(() => {
    getSmartphones();
  }, []);

  // Ajouter smartphone
  const ajouterSmartphone = async (phone) => {
    try {
      await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(phone),
      });
      await getSmartphones(); //  recharge depuis la base
      setSection("list");
    } catch (err) {
      console.error(err);
    }
  };

  // Supprimer smartphone
  const supprimer = async (id) => {
    const code = prompt("Entrez le code de suppression :");
    if (!code) return;

    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        headers: {
          "x-delete-code": code,
        },
      });

      if (!res.ok) {
        const error = await res.json();
        alert(`Erreur : ${error.message}`);
        return;
      }

      await getSmartphones(); // recharge depuis la base
    } catch (err) {
      console.error(err);
    }
  };

  // Voir détail
  const voirDetail = async (phone) => {
    try {
      const res = await fetch(`${API_BASE}/${phone.id}`);
      const data = await res.json();
      setSelectedPhone(data);
      setSection("detail");
    } catch (err) {
      console.error(err);
    }
  };

  // Préparer édition
  const editPhone = (phone) => {
    setEditingPhone(phone);
    setSection("edit");
  };

  // Sauvegarder édition
  const sauvegarderEdition = async (updatedPhone) => {
    try {
      await fetch(`${API_BASE}/${updatedPhone.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPhone),
      });
      await getSmartphones(); // recharge depuis la base
      setSection("list");
      setEditingPhone(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Liste filtrée côté affichage (pas côté base)
  const filteredSmartphones = smartphones.filter((p) => {
    const nom = p.nom || "";
    const marque = p.marque || "";
    return (
      nom.toLowerCase().includes(search.toLowerCase()) ||
      marque.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div>
      <div className="flex items-center justify-between bg-blue-800 text-white">
        {/* Logo à gauche */}
        <div className="flex items-center gap-2 font-bold text-xl">
          <img
            src="images/logo.jpeg"
            alt="Logo"
            className="w-20 h-20 rounded-full object-cover"
          />
          Gestion Smartphones
        </div>

        {/* Barre de recherche */}
        <input
          type="text"
          placeholder="Rechercher par nom ou marque..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-1 rounded text-black w-80"
        />

        {/* Bouton ajouter */}
        <button
          onClick={() => setSection("add")}
          className="hover:bg-blue-600 px-4 py-2 rounded"
        >
          Ajouter smartphone
        </button>
      </div>

      {/* Contenu dynamique */}
      {section === "list" && (
        <SmartphoneList
          smartphones={filteredSmartphones}
          onSelect={voirDetail}
          supprimer={supprimer}
          onAdd={() => setSection("add")}
        />
      )}

      {section === "add" && (
        <AjouterSmartphone
          ajouterSmartphone={ajouterSmartphone}
          onCancel={() => setSection("list")}
        />
      )}

      {section === "detail" && selectedPhone && (
        <DetaillerSmartphone
          phone={selectedPhone}
          onCancel={() => setSection("list")}
          editPhone={editPhone}
        />
      )}

      {section === "edit" && editingPhone && (
        <EditerSmartphone
          phone={editingPhone}
          onSave={sauvegarderEdition}
          onCancel={() => {
            setSection("list");
            setEditingPhone(null);
          }}
        />
      )}
    </div>
  );
}

export default Classe;
