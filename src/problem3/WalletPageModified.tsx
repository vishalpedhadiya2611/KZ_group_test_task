import React, { useMemo, useCallback } from "react";

interface BoxProps {
  className?: string;
  style?: React.CSSProperties;
}

const useWalletBalances = () => {
  return [
    { blockchain: "Ethereum", currency: "ETH", amount: 3 },
    { blockchain: "Osmosis", currency: "ATOM", amount: 10 },
    { blockchain: "Arbitrum", currency: "USDT", amount: 5 },
    { blockchain: "Zilliqa", currency: "ZIL", amount: 0 },
    { blockchain: "Neo", currency: "NEO", amount: 8 },
  ];
};

const usePrices = () => {
  return {
    ETH: 3000,
    ATOM: 20,
    USDT: 1,
    ZIL: 0.1,
    NEO: 50,
  };
};

interface WalletBalance {
  blockchain: string;
  currency: string;
  amount: number;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

interface WalletRowProps {
  amount: number;
  usdValue: number;
  formattedAmount: string;
  className?: string;
}

const WalletRow: React.FC<WalletRowProps> = React.memo(
  ({ amount, usdValue, formattedAmount, className }) => {
    console.log("Rendering WalletRow");
    return (
      <div className={className}>
        <div>Currency: {formattedAmount}</div>
        <div>Amount: {amount}</div>
        <div>USD Value: ${usdValue.toFixed(2)}</div>
      </div>
    );
  }
);

const WalletPage: React.FC<BoxProps> = (props: BoxProps) => {
  const { ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const getPriority = useCallback((blockchain: string): number => {
    const blockchainPriorityMap: { [key: string]: number } = {
      Osmosis: 100,
      Ethereum: 50,
      Arbitrum: 30,
      Zilliqa: 20,
      Neo: 20,
    };
    return blockchainPriorityMap[blockchain] ?? -99;
  }, []);

  const sortedAndFormattedBalances = useMemo(() => {
    return balances
      .map((balance: WalletBalance) => ({
        ...balance,
        priority: getPriority(balance.blockchain),
      }))
      .filter((balance) => balance.priority > -99 && balance.amount > 0)
      .sort((lhs, rhs) => rhs.priority - lhs.priority)
      .map((balance: WalletBalance) => ({
        ...balance,
        formatted: balance.amount.toFixed(2),
      }));
  }, [balances, getPriority]);

  const rows = useMemo(() => {
    return sortedAndFormattedBalances.map(
      (balance: FormattedWalletBalance, index: number) => {
        const usdValue = prices[balance.currency] * balance.amount;
        return (
          <WalletRow
            className="m-20"
            key={index}
            amount={balance.amount}
            usdValue={usdValue}
            formattedAmount={balance.formatted}
          />
        );
      }
    );
  }, [sortedAndFormattedBalances, prices]);

  return <div {...rest}>{rows}</div>;
};

export default WalletPage;
