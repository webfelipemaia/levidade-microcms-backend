const bcrypt = require('bcryptjs');
const db = require('../helpers/db');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    authenticate,
};

async function getAll() {
    //return await db.User.findAll();
    const users = await db.User.findAll({ attributes: {exclude:['password']} });
    return users;
}

async function getById(id) {
    return await getUser(id);
}

async function create(params) {
    
    if (await db.User.findOne({ where: { email: params.email } })) {
        throw 'Email "' + params.email + '" is already registered';
    }

    const user = new db.User(params);    
    user.passwordHash = await bcrypt.hash(params.password, 10);
    await user.save();
}

async function update(id, params) {
    const user = await getUser(id);

    // validate
    const emailChanged = params.email && user.email !== params.email;
    if (emailChanged && await db.User.findOne({ where: { email: params.email } })) {
        //throw 'Email "' + params.email + '" is already registered';
        return { 
            status: "error", 
            message: 'Email "' + params.email + '" is already registered'
        }
    }

    // hash password if it was entered
    if (params.password) {
        params.passwordHash = await bcrypt.hash(params.password, 10);
    }

    // copy params to user and save
    Object.assign(user, params);
    await user.save();
}

async function _delete(id) {
    const user = await getUser(id);
    await user.destroy();
}

// helper functions

async function getUser(id) {
    const user = await db.User.findByPk(id);
    if (!user) {
        return { 
            status: "error", 
            message: "User not found" 
        }
    } else {
        return { 
            status: "success", 
            data: user 
        }
    }
}

async function authenticate(email, password){
    
    const user = await db.User.findOne({ where: {email: `${email}`} });
    var isRegistered = false;
    
    if (!user) {
        return { 
            status: "error", 
            message: "User not found" 
        }
    }
      
    if (user.password === password) isRegistered = true
    
    if (isRegistered) {
        const user = await db.User.findAll(
             { attributes: {exclude:['password']} },
             { where: {email: `${email}`} },
             { limit: 1 }
        );
        return { 
            status: "success", 
            data: user[0]
        }
    } else {
        return { 
            status: "error", 
            message: "Password incorrect" 
        }
    }
  };