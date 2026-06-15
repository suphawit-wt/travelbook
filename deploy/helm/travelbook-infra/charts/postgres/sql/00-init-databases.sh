#!/usr/bin/env bash
set -e

function create_user_and_database() {
	local database=$1
	echo "Creating database '$database'"
	psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
	    CREATE DATABASE $database;
EOSQL
}

create_user_and_database "tb_user_db"
create_user_and_database "tb_partner_db"
create_user_and_database "tb_property_db"
create_user_and_database "tb_booking_db"
create_user_and_database "tb_payment_db"
create_user_and_database "tb_review_db"