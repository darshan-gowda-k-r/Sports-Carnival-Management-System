import React from 'react';
import {
  View, Text, TextInput, ActivityIndicator, TouchableOpacity, Image, ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../constants/colors';
import CustomButton from '../../components/customButton';
import styles from './RegisterScreenStyle';
import { validationStrings } from '../../constants/validationStrings';
import { useAuth } from '../../context/authContext';
import { UserRole, Gender } from '../../models/user';
import { useRegisterViewModel } from '../../viewmodels/registerViewModel';

const RegisterScreen = ({ navigation }: any) => {
  const { register, loading, error } = useAuth();
  const {
    name,
    email,
    password,
    showPassword,
    role,
    gender,
    nameError,
    emailError,
    passwordError,
    handleNameChange,
    handleEmailChange,
    handlePasswordChange,
    togglePasswordVisibility,
    setRole,
    setGender,
    validateForm,
    isFormValid,
  } = useRegisterViewModel();

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await register(name, email, password, role, gender);
      alert(validationStrings.REGISTRATION_SUCCESS);
      navigation.navigate('Login');
    } catch (err) {
      console.error(validationStrings.REG_ERROR, err);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
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
          placeholder="Name"
          placeholderTextColor={Colors.gray}
          style={styles.input}
          value={name}
          onChangeText={handleNameChange}
        />
        {nameError && <Text style={styles.fieldError}>{nameError}</Text>}

        <TextInput
          placeholder="Email"
          placeholderTextColor={Colors.gray}
          style={styles.input}
          value={email}
          onChangeText={handleEmailChange}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {emailError && <Text style={styles.fieldError}>{emailError}</Text>}

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Password"
            placeholderTextColor={Colors.gray}
            style={styles.passwordInput}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={handlePasswordChange}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={togglePasswordVisibility}
            activeOpacity={0.7}
          >
            <Icon
              name={showPassword ? 'visibility' : 'visibility-off'}
              size={24}
              color={Colors.gray}
            />
          </TouchableOpacity>
        </View>
        {passwordError && <Text style={styles.fieldError}>{passwordError}</Text>}

        <Text style={styles.sectionLabel}>{validationStrings.GENDER}</Text>
        <View style={styles.roleContainer}>
          {[Gender.MALE, Gender.FEMALE].map(g => (
            <TouchableOpacity
              key={g}
              style={[styles.roleButton, gender === g && styles.roleSelected]}
              onPress={() => setGender(g)}
            >
              <Text style={[styles.roleText, gender === g && styles.roleTextSelected]}>
                {g}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>{validationStrings.ROLE}</Text>
        <View style={styles.roleContainer}>
          {[UserRole.ORGANIZER, UserRole.PARTICIPANT].map(r => (
            <TouchableOpacity
              key={r}
              style={[styles.roleButton, role === r && styles.roleSelected]}
              onPress={() => setRole(r)}
            >
              <Text style={[styles.roleText, role === r && styles.roleTextSelected]}>
                {r}
              </Text>
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
          {validationStrings.ALREADY_HAVE_ACCOUNT}{' '}
          <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
            {validationStrings.LOGIN}
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
};

export default RegisterScreen;