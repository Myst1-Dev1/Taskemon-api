const User = require('../models/User.js');

const findUserByName = async (req, res) => {
  try {
    const { name } = req.params;

    const user = await User.findOne({ name })
      .populate('tasks')
      .populate('awards')
      .populate('history.referenceId');

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado!' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao buscar usuário!' });
  }
};

const createUser = async (req, res) => {
  try {
    const { avatar, name, } = req.body;

    if (!avatar || !name) {
      return res.status(400).json({ message: 'Nome e avatar são obrigatórios' });
    }

    const newUser = await User.create({ avatar, name, points: 0 });

    return res.status(201).json(newUser);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return res.status(500).json({ message: 'Erro ao criar usuário' });
  }
};

const getUserData = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
    .populate('tasks')
    .populate('awards')
    .populate('history.referenceId');

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Erro ao pegar os dados usuário:', error);
    return res.status(500).json({ message: 'Erro ao pegar os dados usuário' });
  }
};

module.exports = {
    findUserByName,
    createUser,
    getUserData
}