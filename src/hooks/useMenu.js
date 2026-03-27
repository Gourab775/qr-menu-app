import { useMenuStore } from "../store/menuStore";

export function useMenu() {
  const { categories, menuItems, featuredItems, restaurant, restaurantLoading, restaurantError, loading, error, refetch, justUpdated } =
    useMenuStore();

  return { categories, menuItems, featuredItems, restaurant, slug: restaurant.slug, restaurantLoading, restaurantError, loading, error, refetch, justUpdated };
}