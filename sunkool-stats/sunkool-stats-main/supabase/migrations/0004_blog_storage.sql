-- Public bucket for cover images and in-article images uploaded from the
-- Tiptap editor. Reads are public (images are embedded in public post HTML);
-- writes are restricted to admins.
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

create policy blog_images_public_select on storage.objects for select
  using (bucket_id = 'blog-images');

create policy blog_images_admin_insert on storage.objects for insert
  with check (bucket_id = 'blog-images' and is_admin());

create policy blog_images_admin_update on storage.objects for update
  using (bucket_id = 'blog-images' and is_admin())
  with check (bucket_id = 'blog-images' and is_admin());

create policy blog_images_admin_delete on storage.objects for delete
  using (bucket_id = 'blog-images' and is_admin());
