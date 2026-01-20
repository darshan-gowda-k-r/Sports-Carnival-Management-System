import React, { useState } from 'react';
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
import { useAuthViewModel } from '../../viewmodels/AuthViewModel';
import { isEmailValid, isPasswordValid } from '../../utils/validators';
import { UserRole } from '../../models/User';

const RegisterScreen = ({ navigation }: any) => {
  const { register, loading, error } = useAuthViewModel();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.PARTICIPANT);

  const availableRoles = [UserRole.ORGANIZER, UserRole.PARTICIPANT];

  const handleRegister = async () => {
    if (!name.trim()) {
      alert('Name is required');
      return;
    }

    if (!isEmailValid(email)) {
      alert('Invalid email address');
      return;
    }

    if (!isPasswordValid(password)) {
      alert('Password must be at least 6 characters');
      return;
    }

    try {
      await register(name, email, password, role);
      alert('Registration successful. Please login.');
      navigation.replace('Login');
    } catch {
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        placeholder="Name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

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
        onChangeText={setPassword}
      />

      <View style={styles.roleContainer}>
        {availableRoles.map(r => (
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
        <CustomButton title="Register" onPress={handleRegister} />
      )}

      <TouchableOpacity onPress={() => navigation.replace('Login')}>
        <Text style={styles.loginText}>
          Already have an account? <Text style={styles.link}>Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;

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
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray,
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
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
  loginText: {
    marginTop: 16,
    textAlign: 'center',
    color: Colors.gray,
  },
  link: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
});

