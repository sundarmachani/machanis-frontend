const getToken = () => localStorage.getItem('token');

const setToken = (token) => {
  localStorage.setItem('token', token);
};

const removeToken = () => {
  localStorage.removeItem('token');
};

export { getToken, setToken, removeToken };
