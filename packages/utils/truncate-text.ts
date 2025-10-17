export const truncateText = (text, maxLength) => {
  if (!text || !maxLength) return text;
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
};
