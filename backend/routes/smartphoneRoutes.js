const express = require('express');
const router = express.Router();
const controller = require('../controllers/smartphoneController');

const checkDeleteCode = require('../middleware/checkCode');


// Routes CRUD
router.post('/smartphones', controller.addSmartphone);
router.get('/smartphones', controller.getAllSmartphones);
router.get('/smartphones/:id', controller.getSmartphoneById);
router.put('/smartphones/:id', controller.updateSmartphone);
//router.delete('/smartphones/:id', controller.deleteSmartphone);




// Ici on ajoute la vérification du code
router.delete('/smartphones/:id', checkDeleteCode, controller.deleteSmartphone);


// Export du router
module.exports = router; 
