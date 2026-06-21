// Wrapper simples para tratar erros assíncronos em controllers
// Evita repetir try/catch em cada função, encaminhando o erro para o middleware global
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;
