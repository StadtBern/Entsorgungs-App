#!/bin/sh

# taken from blog post: http://www.mokacoding.com/blog/automatic-xcode-versioning-with-git/
# Automatically sets version of target based on most recent tag in git
# Automatically sets build number to number of commits
#
# Add script to build phase in xcode at the top of the chain named "set build number"
# put this script in the root of the xcode project in a directory called scripts (good idea to version control this too)
# call the script as $SRCROOT/set_version_and_build.sh in xcode

git=$(sh /etc/profile; which git)
number_of_commits=$("$git" rev-list HEAD --count)
git_release_version=$("$git" rev-parse --short HEAD)
version="$MARKETING_VERSION.$number_of_commits"

target_plist="$TARGET_BUILD_DIR/$INFOPLIST_PATH"
dsym_plist="$DWARF_DSYM_FOLDER_PATH/$DWARF_DSYM_FILE_NAME/Contents/Info.plist"

for plist in "$target_plist" "$dsym_plist"; do
  if [ -f "$plist" ]; then
    /usr/libexec/PlistBuddy -c "Set :CFBundleVersion $number_of_commits" "$plist"
    /usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString $version" "$plist"
  fi
done
