import express from 'express'
import cors from 'cors'
import { parseStringPromise, processors } from "xml2js"
import fetch from 'node-fetch'

const options = {
  trim: true,
  explicitArray: false,
  normalize: true,
  async: true,
  tagNameProcessors: [processors.stripPrefix]
}

async function xmlFetch (url: string) {
  try {
    const response = await (await fetch(url)).text()
    return await parseStringPromise(response, options)
  } catch (error) {
    console.log(error)
  }
}


const app = express()
const port = 3000
app.enable('strict routing')
app.use(cors({
  "origin": "*",
  "methods": "GET",
  "preflightContinue": false,
}))

app.get("/alandstidningen", async (req, res) => {
  const data = (await xmlFetch("https://www.alandstidningen.ax/rss/allt")).rss.channel.item
  res.json({items: data})
})
app.get("/alandsradio", async (req, res) => {
  const data = (await xmlFetch("https://alandsradio.ax/rss")).rss.channel.item
  res.json({items: data})
})
app.get("/nyaaland", async (req, res) => {
  const data = (await xmlFetch("https://www.nyan.ax/feed")).rss.channel.item
  res.json({items: data})
})

app.get("/", async (req, res) => {
  let at: any, ar: any, ny: any
  at = (await xmlFetch("https://www.alandstidningen.ax/rss/allt")).rss.channel.item
  ar = (await xmlFetch("https://alandsradio.ax/rss")).rss.channel.item
  ny = (await xmlFetch("https://www.nyan.ax/feed")).rss.channel.item
  const complete = at.concat(ar.concat(ny))
  const sorted = complete.sort((a:any, b:any) => {
    return (+ new Date(b.pubDate) - (+ new Date(a.pubDate)))
  })
  res.json({items: sorted})
})

app.listen(port, () => {
  console.log("http://localhost:" + port)
})