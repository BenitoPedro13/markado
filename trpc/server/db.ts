type User = { id: string; name: string };
// Imaginary database
const users: User[] = [
  { id: '1', name: 'Bilbo 0' },
  { id: '2', name: 'Bilbo 1' },
  { id: '3', name: 'Bilbo 2' },
];
export const db = {
  user: {
    findMany: async () => users,
    findById: async (id: string) => {
      console.log('Finding user with id:', id, typeof id);
      return users.find((user) => {
        console.log('Checking user:', user, typeof user.id);
        return user.id === id;
      });
    },
    create: async (data: { name: string }) => {
      const user = { id: String(users.length + 1), ...data };
      users.push(user);
      return user;
    },
  },
};
