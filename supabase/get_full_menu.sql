-- Production-ready RPC for full menu in ONE call
-- Matches schema:
-- categories(id, restaurant_id, name, image, short_order)
-- menu_items(id, restaurant_id, name, price, image_url, description, is_veg, category_id)
--
-- Expected return format:
-- {
--   restaurant: {...},
--   categories: [{ id, name, image, short_order }],
--   menu: [{
--     id, name, price, image_url, description, is_veg, category_id,
--     category_name, category_image
--   }]
-- }

create or replace function public.get_full_menu(r_slug text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  r record;
begin
  -- Assumes a restaurants table with a "slug" column.
  select *
  into r
  from restaurants
  where slug = r_slug
  limit 1;

  if not found then
    raise exception 'Restaurant not found for slug %', r_slug;
  end if;

  return jsonb_build_object(
    'restaurant',
    to_jsonb(r),
    'categories',
    coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'id', c.id,
            'name', c.name,
            'image', c.image,
            'short_order', c.short_order
          )
          order by c.short_order asc
        )
        from categories c
        where c.restaurant_id = (r).id
      ),
      '[]'::jsonb
    ),
    'menu',
    coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'id', mi.id,
            'name', mi.name,
            'price', mi.price,
            'image_url', mi.image_url,
            'description', mi.description,
            'is_veg', mi.is_veg,
            'category_id', mi.category_id,
            'category_name', c.name,
            'category_image', c.image
          )
          order by c.short_order asc, mi.id asc
        )
        from menu_items mi
        join categories c on c.id = mi.category_id
        where mi.restaurant_id = (r).id
      ),
      '[]'::jsonb
    )
  );
end;
$$;

