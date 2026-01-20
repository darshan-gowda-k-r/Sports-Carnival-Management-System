import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Colors from '../../constants/Colors';
import CustomButton from '../../components/CustomButton';
import { UserRole } from '../../models/User';
import { useAuthViewModel } from '../../viewmodels/AuthViewModel';
import { isEmailValid, isPasswordValid } from '../../utils/validators';

const LoginScreen = ({ navigation }: any) => {
  const { login, loading, error, user } = useAuthViewModel();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.PARTICIPANT);

  const handleLogin = async () => {
    if (!isEmailValid(email)) {
      alert('Please enter a valid email');
      return;
    }

    if (!isPasswordValid(password)) {
      alert('Password must be at least 6 characters');
      return;
    }

    await login(email, password, role);
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
      default:
        navigation.replace('ParticipantHome');
    }
  }, [user, navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

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

      <View style={styles.roleContainer}>
        {Object.values(UserRole).map(r => (
          <TouchableOpacity
            key={r}
            style={[
              styles.roleButton,
              role === r && styles.roleSelected,
            ]}
            onPress={() => setRole(r)}
          >
            <Text
              style={[
                styles.roleText,
                role === r && styles.roleTextSelected,
              ]}
            >
              {r.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : (
        <CustomButton title="Login" onPress={handleLogin} />
      )}

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerText}>
          Don’t have an account? <Text style={styles.link}>Register</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  roleButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  roleSelected: {
    backgroundColor: Colors.primary,
  },
  roleText: {
    color: Colors.gray,
  },
  roleTextSelected: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  error: {
    color: Colors.error,
    marginBottom: 12,
    textAlign: 'center',
  },
  registerText: {
    marginTop: 16,
    textAlign: 'center',
    color: Colors.gray,
  },
  link: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
});
