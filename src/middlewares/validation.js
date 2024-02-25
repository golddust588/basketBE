const registerValidationMiddleware = (schema) => {
  return (req, res, next) => {
    try {
      const { error } = schema.validate(req.body);

      if (error) {
        console.log("error", error);
        return res.status(400).json({ message: "Validation is unsuccessful" });
      }

      return next();
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: "Validation is unsuccessful" });
    }
  };
};

const loginValidationMiddleware = (schema) => {
  return (req, res, next) => {
    try {
      const { error } = schema.validate(req.body);

      if (error) {
        console.log("error", error);
        return res.status(404).json({ message: "Bad email or password" });
      }

      return next();
    } catch (err) {
      console.log(err);
      return res.status(404).json({ message: "Bad email or password" });
    }
  };
};
export { registerValidationMiddleware, loginValidationMiddleware };
