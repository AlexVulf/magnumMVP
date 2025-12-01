const userService = require('./user.service');
const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['USER', 'ADMIN']).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const updateUserRoleSchema = z.object({
  role: z.enum(['USER', 'ADMIN']),
});

const register = async (req, res) => {
  try {
    const userData = registerSchema.parse(req.body);
    const user = await userService.register(userData);
    res.status(201).json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors });
    }
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const credentials = loginSchema.parse(req.body);
    const { user, token } = await userService.login(credentials);
    res.json({ user, token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors });
    }
    res.status(400).json({ message: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await userService.getMe(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserRole = async (req, res) => {
  console.log('Received request to update user role.');
  console.log('Request params:', req.params);
  console.log('Request body:', req.body);
  try {
    const { id } = req.params;
    const { role } = updateUserRoleSchema.parse(req.body);
    const updatedUser = await userService.updateUserRole(id, role);
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user role:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors });
    }
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await userService.deleteUser(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  getMe,
  getAllUsers,
  updateUserRole,
  deleteUser,
};
