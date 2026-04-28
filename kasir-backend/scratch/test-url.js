const connectionString = "mysql://root:@localhost:3306/kasir";
const url = new URL(connectionString);
console.log({
  hostname: url.hostname,
  port: url.port,
  username: url.username,
  password: url.password,
  pathname: url.pathname
});
