var mongoose = require('mongoose')
var Schema = mongoose.Schema

var CompanySchema = new Schema({
	username: String,
	name: String,
	tagline: String,
	description: String,
	images: Array,
	members: Array,
	creatorID: String,
	icon: String,
	date: {
		type: Date,
		default: Date.now()
	},
	jobopening: {
		type: Boolean,
		default: false
	}
})

var Company = mongoose.model('Company', CompanySchema)
module.exports = Company
