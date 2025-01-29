import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform, Pressable, StyleProp, TextStyle } from 'react-native';

interface CustomButtonProps {
  /**
   * The text to display on the button.
   */
  title: string;
  /**
   * Optional style object for the button.
   */
  style?: StyleProp<any>;
  /**
   * Optional style object for the button text.
   */
  textStyle?: TextStyle;
  /**
   * Function to be called when the button is pressed.
   */
  onPress: () => void;
  /**
   * Whether the button is disabled.
   */
  disabled?: boolean;
}

/**
 * A custom button component that renders either a TouchableOpacity (iOS) or Pressable (Android).
 *
 * @param {CustomButtonProps} props - The props for the CustomButton component.
 * @returns {JSX.Element} - The CustomButton component.
 *
 * @example
 * const handleSave = () => {
 *   Alert.alert("Save Button Pressed", "Saving data...");
 * };
 *
 * <CustomButton
 *   title="Save"
 *   style={styles.saveButton}
 *   textStyle={styles.saveButtonText}
 *   onPress={handleSave}
 * />
 */
const CustomButton: React.FC<CustomButtonProps> = ({ title, style, textStyle, onPress, disabled }) => {

  const ButtonComponent = Platform.OS === 'ios' ? TouchableOpacity : Pressable;

  return (
    <ButtonComponent
      style={[styles.button, style, disabled ? styles.disabledButton : null]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </ButtonComponent>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default CustomButton;