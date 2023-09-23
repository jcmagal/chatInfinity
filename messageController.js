const { CONAPEPVH, Ariquemes, Jaru, JiParana, ImpelZL, groupList } = require('./database');



function getCityModel(city) {
  switch(city) {
    case 'CONAPEPVH':
      return CONAPEPVH;
    case 'Ariquemes':
      return Ariquemes;
    case 'Jaru':
      return Jaru;
    case 'JiParana':
      return JiParana;
    case 'ImpelZL':
      return ImpelZL;
    default:
      throw new Error('Invalid city');
  }
}

exports.postMessage = async (req, res) => {
  try {
    const { city, group, text, sender } = req.body;
    const CityModel = getCityModel(city);

    // Verificando se o grupo é válido
    if (!groupList.includes(group)) {
      return res.status(400).send({ error: 'Invalid group' });
    }

    // Verificando a cidade do usuário autenticado
    if (req.user.city !== city) {
      return res.status(403).send({ error: 'Access forbidden: You can only post messages in your own city' });
    }

    const newMessage = new CityModel({ group, text, sender });
    await newMessage.save();

    res.send(newMessage);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { city, group } = req.query;
    const CityModel = getCityModel(city);

    // Verificando se o grupo é válido
    if (!groupList.includes(group)) {
      return res.status(400).send({ error: 'Invalid group' });
    }

    // Verificando a cidade do usuário autenticado
    if (req.user.city !== city) {
      return res.status(403).send({ error: 'Access forbidden: You can only view messages from your own city' });
    }

    const messages = await CityModel.find({ group });
    res.send(messages);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.getMessagesByGroup = async (req, res) => {
  try {
    const { group } = req.params;
    const { city } = req.query;
    const CityModel = getCityModel(city);

    // Verificando se o grupo é válido
    if (!groupList.includes(group)) {
      return res.status(400).send({ error: 'Invalid group' });
    }
    try {
      const messages = await Message.find({ group: groupName });
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ error: "Erro ao recuperar mensagens." });
    }

    // Verificando a cidade do usuário autenticado
    if (req.user.city !== city) {
      return res.status(403).send({ error: 'Access forbidden: You can only view messages from your own city' });
    }

    const messages = await CityModel.find({ group });
    res.send(messages);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.updateMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, city } = req.body;
    const CityModel = getCityModel(city);

    // Verificando a cidade do usuário autenticado
    if (req.user.city !== city) {
      return res.status(403).send({ error: 'Access forbidden: You can only update messages from your own city' });
    }

    const message = await CityModel.findByIdAndUpdate(id, { text }, { new: true });
    res.send(message);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.postMessage = async (req, res) => {
  try {
    const { city, group, text, sender } = req.body;
    const CityModel = getCityModel(city);

    // Verificando se o grupo é válido
    if (!groupList.includes(group)) {
      return res.status(400).send({ error: 'Invalid group' });
    }

    // Verificando a cidade do usuário autenticado
    if (req.user.city !== city) {
      return res.status(403).send({ error: 'Acesso perdido.' });
    }

    if (!req.body.text || req.body.text.length > 1000) {
      return res.status(400).send({ error: 'Message text is either empty or exceeds 1000 characters' });
    }

    const newMessage = new CityModel({ group, text, sender });
    await newMessage.save();

    res.send(newMessage);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

