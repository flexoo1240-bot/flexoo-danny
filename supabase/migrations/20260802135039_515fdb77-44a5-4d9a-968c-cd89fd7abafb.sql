CREATE POLICY "Authenticated can view payment QR codes"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'receipts' AND (storage.foldername(name))[1] = 'qr-codes');

CREATE POLICY "Admins can upload payment QR codes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'receipts'
  AND (storage.foldername(name))[1] = 'qr-codes'
  AND public.is_current_user_super_admin()
);