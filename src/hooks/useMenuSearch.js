import { useCallback, useEffect, useRef, useState } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";
import { RESTAURANT_ID } from "../utils/constants";

const DEBOUNCE_MS = 300;

function normalizeItem(i) {
  return {
    id: String(i.id ?? ""),
    name: String(i.name ?? ""),
    price: Number(i.price ?? 0),
    description: String(i.description ?? ""),
    isVeg: Boolean(i.is_veg ?? false),
    isAvailable: Boolean(i.is_available ?? true),
    categoryId: String(i.category_id ?? ""),
    imageUrl: String(i.image_url ?? i.imageUrl ?? ""),
  };
}

export function useMenuSearch(searchQuery) {
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const timerRef = useRef(null);
  const abortRef = useRef(null);

  const fetchResults = useCallback(async (q) => {
    abortRef.current = false;
    setSearching(true);

    try {
      if (!isSupabaseConfigured || !supabase) {
        setResults([]);
        setSearching(false);
        return;
      }

      let itemsQuery = supabase
        .from("menu_items")
        .select("id, name, price, description, is_veg, is_available, category_id, image_url")
        .eq("restaurant_id", RESTAURANT_ID)
        .eq("is_available", true)
        .order("name");

      if (q && q.trim() !== "") {
        itemsQuery = itemsQuery.ilike("name", `%${q.trim()}%`);
      }

      const { data, error } = await itemsQuery;

      if (error) {
        console.error("[useMenuSearch] error:", error);
        setResults([]);
      } else {
        // Normalize so isAvailable matches what MenuItemCard expects
        setResults((data ?? []).map(normalizeItem));
      }
    } catch (e) {
      console.error("[useMenuSearch] unexpected:", e);
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => { fetchResults(searchQuery); }, DEBOUNCE_MS);
    return () => {
      clearTimeout(timerRef.current);
      abortRef.current = true;
    };
  }, [searchQuery, fetchResults]);

  return { results, searching };
}
