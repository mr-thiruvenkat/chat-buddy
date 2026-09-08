import { Image } from "expo-image";
import {
  ImageStyle,
  StyleProp,
  TextStyle,
  View,
  ViewStyle,
  Text,
} from "react-native";

type AvatarProps = {
  initials: string;
  color: string;
  uri?: string | null;
  online?: boolean;
  size?: number;
  containerStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  textStyle?: StyleProp<TextStyle>;
  onlineStyle?: StyleProp<ViewStyle>;
};

export function Avatar({
  initials,
  color,
  uri,
  online = false,
  size = 54,
  containerStyle,
  imageStyle,
  textStyle,
  onlineStyle,
}: AvatarProps) {
  const baseContainerStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: color,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  };

  const baseImageStyle: ImageStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  const baseTextStyle: TextStyle = {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  };

  const baseOnlineStyle: ViewStyle = {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#34C759",
    borderWidth: 2,
    borderColor: "#fff",
    right: 5,
    bottom: 0,
  };

  return (
    <View style={[baseContainerStyle, containerStyle]}>
      {uri ? (
        <Image source={{ uri }} contentFit="cover" style={[baseImageStyle, imageStyle]} />
      ) : (
        <Text style={[baseTextStyle, textStyle]}>{initials}</Text>
      )}
      {online ? <View style={[baseOnlineStyle, onlineStyle]} /> : null}
    </View>
  );
}
