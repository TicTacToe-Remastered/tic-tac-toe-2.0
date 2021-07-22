const users = [];

/**
 * @description Create a new user
 * @param  {object} socket
 * @returns {object}
 */
const createUser = ({ id, name }) => {
    name = name.trim();

    const existingUser = users.find((user) => user.name === name);

    if (!name) return { error: 'Username is required.' };
    if (existingUser) return { error: 'Username is taken.' };

    const user = { id, name };

    users.push(user);

    return { user };
}

/**
 * @description Remove a user
 * @param  {string} id
 * @returns {array}
 */
const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) return users.splice(index, 1)[0];
}

/**
 * @description Get user data
 * @param  {string} id
 * @returns {object || undefined}
 */
const getUser = (id) => users.find((user) => user.id === id);

module.exports = { createUser, removeUser, getUser };