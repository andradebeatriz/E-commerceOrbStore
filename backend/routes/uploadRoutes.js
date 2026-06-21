// backend/routes/uploadRoutes.js
// Rota de upload de imagens de produto usando multer
// Instale: npm install multer  (na pasta backend)

const express = require('express');
const multer = require('multer');
const path = require('path');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

/* ---- Configuração do multer ---- */
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // pasta uploads/ na raiz do backend
  },
  filename(req, file, cb) {
    // ex: product-1718000000000.jpg
    cb(null, `product-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = allowed.test(file.mimetype);
  if (extOk && mimeOk) {
    cb(null, true);
  } else {
    cb(new Error('Apenas imagens são permitidas (jpeg, jpg, png, gif, webp)'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

/* ---- Rota POST /api/upload ---- */
router.post('/', protect, admin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Nenhum arquivo enviado' });
  }
  // Retorna o caminho público da imagem
  res.json({ image: `/uploads/${req.file.filename}` });
});

module.exports = router;