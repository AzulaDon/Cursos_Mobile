import api from './apiClient';

// ── CURSOS ──────────────────────────────────────────────
export const getCursos = async () => {
  const res = await api.get('/api/cursos');
  return res.data.data; // List<CursoDTO>
};

export const getCurso = async (cursoId) => {
  const res = await api.get(`/api/cursos/${cursoId}`);
  return res.data.data; // CursoDTO (incluye videos[])
};

export const buscarCursos = async (q) => {
  const res = await api.get('/api/cursos/buscar', { params: { q } });
  return res.data.data;
};

// ── INSCRIPCIONES ────────────────────────────────────────
export const getMisCursos = async () => {
  const res = await api.get('/api/inscripciones/mis-cursos');
  return res.data.data; // List<InscripcionDTO>
};

export const getInscripcionCurso = async (cursoId) => {
  const res = await api.get(`/api/inscripciones/curso/${cursoId}`);
  return res.data.data; // InscripcionDTO
};

export const verificarInscripcion = async (cursoId) => {
  const res = await api.get(`/api/inscripciones/verificar/${cursoId}`);
  return res.data.data; // Boolean
};

export const inscribirse = async (cursoId) => {
  const res = await api.post(`/api/inscripciones/curso/${cursoId}`);
  return res.data.data; // InscripcionDTO
};

export const getInscripcion = async (inscripcionId) => {
  const res = await api.get(`/api/inscripciones/${inscripcionId}`);
  return res.data.data;
};

// ── VIDEOS ───────────────────────────────────────────────
export const getVideosCurso = async (cursoId) => {
  const res = await api.get(`/api/videos/curso/${cursoId}`);
  return res.data.data; // List<VideoDTO>
};

// ── PROGRESO ─────────────────────────────────────────────
export const getProgreso = async (inscripcionId) => {
  const res = await api.get(`/api/progreso/inscripcion/${inscripcionId}`);
  return res.data.data; // List<ProgresoDTO>
};

export const getProgresoVideo = async (inscripcionId, videoId) => {
  const res = await api.get(`/api/progreso/inscripcion/${inscripcionId}/video/${videoId}`);
  return res.data.data; // ProgresoDTO
};

export const guardarProgreso = async (inscripcionId, videoId, segundoActual) => {
  const res = await api.post(`/api/progreso/inscripcion/${inscripcionId}`, {
    videoId,
    segundoActual,
  });
  return res.data.data; // ProgresoDTO
};

// ── CALIFICACIONES ───────────────────────────────────────
export const getCalificacionInscripcion = async (inscripcionId) => {
  const res = await api.get(`/api/calificaciones/inscripcion/${inscripcionId}`);
  return res.data.data; // CalificacionDTO | null
};

export const calificarCurso = async (inscripcionId, estrellas, comentario) => {
  const res = await api.post(`/api/calificaciones/inscripcion/${inscripcionId}`, {
    estrellas,
    comentario,
  });
  return res.data.data; // CalificacionDTO
};
