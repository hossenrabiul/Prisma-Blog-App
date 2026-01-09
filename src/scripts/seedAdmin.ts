import { prisma } from "../lib/prisma";
import { userRole } from "../middlewares/auth";

async function seedAdmin() {
  const adminData = {
    name: "admin2 saheb",
    email: "admin2@admin.com",
    password: "robiul123@@",
    role: userRole.ADMIN,
  };
  try {
    // check use exist already on DB or not
    const existingUser = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });
    if (existingUser) {
      throw new Error("User already exist!!");
    }

    const signinAdmin = await fetch("http://localhost:5000/api/auth/sign-up/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(adminData),
    });
    if(signinAdmin.ok){
        await prisma.user.update({
            where : {
                email : adminData.email
            },
            data : {
                emailVerified : true
            }
        })
        console.log("***************Updated succesfully...")
    }

  } catch (error: any) {
    console.log(error.message);
  }
}
seedAdmin()