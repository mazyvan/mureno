const Mureno = require('../../dist')
const MurenoRoutes = require('../../dist/app/MurenoRoutes').default
const port = process.env.PORT || 4000

const routes = new MurenoRoutes()

routes.post['/hello'] = (req, res) => {
  return res.json(200, {
    query: req.query,
    body: req.body
  })
}

routes.get['/hello'] = (req, res) => {
  console.log('Hello route requested')

  return res.json({
    greetings: 'Hello word!'
  })
}

const app = new Mureno(port, {
  routes: routes
})

app.middleware(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())

  if (next) next()
})

app.middleware(function methodLog (req, res, next) {
  console.log('Method: ', req.method)
  console.log()

  if (next) next()
})

app.start()
