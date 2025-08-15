#!/bin/bash

# List of files that need to be updated
files=(
  "components/content-detail-sidebar.tsx"
  "app/(container)/profile/page.tsx"
  "components/purchase-confirmation-modal.tsx"
  "components/header.tsx"
  "components/content-data-charts.tsx"
  "app/(container)/publish/page.tsx"
  "components/content-card.tsx"
  "components/search-and-filters.tsx"
  "components/voting-modal.tsx"
  "components/content-detail-main.tsx"
  "components/comments-section.tsx"
  "components/rich-text-editor.tsx"
  "app/(container)/content/[id]/page.tsx"
)

# Update each file
for file in "${files[@]}"; do
  echo "Updating $file..."
  
  # Replace import statement
  sed -i '' 's|import { useColorChange } from "@/hooks/animation/use-color-change"|import { useColorAnimation } from "@/components/color-animation-provider"|g' "$file"
  
  # Replace function call
  sed -i '' 's|useColorChange()|useColorAnimation()|g' "$file"
done

echo "All files updated successfully!"