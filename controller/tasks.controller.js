const Task = require('../models/Tasks.js');
const User = require('../models/User.js');

const createTask = async (req, res) => {
  try {
    const { title, description, points, userId } = req.body;

    if (!title || !description || points == null || !userId) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado!' });
    }

    const newTask = await Task.create({ title, description, points });

    user.tasks = user.tasks || [];
    user.tasks.push(newTask._id);
    await user.save();

    res.status(201).json(newTask);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Erro ao criar a tarefa!' });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, points } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, description, points },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Tarefa não encontrada!' });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Erro ao atualizar a tarefa!' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada!' });
    }

    await Task.findByIdAndDelete(id);

    const user = await User.findOne({ tasks: id });

    if (user) {
      user.tasks = user.tasks.filter(taskId => taskId.toString() !== id);

      user.history = user.history.filter(entry =>
        !(entry.referenceModel === 'Tasks' && entry.referenceId.toString() === id)
      );

      await user.save();
    }

    res.status(200).json({ message: 'Tarefa deletada com sucesso!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Erro ao deletar a tarefa!' });
  }
};

module.exports = {
    createTask,
    updateTask,
    deleteTask
}