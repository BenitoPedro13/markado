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
      return users.find((user) => {
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
