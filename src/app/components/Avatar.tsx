import { Image } from "expo-image";
import { ImageStyle, StyleProp, View, ViewStyle } from "react-native";

const noUserImage = require("../../../assets/images/no-user.png");

type AvatarProps = {
  uri?: string | null;
  online?: boolean;
  size?: number;
  containerStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  onlineStyle?: StyleProp<ViewStyle>;
};

export default function Avatar({
  uri,
  online = false,
  size = 54,
  containerStyle,
  imageStyle,
  onlineStyle,
}: AvatarProps) {
  const baseContainerStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  };

  const baseImageStyle: ImageStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
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
      <Image
        source={uri ? { uri } : noUserImage}
        contentFit="cover"
        style={[baseImageStyle, imageStyle]}
      />
      {online ? <View style={[baseOnlineStyle, onlineStyle]} /> : null}
    </View>
  );
}
