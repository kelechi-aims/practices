import React, { useEffect, useState } from "react";

// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`

function CurrencyConverter() {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchedConvertedAmount = async () => {
      if (amount === "") {
        setConvertedAmount(null);
        return;
      }
      try {
        setIsLoading(true);
        const res = await fetch(
          `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
        );

        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();

        setConvertedAmount(data.rates[toCurrency]);
      } catch (error) {
        console.error("Error fetching converted amount:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (fromCurrency === toCurrency) {
      setConvertedAmount(amount);
      return;
    }
    fetchedConvertedAmount();
  }, [amount, fromCurrency, toCurrency]);

  return (
    <div>
      <input
        type="text"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        disabled={isLoading}
      />
      <select
        value={fromCurrency}
        onChange={(e) => setFromCurrency(e.target.value)}
        disabled={isLoading}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <select
        value={toCurrency}
        onChange={(e) => setToCurrency(e.target.value)}
        disabled={isLoading}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <p>
        {convertedAmount} {toCurrency}
      </p>
    </div>
  );
}

export default CurrencyConverter;
