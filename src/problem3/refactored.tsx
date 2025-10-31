import React, { useMemo } from 'react';

// Assume BoxProps and WalletRow are imported from a library
// e.g., import { BoxProps } from '..';
// e.g., import { WalletRow } from '..';
interface BoxProps {
    [key: string]: any; // placeholder for actual BoxProps
}
declare const WalletRow: React.FC<any>; // placeholder
declare const classes: { row: string }; // placeholder
declare const useWalletBalances: () => WalletBalance[]; // placeholder
declare const usePrices: () => { [currency: string]: number }; // placeholder

// Define a specific type for blockchain identifiers for better type safety
type Blockchain = 'Osmosis' | 'Ethereum' | 'Arbitrum' | 'Zilliqa' | 'Neo' | string;

interface WalletBalance {
    currency: string;
    amount: number;
    blockchain: Blockchain; // Added missing property
    priority: number;
}

// Using a const object for priorities is cleaner and often more performant
const BLOCKCHAIN_PRIORITIES: Record<string, number> = {
    'Osmosis': 100,
    'Ethereum': 50,
    'Arbitrum': 30,
    'Zilliqa': 20,
    'Neo': 20,
};

const DEFAULT_PRIORITY = -99;

const getPriority = (blockchain: Blockchain): number => {
    return BLOCKCHAIN_PRIORITIES[blockchain] ?? DEFAULT_PRIORITY;
};

interface Props extends BoxProps { }

const WalletPage: React.FC<Props> = (props: Props) => {
    // Destructure only what's needed. children was unused.
    const { ...rest } = props;

    const balances = useWalletBalances();
    const prices = usePrices();

    // Consolidate all processing into a single useMemo
    // This avoids re-calculating on every render and combines multiple loops
    const rows = useMemo(() => {
        // Map balances to include priority, filter invalid balances
        const sortedBalances = balances
            .map((balance: WalletBalance): WalletBalance => ({
                ...balance,
                priority: getPriority(balance.blockchain),
            }))
            // Filter out balances with low priority or non-positive amounts
            .filter((balance: WalletBalance): boolean => balance.priority > DEFAULT_PRIORITY && balance.amount > 0)
            // Sort by the pre-calculated priority
            .sort((a: WalletBalance, b: WalletBalance): number => b.priority - a.priority);

        // Map the final sorted array directly to JSX elements
        return sortedBalances.map((balance: WalletBalance) => {
            const usdValue = prices[balance.currency] * balance.amount;
            const formattedAmount = balance.amount.toFixed();

            return (
                <WalletRow
                    className={classes.row}
                    // Use a stable, unique key instead of index
                    key={balance.currency}
                    amount={balance.amount}
                    usdValue={usdValue}
                    formattedAmount={formattedAmount}
                />
            );
        });
    }, [balances, prices]);

    return (
        <div {...rest}>
            {rows}
        </div>
    );
};