import express from 'express';
import multer from 'multer';
import path from 'path';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

/* ---- Configuração do multer ---- */
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
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
  limits: { fileSize: 5 * 1024 * 1024 },
});

/* ---- Rota POST /api/upload ---- */
router.post('/', protect, admin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Nenhum arquivo enviado' });
  }
  // Retorna o caminho público da imagem
  res.json({ image: `/uploads/${req.file.filename}` });
});

export default router;