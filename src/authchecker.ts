import { AuthChecker } from "type-graphql";
import MyContext from "./context";

const authChecker: AuthChecker<MyContext> = async ({ context: { user } }) => {
  if (user) return true;
  return false;
};

export default authChecker;
