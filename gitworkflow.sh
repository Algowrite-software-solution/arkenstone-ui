#!/bin/bash

# --- Configuration ---
COMMIT_MESSAGE="Automated commit" # Default commit message, you can change this or pass it as an argument
DEV_BRANCH="development"                  # Your development branch name
MAIN_BRANCH="main"                # Your main/production branch name

# --- Functions ---
function run_command {
    echo "Executing: $1"
    if ! eval "$1"; then
        echo "Error: Command '$1' failed. Aborting."
        exit 1
    fi
}

# --- Main Workflow ---

echo "Starting automated Git workflow..."

# 1. Add all changes
run_command "git add ."

# 2. Commit changes
# You can also pass a custom commit message:
# if [ -n "$1" ]; then
#     COMMIT_MESSAGE="$1"
# fi
run_command "git commit -m \"$COMMIT_MESSAGE\""

# 3. Push current branch changes to remote (assuming origin as remote)
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "Current branch is: $CURRENT_BRANCH"
run_command "git push origin $CURRENT_BRANCH"

# 4. Push current branch changes to the development branch
echo "Pushing changes from $CURRENT_BRANCH to $DEV_BRANCH..."
run_command "git push origin $CURRENT_BRANCH:$DEV_BRANCH"

# 5. Switch to the development branch
echo "Switching to branch: $DEV_BRANCH"
run_command "git checkout $DEV_BRANCH"

# 6. Pull the latest changes from the remote development branch
echo "Pulling latest changes on $DEV_BRANCH..."
run_command "git pull origin $DEV_BRANCH"

# 7. Switch to the main branch
echo "Switching to branch: $MAIN_BRANCH"
run_command "git checkout $MAIN_BRANCH"

# 8. Pull the latest changes on the main branch
echo "Pulling latest changes on $MAIN_BRANCH..."
run_command "git pull origin $MAIN_BRANCH"

# 9. Merge development branch into main
echo "Merging $DEV_BRANCH into $MAIN_BRANCH..."
run_command "git merge $DEV_BRANCH --no-ff -m \"Merge $DEV_BRANCH into $MAIN_BRANCH\""

# 11. Push the updated main branch (optional, but good practice after merge and build)
echo "Pushing updated $MAIN_BRANCH to remote..."
run_command "git push origin $MAIN_BRANCH"

echo "Workflow completed successfully!"