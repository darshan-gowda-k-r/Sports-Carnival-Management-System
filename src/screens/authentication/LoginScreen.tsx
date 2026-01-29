import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  Image,
} from 'react-native';
import Colors from '../../constants/colors';
import CustomButton from '../../components/customButton';
import { validationStrings } from '../../constants/validationStrings';
import styles from './LoginScreenStyle';
import { useAuthViewModel } from '../../viewmodels/authViewModel';
import { UserRole } from '../../models/user';

const LoginScreen = ({ navigation }: any) => {
  const { login, loading, error, user } = useAuthViewModel();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isFormFilled = email.trim() !== '' && password.trim() !== '';

  const handleLogin = async () => {
  if (!isFormFilled) {
    return;
  }

  await login(email, password);
};

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

  if (user || loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <Image
        source={{
          uri: 'https://img.pikbest.com/png-images/20241031/minimalist-sports-logo-vector-illustration-on-transparent-background_11037606.png!sw800',
        }}
        style={styles.logo}
        resizeMode="contain"
      />

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
        onChangeText={setPassword}
        secureTextEntry
      />
      {error && <Text style={styles.error}>{error}</Text>}

      <CustomButton
        title="Login"
        onPress={handleLogin}
        disabled={!isFormFilled}
      />

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
