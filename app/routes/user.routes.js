const { authJwt } = require('../middlewares')
const controller = require('../controllers/user.controller')

const express = require('express')
const app = express.Router()

const User = require('../models/user.model')
const Company = require('../models/company.model')

// app.use(function (req, res, next) {
// 	res.header(
// 		'Access-Control-Allow-Headers',
// 		'x-access-token, Origin, Content-Type, Accept'
// 	)
// 	next()
// })

app.get('/all', controller.allAccess)

app.get('/discover', [authJwt.verifyToken], (req, res) => {
	Company.find({ creatorID: { $ne: req.userId } }).exec((err, companies) => {
		if (err) {
			console.log(err)
			return res.status(500).send({ message: 'ERROR' })
		}
		return res.send(companies)
	})
})

// app.get('/test/user', [authJwt.verifyToken], controller.userBoard)
app.get('/user', [authJwt.verifyToken], (req, res) => {
	User.findById(req.userId, { password: 0 }).exec((err, user) => {
		if (err) {
			console.log(err)
			return res.status(500).send({ message: 'ERROR' })
		}
		Company.find({ creatorID: req.userId }).exec((err, companies) => {
			if (err) {
				console.log(err)
				return res.status(500).send({ message: 'ERROR' })
			}
			return res.send({ user, companies })
		})
	})
})

// create company
app.post('/createcomp', [authJwt.verifyToken], (req, res) => {
	var compData = {
		name: req.body.name,
		username: req.body.username,
		tagline: req.body.tagline,
		jobopening: req.body.jobopen,
		// description: req.body.description,
		// images: req.body.images,
		// members: req.body.members,
		creatorID: req.userId
	}

	Company.create(compData, (error, log) => {
		if (error) {
			return next(error)
		}
		console.log('company created')
		return res.send('created')
	})
	// User.findById(req.userId).exec((err, user) => {
	// 	if (err) {
	// 		console.log(err)
	// 		return res.status(500).send({ message: 'ERROR' })
	// 	}
	// 	return res.send(user)
	// })
})

//get company information
app.get('/comp/:compname', [authJwt.verifyToken], (req, res) => {
	const companyname = req.params.compname
	Company.findOne({ username: companyname }).exec((err, company) => {
		if (err) {
			console.log(err)
			return res.status(500).send({ message: 'ERROR' })
		}
		var isOwned = false
		if (company.creatorID == req.userId) {
			isOwned = true
		}
		return res.send({ company, isOwned })
	})
	// User.findById(req.userId, { password: 0 }).exec((err, user) => {
	// 	if (err) {
	// 		console.log(err)
	// 		return res.status(500).send({ message: 'ERROR' })
	// 	}
	// 	Company.find({ creatorID: req.userId }).exec((err, companies) => {
	// 		if (err) {
	// 			console.log(err)
	// 			return res.status(500).send({ message: 'ERROR' })
	// 		}
	// 		return res.send({ user, companies })
	// 	})
	// })
})

// app.get(
// 	'/test/mod',
// 	[authJwt.verifyToken, authJwt.isModerator],
// 	controller.moderatorBoard
// )

// app.get(
// 	'/test/admin',
// 	[authJwt.verifyToken, authJwt.isAdmin],
// 	controller.adminBoard
// )

module.exports = app
