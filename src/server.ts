import { app } from "./app";
import { prisma } from "./lib/prisma";

async function main() {
  try {
    await prisma.$connect();
    console.log("database conntected successfully!!");
    const port = process.env.PORT;
    app.listen(port, () => {
      console.log("server is running on port 50000");
    });
  } catch (error: any) {
    console.log(error.message);
    await prisma.$disconnect();
    process.exit();
  }
}
main();
