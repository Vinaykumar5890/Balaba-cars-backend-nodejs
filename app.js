const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Loginuser = require('./model')
const Vehicleowner = require('./model1')
const app = express()

app.use(express.json())
app.use(cors({origin: '*'}))
mongoose
  .connect(
    'mongodb+srv://vinay:vinay@cluster0.fv2hjsb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  )
  .then(() => console.log('DB Connected'))
  .catch(err => console.log(err))

/// Authencation Process

function authenticateToken(request, response, next) {
  let jwtToken
  const authHeader = request.headers['authorization']
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(' ')[1]
  }
  if (jwtToken === undefined) {
    response.status(401)
    response.send('Your Not Authorized User')
  } else {
    jwt.verify(jwtToken, 'jwt', async (error, payload) => {
      if (error) {
        response.status(401)
        response.send('Your Not Authorized User')
      } else {
        next()
      }
    })
  }
}

// User Register with post Method

app.post('/register', async (req, res) => {
  try {
    const {username, email, password} = req.body
    let exits = await Loginuser.findOne({email})
    if (exits) {
      return res.status(400).send('User Already Exist')
    } else if (!email || !username || !password) {
      return res.status(400).send('All fields are required')
    }
    if (password.length > 6) {
      const hashedPassword = await bcrypt.hash(password, 10)

      let newUser = new Loginuser({
        username,
        email,
        password: hashedPassword,
      })
      await newUser.save()
      res.status(200).send('Register Succesfully')
    } else {
      res.status(400).send('Password Too Short')
    }
  } catch (err) {
    console.log(err)
    return res.status(500).send('Internal Server Error')
  }
})

//User Login Using Post Method : /Login

app.post('/login', async (req, res) => {
  try {
    const {email, password} = req.body
    let exits = await Loginuser.findOne({email})
    if (!exits) {
      return res.status(400).send("User Doesn't Exits")
    } else if (!email || !password) {
      return res.status(400).send('All fields are required')
    } else {
      const isPasswordMatched = await bcrypt.compare(password, exits.password)
      if (isPasswordMatched === true) {
        let payload = {
          user: {
            id: exits.id,
          },
        }
        jwt.sign(payload, 'jwt', (err, jwtToken) => {
          if (err) throw err
          return res.json({jwtToken})
        })
      } else {
        return res.status(400).send('Invalid Password')
      }
    }
  } catch (err) {
    console.log(err)
    res.status(500).send('Server Error')
  }
})

/// Vehicle Owner Details with Post Method

app.post('/vehicle-owner',  async (req, res) => {
  const {carname, seats, priceforseat, fromaddress, toaddress} = req.body
  try {
    const newData = new Vehicleowner({
      carname,
      seats,
      priceforseat,
      fromaddress,
      toaddress,
    })
    await newData.save()
    return res.send(await Vehicleowner.find())
  } catch (err) {
    console.log(err)
  }
});

/// Get All Vehicle In Wwebsite

app.get('/vehicle-owner', authenticateToken, async (req, res) => {
  try {
    const posts = await Vehicleowner.find()
    return res.json(posts)
  } catch (err) {
    return res.status(400).json({error: err.message})
  }
})

/// Get Vehicle by there Id

app.get('/vehicle-owner/:id', authenticateToken, async (req, res) => {
  try {
    const allData = await Vehicleowner.findById(req.params.id)
    return res.json(allData)
  } catch (err) {
    console.log(err)
  }
})

// put Updating Seats by user Book Car By Id
app.put('/vehicle-owner/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicleowner.findById(id);

    if (!vehicle) {
      return res.status(404).send('Vehicle not found');
    }
    if (vehicle.seats <= 0) {
      return res.status(400).send('No seats available to decrement');
    }
    vehicle.seats -= 1;
    await vehicle.save();

    return res.status(200).json(vehicle);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Internal Server Error');
  }
});


app.listen(3000, () => {
  console.log('Server Running.....')
})

module.exports = app
