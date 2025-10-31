// Missing blockchain property in interface
interface WalletBalance {
    currency: string;
    amount: number;
}

// Better to extend the WalletBalance interface
interface FormattedWalletBalance {
    currency: string;
    amount: number;
    formatted: string;
}

interface Props extends BoxProps {

}

const WalletPage: React.FC<Props> = (props: Props) => {
    // children is unused
    const { children, ...rest } = props;
    const balances = useWalletBalances();
    const prices = usePrices();

    // getPriority function is called repeatedly for the same items. 
    // It's called once for every item during the filter step
    // priority for each balance only needs to be calculated once.
    const getPriority = (blockchain: any): number => {
        switch (blockchain) {
            case 'Osmosis':
                return 100
            case 'Ethereum':
                return 50
            case 'Arbitrum':
                return 30
            case 'Zilliqa':
                return 20
            case 'Neo':
                return 20
            default:
                return -99
        }
    }

    // useMemo hook for sortedBalances incorrectly includes prices in its dependency array
    // should only contain balances
    const sortedBalances = useMemo(() => {
        return balances.filter((balance: WalletBalance) => {
            const balancePriority = getPriority(balance.blockchain);

            // lhsPriority is not defined, seem like a typo
            // This logic keeps balances that have a priority and have a zero or negative amount. 
            // This is non-sense
            if (lhsPriority > -99) {
                if (balance.amount <= 0) {
                    return true;
                }
            }
            return false
        }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
            const leftPriority = getPriority(lhs.blockchain);
            const rightPriority = getPriority(rhs.blockchain);
            if (leftPriority > rightPriority) {
                return -1;
            } else if (rightPriority > leftPriority) {
                return 1;
            }
        });
    }, [balances, prices]);

    // formattedBalances is not used
    const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
        return {
            ...balance,
            formatted: balance.amount.toFixed()
        }
    })

    // Should combine the logic from formattedBalances and rows into a single map. 
    // To make this even more efficient, should also be wrapped in useMemo.
    const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
        const usdValue = prices[balance.currency] * balance.amount;
        return (
            <WalletRow
                className={classes.row}
                key={index}
                amount={balance.amount}
                usdValue={usdValue}
                formattedAmount={balance.formatted}
            />
        )
    })

    return (
        <div {...rest}>
            {rows}
        </div>
    )
}