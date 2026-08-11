const MAX = 5;
let stack = [];

const websiteInput = document.getElementById("website");
const stackElement = document.getElementById("stack");
const emptyMessage = document.getElementById("emptyMessage");
const counter = document.getElementById("counter");
const statusElement = document.getElementById("status");
const operationBadge = document.getElementById("operationBadge");
const operationTitle = document.getElementById("operationTitle");
const operationText = document.getElementById("operationText");
const cCode = document.getElementById("cCode");
const logElement = document.getElementById("log");
const noLog = document.getElementById("noLog");

document.getElementById("pushBtn").addEventListener("click", push);
document.getElementById("popBtn").addEventListener("click", pop);
document.getElementById("peekBtn").addEventListener("click", peek);
document.getElementById("clearBtn").addEventListener("click", clearLog);

websiteInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    push();
  }
});

function push() {
  const website = websiteInput.value.trim();

  if (!website) {
    setStatus("Please enter a website name first.", "warning");
    return;
  }

  if (stack.length === MAX) {
    showOperation(
      "OVERFLOW",
      "Stack Overflow!",
      `The stack already contains ${MAX} items. No new item can be pushed.`,
      `#define MAX ${MAX}
int stack[MAX];

/* PUSH */
if (top == MAX - 1)
    printf("Stack Overflow");`
    );
    setStatus("⚠ Stack Overflow — the stack is full.", "warning");
    addLog("OVERFLOW", website);
    return;
  }

  // STACK PUSH
  stack.push(website);

  renderStack();
  showOperation(
    "PUSH",
    "PUSH / Visit Website",
    `"${website}" was added to the TOP of the stack. This is the Last In, First Out principle.`,
    `/* PUSH */
top++;
stack[top] = item;

/* New item is placed at TOP. */`
  );

  setStatus(`✅ "${website}" was pushed onto the stack.`, "success");
  addLog("PUSH", website);
  websiteInput.value = "";
  websiteInput.focus();
}

function pop() {
  if (stack.length === 0) {
    showOperation(
      "UNDERFLOW",
      "Stack Underflow!",
      "There is nothing to remove because the stack is empty.",
      `/* POP */
if (top == -1)
    printf("Stack Underflow");`
    );
    setStatus("⚠ Stack Underflow — the stack is empty.", "warning");
    addLog("UNDERFLOW", "No item");
    return;
  }

  const removed = stack[stack.length - 1];

  // Visual pop animation
  const items = stackElement.querySelectorAll(".stack-item");
  const topItem = items[items.length - 1];

  if (topItem) {
    topItem.classList.add("removing");
  }

  setTimeout(() => {
    // STACK POP
    stack.pop();

    renderStack();

    const current = stack.length
      ? stack[stack.length - 1]
      : "No page";

    showOperation(
      "POP",
      "POP / Go Back",
      `"${removed}" was removed from the TOP. ${current === "No page" ? "The stack is now empty." : `"${current}" is now the current page.`}`,
      `/* POP */
item = stack[top];
top--;

/* TOP item is removed. */`
    );

    setStatus(`↩️ Went back from "${removed}".`, "success");
    addLog("POP", removed);
  }, 350);
}

function peek() {
  if (stack.length === 0) {
    showOperation(
      "PEEK",
      "PEEK",
      "The stack is empty, so there is no current page to display.",
      `/* PEEK */
if (top == -1)
    printf("Stack is empty");
else
    printf("%s", stack[top]);`
    );
    setStatus("The stack is empty.", "warning");
    addLog("PEEK", "Empty");
    return;
  }

  const current = stack[stack.length - 1];

  showOperation(
    "PEEK",
    "PEEK / Current Page",
    `"${current}" is at the TOP. PEEK reads the TOP item without removing it.`,
    `/* PEEK */
printf("%s", stack[top]);

/* TOP item remains in the stack. */`
  );

  setStatus(`👀 Current page: "${current}"`, "success");
  addLog("PEEK", current);
}

function renderStack() {
  stackElement.innerHTML = "";

  stack.forEach((website, index) => {
    const item = document.createElement("div");
    item.className = "stack-item";

    if (index === stack.length - 1) {
      item.classList.add("top-item");
    }

    item.textContent = website;
    stackElement.appendChild(item);
  });

  emptyMessage.style.display = stack.length === 0 ? "block" : "none";
  counter.textContent = `${stack.length} / ${MAX}`;
}

function showOperation(badge, title, text, code) {
  operationBadge.textContent = badge;
  operationTitle.textContent = title;
  operationText.innerHTML = text;
  cCode.textContent = code;
}

function setStatus(message, type) {
  statusElement.textContent = message;

  if (type === "warning") {
    statusElement.style.background = "#fff7ed";
    statusElement.style.color = "#9a3412";
  } else if (type === "success") {
    statusElement.style.background = "#ecfdf3";
    statusElement.style.color = "#166534";
  } else {
    statusElement.style.background = "#eef4ff";
    statusElement.style.color = "#1e40af";
  }
}

function addLog(operation, value) {
  noLog.style.display = "none";

  const li = document.createElement("li");
  const time = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });

  li.textContent = `[${time}] ${operation}: ${value}`;
  logElement.prepend(li);
}

function clearLog() {
  logElement.innerHTML = "";
  noLog.style.display = "block";
  setStatus("Operation log cleared.", "normal");
}

// Initial display
renderStack();
