const { findAvailablePort } = require('./free-port')
const movies = require('./mocks/movies.json')
const crypto = require('node:crypto')
const cors = require('cors')
const express = require('express')
const { validateMovie, validatePartialMovie } = require('./schemas/movies')

const app = express()
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
app.disable('x-powered-by')

app.use(express.json())

app.get('/movies', (req, res) => {
  // req.map(data => console.log(data))
  // const origin = req.header('origin')

  // if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
  //   res.header('Access-Control-Allow-Origin', origin)
  // }

  const { genre } = req.query

  if (genre) {
    const filteredMovies =
    movies.filter(
      movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    )
    return res.json(filteredMovies)
  }
  res.json(movies)
})

app.get('/movies/:id', (req, res) => {
  const { id } = req.params

  console.log(id)

  const movie = movies.find(movie => movie.id === id)
  if (movie) return res.json(movie)

  res.status(404).json({ message: 'Movie not found' })
})

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body)

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }
  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data
  }

  movies.push(newMovie)
  res.status(201).json(newMovie)
})

app.delete('/movies/:id', (req, res) => {
  // const origin = req.header('origin')

  // if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
  //   res.header('Access-Control-Allow-Origin', origin)
  // }

  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  movies.splice(movieIndex, 1)

  return res.json({ message: 'Movie deleted' })
})

app.patch('/movies/:id', (req, res) => {
  const result = validatePartialMovie(req.body)

  console.log(result)

  if (result.error) {
    return res.status(400).json({ message: JSON.parse(result.error.message) })
  }

  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  const updateMovie = {
    ...movies[movieIndex],
    ...result.data
  }

  return res.json(updateMovie)
})

// app.options('/movies/:id', (req, res) => {
//   const origin = req.header('origin')

//   if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
//     res.header('Access-Control-Allow-Origin', origin)
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
//   }
//   res.send()
// })

const PORT = process.env.PORT ?? 8000

findAvailablePort(PORT).then((port) => {
  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${PORT}`)
  })
})
