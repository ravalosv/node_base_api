## Versions

This app runs under Node 18.19.0

`nvm use 18.19.0`

## Initial setup

1. Modify the `.env` file to point to the database location.
2. set ENABLE_DB_SYNC=true
3. Run the app. This will create the database structure.
4. Stop the app.
5. Run `npm run seed` to seed the initial database data.
6. set ENABLE_DB_SYNC=false and save the changes.
7. Finish.
