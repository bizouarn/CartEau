const express = require('express')
const app = express()
const port = 3000

// get for node_modules
app.use('/node_modules', express.static('node_modules'));
app.use('/public', express.static('public'));

app.get('/', (req, res) => {
  // send index.html
    res.sendFile(__dirname + '/index.html')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
