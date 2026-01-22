const express = require('express');
const router = express.Router();
const TempUploadController = require('../controllers/TempUploadController');

// POST /api/temp-upload/profile-picture - Upload temporário de foto de perfil
router.post(
  '/profile-picture',
  TempUploadController.uploadProfilePictureMiddleware(),
  (req, res) => TempUploadController.uploadProfilePicture(req, res)
);

// POST /api/temp-upload/scan-face-video - Upload temporário de vídeo de scan facial
router.post(
  '/scan-face-video',
  TempUploadController.uploadScanFaceVideoMiddleware(),
  (req, res) => TempUploadController.uploadScanFaceVideo(req, res)
);

module.exports = router;
