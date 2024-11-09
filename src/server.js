const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = '070320';

app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/Proyecto', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Conectado a MongoDB');
}).catch(err => {
  console.error('Error al conectar a MongoDB:', err);
});

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: { type: Boolean, default: false }
});

const User = mongoose.model('usuarios', userSchema);

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.decode(token, JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const payload = {
      user: {
        id: user._id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        rol: user.rol
      },
      iat: Date.now(),
      exp: Date.now() + (24 * 60 * 60 * 1000)
    };

    const token = jwt.encode(payload, JWT_SECRET);

    res.json({
      token,
      user: payload.user
    });
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ 
      message: 'Error al iniciar sesión', 
      error: error.message 
    });
  }
});

app.post('/api/registro', async (req, res) => {
  const { nombre, apellido, email, password, rol } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      nombre,
      apellido,
      email,
      password: hashedPassword,
      rol
    });

    await newUser.save();
    const payload = {
      user: {
        id: newUser._id,
        nombre: newUser.nombre,
        apellido: newUser.apellido,
        email: newUser.email,
        rol: newUser.rol
      },
      iat: Date.now(),
      exp: Date.now() + (24 * 60 * 60 * 1000)
    };

    const token = jwt.encode(payload, JWT_SECRET);

    res.status(201).json({
      message: 'Usuario registrado con éxito',
      token,
      user: payload.user
    });
  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({
      message: 'Error al registrar el usuario',
      error: error.message
    });
  }
});

app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener perfil' });
  }
});


app.get('/api/userprofile', authenticateToken, async (req, res) => {
    try {
      const userProfile = await UserProfile.findOne({ userId: req.user.id });
      
      if (!userProfile) {
        const newProfile = new UserProfile({
          userId: req.user.id,
          objetivos: []
        });
        await newProfile.save();
        return res.json(newProfile);
      }
      
      res.json(userProfile);
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      res.status(500).json({ message: 'Error al obtener el perfil de usuario' });
    }
  });
  
  app.post('/api/userprofile/update', authenticateToken, async (req, res) => {
    try {
      const { datosPhysicos, medidas, objetivos } = req.body;
  
      const userProfile = await UserProfile.findOneAndUpdate(
        { userId: req.user.id },
        {
          $set: {
            datosPhysicos,
            medidas,
            objetivos
          }
        },
        { new: true, upsert: true }
      );
  
      res.json({
        message: 'Perfil actualizado correctamente',
        profile: userProfile
      });
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      res.status(500).json({ 
        message: 'Error al actualizar el perfil de usuario',
        error: error.message 
      });
    }
  });

  
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});