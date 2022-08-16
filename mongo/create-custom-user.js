// Create user
dbAdmin = db.getSiblingDB("demo-database");
dbAdmin.createUser({
    user: "adrian",
    pwd: "password",
    roles: [{ role: "dbOwner", db: "demo-database" }],
    mechanisms: ["SCRAM-SHA-1"],
});
