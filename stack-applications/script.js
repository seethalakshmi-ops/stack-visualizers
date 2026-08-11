// ===============================
// STACK APPLICATIONS LAB
// ===============================

// Show the first application when the page loads
document.addEventListener("DOMContentLoaded", function () {
  showApp("reverse");

  document.querySelectorAll("#tabs button").forEach(function (button) {
    button.addEventListener("click", function () {
      showApp(button.dataset.app);
    });
  });
});


// ===============================
// TAB NAVIGATION
// ===============================

function showApp(appName) {

  document.querySelectorAll(".app").forEach(function (app) {
    app.classList.remove("active");
  });

  document.querySelectorAll("#tabs button").forEach(function (button) {
    button.classList.remove("active");
  });

  const app = document.getElementById(appName);

  if (app) {
    app.classList.add("active");
  }

  const button = document.querySelector(
    '#tabs button[data-app="' + appName + '"]'
  );

  if (button) {
    button.classList.add("active");
  }
}


// ===============================
// 1. REVERSE LIST
// ===============================

function reverseList() {

  const input = document.getElementById("reverseInput").value;

  const items = input
    .split(",")
    .map(item => item.trim())
    .filter(item => item !== "");

  if (items.length === 0) {
    document.getElementById("reverseOutput").innerHTML =
      '<div class="result error">Please enter some elements.</div>';
    return;
  }

  let stack = [];
  let steps = "";

  // PUSH
  items.forEach(function (item) {
    stack.push(item);

    steps += `
      <div class="step">
        PUSH <b>${item}</b>
        → Stack: [${stack.join(", ")}]
      </div>
    `;
  });

  // POP
  let reversed = [];

  while (stack.length > 0) {

    const item = stack.pop();

    reversed.push(item);

    steps += `
      <div class="step">
        POP <b>${item}</b>
        → Stack: [${stack.join(", ")}]
      </div>
    `;
  }

  document.getElementById("reverseOutput").innerHTML = `
    <div class="result">
      <h3>Result</h3>

      <p>
        Original List:
        <b>${items.join(", ")}</b>
      </p>

      <p>
        Reversed List:
        <b>${reversed.join(", ")}</b>
      </p>

      <h3>Stack Operations</h3>

      ${steps}
    </div>
  `;
}


// ===============================
// 2. PARENTHESES MATCHING
// ===============================

function checkBrackets() {

  const expression =
    document.getElementById("bracketInput").value;

  const stack = [];

  const pairs = {
    ")": "(",
    "]": "[",
    "}": "{"
  };

  const opening = ["(", "[", "{"];

  let steps = "";
  let valid = true;
  let message = "";

  for (let char of expression) {

    if (opening.includes(char)) {

      stack.push(char);

      steps += `
        <div class="step">
          <b>${char}</b> → PUSH
          → Stack: [${stack.join(" ")}]
        </div>
      `;

    } else if (pairs[char]) {

      if (
        stack.length === 0 ||
        stack[stack.length - 1] !== pairs[char]
      ) {

        valid = false;

        steps += `
          <div class="step">
            <b>${char}</b> → No matching opening bracket
          </div>
        `;

        break;

      }

      const removed = stack.pop();

      steps += `
        <div class="step">
          <b>${char}</b> → POP ${removed}
          → Stack: [${stack.join(" ")}]
        </div>
      `;
    }
  }

  if (valid && stack.length === 0) {

    message = `
      <p class="success">
        ✅ Balanced! All brackets are correctly matched.
      </p>
    `;

  } else {

    valid = false;

    message = `
      <p class="error">
        ❌ Not balanced. Brackets do not match correctly.
      </p>
    `;
  }

  document.getElementById("bracketOutput").innerHTML = `
    <div class="result">

      <h3>Expression</h3>

      <p><code>${expression}</code></p>

      ${message}

      <h3>Stack Operations</h3>

      ${steps}

    </div>
  `;
}


// ===============================
// HELPER: APPLY OPERATOR
// ===============================

function applyOperator(a, b, operator) {

  switch (operator) {

    case "+":
      return a + b;

    case "-":
      return a - b;

    case "*":
      return a * b;

    case "/":
      return a / b;

    case "%":
      return a % b;

    case "^":
      return Math.pow(a, b);

    default:
      return 0;
  }
}


// ===============================
// 3. POSTFIX EVALUATION
// ===============================

function evaluatePostfix() {

  const expression =
    document.getElementById("postfixInput").value.trim();

  const tokens = expression.split(/\s+/);

  const stack = [];

  let steps = "";

  for (let token of tokens) {

    if (!isNaN(token)) {

      stack.push(Number(token));

      steps += `
        <div class="step">
          <b>${token}</b> → PUSH
          → Stack: [${stack.join(", ")}]
        </div>
      `;

    } else {

      if (stack.length < 2) {

        document.getElementById("postfixOutput").innerHTML =
          '<div class="result error">Invalid postfix expression.</div>';

        return;
      }

      const b = stack.pop();
      const a = stack.pop();

      const result =
        applyOperator(a, b, token);

      stack.push(result);

      steps += `
        <div class="step">
          POP ${a} and ${b}
          → ${a} ${token} ${b} = ${result}
          → PUSH ${result}
          → Stack: [${stack.join(", ")}]
        </div>
      `;
    }
  }

  if (stack.length !== 1) {

    document.getElementById("postfixOutput").innerHTML =
      '<div class="result error">Invalid postfix expression.</div>';

    return;
  }

  document.getElementById("postfixOutput").innerHTML = `
    <div class="result">

      <h3>Answer: ${stack[0]}</h3>

      <h3>Stack Operations</h3>

      ${steps}

    </div>
  `;
}


// ===============================
// 4. PREFIX EVALUATION
// ===============================

function evaluatePrefix() {

  const expression =
    document.getElementById("prefixInput").value.trim();

  const tokens = expression.split(/\s+/);

  const stack = [];

  let steps = "";

  // Prefix is scanned from RIGHT to LEFT
  for (let i = tokens.length - 1; i >= 0; i--) {

    const token = tokens[i];

    if (!isNaN(token)) {

      stack.push(Number(token));

      steps += `
        <div class="step">
          <b>${token}</b> → PUSH
          → Stack: [${stack.join(", ")}]
        </div>
      `;

    } else {

      if (stack.length < 2) {

        document.getElementById("prefixOutput").innerHTML =
          '<div class="result error">Invalid prefix expression.</div>';

        return;
      }

      const a = stack.pop();
      const b = stack.pop();

      const result =
        applyOperator(a, b, token);

      stack.push(result);

      steps += `
        <div class="step">
          POP ${a} and ${b}
          → ${a} ${token} ${b} = ${result}
          → PUSH ${result}
          → Stack: [${stack.join(", ")}]
        </div>
      `;
    }
  }

  if (stack.length !== 1) {

    document.getElementById("prefixOutput").innerHTML =
      '<div class="result error">Invalid prefix expression.</div>';

    return;
  }

  document.getElementById("prefixOutput").innerHTML = `
    <div class="result">

      <h3>Answer: ${stack[0]}</h3>

      <h3>Stack Operations</h3>

      ${steps}

    </div>
  `;
}


// ===============================
// OPERATOR PRECEDENCE
// ===============================

function precedence(operator) {

  if (operator === "^") return 3;

  if (operator === "*" ||
      operator === "/" ||
      operator === "%") return 2;

  if (operator === "+" ||
      operator === "-") return 1;

  return 0;
}


// ===============================
// 5. INFIX → POSTFIX
// ===============================

function convertInfixPostfix() {

  const expression =
    document.getElementById("infixPostfixInput").value
      .replace(/\s+/g, "");

  const stack = [];

  const output = [];

  let steps = "";

  for (let char of expression) {

    if (/[A-Za-z0-9]/.test(char)) {

      output.push(char);

      steps += `
        <div class="step">
          ${char} → Add to output
          → Output: ${output.join(" ")}
        </div>
      `;

    } else if (char === "(") {

      stack.push(char);

      steps += `
        <div class="step">
          ( → PUSH
          → Stack: [${stack.join(" ")}]
        </div>
      `;

    } else if (char === ")") {

      while (
        stack.length &&
        stack[stack.length - 1] !== "("
      ) {

        output.push(stack.pop());
      }

      stack.pop();

      steps += `
        <div class="step">
          ) → POP until (
          → Output: ${output.join(" ")}
        </div>
      `;

    } else {

      while (
        stack.length &&
        stack[stack.length - 1] !== "(" &&
        precedence(stack[stack.length - 1]) >= precedence(char)
      ) {

        output.push(stack.pop());
      }

      stack.push(char);

      steps += `
        <div class="step">
          ${char} → PUSH operator
          → Stack: [${stack.join(" ")}]
        </div>
      `;
    }
  }

  while (stack.length) {
    output.push(stack.pop());
  }

  document.getElementById("infixPostfixOutput").innerHTML = `
    <div class="result">

      <h3>Postfix Expression</h3>

      <p><code>${output.join(" ")}</code></p>

      <h3>Steps</h3>

      ${steps}

    </div>
  `;
}


// ===============================
// 6. INFIX → PREFIX
// ===============================

function convertInfixPrefix() {

  const expression =
    document.getElementById("infixPrefixInput").value
      .replace(/\s+/g, "");

  // Reverse expression
  let reversed = expression
    .split("")
    .reverse()
    .map(function (char) {

      if (char === "(") return ")";
      if (char === ")") return "(";

      return char;

    })
    .join("");

  const stack = [];
  const output = [];

  for (let char of reversed) {

    if (/[A-Za-z0-9]/.test(char)) {

      output.push(char);

    } else if (char === "(") {

      stack.push(char);

    } else if (char === ")") {

      while (
        stack.length &&
        stack[stack.length - 1] !== "("
      ) {

        output.push(stack.pop());
      }

      stack.pop();

    } else {

      while (
        stack.length &&
        stack[stack.length - 1] !== "(" &&
        precedence(stack[stack.length - 1]) > precedence(char)
      ) {

        output.push(stack.pop());
      }

      stack.push(char);
    }
  }

  while (stack.length) {
    output.push(stack.pop());
  }

  const prefix =
    output.reverse().join(" ");

  document.getElementById("infixPrefixOutput").innerHTML = `
    <div class="result">

      <h3>Prefix Expression</h3>

      <p><code>${prefix}</code></p>

      <p>
        The expression is first reversed,
        brackets are exchanged, and the postfix
        method is applied.
      </p>

    </div>
  `;
}


// ===============================
// 7. FUNCTION CALL STACK
// ===============================

function memoryDemo() {

  const functions = [
    "main()",
    "calculate()",
    "display()",
    "printf()"
  ];

  let html = `
    <div class="result">

      <h3>Function Call Stack</h3>

      <p>
        Each function call creates a stack frame.
        The most recently called function is on TOP.
      </p>

      <div class="stack-container">
  `;

  functions.forEach(function (func, index) {

    const top =
      index === functions.length - 1
        ? " top"
        : "";

    html += `
      <div class="stack-item${top}">
        ${func}
        ${index === functions.length - 1 ? " ← TOP" : ""}
      </div>
    `;
  });

  html += `
      </div>

      <p>
        When <b>printf()</b> finishes, its stack frame
        is removed first.
      </p>

    </div>
  `;

  document.getElementById("memoryOutput").innerHTML = html;
}


// ===============================
// 8. RECURSION / FACTORIAL
// ===============================

function runFactorial() {

  const n =
    Number(document.getElementById("factorialInput").value);

  if (n < 1 || n > 8) {

    document.getElementById("recursionOutput").innerHTML =
      '<div class="result error">Enter a number from 1 to 8.</div>';

    return;
  }

  let html = `
    <div class="result">

      <h3>Call Stack During factorial(${n})</h3>

      <p>
        Recursive calls are PUSHED onto the call stack.
      </p>

      <div class="stack-container">
  `;

  for (let i = 1; i <= n; i++) {

    html += `
      <div class="stack-item">
        factorial(${n - i + 1})
      </div>
    `;
  }

  html += `
      </div>

      <h3>Returning from the Stack</h3>
  `;

  let result = 1;

  for (let i = 1; i <= n; i++) {

    result *= i;

    html += `
      <div class="step">
        Return factorial(${i})
        → ${result}
      </div>
    `;
  }

  html += `
      <h3>Final Answer: ${result}</h3>

    </div>
  `;

  document.getElementById("recursionOutput").innerHTML = html;
}
