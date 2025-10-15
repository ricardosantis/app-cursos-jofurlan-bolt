import postgres from 'postgres';

const connectionString = "postgresql://neondb_owner:npg_u5rz4StpiKTj@ep-sparkling-credit-afry152u-pooler.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require";

const sql = postgres(connectionString);

export default sql;
