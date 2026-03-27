-- ============================================================
-- FIX: menu_items category_id mapping corrections
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- Category ID references (for readability):
-- Starters:       64050d1a-0864-4282-99a0-bd73da7de9f6
-- Drinks:         40aa6e91-ee7c-4f09-bd7c-70c819c9786a
-- Tandoor:       d8e013c7-2fd8-45dd-9ec0-5f6ad61331e6
-- Momos:         c2e533a1-63d0-4855-bfb0-6eb8697293a5
-- Noodles:       b58fdec4-c237-4192-a46d-775510a8fb03
-- Biryani:       b7156881-efa2-42f7-94b2-a2ad7c9f1518
-- Rice:           87be2237-2ab0-4f78-a253-c7c2fcd1f422
-- Breads:         672216ed-94cd-4721-b994-fb1e7d7f97cd
-- Non-Veg Curries: a609fafe-3007-4d61-8b21-1e23137a761d
-- Veg Curries:    c6677ef6-c8c4-4178-8ae6-10de691b488f
-- Salads:         276c1064-78a1-4dc5-a059-e9f1556f5f96
-- Sweets:         cc437e75-5ffd-41dc-aba5-fde311dfcef4

-- ── 1. Starters: Remove non-starter items ──
-- "Chicken 65" and "Chilli Chicken" are NOT starters → move to Non-Veg Curries
UPDATE menu_items SET category_id = 'a609fafe-3007-4d61-8b21-1e23137a761d'
WHERE name IN ('Chicken 65', 'Chilli Chicken');

-- ── 2. Tandoor: Remove non-tandoor items ──
-- "Paneer Tikka" is a curry, not tandoor → move to Veg Curries
UPDATE menu_items SET category_id = 'c6677ef6-c8c4-4178-8ae6-10de691b488f'
WHERE name = 'Paneer Tikka';

-- ── 3. Noodles: Fix non-noodle items ──
-- "Schezwan Fried Rice", "Chicken Fried Rice", "Jeera Rice" are RICE dishes → move to Rice
UPDATE menu_items SET category_id = '87be2237-2ab0-4f78-a253-c7c2fcd1f422'
WHERE name IN ('Schezwan Fried Rice', 'Chicken Fried Rice', 'Jeera Rice');

-- ── 4. Salads: Fix misnamed items ──
-- "Kachumber Salad" is the same as "Onion Salad" (both are kachumber/onion salads)
-- Keep under Salads (already correct)
-- Note: No changes needed for Salad category items

-- ── 5. Momos: Verify all are momos (all correct) ──
-- Veg Momos, Chicken Momos, Cheese Momos, Paneer Momos, Tandoori Momos, Schezwan Momos
-- All correctly under Momos category

-- ── 6. Biryani: Already correct ──
-- Chicken Biryani, Veg Biryani → correct

-- ── 7. Breads: Already correct ──
-- Butter Naan, Garlic Naan → correct

-- ── 8. Rice: Already correct after step 3 ──
-- Schezwan Fried Rice, Chicken Fried Rice, Jeera Rice now under Rice

-- ── 9. Noodles: Already correct ──
-- Hakka Noodles, Chicken Noodles, Schezwan Noodles, Egg Noodles,
-- Veg Singapore Noodles, Chowmein → all correctly under Noodles

-- ── 10. Verify changes ──
SELECT
  c.name AS category,
  COUNT(m.id) AS item_count
FROM categories c
LEFT JOIN menu_items m ON m.category_id = c.id AND m.restaurant_id = 'f9324acc-ea1e-47ae-9ebc-9a66c61cd53b'
WHERE c.restaurant_id = 'f9324acc-ea1e-47ae-9ebc-9a66c61cd53b'
GROUP BY c.name, c.sort_order
ORDER BY c.sort_order;
