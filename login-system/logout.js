const logout = async (req, res) => {
  localStorage.removeItem("accessToken");
  res.sendStatus(200);
};

module.exports = { logout };
