import { roles } from "../../middleware/auth.js";

export const endPoint = {
  addToCart: [roles.User],
  deleteFromCart: [roles.User],
};
