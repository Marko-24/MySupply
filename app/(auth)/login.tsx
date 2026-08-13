import React, { useState } from 'react';
import { View, TextInput, Alert, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleLogin() {
        if (!email || !password) {
            Alert.alert('Грешка', 'Ве молиме внесете е-пошта и лозинка.');
            return;
        }

        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setLoading(false);

        if (error) {
            Alert.alert('Грешка при најава', error.message);
        } else {
            // Успешна најава - пренасочи кон главниот екран
            router.replace('/(tabs)');
        }
    }

    return (
        <View style={styles.container}>
            <Image
                source={require('@/assets/images/logo.jpg')} // Сменете ја патеката со вашата слика
                style={styles.logo}
                resizeMode="contain"
            />

            <Text style={styles.title}>MySupply</Text>
            <Text style={styles.h5}>Добредојдовте! Највете се за да продолжите.</Text>

            <TextInput
                placeholder="Е-пошта"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
            />

            <TextInput
                placeholder="Лозинка"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />
            <TouchableOpacity
                onPress={handleLogin}
                disabled={loading}
                style={[styles.button, loading && styles.buttonDisabled]}
            >
                {loading ? (
                    <ActivityIndicator color="#44b273" />
                ) : (
                    <Text style={styles.buttonText}>Најави се</Text>
                )}
            </TouchableOpacity>

            {/* Дел за нерегистрирани корисници */}
            <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Немате профил? </Text>
                <TouchableOpacity onPress={() => router.push('/register')}>
                    <Text style={styles.registerLink}>Регистрирајте се</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    logo: {
        width: 150,
        height: 150,
        alignSelf: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#44b273',
        marginBottom: 10,
        textAlign: 'center',
        fontFamily: 'Geist'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        marginBottom: 15,
        borderRadius: 9,
        width: '100%',
    },
    h5: {
        fontSize: 15,
        fontWeight: '200',
        marginBottom: 30,
        color: '#333333',
        textAlign: 'center',
    },
    button: {
        borderWidth: 1.5,
        borderColor: '#44b273',
        borderRadius: 9,
        paddingVertical: 12,
        backgroundColor: 'transparent',
        marginTop: 25,
        width: 180,
        alignSelf: 'center',
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: '#44b273',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30,
    },
    registerText: {
        color: '#666',
        fontSize: 14,
    },
    registerLink: {
        color: '#44b273',
        fontWeight: 'bold',
        fontSize: 14,
    },
});
