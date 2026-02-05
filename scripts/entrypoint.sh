#!/bin/sh

# Ensure the storage directory and its subdirectories have the correct permissions
# for the nextjs user (UID 1001)
echo "Setting permissions for /app/public/assets/storage..."
mkdir -p /app/public/assets/storage/blog \
         /app/public/assets/storage/users/avatars \
         /app/public/assets/storage/payments/receipts \
         /app/public/assets/storage/documents

chown -R nextjs:nodejs /app/public/assets/storage
chmod -R 755 /app/public/assets/storage

# Execute the main command
exec "$@"
