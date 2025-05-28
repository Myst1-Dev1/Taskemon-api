const User = require('../models/User.js');
const Task = require('../models/Tasks.js');
const Award = require('../models/Awards.js');

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

const completeTask = async (req, res) => {
  try {
    const { userId, taskId } = req.body;

    const user = await User.findById(userId).populate('history.referenceId');
    const task = await Task.findById(taskId);

    if (!user || !task) {
      return res.status(404).json({ message: 'Usuário ou tarefa não encontrada' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const alreadyCompletedToday = user.history.some(entry =>
      entry.actionType === 'task_completed' &&
      entry.referenceId?._id?.toString() === taskId &&
      new Date(entry.date).toDateString() === today.toDateString()
    );

    if (alreadyCompletedToday) {
      return res.status(400).json({ message: 'Tarefa já foi concluída hoje' });
    }

    user.points += task.points;

    user.history.push({
      actionType: 'task_completed',
      referenceModel: 'Tasks',
      referenceId: taskId,
      date: new Date()
    });

    await user.save();

    return res.status(200).json({ message: 'Tarefa concluída com sucesso', user });
  } catch (err) {
    console.error('Erro ao concluir tarefa:', err);
    return res.status(500).json({ message: 'Erro ao concluir tarefa' });
  }
};

const redeemAward = async (req, res) => {
  try {
    const { userId, awardId } = req.body;

    const user = await User.findById(userId).populate('history.referenceId');
    const award = await Award.findById(awardId);

    if (!user || !award) {
      return res.status(404).json({ message: 'Usuário ou prêmio não encontrado' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const alreadyRedeemedToday = user.history.some(entry =>
      entry.actionType === 'award_redeemed' &&
      entry.referenceId?._id?.toString() === awardId &&
      new Date(entry.date).toDateString() === today.toDateString()
    );

    if (alreadyRedeemedToday) {
      return res.status(400).json({ message: 'Você já resgatou este prêmio hoje.' });
    }

    const userPoints = Number(user.points ?? 0);
    const awardPoints = Number(award.awardPoints ?? 0);

    if (isNaN(userPoints) || isNaN(awardPoints)) {
      return res.status(400).json({ message: 'Pontos inválidos.' });
    }

    if (userPoints < awardPoints) {
      return res.status(400).json({ message: 'Pontos insuficientes para resgatar a recompensa' });
    }

    user.points = userPoints - awardPoints;

    user.history.push({
      actionType: 'award_redeemed',
      referenceModel: 'Awards',
      referenceId: awardId,
      date: new Date()
    });

    await user.save();

    return res.status(200).json({ message: 'Recompensa resgatada com sucesso', user });
  } catch (err) {
    console.error('Erro ao resgatar recompensa:', err);
    return res.status(500).json({ message: 'Erro ao resgatar recompensa' });
  }
};

module.exports = {
    findUserByName,
    createUser,
    getUserData,
    completeTask,
    redeemAward
}