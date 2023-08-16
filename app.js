import { moviesRouter } from './routes/movies.js'
import express, { json } from 'express'
import cors from 'cors'

/* Leer JSON en ESModules */
// import fs from 'node:fs'
// const movies = JSON.parse(fs.readFileSync('./movies.json', 'utf-8'))

const app = express()
app.disable('x-powered-by')

app.use(json())

app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:8080',
      'http://localhost:8000',
      'http://movies.com',
      'http://midu.dev'
    ]

    if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
}))

app.use('/movies', moviesRouter)

const PORT = process.env.PORT ?? 8000

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
