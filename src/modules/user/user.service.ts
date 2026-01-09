import { prisma } from "../../lib/prisma"
import { userRole } from "../../middlewares/auth"

const updateUser = async(authorId : string, data : {status ?: string, role ?: userRole})=>{
    return await prisma.user.update({
        where : {
            id : authorId
        },
        data : data
    })
}

export const userServices = {
    updateUser
}