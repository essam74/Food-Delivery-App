import { roles } from "../../middleware/auth.js";


export const endpoint ={
    create: [roles.User],
    update: [roles.User],
    delete: [roles.User],
    get:    [roles.User]
}