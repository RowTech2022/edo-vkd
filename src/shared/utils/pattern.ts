export const getLoginPattern = () => {
  return /^[a-zA-Z0-9_\-@.'\s]*$/;
};

export const getNamePattern = () => {
  return /^[а-яА-ЯёЁa-zA-ZғӣқӯҳҷҒӢҚӮҲҶ\s\-']*$/;
};