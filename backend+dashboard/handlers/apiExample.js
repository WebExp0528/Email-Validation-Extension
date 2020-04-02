import ExamplesModel from "../models/ExamplesModel.js";
import DomainApprovedModel from "../models/DomainApprovedModel";
import RecentSearchModel from "../models/RecentSearchModel";

const apiExampleHandlers = {};

// Create
apiExampleHandlers.exampleCreate = (req, res) => {
  req
    .checkBody("example")
    .notEmpty()
    .withMessage("Example is required");
  const errors = req.validationErrors();
  if (errors) {
    return res.json({ errors, createdExample: {} });
  }
  const example = req.body.example;
  const newExample = new ExamplesModel({
    exampleField: example
  });
  return newExample
    .save()
    .then(createdExample => res.json({ createdExample, errors: [] }))
    .catch(() =>
      res.json({
        errors: [{ msg: "ErrorCode: 1.0 | Something went wrong." }],
        createdExample: {}
      })
    );
};

/**
 * Register new approved doamin
 */
apiExampleHandlers.registerDomain = (req, res) => {
  const user = req.session.user;
  const domain = req.body.domain;
  if (!domain) {
    return res.status(422).send({
      message: "Invalid data!"
    });
  }

  DomainApprovedModel.findOne({ domain: domain })
    .then(searchdata => {
      // already registered
      if (searchdata) {
        return res.status(422).send({
          message: "Already registerd!"
        });
      }

      var logDate = new Date();
      const domainApproved = new DomainApprovedModel({
        userid: user._id,
        status: true,
        domain: domain,
        logged: logDate
      });
      domainApproved
        .save()
        .then(data =>
          res.status(200).send({ data, message: "Successfully saved!" })
        )
        .catch(() =>
          res.status(400).send({
            message: "Failed to save!"
          })
        );
    })
    .catch(e =>
      res.status(400).send({
        message: "Failed to save!"
      })
    );
};

/**
 * Register new Email in Recent_Search list
 */
apiExampleHandlers.registerEmail = (req, res) => {
  const user = req.session.user;
  const email = req.body.email;
  if (!email) {
    return res.status(422).send({
      message: "Invalid data!"
    });
  }

  RecentSearchModel.findOne({ email: email })
    .then(searchdata => {
      // we already have user with the provided email
      if (searchdata) {
        return res.status(400).send({ massage: "Already registerd!" });
      }

      var logDate = new Date();
      const recentSearch = new RecentSearchModel({
        userid: user._id,
        status: true,
        email: email,
        logged: logDate
      });

      recentSearch
        .save()
        .then(data =>
          res.status(200).send({ data, message: "Successfully saved!" })
        )
        .catch(() =>
          res.status(400).send({
            message: "Failed to save!"
          })
        );
    })
    .catch(e =>
      res.status(400).send({
        message: "Failed to save!"
      })
    );
};

/**
 * Update Domain Approved List
 */
apiExampleHandlers.updateDomainList = (req, res) => {
  const user = req.session.user;
  console.log(req.body);
  if (req.body.action == "edit") {
    //Update Domain Approved list database
    DomainApprovedModel.findByIdAndUpdate(
      req.body._id,
      {
        domain: req.body.domain,
        status: req.body.status == "Approved" ? true : false
      },
      function(err, data) {
        if (err) {
          return res.status(400).send({
            message: "Failed to update!"
          });
        } else {
          return res.status(200).send({
            message: "Updated!"
          });
        }
      }
    );
  } else if (req.body.action == "delete") {
    //remove Domain Approved list
    DomainApprovedModel.findByIdAndRemove(req.body._id, function(err) {
      if (err) {
        return res.status(400).send({
          message: "Failed to remove!"
        });
      } else {
        return res.status(200).send({
          message: "Removed!",
          id: req.body._id
        });
      }
    });
  }
};

/**
 * Update Recent Search List
 */
apiExampleHandlers.updateEmailList = (req, res) => {
  const user = req.session.user;
};

export { apiExampleHandlers as default };
