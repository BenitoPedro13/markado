type User = { id: string; name: string };
// Imaginary database
const users: User[] = [
  { id: 'id_bilbo', name: 'Bilbo 0' },
  { id: 'id_bilbo_1', name: 'Bilbo 1' },
  { id: 'id_bilbo_2', name: 'Bilbo 2' },
];
export const db = {
  user: {
    findMany: async () => users,
    findById: async (id: string) => users.find((user) => user.id === id),
    create: async (data: { name: string }) => {
      const user = { id: String(users.length + 1), ...data };
      users.push(user);
      return user;
    },
  },
};
