import React, { useState, useEffect } from "react";
import DropdownWithSearch from "./DropdownWithSearch";

interface TokenData {
  currency: string;
  date: string;
  price: number;
  src: string;
}

interface TokenDataFromApi {
  currency: string;
  date: string;
  price: number;
}

const CurrencyConverter = () => {
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("ETH");
  const [amount, setAmount] = useState<string>("");
  const [swappedAmount, setSwappedAmount] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [tokenData, setTokenData] = useState<TokenData[]>([]);
  const [filtererTokenData, setFiltererTokenData] = useState<TokenData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchTokenPrices = async () => {
      setLoading(true);
      setErrorMessage(null);
      try {
        const res = await fetch("https://interview.switcheo.com/prices.json");
        const data = await res.json();
        setTokenData(
          data.map((item: TokenDataFromApi) => ({
            ...item,
            src:
              "https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/" +
              item.currency +
              ".svg",
          }))
        );
      } catch {
        setErrorMessage(`Failed to fetch currency data from API`);
      } finally {
        setLoading(false);
      }
    };

    fetchTokenPrices();
  }, []);

  useEffect(() => {
    setFiltererTokenData(tokenData);
  }, [tokenData]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSwappedAmount(null);
    setAmount(e.target.value);
    if (Number(e.target.value) <= 0) {
      setErrorMessage("Amount should be greater than 0");
    } else {
      setErrorMessage(null);
    }
  };

  const handleSwap = () => {
    setErrorMessage(null);
    if (+amount <= 0) {
      setErrorMessage("Please enter amount");
      return;
    }

    if (fromCurrency === toCurrency) {
      setErrorMessage("Both currencies are the same");
      return;
    }

    setLoading(true);

    const fromToken = tokenData.find(
      (token) => token.currency === fromCurrency
    );
    const toToken = tokenData.find((token) => token.currency === toCurrency);

    if (fromToken && toToken) {
      const rate = toToken.price / fromToken.price;
      const swapped = parseFloat(amount) * rate;
      setSwappedAmount(swapped.toFixed(2));
    }
    setLoading(false);
  };
  useEffect(() => {
    console.log(filtererTokenData);
  }, [filtererTokenData]);``
  return (
    <div className="mx-4 sm:mx-0">
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="space-y-6">
          <div className="flex flex-col">
            <label
              htmlFor="fromCurrency"
              className="text-sm font-medium text-gray-700"
            >
              From Currency
            </label>
            <DropdownWithSearch
              trigger={<p>{fromCurrency}</p>}
              searchComponent={
                <input
                  className="w-full px-3 py-2 border rounded focus-visible:outline-none"
                  placeholder="Search..."
                />
              }
              dropdownContent={
                <ul>
                  {filtererTokenData.map((item, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                    >
                      <p>{item.currency}</p>
                      <img
                        src={item.src}
                        alt={item.currency}
                        className="w-6 h-6 ml-2"
                      />
                    </li>
                  ))}
                </ul>
              }
              onSearchChange={(e) => {
                const searchQuery = e;
                const filteredData = tokenData.filter((res) =>
                  res.currency.toLowerCase().includes(searchQuery)
                );
                setFiltererTokenData(filteredData);
              }}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setData={setFiltererTokenData}
              originalData={tokenData}
              onItemSelect={(e) => {
                setFromCurrency(e);
                setSwappedAmount(null);
                setFiltererTokenData(tokenData);
              }}
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="toCurrency"
              className="text-sm font-medium text-gray-700"
            >
              To Currency
            </label>
            <DropdownWithSearch
              trigger={<p>{toCurrency}</p>}
              searchComponent={
                <input
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Search..."
                />
              }
              dropdownContent={
                <ul>
                  {filtererTokenData.map((item, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                    >
                      <p>{item.currency}</p>
                      <img
                        src={item.src}
                        alt={item.currency}
                        className="w-6 h-6 ml-2"
                      />
                    </li>
                  ))}
                </ul>
              }
              onSearchChange={(e) => {
                const searchQuery = e;
                const filteredData = tokenData.filter((res) =>
                  res.currency.toLowerCase().includes(searchQuery)
                );
                setFiltererTokenData(filteredData);
              }}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setData={setFiltererTokenData}
              originalData={tokenData}
              onItemSelect={(e) => {
                setToCurrency(e);
                setSwappedAmount(null);
              }}
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="amount"
              className="text-sm font-medium text-gray-700"
            >
              Amount
            </label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Enter amount"
              className="p-3 border border-gray-300 rounded-md"
              disabled={loading}
            />
          </div>

          {errorMessage && (
            <p className="text-sm text-red-600 text-center">{errorMessage}</p>
          )}

          <div className="flex justify-center">
            <button
              onClick={handleSwap}
              disabled={loading}
              className="w-full p-3 bg-green-600 text-white rounded-md flex items-center justify-center space-x-2 hover:bg-green-700 disabled:bg-gray-300"
            >
              {loading ? <span>Swapping...</span> : <span>Swap</span>}
            </button>
          </div>

          {swappedAmount && (
            <div className="text-center mt-4 text-lg font-semibold">
              <h3>
                {amount} {fromCurrency} = {swappedAmount} {toCurrency}
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
