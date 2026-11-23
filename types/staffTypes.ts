import { adminUserProps } from "./sidebar";

export type staffResponseProps = {
  data: adminUserProps[];
  meta: { total: number };
};
