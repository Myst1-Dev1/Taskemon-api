const Awards = require('../models/Awards.js');
const User = require('../models/User.js');

const createAward = async (req, res) => {
    try {
        const { awardImg, awardTitle, awardPoints, userId } = req.body;

        if(!awardImg || !awardTitle || !awardPoints || !userId) {
            return res.status(400).json({message: "Todos os campos são obrigatórios!"});
        }

        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado!' });
        }

        const newAward = await Awards.create({awardImg, awardTitle, awardPoints});

        user.awards = user.awards || [];
        user.awards.push(newAward._id);
        await user.save();

        res.status(201).json({
            message: "Recopensa criada com sucesso!",
            data: newAward
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Erro ao pegar os dados das recompensas!"});
    }
}

const updateAward = async (req, res) => {
    try {
        const { id } = req.params;
        const { awardImg, awardTitle, awardPoints } = req.body;

        const updatedAward = await Awards.findByIdAndUpdate(
            id,
            { awardImg, awardTitle, awardPoints },
            { new: true }
        );

        if(!updatedAward) {
            res.status(404).json({ message: 'Recompensa não encontrada!' });
        }

        res.status(200).json({
            message: "Recompensa atualizada com sucesso !",
            data: updatedAward
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Erro ao atualizar os dados das recompensa!"});
    }
}

const deleteAward = async (req, res) => {
  try {
    const { id } = req.params;

    const award = await Awards.findById(id);
    if (!award) {
      return res.status(404).json({ message: 'Recompensa não encontrada!' });
    }

    await Awards.findByIdAndDelete(id);

    const user = await User.findOne({ awards: id });

    if (user) {
      user.awards = user.awards.filter(awardId => awardId.toString() !== id);

      user.history = user.history.filter(entry =>
        !(entry.referenceModel === 'Awards' && entry.referenceId.toString() === id)
      );

      await user.save();
    }

    res.status(200).json({ message: 'Recompensa deletada com sucesso!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Erro ao deletar a recompensa!' });
  }
};

module.exports = {
    createAward,
    updateAward,
    deleteAward
}