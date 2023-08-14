import { roles } from "../../middleware/auth.js";

export const endPoint = {
    createRestaurant: [roles.User],
    updateRestaurant: [roles.User],
};
 