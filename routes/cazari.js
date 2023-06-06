const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Cazare = require("../models/cazare");
const { isLoggedIn, isAuthor, validateCazare } = require("../middleware");
const cazari = require("../controllers/cazari");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
  .route("/")
  .get(catchAsync(cazari.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCazare,
    catchAsync(cazari.createNewCazare)
  );

router.get("/new", isLoggedIn, cazari.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(cazari.showCazare))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCazare,
    catchAsync(cazari.editCazare)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(cazari.deleteCazare));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(cazari.renderEditForm)
);

router;

module.exports = router;
