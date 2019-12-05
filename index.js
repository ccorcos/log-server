const express = require("express")

const app = express()

app.use(function(req, res, next) {
	var data = ""
	req.setEncoding("utf8")
	req.on("data", function(chunk) {
		data += chunk
	})

	req.on("end", function() {
		req.body = data
		next()
	})
})

app.post("*", (req, res) => {
	console.log(req.body)
	setTimeout(() => {
		res.status(200).send()
	}, 0)
})

app.listen(8000, () => {
	console.log("Listening at http://localhost:8000")
})
