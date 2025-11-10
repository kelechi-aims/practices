import { useState } from "react";
import "./App.css";

export default function App() {
  return (
    <div className="App">
      <h1>Tip Calculator</h1>
      <TipCalculator />
    </div>
  );
}

function TipCalculator() {
  const [bill, setBill] = useState("");
  const [tip1, setTip1] = useState(0);
  const [tip2, setTip2] = useState(0);

  const totalTip = ((tip1 + tip2) / 2 / 100) * bill;

  function reset() {
    setBill("");
    setTip1(0);
    setTip2(0);
  }

  return (
    <div>
      {" "}
      <Bill bill={bill} onSetBill={setBill} />
      <Tip tip={tip1} onSelect={setTip1}>
        How did you like the service?
      </Tip>
      <Tip tip={tip2} onSelect={setTip2}>
        How did your friend like the service?
      </Tip>
      {bill > 0 && (
        <>
          <PaymentMethod bill={bill} totalTip={totalTip} />
          <Reset onReset={reset} />
        </>
      )}
    </div>
  );
}

function Bill({ bill, onSetBill }) {
  return (
    <div>
      <label>How much was the bill? </label>
      <input
        type="text"
        placeholder="Bill value"
        value={bill}
        onChange={(e) => onSetBill(Number(e.target.value))}
      />
    </div>
  );
}

function Tip({ tip, onSelect, children }) {
  return (
    <div>
      <label>{children}</label>
      <select value={tip} onChange={(e) => onSelect(Number(e.target.value))}>
        <option value="0">Dissatisfied (0%)</option>
        <option value="5">It was okay (5%)</option>
        <option value="10">It was good (10%)</option>
        <option value="20">Absolutely amazing! (20%)</option>
      </select>
    </div>
  );
}

function PaymentMethod({ bill, totalTip }) {
  return (
    <h3>
      {" "}
      You pay ${bill + totalTip} ( ${bill} + ${totalTip} tip)
    </h3>
  );
}

function Reset({ onReset }) {
  return (
    <div>
      <button onClick={onReset}>Reset</button>
    </div>
  );
}
