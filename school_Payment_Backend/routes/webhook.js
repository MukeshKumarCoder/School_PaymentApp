const router = require("express").Router();

const { webhookStatus } = require("../controllers/webhook");

router.get("/", webhookStatus);

module.exports = router;
