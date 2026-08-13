import "@/global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { Platform, ActivityIndicator, View } from "react-native";
import "@/lib/_core/nativewind-pressable";
import { ThemeProvider } from "@/lib/theme-provider";
import {
    SafeAreaFrameContext,
    SafeAreaInsetsContext,
    SafeAreaProvider,
    initialWindowMetrics,
} from "react-native-safe-area-context";
import type { EdgeInsets, Metrics, Rect } from "react-native-safe-area-context";

import { trpc, createTRPCClient } from "@/lib/trpc";
import { initManusRuntime, subscribeSafeAreaInsets } from "@/lib/_core/manus-runtime";
import { supabase } from "@/lib/supabase";

const DEFAULT_WEB_INSETS: EdgeInsets = { top: 0, right: 0, bottom: 0, left: 0 };
const DEFAULT_WEB_FRAME: Rect = { x: 0, y: 0, width: 0, height: 0 };

export const unstable_settings = {
    initialRouteName: "(auth)",
};

export default function RootLayout() {
    const router = useRouter();
    const segments = useSegments();

    const [isReady, setIsReady] = useState(false);
    const [session, setSession] = useState<any>(null);

    const initialInsets = initialWindowMetrics?.insets ?? DEFAULT_WEB_INSETS;
    const initialFrame = initialWindowMetrics?.frame ?? DEFAULT_WEB_FRAME;

    const [insets, setInsets] = useState<EdgeInsets>(initialInsets);
    const [frame, setFrame] = useState<Rect>(initialFrame);

    useEffect(() => {
        initManusRuntime();
    }, []);

    const handleSafeAreaUpdate = useCallback((metrics: Metrics) => {
        setInsets(metrics.insets);
        setFrame(metrics.frame);
    }, []);

    useEffect(() => {
        if (Platform.OS !== "web") return;
        const unsubscribe = subscribeSafeAreaInsets(handleSafeAreaUpdate);
        return () => unsubscribe();
    }, [handleSafeAreaUpdate]);

    // 1. Проверка на сесијата при старт + Auth Listener
    useEffect(() => {
        // Прво земете ја тековната сесија од Supabase
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setIsReady(true);
        });

        // Слушајте промени (логирање / одлогирање)
        const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
            console.log(`[Auth Event] ${event}`, newSession?.user?.email ?? "Нема сесија");
            setSession(newSession);
            setIsReady(true);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    // 2. Автоматско пренасочување според сесијата
    useEffect(() => {
        if (!isReady) return;

        const inAuthGroup = segments[0] === "(auth)";

        if (!session && !inAuthGroup) {
            // Ако корисникот НЕ е најавен, а се обидува да отвори друго освен Auth
            router.replace("/(auth)/login");
        } else if (session && inAuthGroup) {
            // Ако корисникот Е најавен, а се наоѓа на Login/Register
            router.replace("/(tabs)");
        }
    }, [session, isReady, segments]);

    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        refetchOnWindowFocus: false,
                        retry: 1,
                    },
                },
            }),
    );
    const [trpcClient] = useState(() => createTRPCClient());

    const providerInitialMetrics = useMemo(() => {
        const metrics = initialWindowMetrics ?? { insets: initialInsets, frame: initialFrame };
        return {
            ...metrics,
            insets: {
                ...metrics.insets,
                top: Math.max(metrics.insets.top, 16),
                bottom: Math.max(metrics.insets.bottom, 12),
            },
        };
    }, [initialInsets, initialFrame]);

    // Додека се проверува сесијата, покажи Loading спинер за да не трепка екранот
    if (!isReady) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
                <ActivityIndicator size="large" color="#44b273" />
            </View>
        );
    }

    const content = (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <trpc.Provider client={trpcClient} queryClient={queryClient}>
                <QueryClientProvider client={queryClient}>
                    <Stack screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="(auth)" />
                        <Stack.Screen name="(tabs)" />
                        <Stack.Screen name="oauth/callback" />
                    </Stack>
                    <StatusBar style="auto" />
                </QueryClientProvider>
            </trpc.Provider>
        </GestureHandlerRootView>
    );

    const shouldOverrideSafeArea = Platform.OS === "web";

    if (shouldOverrideSafeArea) {
        return (
            <ThemeProvider>
                <SafeAreaProvider initialMetrics={providerInitialMetrics}>
                    <SafeAreaFrameContext.Provider value={frame}>
                        <SafeAreaInsetsContext.Provider value={insets}>
                            {content}
                        </SafeAreaInsetsContext.Provider>
                    </SafeAreaFrameContext.Provider>
                </SafeAreaProvider>
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider>
            <SafeAreaProvider initialMetrics={providerInitialMetrics}>{content}</SafeAreaProvider>
        </ThemeProvider>
    );
}