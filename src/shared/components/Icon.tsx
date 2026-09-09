import MaterialIcons from "@react-native-vector-icons/material-icons";
import type { ComponentProps } from "react";

type IconProps = Omit<ComponentProps<typeof MaterialIcons>, "name"> & {
  name: string;
};

export default function Icon({ name, ...props }: IconProps) {
  return <MaterialIcons {...props} name={name as never} />;
}
