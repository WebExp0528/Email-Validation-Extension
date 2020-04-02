const ExamplesModel = require("../models/ExamplesModel");
import DomainApprovedModel from "../models/DomainApprovedModel";
import RecentSearchModel from "../models/RecentSearchModel";
import { domainToASCII } from "url";

const exampleHandlers = {};

// Example get
exampleHandlers.exampleAction = (req, res) => {
  const user = req.session.user;
  res.render("pages/home/home.pug", {
    title: "Home Page",
    isAuthed: user ? true : false
  });
};

// Dashboard
exampleHandlers.showDashboard = async (req, res) => {
  const user = req.session.user;
  if (!user) {
    return res.redirect("/auth/");
  }
  const queryDomain = DomainApprovedModel.find();
  var colDomainApproved = await queryDomain.exec();
  const queryRecent = RecentSearchModel.find();
  var colRecentSearch = await queryRecent.exec();
  res.render("pages/dashboard/dashboard.pug", {
    title: "Dashboard Page",
    isAuthed: user ? true : false,
    domainApprovedList: colDomainApproved,
    recentSearchList: colRecentSearch
  });
};
// Show profile page
exampleHandlers.showProfile = (req, res) => {
  const user = req.session.user;
  if (!user) {
    return res.redirect("/auth/");
  }
  res.render("pages/profile/profile.pug", {
    title: "Profile Page",
    isAuthed: user ? true : false,
    user
  });
};

export { exampleHandlers as default };
