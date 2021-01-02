const sgMail = require("@sendgrid/mail");

// const sendgridAPIKey =
// 	"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";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeMail = (email, name) => {
	sgMail.send({
		to: email,
		from: "517-2017@hamdard.edu",
		subject: "Thanks for joining in!",
		text: `Welcome to the app, ${name}. Let me know how you get along with the app.`,
	});
};

const sendCancelationEmail = (email, name) => {
	sgMail.send({
		to: email,
		from: "517-2017@hamdard.edu",
		subject: "Sorry to see you go!",
		text: `Goodbye, ${name}. I hope to see you back sometime soon.`,
	});
};

module.exports = {
	sendWelcomeMail,
	sendCancelationEmail,
};
