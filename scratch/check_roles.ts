import { queryDB } from "./backend/src/utils/queryDB";

async function checkRoles() {
    try {
        console.log("Checking roles table...");
        const roles = await queryDB("SELECT * FROM role", []);
        console.log("ROLES IN DATABASE:");
        console.table(roles);
    } catch (err) {
        console.error("Error checking roles:", err);
    }
}

checkRoles();
