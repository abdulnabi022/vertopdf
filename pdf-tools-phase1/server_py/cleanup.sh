#!/bin/bash
# Cleanup script - Remove uploaded files older than 1 hour
# Add to crontab: 0 * * * * /var/www/rarepdftool/server_py/cleanup.sh

UPLOAD_DIR="/var/www/rarepdftool/server_py/uploads"

# Delete files older than 60 minutes
find "$UPLOAD_DIR" -type f -mmin +60 -delete

# Log cleanup
echo "$(date): Cleaned up old files from $UPLOAD_DIR" >> /var/log/rarepdftool/cleanup.log
