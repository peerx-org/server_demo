CREATE TABLE escrow (
    id SERIAL PRIMARY KEY, -- Unique identifier for the escrow wallet
    balance INT DEFAULT 0, -- Available balance in the wallet
    private_key TEXT, -- Private key for the wallet (if applicable)
    phrase TEXT, -- Recovery phrase for the wallet (optional)
    processed_transactions INT[], -- Array of processed transaction IDs
    ongoing_transactions INT[], -- Array of ongoing transaction IDs
    escrow_balance INT DEFAULT 0, -- Amount held in escrow
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the escrow wallet was created
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Timestamp when the escrow wallet was last updated
);



CREATE TABLE escrow_transactions (
    id SERIAL PRIMARY KEY, -- Unique identifier for the escrow transaction
    order_id INT NOT NULL, -- Associated order ID (from the 'orders' table)
    amount INT NOT NULL, -- Amount of money held in escrow for this transaction
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'funded', 'released', 'cancelled')), -- Escrow status
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the transaction was created
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Timestamp when the transaction was last updated
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE -- Reference to the order
);
