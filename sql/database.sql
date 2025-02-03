CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firstName VARCHAR(200) NOT NULL,
    lastName VARCHAR(200) NOT NULL,
    email VARCHAR(200) UNIQUE NOT NULL,
    username VARCHAR(200) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    transactions INTEGER[],
    balance JSONB,
    private_key TEXT,
    address TEXT,
    phrase TEXT,
    wallet_transactions INTEGER[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    type VARCHAR(10) NOT NULL CHECK (type IN ('withdrawal', 'deposit')),
    sender_id INT,
    receiver_id INT,
    user_id INT NOT NULL,
    amount INT NOT NULL,
    fee INT DEFAULT 0,
    balance_before INT,
    balance_after INT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
    reference_code VARCHAR(50) UNIQUE NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
);


CREATE TABLE orders (
    id SERIAL PRIMARY KEY, 
    type VARCHAR(10) NOT NULL CHECK (type IN ('buy', 'sell')), -- Order type (buy or sell)
    user_id INT NOT NULL, -- User who created the order
    counterparty_id INT, -- The other party involved in the trade
    amount INT NOT NULL, -- Amount of currency being traded
    price_per_unit DECIMAL(10, 2) NOT NULL, -- Price per unit of the currency
    total_price DECIMAL(15, 2) GENERATED ALWAYS AS (amount * price_per_unit) STORED, -- Total price (calculated)
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')), -- Order status
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('bank_transfer', 'wallet')), -- Payment method
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Order creation time
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Last update time
    expiration_time TIMESTAMP, -- Time when the order expires
    escrow_amount INT, -- Amount held in escrow
    escrow_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (escrow_status IN ('pending', 'funded', 'released', 'cancelled')), -- Escrow status
    escrow_wallet_id INT, -- Reference to the escrow wallet
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, -- User who created the order
    FOREIGN KEY (counterparty_id) REFERENCES users(id) ON DELETE SET NULL, -- The other party involved in the trade (can be null if not filled)
    FOREIGN KEY (escrow_wallet_id) REFERENCES escrow_transactions(id) ON DELETE SET NULL -- Reference to the escrow wallet
);



CREATE TABLE transactions (
    user_id INIT,
    type VARCHAR(10) NOT NULL CHECK (type IN ('withdrawal', 'deposit')),
    reference_code VARCHAR(50) UNIQUE NOT NULL,
    receipt JSONB,
    amount BIGINT,
    currency VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
    balance_before INT,
    balance_after INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)

