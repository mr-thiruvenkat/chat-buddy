import { Modal, Pressable, useWindowDimensions, View } from "react-native";

import { Button } from "@/shared/components/Button";
import { AppText } from "@/shared/components/Text";
import { useStyles } from "@/theme/useStyles";

type ConfirmationModalProps = {
  visible: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmationModal({
  visible,
  message,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  const { height } = useWindowDimensions();
  const { styles, isDark } = useStyles();

  return (
    <Modal
      animationType="slide"
      onRequestClose={onCancel}
      transparent
      visible={visible}
    >
      <View style={styles.modalRoot}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close confirmation"
          onPress={onCancel}
          style={styles.modalBackdrop}
        />
        <View
          style={[
            styles.modalSheet,
            isDark && styles.darkModalSheet,
            { height: height * 0.3 },
          ]}
        >
          <AppText style={[styles.modalMessage, isDark && styles.darkText]}>{message}</AppText>
          <View style={styles.modalActions}>
            <Button accessibilityRole="button" onPress={onCancel} style={styles.modalCancelButton}>
              <AppText style={styles.modalCancelText}>Cancel</AppText>
            </Button>
            <Button accessibilityRole="button" onPress={onConfirm} style={styles.modalConfirmButton}>
              <AppText style={styles.modalConfirmText}>Confirm</AppText>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}