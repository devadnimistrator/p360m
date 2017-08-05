module.exports = {
	firebase: {
		databaseURL: "https://p360m-776f5.firebaseio.com",
	},
	mail: {
		auth: {
			user: 'p360m.contact@gmail.com',
			pass: 'KTqr3QAQ9qV8CVo'
		},
		template: {
			from: "no.reply@p360m.com",
			subject: "P360M: image_set_title",
			html: '\
					<p>Dear first_name last_name,</p>\
				   	<p>You have a <a href="http://image_set_url">new set of images available to view</a></p>\
				   	<p>Sent from <a href="mailto:reply_to_email" target="_top">c_fir_name c_lst_name</a>,</p>\
				   	<p>Sent via <a href="http://host_url">P360M</a></p>\
				   	',
		}
	}
}