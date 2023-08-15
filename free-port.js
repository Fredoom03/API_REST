const net = require('node:net')

const findAvailablePort = (desiredPort) => {
  const server = net.createServer()
  return new Promise((resolve, reject) => {
    server.listen(desiredPort, () => {
      server.close(() => {
        resolve(desiredPort)
      })
    })

    server.on('error', (err) => {
      if (err === 'EADDRINUSE') {
        resolve(findAvailablePort(0)).resolve()
      } else {
        reject(err)
      }
    })
  })
}

module.exports = { findAvailablePort }
