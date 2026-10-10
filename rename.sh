#!/usr/bin/env bash
# Rename the template to your app. Run once, from the repo root, before the first commit.
#
#   ./rename.sh <slug> "<Display Name>" <reverse.dns.app.id>
#   ./rename.sh myapp "My App" com.acme.myapp
#
# slug: lowercase letters and digits only (used for the package name, URL scheme and
#       storage keys). It must be a different string from the app id's prefix.
set -euo pipefail

if [ "$#" -ne 3 ]; then
  echo "usage: $0 <slug> \"<Display Name>\" <app.id>" >&2
  exit 1
fi
SLUG="$1"; NAME="$2"; APP_ID="$3"

[[ "$SLUG" =~ ^[a-z][a-z0-9]*$ ]] || { echo "slug must match ^[a-z][a-z0-9]*$" >&2; exit 1; }
[[ "$APP_ID" =~ ^[A-Za-z][A-Za-z0-9_]*(\.[A-Za-z][A-Za-z0-9_]*)+$ ]] || { echo "invalid app id" >&2; exit 1; }
[[ "$NAME" != *'|'* && "$NAME" != *'&'* && "$NAME" != *'\'* ]] || { echo "display name must not contain | & \\" >&2; exit 1; }

# Order matters: the app id contains the slug token, so replace it first.
FILES=$(grep -rlE 'dev\.example\.starterapp|Starter App|starterapp' . \
  --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=dist --exclude-dir=.expo \
  --exclude=package-lock.json --exclude=rename.sh || true)
for f in $FILES; do
  sed -i -e "s|dev\.example\.starterapp|${APP_ID}|g" -e "s|Starter App|${NAME}|g" -e "s|starterapp|${SLUG}|g" "$f"
done
# package-lock.json carries the package name in two places only.
if [ -f package-lock.json ]; then
  sed -i -e "0,/\"name\": \"starterapp\"/s//\"name\": \"${SLUG}\"/" package-lock.json
  sed -i -e "0,/\"name\": \"starterapp\"/s//\"name\": \"${SLUG}\"/" package-lock.json
fi
echo "Renamed to ${NAME} (${SLUG}, ${APP_ID}). Review with: git diff"
echo "Update the copyright line in LICENSE for your project and delete this script when done."
