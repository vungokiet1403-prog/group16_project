// controllers/userController.js

exports.getUsers = (req, res) => {
  res.json([
    { id: 1, name: 'Vo Hoang KHA' },
    { id: 2, name: 'Kiet Bap' }
  ]);
};

exports.createUser = (req, res) => {
  const newUser = req.body;
  res.status(201).json({
    message: 'User created successfully',
    user: newUser
  });
};
