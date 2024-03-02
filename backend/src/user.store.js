let user = [];

const addUser = (userId) => {
  const isUserExist = user.find((id) => id.userId === userId);
  if (!isUserExist) {
    user.push({ userId: userId });
  } else {
    console.log(`User with ID already exists`);
  }
};

const removeUser = (userId) => {
  const isUserExist = user.filter((id) => id.userId !== userId);
  user = isUserExist;
};
export { user, addUser, removeUser };
