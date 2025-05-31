//home page controller

const home = async (req, res) => {
  try {
    res.status(200).send("hi i am home page");
  } catch (error) {
    console.log(error);
  }
};

// registration controller

const register = async (req, res) => {
  try {
    res.status(200).send("register");
  } catch (error) {
    console.log(error);
  }
};

// login controller

const login = (req, res) => {
  try {
    res.status(300).send("login");
  } catch (error) {
    console.log(error);
  }
};

module.exports = { home, register, login };
