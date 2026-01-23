import React, { useState } from 'react';
import {
  View, Text, TextInput, ActivityIndicator, TouchableOpacity, StyleSheet,
  } from 'react-native';
import Colors from '../../constants/colors';
import CustomButton from '../../components/customButton';
import styles from './RegisterScreenStyle';
import { validationStrings } from '../../constants/validationStrings';
import { useAuthViewModel } from '../../viewmodels/authViewModel';
import { isNameValid, isEmailValid, isPasswordValid } from '../../utils/validators';
import { UserRole } from '../../models/user';

const RegisterScreen = ({ navigation }: any) => {
  const { register, loading, error } = useAuthViewModel();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.PARTICIPANT);

  const [nameError, setNameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleNameChange = (text: string) => {
    setName(text);
    setNameError(isNameValid(text));
  };
  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setPasswordError(isPasswordValid(text));
  };

  const handleRegister = async () => {
    const nError = isNameValid(name);
    if (nError) {
        setNameError(nError);
        return;
    }
    const eError = isEmailValid(email);
    if (eError) {
        alert(eError);
        return;
    }
    const pError = isPasswordValid(password);
    if (pError) {
        setPasswordError(pError);
        return;
    }

    await register(name, email, password, role);
    alert(validationStrings.REGISTRATION_SUCCESS);
    navigation.navigate('Login');
  };

  const isFormValid =
    !isNameValid(name) &&
    !isEmailValid(email) &&
    !isPasswordValid(password);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{validationStrings.TITLE}</Text>

      <TextInput
        placeholder="Name"
        style={styles.input}
        value={name}
        onChangeText={handleNameChange}
      />
      {nameError && <Text style={styles.fieldError}>{nameError}</Text>}

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={handlePasswordChange}
      />
      {passwordError && <Text style={styles.fieldError}>{passwordError}</Text>}

      <View style={styles.roleContainer}>
        {[UserRole.ORGANIZER, UserRole.PARTICIPANT].map(r => (
          <TouchableOpacity
            key={r}
            style={[styles.roleButton, role === r && styles.roleSelected]}
            onPress={() => setRole(r)}
          >
            <Text style={[styles.roleText, role === r && styles.roleTextSelected]}>{r.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : (
        <CustomButton
          title="Register"
          onPress={handleRegister}
          disabled={!isFormValid}
        />
      )}

      <Text style={styles.loginText}>
        Already have an account?{' '}
        <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
            Login
        </Text>
      </Text>
    </View>
  );
};

export default RegisterScreen;
