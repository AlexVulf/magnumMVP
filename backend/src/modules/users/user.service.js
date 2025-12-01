const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const generateToken = require('../../utils/generateToken');

const prisma = new PrismaClient();

const register = async (userData) => {
  console.log('Register function in service received:', userData);
  const { name, email, password, role } = userData;
  console.log(`Destructured role is: ${role}`);

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    console.error(`Registration failed: User with email ${email} already exists.`);
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role || 'USER',
    },
  });

  console.log(`User ${email} registered successfully with role ${user.role}.`);
  return user;
};

const login = async (credentials) => {
  console.log(`Login attempt for user: ${credentials.email}`);
  const { email, password } = credentials;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.warn(`Login failed: User ${email} not found.`);
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    console.warn(`Login failed: Invalid password for user ${email}.`);
    throw new Error('Invalid credentials');
  }

  console.log(`User ${email} logged in successfully.`);
  const token = generateToken(user);
  return { user, token };
};

const getMe = async (userId) => {
  console.log(`Fetching data for user with ID: ${userId}`);
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    console.warn(`Failed to fetch data: User with ID ${userId} not found.`);
    throw new Error('User not found');
  }
  return user;
};

const getAllUsers = async () => {
  console.log('Fetching all users for admin.');
  const users = await prisma.user.findMany();
  return users;
};

const updateUserRole = async (userId, newRole) => {
  console.log(`Updating role for user with ID: ${userId} to ${newRole}`);
  const updatedUser = await prisma.user.update({
    where: { id: parseInt(userId, 10) },
    data: { role: newRole },
  });
  return updatedUser;
};

const deleteUser = async (userId) => {
  console.log(`Deleting user with ID: ${userId}`);
  await prisma.user.delete({
    where: { id: parseInt(userId, 10) },
  });
};

module.exports = {
  register,
  login,
  getMe,
  getAllUsers,
  updateUserRole,
  deleteUser,
};
