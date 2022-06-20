# check and prepare db if needed
echo "[Entrypoint]: API entrypoint script!"
echo "[Entrypoint]: Wait for database ${MYSQL_DATABASE}..."
while ! mysql --silent --host=$MYSQL_HOST --user=$MYSQL_USER --password=$MYSQL_PASSWORD --execute=";" $MYSQL_DATABASE ; do
       sleep 5
done
echo "[Entrypoint]: API entrypoint script Finished!!"

# execute docker CMD
echo $@
exec "$@"