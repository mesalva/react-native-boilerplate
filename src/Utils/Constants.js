var { EventEmitter } = require("fbemitter");

module.exports = {
  alertTitle: "Firebase Login",
  keyCurrentUser: "currentUser",
  emitter: new EventEmitter(),
  loginListener: "loginListener",
  logoutListener: "logoutListener",
  colors: {
    themeBGColor: "#aaa",
    buttonBGColor: "#888",
    borderColor: "#555",
    whiteTitleColor: "#fff"
  },
  keyLoginNav: {
    keyStack: "Stack",
    keySignUp: "SignUp"
  },
  /// Funções comuns
  debugLog: log => {
    console.log("\n====================>");
    console.log(log);
    console.log("<====================\n");
  }
};
