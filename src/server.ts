import express from 'express'
import { load } from 'rss-to-json'
import cors from 'cors'

const app = express()
const port = 3000
app.enable('strict routing')
app.use(cors({
  "origin": "*",
  "methods": "GET",
  "preflightContinue": false,
}))

app.get("/alandstidningen", async (req, res) => {
  const data = await load("https://www.alandstidningen.ax/rss/allt")
  res.send(data)
})
app.get("/alandsradio", async (req, res) => {
  const data = await load("https://alandsradio.ax/rss")
  res.send(data)
})
app.get("/nyaaland", async (req, res) => {
  const data = await load("https://www.nyan.ax/feed/")
  res.send(data)
})

app.get("/", async (req, res) => {
  const al = await load("https://www.alandstidningen.ax/rss/allt")
  const ar = await load("https://alandsradio.ax/rss")
  const ny = await load("https://www.nyan.ax/feed/")
  const collection = al.items.concat(ar.items.concat(ny.items))
  const sortedCollection = collection.sort((a: any,b: any) => {
    return b.published - a.published
  })
  res.send({items: sortedCollection})
})

app.listen(port, () => {
  console.log("http://localhost:" + port)
})