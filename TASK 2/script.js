// script.js
// Safe calculator logic for digits 1-9 and operators + and - only.

const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

let input = ""; // internal string representation of the expression (e.g., "12+3-4")

function isOperator(ch) {
  return ch === '+' || ch === '-';
}

function updateDisplay() {
  display.value = input === "" ? "0" : input;
}

// Evaluate expression containing only + and - and integer numbers.
// We parse manually instead of using eval() for safety/consistency.
function evaluateExpression(expr) {
  if (!expr || expr.length === 0) return 0;

  // Remove trailing operator if any (e.g., "6+3+" -> "6+3")
  if (isOperator(expr[expr.length - 1])) {
    expr = expr.slice(0, -1);
  }
  if (expr === "") return 0;

  let total = 0;
  let current = "";
  let sign = '+'; // sign to apply to next parsed number

  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];

    if (ch >= '0' && ch <= '9') {
      current += ch;
    } else if (isOperator(ch)) {
      // handle case where we have a current number to commit
      if (current === "") {
        // If current is empty and we see an operator, it's an invalid double-operator situation.
        // But our input management prevents this; still, handle safely by continuing.
        sign = ch; // treat it as replacing the sign
        continue;
      }
      const num = parseInt(current, 10);
      if (sign === '+') total += num;
      else total -= num;

      // update sign and reset current number
      sign = ch;
      current = "";
    } else {
      // unexpected character -> throw to upper level
      throw new Error("Invalid character in expression");
    }
  }

  // commit last number
  if (current !== "") {
    const num = parseInt(current, 10);
    if (sign === '+') total += num;
    else total -= num;
  }

  return total;
}

// Button clicks
buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const value = btn.textContent.trim();

    // digit (1-9)
    if (/^[1-9]$/.test(value)) {
      // if display currently "0" or empty, replace; else append
      if (input === "0") input = value;
      else input += value;

      updateDisplay();
      return;
    }

    // operator + or -
    if (isOperator(value)) {
      if (input === "") {
        // allow starting with '-' to build a negative number, but not '+'
        if (value === '-') {
          input = '-';
          updateDisplay();
        }
        // if '+' at start -> ignore
        return;
      }

      const last = input[input.length - 1];
      if (isOperator(last)) {
        // replace last operator with the new one (prevents "6+-1" like cases)
        input = input.slice(0, -1) + value;
      } else {
        input += value;
      }
      updateDisplay();
      return;
    }

    // equals
    if (value === '=') {
      try {
        // Do not evaluate if expression is just "-" or empty
        if (input === "" || input === "-") {
          display.value = "0";
          input = "";
          return;
        }

        const result = evaluateExpression(input);
        input = String(result);
        updateDisplay();
      } catch (err) {
        display.value = "Error";
        input = "";
      }
      return;
    }
  });
});

// init
updateDisplay();
