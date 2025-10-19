//Src/components/DetaillerSmartphone.jsx
function DetaillerSmartphone({ phone, onCancel, editPhone }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">{phone.nom}</h2>

      <div className="md:flex gap-6">
        {/* Image à gauche */}
        <div className="md:w-1/3 flex justify-center items-start mb-4 md:mb-0">
          <img
            src={phone.photos && phone.photos.length > 0 ? phone.photos[0] : ""}
            alt={phone.nom}
            className="w-full h-64 object-cover rounded-lg shadow-md"
          />
        </div>

        {/* Informations à droite */}
        <div className="md:w-2/3 flex flex-col justify-start gap-3 text-gray-700">
          <p><span className="font-semibold">Marque:</span> {phone.marque}</p>
          <p><span className="font-semibold">Prix:</span> {phone.prix.toLocaleString()} FCFA</p>
          <p><span className="font-semibold">Description:</span> {phone.description}</p>
          <p><span className="font-semibold">RAM:</span> {phone.caracteristiques?.ram}</p>
          <p><span className="font-semibold">ROM:</span> {phone.caracteristiques?.rom}</p>
          <p><span className="font-semibold">Écran:</span> {phone.caracteristiques?.ecran}</p>

          {/* Couleurs */}
          <div className="mt-2">
            <span className="font-semibold">Couleurs disponibles :</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {Array.isArray(phone.couleurs) && phone.couleurs.length > 0 ? (
                phone.couleurs.map((c, i) => (
                  <span
                    key={i}
                    style={{ backgroundColor: c }}
                    className="w-6 h-6 rounded-full border border-gray-300"
                  ></span>
                ))
              ) : (
                <span className="text-gray-500">Aucune couleur</span>
              )}
            </div>
          </div>

          {/* Boutons */}
          <div className="mt-4 flex gap-3">
            <button
              onClick={onCancel}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition"
            >
              Annuler
            </button>
            <button
              onClick={() => editPhone(phone)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              Éditer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetaillerSmartphone;
