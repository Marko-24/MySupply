import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export function useFavorites(userId?: string) {
    const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    // Вчитај ги зачуваните омилени за овој user_id
    const fetchFavorites = useCallback(async () => {
        if (!userId) {
            setFavoriteIds([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        const { data, error } = await supabase
            .from("favorites")
            .select("vendor_id")
            .eq("user_id", userId);

        if (error) {
            console.error("Грешка при влечење омилени:", error.message);
        } else if (data) {
            setFavoriteIds(data.map((item) => item.vendor_id));
        }
        setLoading(false);
    }, [userId]);

    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    const isFavorite = (vendorId: string) => favoriteIds.includes(vendorId);

    const toggleFavorite = async (vendorId: string) => {
        // Ако корисникот не е најавен, земи ја сесијата директно за сигурност
        let activeUserId = userId;
        if (!activeUserId) {
            const { data } = await supabase.auth.getSession();
            activeUserId = data.session?.user?.id;
        }

        if (!activeUserId) {
            console.warn("Нема најавен корисник за да зачува во омилени!");
            return;
        }

        const exists = favoriteIds.includes(vendorId);

        // Optimistic UI Update (веднаш смени ја состојбата во мобилната)
        if (exists) {
            setFavoriteIds((prev) => prev.filter((id) => id !== vendorId));
        } else {
            setFavoriteIds((prev) => [...prev, vendorId]);
        }

        if (exists) {
            // Бришење од Supabase
            const { error } = await supabase
                .from("favorites")
                .delete()
                .eq("user_id", activeUserId)
                .eq("vendor_id", vendorId);

            if (error) {
                console.error("Грешка при бришење од favorites:", error.message);
                // Врати ја старата состојба ако има грешка
                setFavoriteIds((prev) => [...prev, vendorId]);
            }
        } else {
            // Додавање во Supabase
            const { error } = await supabase
                .from("favorites")
                .insert([{ user_id: activeUserId, vendor_id: vendorId }]);

            if (error) {
                console.error("Грешка при додавање во favorites:", error.message);
                // Врати ја старата состојба ако има грешка
                setFavoriteIds((prev) => prev.filter((id) => id !== vendorId));
            }
        }
    };

    return {
        favoriteIds,
        isFavorite,
        toggleFavorite,
        loading,
        refreshFavorites: fetchFavorites,
    };
}