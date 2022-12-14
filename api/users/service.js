const pool = require("../../config/database")

module.exports = {
    create: (data, callBack) => {
        pool.query(
            `insert into registration(FIRSTNAME,LASTNAME,GENDER,EMAIL,PASSWORD,NUMBER)
            values(?,?,?,?,?,?)`, [
                data.first_name,
                data.last_name,
                data.gender,
                data.email,
                data.password,
                data.number
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }

        );
    },
    getUsers: callBack => {
        pool.query(
            `select id,firstname,lastname,gender,email,number from registration`, [],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        )
    },
    getUsersById: (id, callBack) => {
        pool.query(
            `select id,firstname,lastname,gender,email,number from registration where id = ?`, [id],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results[0]);
            }
        )
    },
    updateUser: (data, callBack) => {
        pool.query(
            `update registration set firstname=?,lastname=?,gender=?,email=?,password=?,number=? where id = ?`, [
                data.first_name,
                data.last_name,
                data.gender,
                data.email,
                data.password,
                data.number,
                data.id
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        )
    },
    deleteUser: (id, callBack) => {
        pool.query(
            `delete from registration where id = ?`, [id],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        )
    },
    // login query for user
    getUserByUserEmail: (email, callBack) => {
        pool.query(
            `select * from registration where email = ? or number = ?`, [email, email],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results[0]);
            }
        )
    },
    getGender: callBack => {
        pool.query(
            `SELECT ID, GENDER_NAME FROM GENDER`, [],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        )
    },
    forgetPassword: (data, callBack) => {
        pool.query(
            `update registration set password=? where email = ?`, [
                data.password,
                data.email
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        )
    },
}