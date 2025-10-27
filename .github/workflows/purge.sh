#!/usr/bin/env bash
set -e

# ==============================
# Cloudflare Pages Deployment Cleanup
# ==============================

# --- Install prerequisites ---
sudo apt-get update -qq && sudo apt-get install -y jq curl -qq

# --- Provide secrets ---
ACCOUNT_ID="$CLOUDFLARE_ACCOUNT_ID"
PROJECT_NAME="8sched"
API_TOKEN="$CLOUDFLARE_API_TOKEN"
API_URL="https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/pages/projects/$PROJECT_NAME/deployments"

# --- Cutoff: 30 days ago ---
cutoff=$(date -u -d '30 days ago' +"%Y-%m-%dT%H:%M:%SZ")

echo "🔍 Fetching deployments for project '$PROJECT_NAME'..."

# --- Fetch all deployments (no pagination) ---
response=$(curl -s -H "Authorization: Bearer $API_TOKEN" "$API_URL")

# --- Check API success ---
success=$(echo "$response" | jq -r '.success')
if [[ "$success" != "true" ]]; then
  echo "❌ API call failed:"
  echo "$response" | jq '.errors'
  exit 1
fi

count=$(echo "$response" | jq '.result | length')
echo "✅ Found $count deployments"

# --- Loop through deployments ---
echo "$response" | jq -c '.result[] | {id: .id, created_on: .created_on}' | while read -r dep; do
  dep_id=$(echo "$dep" | jq -r '.id')
  dep_date=$(echo "$dep" | jq -r '.created_on')

  if [[ "$dep_date" < "$cutoff" ]]; then
    echo "🗑️ Deleting deployment $dep_id from $dep_date"
    curl -s -X DELETE -H "Authorization: Bearer $API_TOKEN" "$API_URL/$dep_id" >/dev/null
  fi
done

echo "✨ Cleanup complete."
