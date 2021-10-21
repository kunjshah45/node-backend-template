let { validationResult } = require('express-validator')
// const ErrorTemplate = require('../email_templetes/errorTemplate')
// const MailService = require('../service/mailService')
// const Sentry = require("@sentry/node");


module.exports = {
  /* send the mail when error occured*/
//   sendErrorMail(req, error) {
//     let templatePayload = {
//       subject: `Error occoured at - ${process.env.NODE_ENV} server`,
//       data: {
//         error: error,
//         body: req.body,
//         user: req.user
//       }
//     }
//     let sender = {
//       to: process.env.EMAIL_TO,
//       from: process.env.EMAIL_FROM,
//       cc: process.env.EMAIL_ERROR_CC.split(',')
//     }
//     let template = new ErrorTemplate(templatePayload)
//     if (process.env.SEND_ERROR_MAIL == 'true') MailService.sendTemplate(sender, template)
//   },

  respondWithSuccess(req, res, data, message = '') {
    res.status(200)
    return this.respond(req, res, true, message, data)
  },

  respondWithFalseSuccess(req, res, data, message = '') {
    res.status(200)
    return this.respond(req, res, false, message, data)
  },

  respondWithError(req, res, error) {
    Sentry.withScope(scope => {
      scope.setExtra("request - body", req.body)
      scope.setExtra("request - user data", req.user)
      scope.setExtra("request - query", req.query)
      scope.setExtra("request - params", req.params)
      Sentry.captureException(error)
    });
    // Sentry.captureException(error, req);
    // this.sendErrorMail(req, error) //- to send the mail for unhandled error
    res.status(500)
    return this.respond(req, res, false, error.toString())
  },

  respondWithValidationError(req, res, errors) {
    res.status(422)
    return this.respond(req, res, false, 'validation failed', undefined, errors)
  },

  respondWithCustomError(req, res, message, data) {
    res.status(400)
    return this.respond(req, res, false, message.toString(), data)
  },

  respondWithUnauthorised(req, res, message = 'Unauthorised') {
    res.status(401)
    return this.respond(req, res, false, message.toString())
  },

  respondWithNotFound(req, res, message = 'Data not found') {
    res.status(404)
    return this.respond(req, res, false, message)
  },

  respondWithFileUploaded(req, res, data, message, error) {
    res.status(422)
    return this.fileRespond(req, res, false, message, data, error)
  },

  respond(req, res, status, message, data, error) {
    return status
      ? res.json({ status, data, message })
      : res.json({ status, message, data, error })
  },

  fileRespond(req, res, status, message, data, error) {
    return res.json({ status, data, error, message })
  },

  formatter({ location, msg, param, value, nestedErrors }) {
    return msg
  },

  validate(req, res, next) {
    const errors = validationResult(req).formatWith(this.formatter)
    if (!errors.isEmpty()) {
      return this.respondWithValidationError(req, res, errors.mapped())
    }
    next()
  }
}