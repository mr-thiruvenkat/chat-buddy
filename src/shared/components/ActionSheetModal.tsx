import { Modal, Pressable, useWindowDimensions, View } from "react-native";

import { Button } from "@/shared/components/Button";
import Icon from "@/shared/components/Icon";
import { AppText } from "@/shared/components/Text";
import { useStyles } from "@/theme/useStyles";

export type ActionSheetOption = {
  label: string;
  icon: string;
  onPress: () => void;
};

type ActionSheetModalProps = {
  visible: boolean;
  title: string;
  options: ActionSheetOption[];
  onCancel: () => void;
};

export function ActionSheetModal({ visible, title, options, onCancel }: ActionSheetModalProps) {
  const { height } = useWindowDimensions();
  const { styles, isDark } = useStyles();

  return (
    <Modal animationType="slide" onRequestClose={onCancel} transparent visible={visible}>
      <View style={styles.modalRoot}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close options"
          onPress={onCancel}
          style={styles.modalBackdrop}
        />
        <View
          style={[styles.modalSheet, isDark && styles.darkModalSheet, { minHeight: height * 0.3 }]}
        >
          <AppText style={[styles.modalTitle, isDark && styles.darkText]}>{title}</AppText>
          <View style={styles.modalOptionList}>
            {options.map((option) => (
              <Button
                accessibilityRole="button"
                accessibilityLabel={option.label}
                key={option.label}
                onPress={option.onPress}
                style={styles.modalOptionButton}
              >
                <Icon
                  name={option.icon}
                  size={20}
                  color={isDark ? styles.darkText.color : undefined}
                />
                <AppText style={[styles.modalOptionText, isDark && styles.darkText]}>
                  {option.label}
                </AppText>
              </Button>
            ))}
          </View>
          <Button accessibilityRole="button" onPress={onCancel} style={styles.modalCancelButton}>
            <AppText style={styles.modalCancelText}>Cancel</AppText>
          </Button>
        </View>
      </View>
    </Modal>
  );
}
