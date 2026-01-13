const express = require('express');
const router = express.Router();
const RecordingController = require('../controllers/RecordingController');
const { validate } = require('../middlewares/validate');
const { StartRecordingSchema, StartMultipleRecordingsSchema } = require('../schemas/recording.schema');

// Rotas de gravação RTSP
router.post('/start', validate(StartRecordingSchema), RecordingController.startRecording);
router.post('/start-multiple', validate(StartMultipleRecordingsSchema), RecordingController.startMultipleRecordings);
router.get('/status/:recordId', RecordingController.getRecordingStatus);

module.exports = router;
