// const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const {
    create,
    getUsersById,
    getUsers,
    updateUser,
    deleteUser,
    getUserByUserEmail,
} = require("./user.service");

module.exports = {
    createUser: (req, res) => {
        const body = req.body;
        // const salt = genSaltSync(10);
        // body.password = hashSync(body.password, salt);
        create(body, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    message: "Email Should Be Unique or Database connection error"
                });
            }
            return res.status(200).json({
                code: 200,
                status: "success",
                Show_Data_Insert_Values: results,
                data: {
                    id: results.insertId,
                    // ...body
                    first_name: body.first_name,
                    last_name: body.last_name,
                    gender: body.gender,
                    email: body.email,
                    // password: body.password,
                    number: Number(body.number)
                }
            });
        });
    },
    getUsersById: (req, res) => {
        const id = req.params.id;
        getUsersById(id, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            if (!results) {
                return res.json({
                    success: 0,
                    message: "Record not found"
                })
            }
            return res.json({
                success: 1,
                data: results,
            })

        });
    },
    getUsers: (req, res) => {
        getUsers((err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            return res.json({
                success: 1,
                length: results.length,
                data: results
            })
        })
    },
    updateUser: (req, res) => {
        const body = req.body;
        // const salt = genSaltSync(10);
        // body.password = hashSync(body.password, salt);
        updateUser(body, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            if (!results || body.id == null || body.id == undefined || body.id == "")
                return res.json({
                    success: 0,
                    message: "Invalid id or id not found"
                })
            return res.json({
                success: 1,
                message: "updated successfully",
                data: {
                    id: results.insertId,
                    ...body
                }
            })
        })
    },
    deleteUser: (req, res) => {
        const id = req.params.id;
        deleteUser(id, (err, results) => {
            // console.log(results, id);
            console.log("affectedRows =", results.affectedRows, "and", "id =", id);
            if (err) {
                console.log(err);
                return;
            }
            if (results.affectedRows == 0) {
                return res.json({
                    success: 0,
                    message: "Record not found"
                });
            }
            return res.json({
                success: 1,
                message: "user delete successfully"
            })
        })
    },
    login: (req, res) => {
        const body = req.body;
        getUserByUserEmail(body.email, (err, results) => {
            // console.log('results', results.PASSWORD);
            // console.log('body', body.password);

            if (err) {
                console.log(err);
                return;
            }
            if (!results) {
                return res.json({
                    success: 0,
                    message: "Record not found"
                })
            }
            const pass = results.PASSWORD ? results.PASSWORD : undefined;
            if (pass == body.password) {
                const jsontoken = sign({ result: results }, "qwe1234", {
                    expiresIn: "1h"
                });
                return res.json({
                    access_token: jsontoken,
                    code: 200,
                    status: "success",
                    // success: 1,
                    // data: results,
                    message: "loginID " + results.ID,
                    data: {
                        token: {
                            access_token: jsontoken,
                        },
                        user: {
                            id: results.ID,
                            first_name: results.FIRSTNAME,
                            last_name: results.LASTNAME,
                            email: results.EMAIL,
                            number: results.NUMBER,
                        }
                    },
                })
            } else {
                return res.json({
                    success: 0,
                    message: "Invalid Password"

                })
            }

        });
    }
}