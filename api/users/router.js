const {
    createUser,
    getUsersById,
    getUsers,
    updateUser,
    deleteUser,
    login,
    getGender,
} = require('./controller');
const router = require('express').Router();
const { checkToken } = require('../../auth/token_validation');


router.post('/', createUser);
router.get('/:id', checkToken, getUsersById);
router.get('/', checkToken, getUsers);
router.post('/update', checkToken, updateUser);
router.delete('/:id', checkToken, deleteUser)
router.post('/login', login)
router.get('/gender/list', getGender);

module.exports = router;