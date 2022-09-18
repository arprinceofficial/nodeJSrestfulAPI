const {
    createUser,
    getUsersById,
    getUsers,
    updateUser,
    deleteUser
} = require('./user.controller');
const router = require('express').Router();

router.post('/', createUser);
router.get('/:id', getUsersById);
router.get('/', getUsers);
router.post('/update', updateUser);
router.delete('/', deleteUser)

module.exports = router;