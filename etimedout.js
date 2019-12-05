// https://stackoverflow.com/questions/53339823/error-connect-etimedout-at-tcpconnectwrap-afterconnect-as-oncomplete

const request = require("request")

const pool = { maxSockets: 50 }

function fetch(url, { method, body, headers }) {
	return new Promise((resolve, reject) => {
		request(url, {
			method,
			body,
			headers,
			pool,
			callback: (error, response, body) => {
				if (error) {
					// Network-related errors such as ETIMEDOUT and ECONNRESET.
					reject(error)
				} else {
					resolve({
						status: response.statusCode,
						headers: response.headers,
						body: body,
					})
				}
			},
		})
	})
}

async function series(iter) {
	for (let i = 0; i < iter; i++) {
		await fetch("http://localhost:8000", { method: "post", body: `${i}` })
	}
}

async function series2(iter) {
	for (let i = 0; i < iter / 100; i++) {
		await parallel(100)
	}
}

async function workers(iter) {
	let i = 0
	await Promise.all(
		Array(100)
			.fill(0)
			.map(async () => {
				while (i <= iter) {
					i++
					await fetch("http://localhost:8000", { method: "post", body: `${i}` })
				}
			})
	)
}

async function parallel(iter) {
	await Promise.all(
		Array(iter)
			.fill(0)
			.map((_, i) => {
				return fetch("http://localhost:8000", { method: "post", body: `${i}` })
			})
	)
}

workers(100000)
	.then(() => {
		console.log("done")
	})
	.catch(error => {
		console.error(error)
	})
