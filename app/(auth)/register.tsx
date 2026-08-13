import React, { useState } from 'react';
import { View, TextInput, Alert, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleRegister() {
        if (!email || !password || !fullName) {
            Alert.alert('Грешка', 'Пополнете ги сите полиња.');
            return;
        }
        setLoading(true);
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        });

        setLoading(false);

        if (error) {
            Alert.alert('Грешка при регистрација', error.message);
        } else {
            Alert.alert('Успешна регистрација!', 'Проверете ја вашата е-пошта за потврда (доколку е овозможена потврда).');
            router.replace('/(tabs)');
        }
    }

    return (
        <View style={styles.container}>
            <Image
                source={require('@/assets/images/logo.jpg')}
                style={styles.logo}
                resizeMode="contain"
            />
            <Text style={styles.title}>MySupply</Text>
            <Text style={styles.h5}>Добредојдовте! Регистрирајте се за да продолжите.</Text>

            <TextInput
                placeholder="Име и презиме"
                value={fullName}
                onChangeText={setFullName}
                style={styles.input}
            />

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
                onPress={handleRegister}
                disabled={loading}
                style={[styles.button, loading && styles.buttonDisabled]}
            >
                {loading ? (
                    <ActivityIndicator color="#44b273" />
                ) : (
                    <Text style={styles.buttonText}>Регистрирај се</Text>
                )}
            </TouchableOpacity>

            <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Веќе имате сметка? </Text>
                <TouchableOpacity onPress={() => router.push('/')}>
                    <Text style={styles.registerLink}>Најавете се</Text>
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
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#44b273',
        marginBottom: 5,
        textAlign: 'center',
        fontFamily: 'Geist'
    },
    h5: {
        fontSize: 15,
        fontWeight: '200',
        marginBottom: 25,
        color: '#333333',
        textAlign: 'center',
        marginTop: 10
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        marginBottom: 12,
        borderRadius: 9,
        width: '100%',
    },
    button: {
        borderWidth: 1.5,
        borderColor: '#44b273',
        borderRadius: 9,
        paddingVertical: 12,
        backgroundColor: 'transparent',
        marginTop: 15,
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
        marginTop: 25,
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