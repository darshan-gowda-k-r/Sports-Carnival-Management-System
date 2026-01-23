import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Colors from '../../constants/colors';
import CustomButton from '../../components/customButton';
import { validationStrings } from '../../constants/validationStrings';
import styles from './LoginScreenStyle';
import { useAuthViewModel } from '../../viewmodels/authViewModel';
import { isEmailValid, isPasswordValid } from '../../utils/validators';
import { UserRole } from '../../models/user';

const LoginScreen = ({ navigation }: any) => {
  const { login, loading, error, user } = useAuthViewModel();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    const errorMsg = isPasswordValid(text);
    setPasswordError(errorMsg);
  };

  const handleLogin = async () => {
    const emailError = isEmailValid(email);
    if (emailError) {
        alert(emailError);
        return;
    }

    const passError = isPasswordValid(password);
    if (passError) {
        setPasswordError(passError);
        return;
    }

    await login(email, password);
  };

  const isFormValid = !isEmailValid(email) && !isPasswordValid(password);

  useEffect(() => {
    if (!user) return;

    switch (user.role) {
      case UserRole.ADMIN:
        navigation.replace('AdminHome');
        break;
      case UserRole.ORGANIZER:
        navigation.replace('OrganizerHome');
        break;
      case UserRole.PARTICIPANT:
        navigation.replace('ParticipantHome');
        break;
      default:
        navigation.replace('Login');
    }
  }, [user, navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{validationStrings.TITLE}</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor={Colors.gray}
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor={Colors.gray}
        style={styles.input}
        value={password}
        onChangeText={handlePasswordChange}
        secureTextEntry
      />
      {passwordError && <Text style={styles.fieldError}>{passwordError}</Text>}
      {error && <Text style={styles.error}>{error}</Text>}

      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : (
        <CustomButton
          title="Login"
          onPress={handleLogin}
          disabled={!isFormValid}
        />
      )}

      <Text style={styles.registerText}>
        Don’t have an account?{' '}
        <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
            Register
        </Text>
      </Text>
    </View>
  );
};

export default LoginScreen;
