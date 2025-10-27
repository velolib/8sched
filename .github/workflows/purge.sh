# install prerequisites
sudo apt-get update && sudo apt-get install -y jq curl

# provide secrets, I use Github Actions hence the syntax
ACCOUNT_ID="$CLOUDFLARE_ACCOUNT_ID"
PROJECT_NAME="8sched"
API_TOKEN="$CLOUDFLARE_API_TOKEN"
API_URL="https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/pages/projects/$PROJECT_NAME/deployments"

# for me 30 days is enough
cutoff=$(date -u -d '30 days ago' +"%Y-%m-%dT%H:%M:%SZ")

per_page=25
response=$(curl -s -H "Authorization: Bearer $API_TOKEN" "$API_URL?page=1&per_page=$per_page")
total_pages=$(echo "$response" | jq '.result_info.total_pages')
echo "Total pages: $total_pages"

page=$total_pages
while [ $page -gt 1 ]; do
  echo "Processing page: $page"
  response=$(curl -s -H "Authorization: Bearer $API_TOKEN" "$API_URL?page=$page&per_page=$per_page")
  echo "$response" | jq -c '.result[] | {id: .id, created_on: .created_on}' | while read -r dep; do
    dep_id=$(echo "$dep" | jq -r '.id')
    dep_date=$(echo "$dep" | jq -r '.created_on')
    if [[ "$dep_date" < "$cutoff" ]]; then
      echo "Deleting deployment $dep_id from $dep_date"
      curl -s -X DELETE -H "Authorization: Bearer $API_TOKEN" "$API_URL/$dep_id"
    fi
  done
  page=$((page-1))
done
