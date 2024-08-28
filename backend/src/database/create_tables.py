from .connection import db
import logging


async def create_tables():
    pool = await db.get_connetion()
    async with pool.acquire() as connection:
        async with connection.transaction():
            await connection.execute(
                """
                CREATE TABLE IF NOT EXISTS "user" (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                hashed_password TEXT NOT NULL,
                birthdate DATE NOT NULL,
                updated_at TIMESTAMP DEFAULT NOW(),
                created_at TIMESTAMP DEFAULT NOW()
                );

                CREATE TABLE IF NOT EXISTS account (
                id SERIAL PRIMARY KEY,
                user_id INT NOT NULL REFERENCES "user"(id),
                name TEXT NOT NULL,
                description TEXT,
                opening_balance DECIMAL,
                balance DECIMAL,
                updated_at TIMESTAMP DEFAULT NOW(),
                created_at TIMESTAMP DEFAULT NOW()
                );

                CREATE TABLE IF NOT EXISTS transaction_category (
                id SERIAL PRIMARY KEY,
                user_id INT NOT NULL REFERENCES "user"(id),
                name TEXT NOT NULL,
                description TEXT,
                color TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
                );

                CREATE TABLE IF NOT EXISTS transaction (
                id BIGSERIAL PRIMARY KEY,
                description TEXT NOT NULL,
                value INT NOT NULL,
                user_id INT NOT NULL REFERENCES "user"(id),
                account_id INT NOT NULL REFERENCES "account"(id),
                transaction_category_id INT NOT NULL REFERENCES "transaction_category"(id),
                deleted_at TIMESTAMP DEFAULT NULL,
                created_at TIMESTAMP DEFAULT NOW()
                );

                CREATE TABLE IF NOT EXISTS budget (
                id SERIAL PRIMARY KEY,
                user_id INT NOT NULL REFERENCES "user"(id),
                transaction_category_id INT NOT NULL REFERENCES "transaction_category"(id),
                value INT NOT NULL,
                amount_spent INT DEFAULT 0,
                start_at DATE NOT NULL,
                duration INTERVAL NOT NULL,
                finish_at DATE GENERATED ALWAYS AS (start_at + duration) STORED,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
                );

                CREATE TABLE IF NOT EXISTS fixed_income (
                    id SERIAL PRIMARY KEY,
                    user_id INT NOT NULL REFERENCES "user"(id),
                    account_id INT NOT NULL REFERENCES "account"(id),
                    type VARCHAR(10) CHECK (type IN ('Pre', 'Pos', 'IPCA')),
                    rate_per_year NUMERIC,
                    application_date DATE NOT NULL,
                    liquidity_in DATE DEFAULT NULL,
                    expiration_date DATE NOT NULL,
                    value_invested INT
                );
            """
            )


async def create_trigger(conn, trigger_name, table_name, function_sql, trigger_sql):
    trigger_exists_query = """
        SELECT EXISTS (
            SELECT 1 
            FROM pg_trigger 
            WHERE tgname = $1
        )
    """

    trigger_exists = await conn.fetchval(trigger_exists_query, trigger_name)

    if not trigger_exists:
        await conn.execute(function_sql)

        await conn.execute(trigger_sql)
        logging.info(f"Trigger '{trigger_name}' created successfully.")
    else:
        logging.info(f"Trigger '{trigger_name}' already exists.")


async def create_trigger_sql():
    pool = await db.get_connetion()
    async with pool.acquire() as conn:
        async with conn.transaction():

            await create_trigger(
                conn,
                "before_insert_check_account_belongs_to_user",
                "transaction",
                """
                CREATE OR REPLACE FUNCTION check_account_belongs_to_user()
                RETURNS TRIGGER AS $$
                BEGIN
                    IF NOT EXISTS (
                        SELECT 1 FROM "account" WHERE id = NEW.account_id AND user_id = NEW.user_id
                    ) THEN
                        RAISE EXCEPTION 'Account does not belong to the user';
                    END IF;
                    RETURN NEW;
                END;
                $$ LANGUAGE plpgsql;
                """,
                """
                CREATE TRIGGER before_insert_check_account_belongs_to_user
                BEFORE INSERT ON "transaction"
                FOR EACH ROW
                EXECUTE FUNCTION check_account_belongs_to_user();
                """,
            )

            await create_trigger(
                conn,
                "before_update_check_account_belongs_to_user",
                "transaction",
                """
                CREATE OR REPLACE FUNCTION check_account_belongs_to_user()
                RETURNS TRIGGER AS $$
                BEGIN
                    IF NOT EXISTS (
                        SELECT 1 FROM "account" WHERE id = NEW.account_id AND user_id = NEW.user_id
                    ) THEN
                        RAISE EXCEPTION 'Account does not belong to the user';
                    END IF;
                    RETURN NEW;
                END;
                $$ LANGUAGE plpgsql;
                """,
                """
                CREATE TRIGGER before_update_check_account_belongs_to_user
                BEFORE UPDATE ON "transaction"
                FOR EACH ROW
                EXECUTE FUNCTION check_account_belongs_to_user();
                """,
            )

            await create_trigger(
                conn,
                "before_insert_check_transaction_category_belongs_to_user",
                "transaction",
                """
                CREATE OR REPLACE FUNCTION check_transaction_category_belongs_to_user()
                RETURNS TRIGGER AS $$
                BEGIN
                    IF NOT EXISTS (
                        SELECT 1 FROM "transaction_category" WHERE id = NEW.transaction_category_id AND user_id = NEW.user_id
                    ) THEN
                        RAISE EXCEPTION 'Transaction category does not belong to the user';
                    END IF;
                    RETURN NEW;
                END;
                $$ LANGUAGE plpgsql;
                """,
                """
                CREATE TRIGGER before_insert_check_transaction_category_belongs_to_user
                BEFORE INSERT ON "transaction"
                FOR EACH ROW
                EXECUTE FUNCTION check_transaction_category_belongs_to_user();
                """,
            )

            await create_trigger(
                conn,
                "before_update_check_transaction_category_belongs_to_user",
                "transaction",
                """
                CREATE OR REPLACE FUNCTION check_transaction_category_belongs_to_user()
                RETURNS TRIGGER AS $$
                BEGIN
                    IF NOT EXISTS (
                        SELECT 1 FROM "transaction_category" WHERE id = NEW.transaction_category_id AND user_id = NEW.user_id
                    ) THEN
                        RAISE EXCEPTION 'Transaction category does not belong to the user';
                    END IF;
                    RETURN NEW;
                END;
                $$ LANGUAGE plpgsql;
                """,
                """
                CREATE TRIGGER before_update_check_transaction_category_belongs_to_user
                BEFORE UPDATE ON "transaction"
                FOR EACH ROW
                EXECUTE FUNCTION check_transaction_category_belongs_to_user();
                """,
            )

            await create_trigger(
                conn,
                "after_insert_add_account_balance",
                "transaction",
                """
                CREATE OR REPLACE FUNCTION add_account_balance()
                RETURNS TRIGGER AS $$
                BEGIN
                    UPDATE "account"
                    SET balance = balance + NEW.value
                    WHERE id = NEW.account_id AND user_id = NEW.user_id;
                    RETURN NEW;
                END;
                $$ LANGUAGE plpgsql;
                """,
                """
                CREATE TRIGGER after_insert_add_account_balance
                AFTER INSERT ON "transaction"
                FOR EACH ROW
                EXECUTE FUNCTION add_account_balance();
                """,
            )

            await create_trigger(
                conn,
                "after_delete_add_account_balance",
                "transaction",
                """
                CREATE OR REPLACE FUNCTION update_account_balance()
                RETURNS TRIGGER AS $$
                BEGIN
                    UPDATE "account"
                    SET balance = balance - OLD.value
                    WHERE id = OLD.account_id AND user_id = OLD.user_id;
                    RETURN OLD;
                END;
                $$ LANGUAGE plpgsql;
                """,
                """
                CREATE TRIGGER after_delete_add_account_balance
                AFTER DELETE ON "transaction"
                FOR EACH ROW
                EXECUTE FUNCTION update_account_balance();
                """,
            )

            await create_trigger(
                conn,
                "after_insert_add_budget_balance",
                "transaction",
                """
                CREATE OR REPLACE FUNCTION add_budget_balance()
                RETURNS TRIGGER AS $$
                BEGIN
                    UPDATE "budget"
                    SET amount_spent = amount_spent + NEW.value
                    WHERE NEW.value < 0
                        AND transaction_category_id = NEW.transaction_category_id 
                        AND user_id = NEW.user_id
                        AND start_at <= NEW.created_at
                        AND finish_at > NEW.created_at;
                    RETURN NEW;
                END;
                $$ LANGUAGE plpgsql;
                """,
                """
                CREATE TRIGGER after_insert_add_budget_balance
                AFTER INSERT ON "transaction"
                FOR EACH ROW
                EXECUTE FUNCTION add_budget_balance();
                """,
            )

            await create_trigger(
                conn,
                "after_delete_remove_budget_balance",
                "transaction",
                """
                CREATE OR REPLACE FUNCTION remove_budget_balance()
                RETURNS TRIGGER AS $$
                BEGIN
                    UPDATE "budget"
                    SET amount_spent = amount_spent - OLD.value
                    WHERE OLD.value < 0
                        AND transaction_category_id = OLD.transaction_category_id 
                        AND user_id = OLD.user_id
                        AND start_at <= OLD.created_at
                        AND finish_at > OLD.created_at;
                    RETURN NEW;
                END;
                $$ LANGUAGE plpgsql;
                """,
                """
                CREATE TRIGGER after_delete_remove_budget_balance
                AFTER DELETE ON "transaction"
                FOR EACH ROW
                EXECUTE FUNCTION remove_budget_balance();
                """,
            )

            await create_trigger(
                conn,
                "before_insert_check_budget_per_category",
                "budget",
                """
                CREATE OR REPLACE FUNCTION check_budget_per_category()
                RETURNS TRIGGER AS $$
                BEGIN
                    IF EXISTS (
                        SELECT 1 FROM "budget" WHERE user_id = NEW.user_id
                            AND transaction_category_id = NEW.transaction_category_id 
                            AND ((start_at <= NEW.start_at AND finish_at > NEW.start_at)
                            OR (start_at > NEW.start_at AND start_at < (NEW.start_at + NEW.duration)))
                    ) THEN
                        RAISE EXCEPTION 'Budget already exists';
                    END IF;
                    RETURN NEW;
                END;
                $$ LANGUAGE plpgsql;
                """,
                """
                CREATE TRIGGER before_insert_check_budget_per_category
                BEFORE INSERT ON "budget"
                FOR EACH ROW
                EXECUTE FUNCTION check_budget_per_category();
                """,
            )

            await create_trigger(
                conn,
                "after_update_account_calculate_account_balance",
                "account",
                """
                CREATE OR REPLACE FUNCTION calculate_account_balance()
                RETURNS TRIGGER AS $$
                BEGIN
                    UPDATE account
                    SET balance = balance + NEW.opening_balance - OLD.opening_balance
                    WHERE id = NEW.id AND user_id = NEW.user_id;
                    RETURN NEW;
                END;
                $$ LANGUAGE plpgsql;
                """,
                """
                CREATE TRIGGER after_update_account_calculate_account_balance
                AFTER UPDATE OF opening_balance ON "account"
                FOR EACH ROW
                EXECUTE FUNCTION calculate_account_balance();
                """,
            )

            await create_trigger(
                conn,
                "after_update_calculate_account_balance",
                "transaction",
                """
                CREATE OR REPLACE FUNCTION update_t_calculate_account_balance()
                RETURNS TRIGGER AS $$
                BEGIN
                    IF NEW.account_id != OLD.account_id THEN
                        UPDATE account
                        SET balance = balance - OLD.value
                        WHERE id = OLD.account_id AND user_id = NEW.user_id;

                        UPDATE account
                        SET balance = balance + OLD.value
                        WHERE id = NEW.account_id AND user_id = NEW.user_id;
                    END IF;
                    
                    IF NEW.value != OLD.value THEN 
                        UPDATE account
                        SET balance = balance - OLD.value + NEW.value
                        WHERE id = NEW.account_id AND user_id = NEW.user_id;
                    END IF;
                    
                    RETURN NEW;
                END;
                $$ LANGUAGE plpgsql;
                """,
                """
                CREATE TRIGGER after_update_calculate_account_balance
                AFTER UPDATE OF value, account_id ON "transaction"
                FOR EACH ROW
                EXECUTE FUNCTION update_t_calculate_account_balance();
                """,
            )

            await create_trigger(
                conn,
                "after_update_calculate_budget_amount_spent",
                "transaction",
                """
                CREATE OR REPLACE FUNCTION update_t_calculate_budget_amount_spent()
                RETURNS TRIGGER AS $$
                BEGIN
                    IF OLD.transaction_category_id = NEW.transaction_category_id THEN
                        UPDATE budget
                        SET amount_spent = COALESCE((
                            SELECT SUM(CASE Quando value < 0 THEN value ELSE 0 END)
                            FROM transaction
                            WHERE transaction_category_id = OLD.transaction_category_id 
                                AND user_id = NEW.user_id
                                AND created_at BETWEEN start_at AND finish_at
                        ), 0)
                        WHERE transaction_category_id = OLD.transaction_category_id 
                            AND user_id = NEW.user_id
                            AND start_at <= NEW.created_at
                            AND finish_at > NEW.created_at;
                    END IF;

                    IF OLD.transaction_category_id != NEW.transaction_category_id THEN
                        UPDATE budget
                        SET amount_spent = COALESCE((
                            SELECT SUM(CASE Quando value < 0 THEN value ELSE 0 END)
                            FROM transaction
                            WHERE transaction_category_id = OLD.transaction_category_id 
                                AND user_id = NEW.user_id
                                AND created_at BETWEEN start_at AND finish_at
                        ), 0)
                        WHERE transaction_category_id = OLD.transaction_category_id 
                            AND user_id = NEW.user_id
                            AND start_at <= NEW.created_at
                            AND finish_at > NEW.created_at;

                        UPDATE budget
                        SET amount_spent = COALESCE((
                            SELECT SUM(CASE Quando value < 0 THEN value ELSE 0 END)
                            FROM transaction
                            WHERE transaction_category_id = NEW.transaction_category_id 
                                AND user_id = NEW.user_id
                                AND created_at BETWEEN start_at AND finish_at
                        ), 0)
                        WHERE transaction_category_id = NEW.transaction_category_id 
                            AND user_id = NEW.user_id
                            AND start_at <= NEW.created_at
                            AND finish_at > NEW.created_at;
                    END IF;

                    RETURN NEW;
                END;
                $$ LANGUAGE plpgsql;
                """,
                """
                CREATE TRIGGER after_update_calculate_budget_amount_spent
                AFTER UPDATE ON "transaction"
                FOR EACH ROW
                EXECUTE FUNCTION update_t_calculate_budget_amount_spent();
                """,
            )

            await create_trigger(
                conn,
                "after_insert_calculate_budget_amount_spent",
                "budget",
                """
                CREATE OR REPLACE FUNCTION update_budget_amount_spent()
                RETURNS TRIGGER AS $$
                BEGIN
                    UPDATE budget
                    SET amount_spent = COALESCE((
                        SELECT SUM(CASE Quando value < 0 THEN value ELSE 0 END)
                        FROM transaction
                        WHERE transaction_category_id = NEW.transaction_category_id 
                            AND user_id = NEW.user_id
                            AND created_at BETWEEN start_at AND finish_at
                    ), 0)
                    WHERE transaction_category_id = NEW.transaction_category_id 
                        AND user_id = NEW.user_id
                        AND start_at <= NEW.created_at
                        AND finish_at > NEW.created_at;

                    RETURN NEW;
                END;
                $$ LANGUAGE plpgsql;
                """,
                """
                CREATE TRIGGER after_insert_calculate_budget_amount_spent
                AFTER INSERT ON "budget"
                FOR EACH ROW
                EXECUTE FUNCTION update_budget_amount_spent();
                """,
            )
