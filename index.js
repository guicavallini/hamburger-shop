const express = require("express")
const uuid = require("uuid")

const port = 3001
const app = express()
app.use(express.json())

const orders = []


const checkUserId = (request, response, next) => {
    const { id } = request.params

    const index = orders.findIndex(user => user.id === id)

    if (index < 0) {
        return response.status(404).json({ error: "User not found" })
    }

    request.userIndex = index
    request.userId = id

    next()
}

const checkMethod = (request, response, next) => {
    console.log(request.method, request.url)

    next()
}

app.get("/order", checkMethod, (request, response) => {
    return response.json(orders)
})

app.post("/order", checkMethod, (request, response) => {
    const { order, clientName, price } = request.body

    const newOrder = { id: uuid.v4(), order, clientName, price, status: "Em preparação" }

    orders.push(newOrder)

    return response.status(201).json(newOrder)
})

app.put("/order/:id", checkMethod, checkUserId, (request, response) => {
    const index = request.userIndex
    const id = request.userId
    const { order, clientName, price } = request.body

    const updateOrder = { id, order, clientName, price, status: "Em preparação" }

    orders[index] = updateOrder

    return response.json(updateOrder)
})

app.delete("/order/:id", checkMethod, checkUserId, (request, response) => {
    const index = request.userIndex

    orders.splice(index, 1)

    return response.status(204).json()
})

app.get("/order/:id", checkUserId, (request, response) => {
    const index = request.userIndex
    return response.json(orders[index])
})

app.patch("/order/:id", checkMethod, checkUserId, (request, response) => {
    const index = request.userIndex
    const id = request.userId
    const { order, clientName, price } = orders[index]

    const fineshedOrder = { id, order, clientName, price, status: "Pronto" }

    orders[index] = fineshedOrder

    return response.json(fineshedOrder)
})

app.listen(port, () => {
    console.log(`server started on port ${port}`)
})

