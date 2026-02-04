#!/bin/bash

# Phase 1 Setup Helper Script
# This script helps with initial Phase 1 setup

echo "==================================="
echo "MADVERSE Phase 1 Setup Helper"
echo "==================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if all necessary files exist
echo "Checking Phase 1 files..."
files_to_check=(
  "src/lib/phase1Service.ts"
  "src/components/ActivityCard.tsx"
  "src/components/MyActivitiesSection.tsx"
  "src/pages/Profile.tsx"
  "PHASE1_DATABASE.sql"
  "PHASE1_GUIDE.md"
  "PHASE1_QUICK_START.md"
  "src/types/phase1.types.ts"
)

all_files_exist=true
for file in "${files_to_check[@]}"; do
  if [ -f "$file" ]; then
    echo -e "${GREEN}✓${NC} $file exists"
  else
    echo -e "${RED}✗${NC} $file missing"
    all_files_exist=false
  fi
done

echo ""

if [ "$all_files_exist" = true ]; then
  echo -e "${GREEN}All Phase 1 files found!${NC}"
else
  echo -e "${RED}Some files are missing. Please ensure all Phase 1 files are in place.${NC}"
  exit 1
fi

echo ""
echo "==================================="
echo "Setup Checklist:"
echo "==================================="
echo ""
echo "1. DATABASE SETUP:"
echo "   - Open your Supabase project dashboard"
echo "   - Go to SQL Editor"
echo "   - Copy contents of PHASE1_DATABASE.sql"
echo "   - Paste and execute the SQL"
echo "   - Verify 4 tables were created:"
echo "     • user_profiles"
echo "     • activity_favorites"
echo "     • activity_registrations"
echo "     • activity_history"
echo ""

echo "2. VERIFY RLS POLICIES:"
echo "   - Open each table in Supabase dashboard"
echo "   - Ensure RLS is enabled on all tables"
echo "   - Verify policies are in place"
echo ""

echo "3. CREATE STORAGE BUCKET (Optional, for profile images):"
echo "   - Go to Storage in Supabase dashboard"
echo "   - Create new bucket: profile-images"
echo "   - Set to Public"
echo ""

echo "4. IMPORT COMPONENTS IN YOUR APP:"
echo "   - Import ActivityCard component"
echo "   - Import MyActivitiesSection component"
echo "   - Use services from phase1Service.ts"
echo ""

echo "5. TEST THE FEATURES:"
echo "   - Edit your profile"
echo "   - Add an activity to favorites"
echo "   - Register for an activity"
echo "   - Check MyActivities section"
echo ""

echo "==================================="
echo "Quick Commands:"
echo "==================================="
echo ""
echo "View implementation guide:"
echo "  cat PHASE1_GUIDE.md"
echo ""
echo "View quick start checklist:"
echo "  cat PHASE1_QUICK_START.md"
echo ""
echo "View integration examples:"
echo "  cat PHASE1_EXAMPLES.tsx"
echo ""
echo "View database schema:"
echo "  cat PHASE1_DATABASE.sql"
echo ""

echo "==================================="
echo -e "${GREEN}Phase 1 Setup Helper Complete!${NC}"
echo "==================================="
echo ""
echo "Next steps:"
echo "1. Run the SQL schema in Supabase"
echo "2. Verify tables are created"
echo "3. Test the features in your app"
echo "4. Deploy to production"
echo ""
echo "Need help? Check PHASE1_GUIDE.md or PHASE1_QUICK_START.md"
echo ""
