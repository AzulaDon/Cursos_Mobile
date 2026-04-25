export const formatDuracion = (segundos) => {
  if (!segundos) return '0:00';
  const h = Math.floor(segundos / 3600);
  const m = Math.floor((segundos % 3600) / 60);
  const s = segundos % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
};

export const formatPorcentaje = (value) => {
  if (!value) return '0%';
  return `${parseFloat(value).toFixed(0)}%`;
};

export const estrellas = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);
