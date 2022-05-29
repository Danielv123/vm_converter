const bullmq = require("bullmq")

const queue = new bullmq.Queue("Pain")

queue.add("cars", { color: "blue" })


const worker = new bullmq.Worker("Pain", async job => {
    if (job.name === "cars") {
        
    }
})
