const UserFactory = require("./factory/userFactory");

(async () => {
  const userFactory = await UserFactory.createInstance();
  const result = await userFactory.find({ name: "Wall*" });
  console.log(result);
})();
