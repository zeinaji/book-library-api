const { Reader, Book, Author, Genre } = require('../models');

const get404Error = (model) => {
  return { error: `The ${model} could not be found.` };
};

const getModel = (model) => {
  const models = {
    book: Book,
    reader: Reader,
    author: Author,
    genre: Genre,
  };
  return models[model];
};

const removePassword = (item) => {
  const itemObject = item.toJSON();
  const { password, ...modifiedItem } = itemObject;
  return modifiedItem;
};

const createItem = (req, res, model) => {
  const Model = getModel(model);
  const newItem = req.body;

  Model.create(newItem)
    .then((item) => {
      const modifiedItem = removePassword(item);
      res.status(201).json(modifiedItem);
    })
    .catch((err) => {
      const errorMessages = err.errors.map((error) => error.message);
      res.status(400).json({ errors: errorMessages });
    });
};

const getAllItems = (req, res, model) => {
  const Model = getModel(model);
  const toInclude = model == 'genre' || model === 'author' ? Book : '';
  Model.findAll({ include: toInclude }).then((items) => {
    const modifiedItems = items.map((item) => removePassword(item));
    res.status(200).json(modifiedItems);
  });
};

const getItemById = (req, res, model) => {
  const { id } = req.params;
  const Model = getModel(model);
  const toInclude = model === 'book' ? ['Genre', 'Author'] : '';
  Model.findByPk(id, { include: toInclude }).then((item) => {
    if (!item) {
      res.status(404).json(get404Error(model));
    } else {
      const modifiedItem = removePassword(item);
      res.status(200).json(modifiedItem);
    }
  });
};

const updateItem = (req, res, model) => {
  const { id } = req.params;
  const Model = getModel(model);

  Model.update(req.body, { where: { id } }).then(([updatedItem]) => {
    if (!updatedItem) {
      res.status(404).json(get404Error(model));
    } else {
      Model.findByPk(id).then((item) => {
        const modifiedItem = removePassword(item);
        res.status(200).json(modifiedItem);
      });
    }
  });
};

const deleteItem = (req, res, model) => {
  const { id } = req.params;
  const Model = getModel(model);

  Model.findByPk(id).then((item) => {
    if (!item) {
      res.status(404).json(get404Error(model));
    } else {
      Model.destroy({ where: { id } }).then(() => {
        res.status(204).send();
      });
    }
  });
};

module.exports = {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
};
