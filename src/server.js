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

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
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

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      user: payload.user
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  capacity: { type: Number, required: true },
  price: { type: Number, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'usuarios', required: true },
  createdAt: { type: Date, default: Date.now }
});

const Group = mongoose.model('grupos', groupSchema);

app.post('/api/groups/create', async (req, res) => {
  console.log('Datos recibidos en el servidor:', req.body);
  
  const { name, description, capacity, price, creatorId } = req.body;
  if (!name || !description || !capacity || !price || !creatorId) {
    console.log('Faltan campos requeridos');
    return res.status(400).json({
      message: 'Todos los campos son requeridos',
      receivedData: req.body
    });
  }

  try {
    const creator = await User.findById(creatorId);
    if (!creator) {
      console.log('Creador no encontrado:', creatorId);
      return res.status(404).json({ message: 'Creador no encontrado' });
    }

    const newGroup = new Group({
      name,
      description,
      capacity,
      price,
      creator: creatorId
    });

    console.log('Grupo a guardar:', newGroup);
    const savedGroup = await newGroup.save();
    console.log('Grupo guardado exitosamente:', savedGroup);

    res.status(201).json({
      message: 'Grupo creado exitosamente',
      group: savedGroup
    });
  } catch (error) {
    console.error('Error al guardar el grupo:', error);
    res.status(500).json({
      message: 'Error al crear el grupo',
      error: error.message,
      stack: error.stack
    });
  }
});

app.get('/api/groups', async (req, res) => {
  try {
    const groups = await Group.find()
      .populate('creator', 'nombre apellido email')
      .sort({ createdAt: -1 });

    const formattedGroups = groups.map(group => ({
      id: group._id,
      name: group.name,
      description: group.description,
      capacity: group.capacity,
      price: group.price,
      creator: {
        id: group.creator._id,
        name: `${group.creator.nombre} ${group.creator.apellido}`,
        email: group.creator.email
      },
      createdAt: group.createdAt
    }));

    res.status(200).json(formattedGroups);
  } catch (error) {
    console.error('Error al obtener grupos:', error);
    res.status(500).json({
      message: 'Error al obtener los grupos',
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});