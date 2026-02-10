import React, { useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../constants/colors';
import CustomButton from '../../components/customButton';
import ForgotPasswordModal from '../../components/forgotPasswordModal';
import { validationStrings } from '../../constants/validationStrings';
import styles from './LoginScreenStyle';
import { useAuth } from '../../context/authContext';
import { UserRole } from '../../models/user';
import { useLoginViewModel } from '../../viewmodels/loginViewModel';

const LoginScreen = ({ navigation }: any) => {
  const { login, loading, error, user, forgotPassword } = useAuth();

  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    togglePasswordVisibility,
    isFormFilled,
    isNavigating,
    setIsNavigating,
    hasNavigated,
    resetNavigation,
    showForgotPasswordModal,
    openForgotPasswordModal,
    closeForgotPasswordModal,
    handleLogin,
    handleForgotPasswordSubmit,
  } = useLoginViewModel({
    loginService: login,
    forgotPasswordService: forgotPassword,
  });

  const onLoginPress = async () => {
    const result = await handleLogin();

    if (!result.success && result.error) {
      console.log(validationStrings.LOGIN_FAILED, result.error);
    }
  };

  const onForgotPasswordSubmit = async (inputEmail: string) => {
    const result = await handleForgotPasswordSubmit(inputEmail);

    if (result.success && result.tempPassword) {
      Alert.alert(
        validationStrings.PASSWORD_RESET_SUCCESS,
        `Your temporary password is:\n\n${result.tempPassword}\n\nPlease login with this password and change it immediately from your profile settings.`,
        [{ text: 'OK' }]
      );
    } else if (!result.success && result.error) {
      Alert.alert('Error', result.error);
    }
  };

  useEffect(() => {
    if (!user || hasNavigated.current) return;

    hasNavigated.current = true;
    setIsNavigating(true);

    const timer = setTimeout(() => {
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
          resetNavigation();
          break;
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [user, navigation]);

  useEffect(() => {
    return () => {
      resetNavigation();
    };
  }, []);

  if (loading || isNavigating || user) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>{validationStrings.LOADING}</Text>
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

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          placeholderTextColor={Colors.gray}
          style={styles.passwordInput}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
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

      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity
        onPress={openForgotPasswordModal}
        style={styles.forgotPasswordContainer}
      >
        <Text style={styles.forgotPasswordText}>{validationStrings.FORGOT_PASSWORD}</Text>
      </TouchableOpacity>

      <CustomButton
        title="Login"
        onPress={onLoginPress}
        disabled={!isFormFilled || loading}
      />

      <Text style={styles.registerText}>
        {validationStrings.DONT_HAVE_ACCOUNT}{' '}
        <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
          Register
        </Text>
      </Text>

      <ForgotPasswordModal
        visible={showForgotPasswordModal}
        onClose={closeForgotPasswordModal}
        onSubmit={onForgotPasswordSubmit}
      />
    </View>
  );
};

export default LoginScreen;