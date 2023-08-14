import { roles } from "../../middleware/auth.js";

export const endPoint = {
  createItem: [roles.User],
  updateItem: [roles.User],
  wishlist: [roles.User],
};
