const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middlewares.js");
const listingControllers = require("../controllers/listings.js");
const multer  = require("multer");
const{ storage } =require("../cloudConfig.js")
const upload = multer({ storage });

router.route("/")
  .get(
    wrapAsync(listingControllers.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingControllers.createListing)
  );

// CREATE ROUTE(GET)
router.get("/new", isLoggedIn, listingControllers.renderNewForm);

router.route("/:id")
  .get(
    wrapAsync(listingControllers.showListing)
  )
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingControllers.updateListing)
  )
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingControllers.deleteListing)
  );

//EDIT ROUTE
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingControllers.renderEditForm)
);

module.exports = router;