const users = [
    {id: '1', name: 'João', email: 'joao@example.com'},
    {id: '2', name: 'Maria', email: 'maria@example.com'}
];

const resolvers = {
    hello: () => 'Olá mundo!',
    users: () => users,
    user: ({id}: { id: string }) => users.find(user => user.id === id),
    createUser: ({name, email}: { name: string, email: string }) => {
        const id = String(users.length + 1);
        const newUser = {id, name, email};
        users.push(newUser);
        return newUser;
    }
};

export default resolvers