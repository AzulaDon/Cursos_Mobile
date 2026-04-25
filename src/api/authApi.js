import api from './apiClient';

export const login = async (correo, password) => {
  const res = await api.post('/api/auth/login', { correo, password });
  return res.data.data; // { token, tipo, usuario }
};

export const registro = async (nombre, correo, password) => {
  const res = await api.post('/api/auth/registro', { nombre, correo, password });
  return res.data.data;
};
