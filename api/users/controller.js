const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const {
    create,
    getUsersById,
    getUsers,
    updateUser,
    deleteUser,
    getUserByUserEmail,
    getGender,
    forgetPassword,
} = require("./service");

module.exports = {
    createUser: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        create(body, (err, results) => {
            if (err) {
                console.log(err);
                if (err.code === 'ER_DUP_ENTRY' && err.sqlMessage === "Duplicate entry '" + body.email + "' for key 'EMAIL'") {
                    console.log(err.code);
                    return res.status(200).json({
                        success: 0,
                        status: "error",
                        message: "Email already exists"
                    });
                } else if (err.code === 'ER_DUP_ENTRY' && err.sqlMessage === "Duplicate entry '" + body.number + "' for key 'NUMBER'") {
                    console.log(err.code);
                    return res.status(200).json({
                        success: 0,
                        status: "error",
                        message: "Number already exists"
                    });
                }
                return res.status(500).json({
                    success: 0,
                    message: "Database connection error"
                });
            } else {
                const jsontoken = sign({ result: results }, "qwe1234", {
                    expiresIn: "1h"
                });
                return res.status(200).json({
                    access_token: jsontoken,
                    code: 200,
                    status: "success",
                    Show_Data_Insert_Values: results,
                    data: {
                        user: {
                            id: results.insertId,
                            // ...body
                            first_name: body.first_name,
                            last_name: body.last_name,
                            gender: body.gender,
                            email: body.email,
                            // password: body.password,
                            number: Number(body.number)
                        }
                    }
                });
            }
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
            const result = compareSync(body.password, results.PASSWORD);
            if (result) {
                results.PASSWORD = undefined;
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
    },
    getGender: (req, res) => {
        getGender((err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            return res.json({
                success: 1,
                length: results.length,
                data: results.map((item) => {
                    return {
                        id: item.ID,
                        gender: item.GENDER_NAME
                    }
                })
            })
        })
    },
    forgetPassword: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        forgetPassword(body, (err, results) => {
            console.log('results', results);
            console.log('body', body);
            if (err) {
                console.log(err);
                return;
            }
            if (!results || body.email == null || body.email == undefined || body.email == "")
                return res.json({
                    success: 0,
                    message: "email not found",
                    // data: {
                    //     id: results.insertId,
                    //     ...body
                    // }
                })
            else if (results.affectedRows == 0) {
                return res.json({
                    success: 0,
                    message: "Invalid Email Address"
                });
            }
            return res.json({
                success: 1,
                message: "updated successfully",
                // data: {
                //     id: results.insertId,
                //     ...body
                // }
            })
        })
    }
}